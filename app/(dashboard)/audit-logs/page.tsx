"use client";

import { useState, useEffect } from "react";
import { Search, Download, Filter, LogOut, Edit, Lock, Trash2, Eye, Loader } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

const typeIcons: Record<string, any> = {
  login: LogOut,
  content: Edit,
  role: Lock,
  client: Eye,
  ticket: Edit,
};

const typeColors: Record<string, string> = {
  login: "bg-blue-500/30 text-blue-300",
  content: "bg-primary/30 text-primary",
  role: "bg-red-500/30 text-red-300",
  client: "bg-purple-500/30 text-purple-300",
  ticket: "bg-orange-500/30 text-orange-300",
};

export default function AuditLogsPage() {
  const { t, language } = useLanguageStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter((log) => {
    const typeMatch = filterType === "All" || log.type === filterType;
    const statusMatch = filterStatus === "All" || log.status === filterStatus;
    const searchMatch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  const loginAttempts = logs.filter((l) => l.type === "login").length;
  const failedAttempts = logs.filter((l) => l.type === "login" && l.status === "failed").length;
  const contentChanges = logs.filter((l) => l.type === "content").length;
  const roleChanges = logs.filter((l) => l.type === "role").length;
  const successCount = logs.filter((l) => l.status === "success").length;
  const successRate = logs.length > 0 ? ((successCount / logs.length) * 100).toFixed(0) : "0";

  return (
    <div>
      <div className="min-h-screen text-white relative overflow-hidden star">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />

        <div className="relative z-10 p-4 md:p-8">
          <div className="bg-card backdrop-blur-sm rounded-2xl p-4 md:p-8 flex flex-col gap-6 md:gap-8 border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tight">{t('audit_logs.title')}</h1>
                <p className="text-gray-400 text-xs md:text-sm mt-2">{t('audit_logs.subtitle')}</p>
              </div>
              <button className="bg-primary hover:bg-primary/80 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm w-full md:w-auto justify-center uppercase tracking-wider">
                <Download size={18} />
                {t('audit_logs.export_logs')}
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-4 md:p-6 border border-blue-500/20 shadow-lg">
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-bold mb-2">{t('audit_logs.login_attempts')}</p>
                <p className="text-2xl md:text-3xl font-black text-white">{loginAttempts}</p>
                <p className="text-red-400 text-[10px] md:text-xs mt-2 font-medium">{failedAttempts} {t('audit_logs.failed_attempts')}</p>
              </div>

              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 md:p-6 border border-primary/20 shadow-lg">
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-bold mb-2">{t('audit_logs.content_changes')}</p>
                <p className="text-2xl md:text-3xl font-black text-white">{contentChanges}</p>
                <p className="text-primary text-[10px] md:text-xs mt-2 font-medium">{t('audit_logs.content_desc')}</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-xl p-4 md:p-6 border border-red-500/20 shadow-lg">
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-bold mb-2">{t('audit_logs.role_changes')}</p>
                <p className="text-2xl md:text-3xl font-black text-white">{roleChanges}</p>
                <p className="text-red-400 text-[10px] md:text-xs mt-2 font-medium">{t('audit_logs.permission_updates')}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-4 md:p-6 border border-green-500/20 shadow-lg">
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-bold mb-2">{t('audit_logs.success_rate')}</p>
                <p className="text-2xl md:text-3xl font-black text-white">{successRate}%</p>
                <p className="text-green-400 text-[10px] md:text-xs mt-2 font-medium">{t('audit_logs.all_operations')}</p>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder={t('audit_logs.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 pl-10 pr-4 py-2.5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all duration-200 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white text-xs md:text-sm focus:outline-none focus:border-primary/50 transition-all duration-200 min-w-[120px]"
                >
                  <option className="bg-gray-800" value="All">{t('audit_logs.all_types')}</option>
                  <option className="bg-gray-800" value="login">{t('audit_logs.types.login')}</option>
                  <option className="bg-gray-800" value="content">{t('audit_logs.types.content')}</option>
                  <option className="bg-gray-800" value="role">{t('audit_logs.types.role')}</option>
                  <option className="bg-gray-800" value="client">{t('audit_logs.types.client')}</option>
                  <option className="bg-gray-800" value="ticket">{t('audit_logs.types.ticket')}</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white text-xs md:text-sm focus:outline-none focus:border-primary/50 transition-all duration-200 min-w-[120px]"
                >
                  <option className="bg-gray-800" value="All">{t('audit_logs.all_status')}</option>
                  <option className="bg-gray-800" value="success">{t('audit_logs.status.success')}</option>
                  <option className="bg-gray-800" value="failed">{t('audit_logs.status.failed')}</option>
                </select>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl border border-white/10 shadow-lg overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{t('audit_logs.table.type')}</th>
                    <th className="text-left p-4 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{t('audit_logs.table.user')}</th>
                    <th className="text-left p-4 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{t('audit_logs.table.action')}</th>
                    <th className="text-left p-4 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{t('audit_logs.table.timestamp')}</th>
                    <th className="text-left p-4 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{t('audit_logs.table.ip')}</th>
                    <th className="text-left p-4 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{t('audit_logs.table.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 uppercase tracking-widest font-mono text-sm animate-pulse italic">
                         Syncing logs...
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      const Icon = typeIcons[log.type] || Edit;
                      return (
                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/10 transition-colors duration-200">
                          <td className="p-4">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${typeColors[log.type] || "bg-gray-500/30"}`}>
                              <Icon size={18} />
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-white font-bold text-sm">{log.user}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-300 text-sm line-clamp-2 max-w-xs">{log.action}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-400 text-xs md:text-sm font-mono">{log.timestamp}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-500 text-xs md:text-sm font-mono tracking-tighter">{log.ipAddress}</p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full font-bold uppercase tracking-wide border ${
                                log.status === "success"
                                  ? "bg-green-500/30 text-green-300 border-green-500/30"
                                  : "bg-red-500/30 text-red-300 border-red-500/30"
                              }`}
                            >
                              {log.status === "success" ? t('audit_logs.status.success') : t('audit_logs.status.failed')}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-500 uppercase tracking-widest font-bold text-xs">
                        No logs found matching filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* GDPR & Compliance Section */}
            <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl border border-white/10 shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-6 uppercase tracking-tight">{t('audit_logs.gdpr.title')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <button className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group">
                  <div className="text-left min-w-0 pr-4">
                    <p className="text-white font-bold text-sm uppercase tracking-wide">{t('audit_logs.gdpr.export_user')}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{t('audit_logs.gdpr.export_desc')}</p>
                  </div>
                  <Download size={20} className="text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                </button>

                <button className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group">
                  <div className="text-left min-w-0 pr-4">
                    <p className="text-white font-bold text-sm uppercase tracking-wide">{t('audit_logs.gdpr.delete_user')}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{t('audit_logs.gdpr.delete_desc')}</p>
                  </div>
                  <Trash2 size={20} className="text-red-400 group-hover:rotate-12 transition-transform flex-shrink-0" />
                </button>

                <button className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group">
                  <div className="text-left min-w-0 pr-4">
                    <p className="text-white font-bold text-sm uppercase tracking-wide text-primary">{t('audit_logs.gdpr.view_dpa')}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{t('audit_logs.gdpr.view_dpa_desc')}</p>
                  </div>
                  <Eye size={20} className="text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
