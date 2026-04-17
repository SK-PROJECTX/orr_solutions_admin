"use client";

import { useState, useEffect } from "react";
import { Bell, Ticket, Calendar, AlertCircle, MessageSquare, Settings, Trash2, Check, Loader } from "lucide-react";
import { notificationAPI } from "@/app/services";
import type { Notification } from "@/app/services/types";
import { useLanguageStore } from "@/store/languageStore";

const typeIcons: Record<string, any> = {
  ticket_created: Ticket,
  ticket_assigned: Ticket,
  meeting_assigned: Calendar,
  meeting_confirmed: Calendar,
  client_updated: AlertCircle,
  content_published: MessageSquare,
  system_alert: AlertCircle,
};

const typeColors: Record<string, string> = {
  ticket_created: "bg-blue-500/30 text-blue-300",
  ticket_assigned: "bg-blue-500/30 text-blue-300",
  meeting_assigned: "bg-primary/30 text-primary",
  meeting_confirmed: "bg-primary/30 text-primary",
  client_updated: "bg-purple-500/30 text-purple-300",
  content_published: "bg-green-500/30 text-green-300",
  system_alert: "bg-red-500/30 text-red-300",
};

export default function NotificationsPage() {
  const { t, language } = useLanguageStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationStats, setNotificationStats] = useState<any>(null);
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [response, stats] = await Promise.all([
          notificationAPI.listNotifications({
            is_read: filterRead !== "all" ? filterRead === "read" : undefined,
          }).catch(() => ({ results: [] })),
          notificationAPI.getStats().catch(() => null),
        ]);
        // Handle both array response and object with results
        setNotifications(Array.isArray(response) ? response : ((response as any)?.results || []));
        setNotificationStats(stats);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError(t('analytics.error_fetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [filterRead, language, t]);

  const filteredNotifications = notifications.filter((notif) => {
    if (filterRead === "all") return true;
    if (filterRead === "unread") return !notif.is_read;
    if (filterRead === "read") return notif.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div>
      <div className="min-h-screen text-white relative overflow-hidden star">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />

        <div className="relative z-10 p-4 md:p-8">
          <div className="bg-card backdrop-blur-sm rounded-2xl p-4 md:p-8 flex flex-col gap-8 border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tight">{t('notifications_page.title')}</h1>
                <p className="text-gray-400 text-xs md:text-sm mt-2 uppercase tracking-widest font-bold">
                  {unreadCount > 0 
                    ? t('notifications_page.unread_count', { count: unreadCount }) 
                    : t('notifications_page.all_read')}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-lg font-bold text-xs transition-all duration-200 shadow-md hover:shadow-lg w-full md:w-auto uppercase tracking-widest"
                >
                  {t('notifications_page.mark_all')}
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value as "all" | "unread" | "read")}
                className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white text-xs md:text-sm focus:outline-none focus:border-primary/50 transition-all duration-200"
              >
                <option value="all" className="bg-gray-800">{t('notifications_page.filters.all')}</option>
                <option value="unread" className="bg-gray-800">{t('notifications_page.filters.unread')}</option>
                <option value="read" className="bg-gray-800">{t('notifications_page.filters.read')}</option>
              </select>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 uppercase tracking-widest font-bold text-xs">{t('analytics.loading')}</p>
                </div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => {
                  const Icon = typeIcons[notif.notification_type] || Bell;
                  return (
                    <div
                      key={notif.id}
                      className={`bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border transition-all duration-300 p-4 md:p-5 flex items-start gap-4 ${
                        notif.is_read ? "border-white/10 opacity-60" : "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10"
                      } hover:scale-[1.01] hover:bg-white/10 group`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 ${typeColors[notif.notification_type] || "bg-gray-500/30 text-gray-400"}`}>
                        <Icon size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-bold text-sm md:text-base uppercase tracking-tight ${notif.is_read ? "text-gray-400" : "text-white"}`}>
                            {notif.title}
                          </h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-3">
                           <div className={`w-1.5 h-1.5 rounded-full ${notif.is_read ? "bg-gray-600" : "bg-primary animate-pulse"}`} />
                           <p className="text-[10px] md:text-xs text-gray-500 font-mono">
                             {new Date(notif.created_at).toLocaleString(language === 'it' ? 'it-IT' : 'en-US')}
                           </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 md:gap-2 flex-shrink-0">
                        {!notif.is_read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 hover:bg-primary/20 rounded-lg transition-all duration-200 text-gray-500 hover:text-primary"
                            title={t('notifications_page.mark_read')}
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200 text-gray-500 hover:text-red-400"
                          title={t('notifications_page.delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/10 p-12 md:p-20 text-center border-dashed">
                  <Bell size={48} className="text-white/10 mx-auto mb-6 animate-bounce" />
                  <p className="text-gray-500 uppercase tracking-[0.2em] font-black text-xs md:text-sm">{t('notifications_page.empty')}</p>
                </div>
              )}
            </div>

            {/* Settings Link */}
            <div className="border-t border-white/10 pt-8 mt-4">
              <button className="flex items-center gap-3 text-primary hover:text-white transition-all duration-300 group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                </div>
                <span className="font-bold text-xs md:text-sm uppercase tracking-widest">{t('notifications_page.configure')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
