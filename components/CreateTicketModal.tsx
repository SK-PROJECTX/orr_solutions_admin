"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { clientAPI, ticketAPI } from "@/app/services";
import { useNotificationContext } from "@/lib/contexts/NotificationContext";

interface CreateTicketModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateTicketModal({ onClose, onSuccess }: CreateTicketModalProps) {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { success, error: showError } = useNotificationContext();

    const [formData, setFormData] = useState({
        client: "",
        subject: "",
        description: "",
        priority: "normal",
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const response = await clientAPI.listClients();
                const clientsData = Array.isArray(response) ? response : ((response as any).results || []);
                setClients(Array.isArray(clientsData) ? clientsData : []);
            } catch (err) {
                console.error("Failed to load clients", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.client || !formData.subject || !formData.description) {
            showError("Validation Error", "Please fill all required fields");
            return;
        }

        try {
            setSubmitting(true);
            await ticketAPI.createTicket({
                client_id: parseInt(formData.client),
                subject: formData.subject,
                description: formData.description,
                priority: formData.priority,
                source: "manual_request",
            });
            success("Ticket Created", "The support ticket has been created successfully");
            onSuccess();
        } catch (err: any) {
            console.error(err);
            showError("Failed to create ticket", err.message || "An unknown error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#121c2d] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Create Support Ticket</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Client *</label>
                        {loading ? (
                            <div className="text-xs text-gray-400">Loading clients...</div>
                        ) : (
                            <select
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                required
                            >
                                <option value="" className="bg-gray-800">Select a client</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id} className="bg-gray-800">
                                        {c.user?.full_name || c.user?.email || `Client ${c.id}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Subject *</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                            placeholder="Brief summary of the issue"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 min-h-[120px]"
                            placeholder="Detailed description..."
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-primary/50"
                        >
                            <option value="low" className="bg-gray-800">Low</option>
                            <option value="normal" className="bg-gray-800">Normal</option>
                            <option value="high" className="bg-gray-800">High</option>
                            <option value="urgent" className="bg-gray-800">Urgent</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-primary/80 disabled:opacity-50 px-5 py-2 rounded-lg text-white font-medium transition-colors"
                        >
                            {submitting ? "Creating..." : "Create Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
