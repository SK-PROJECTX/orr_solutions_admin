"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface TicketMessage {
  id: number;
  message: string;
  sender_name: string;
  sender_type: string;
  created_at: string;
  is_internal: boolean;
}

interface Ticket {
  id: number;
  ticket_id: string;
  subject: string;
  status: string;
  priority: string;
  source: string;
  created_at: string;
  client_name: string;
  client_company: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
  ticket?: Ticket;
}

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("auth-token");

      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      console.log("Using token:", token ? "Token exists" : "No token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend.orr.solutions'}/admin-portal/v1/tickets/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Messages API Response:", data);

        // Handle different response formats
        let ticketsArray = [];
        if (Array.isArray(data)) {
          ticketsArray = data;
        } else if (data && Array.isArray(data.data)) {
          ticketsArray = data.data;
        } else if (data && Array.isArray(data.results)) {
          ticketsArray = data.results;
        } else if (data && Array.isArray(data.tickets)) {
          ticketsArray = data.tickets;
        } else if (data && data.data && typeof data.data === "object") {
          // Handle case where data.data is an object with tickets property
          if (Array.isArray(data.data.tickets)) {
            ticketsArray = data.data.tickets;
          } else if (Array.isArray(data.data.results)) {
            ticketsArray = data.data.results;
          } else {
            // Convert single object to array or handle pagination
            ticketsArray = Object.values(data.data).filter(
              (item: any) => item && typeof item === "object" && item.id,
            );
          }
        } else {
          console.error("Unexpected response format:", data);
          setLoading(false);
          return;
        }

        // Convert tickets to chat format
        const ticketChats: Chat[] = ticketsArray.map((ticket: any) => {
          console.log("Processing ticket:", ticket);
          console.log("Ticket ID:", ticket.id);

          return {
            id: ticket.id, // Use the actual numeric ID from the API
            name: ticket.client_name ? `Support - ${ticket.client_name}` : `Support - ${ticket.ticket_id}`,
            lastMessage: ticket.subject || "No subject",
            timestamp: new Date(ticket.created_at).toLocaleDateString(),
            unread: 0,
            avatar: "🎧",
            online: ticket.status !== "resolved",
            ticket,
          };
        });

        setChats(ticketChats);
        if (ticketChats.length > 0 && !selectedChat) {
          setSelectedChat(ticketChats[0]);
          fetchMessages(ticketChats[0].id);
        }
      } else {
        console.error(
          "Failed to fetch tickets:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: number) => {
    try {
      console.log("Fetching messages for ticket ID:", ticketId);

      if (!ticketId || ticketId === undefined) {
        console.error("Invalid ticket ID:", ticketId);
        return;
      }

      const token = localStorage.getItem("auth-token");

      if (!token) {
        console.error("No authentication token found for messages");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend.orr.solutions'}/admin-portal/v1/tickets/${ticketId}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        // Normalize different API response shapes into an array
        let messagesArray: TicketMessage[] = [];
        if (Array.isArray(result)) {
          messagesArray = result;
        } else if (result && Array.isArray(result.data)) {
          messagesArray = result.data;
        } else if (result && Array.isArray(result.results)) {
          messagesArray = result.results;
        } else if (result && result.data && typeof result.data === "object") {
          messagesArray = (Object.values(result.data) as TicketMessage[]).filter(
              (item) => item && item.id,
            );
        } else {
          messagesArray = [];
        }

        setMessages(messagesArray);
      } else {
        console.error(
          "Failed to fetch messages:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      try {
        const token = localStorage.getItem("auth-token");

        if (!token) {
          console.error("No authentication token found for sending message");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend.orr.solutions'}/admin-portal/v1/tickets/${selectedChat.id}/messages/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newMessage, is_internal: false }),
          },
        );

        if (response.ok) {
          setNewMessage("");
          // Refresh messages
          await fetchMessages(selectedChat.id);
        } else {
          console.error(
            "Failed to send message:",
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hasAutoReply =
    Array.isArray(messages) &&
    messages.some(
      (msg) =>
        msg &&
        (msg.sender_type === "system" ||
          (msg.sender_name && msg.sender_name.includes("Auto Reply"))),
    );

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading your messages...</div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-full bg-background flex overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-card border-r border-white/10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-foreground mb-4">
            Support Messages
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground opacity-40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/30 border border-white/10 rounded-lg text-foreground placeholder:opacity-60 focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-foreground/60">
              No support tickets found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  fetchMessages(chat.id);
                }}
                className={`p-3 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                  selectedChat?.id === chat.id
                    ? "bg-primary/10 border-l-4 border-l-primary shadow-inner"
                    : "hover:bg-secondary/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-lg">
                      {chat.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex flex-col min-w-0">
                        {chat.ticket?.ticket_id && (
                          <span className="text-[10px] text-primary font-mono leading-none mb-1">
                            {chat.ticket.ticket_id}
                          </span>
                        )}
                        <h3 className={`font-sm font-medium truncate ${selectedChat?.id === chat.id ? "text-primary" : "text-foreground"}`}>
                          {chat.name}
                        </h3>
                      </div>
                      <span className="text-[10px] text-foreground opacity-60">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${selectedChat?.id === chat.id ? "text-foreground" : "text-foreground/70"}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.ticket?.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            chat.ticket.status === "resolved"
                              ? "bg-green-500/20 text-green-300"
                              : chat.ticket.status === "new"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {chat.ticket.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-card border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-lg">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div>
                  {selectedChat.ticket?.ticket_id && (
                    <p className="text-[10px] text-primary font-mono leading-none mb-1">
                      {selectedChat.ticket.ticket_id}
                    </p>
                  )}
                  <h2 className="font-semibold text-foreground">
                    {selectedChat.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-foreground opacity-60">
                      {selectedChat.online ? "Active" : "Resolved"}
                    </p>
                    {hasAutoReply && (
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 flex items-center gap-1">
                        <CheckCircle size={10} />
                        Auto-replied
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                  <Phone className="w-5 h-5 text-foreground" />
                </button>
                <button className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                  <Video className="w-5 h-5 text-foreground" />
                </button>
                <button className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                  <MoreVertical className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(msg => 
                  msg.sender_type !== "system" && 
                  !(msg.sender_name && msg.sender_name.includes("Auto Reply"))
                )
                .map((message) => {
                const isUs = message.sender_type === "admin" || message.sender_type === "support";
                const isInternal = message.is_internal;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUs ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isInternal
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-sm"
                          : isUs
                            ? "bg-primary text-black shadow-md font-medium"
                            : "bg-blue-500/15 text-blue-50 border border-blue-500/30 shadow-sm"
                      }`}
                    >
                      {isInternal && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            🔒 Internal Note
                          </span>
                        </div>
                      )}
                      {!isUs && !isInternal && (
                        <p className="text-[10px] font-bold text-blue-300 mb-1 uppercase tracking-tight">{message.sender_name}</p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isUs ? "text-black/70" : "text-foreground/60"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-card border-t border-white/10">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                  <Paperclip className="w-5 h-5 text-foreground" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message as admin..."
                    className="w-full px-4 py-3 bg-secondary/30 border border-white/10 rounded-lg text-foreground placeholder:opacity-60 focus:border-primary outline-none pr-12"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-secondary/60 transition-colors">
                    <Smile className="w-5 h-5 text-foreground opacity-60" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-foreground/60">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-40" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
