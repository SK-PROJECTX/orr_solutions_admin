"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock,
  User,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Trash2,
  Plus,
  Download
} from 'lucide-react';

import { useVaultStore, AuditLog } from '@/store/vaultStore';
import { useLanguageStore } from '@/store/languageStore';

export default function AuditLogsPage() {
  const { t } = useLanguageStore();
  const { auditLogs } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      return matchesSearch && matchesAction;
    });
  }, [auditLogs, searchQuery, filterAction]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload': return <Plus className="text-emerald-400" size={14} />;
      case 'download': return <Download className="text-blue-400" size={14} />;
      case 'visibility_change': return <Eye className="text-amber-400" size={14} />;
      case 'unlock': return <ShieldCheck className="text-primary" size={14} />;
      case 'delete': return <Trash2 className="text-rose-400" size={14} />;
      default: return <Activity className="text-slate-400" size={14} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Activity size={14} />
            Governance Layer
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
            Audit & <span className="text-primary italic">Activity Logs</span>
          </h1>
          <p className="text-slate-400 max-w-xl text-sm font-medium">
            Complete traceability for every document interaction, from upload to client download and access state transitions.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter by document or administrator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <select 
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-400 focus:outline-none w-full md:w-auto"
          >
            <option value="all">All Actions</option>
            <option value="upload">Uploads</option>
            <option value="download">Downloads</option>
            <option value="visibility_change">Visibility Changes</option>
            <option value="unlock">Unlock Events</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp / Session</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity / Document</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Administrator</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode='popLayout'>
                  {filteredLogs.map((log, idx) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-6 px-8">
                        <div className="flex flex-col">
                           <p className="text-xs font-black text-white">{new Date(log.timestamp).toLocaleDateString()}</p>
                           <p className="text-[10px] text-slate-500 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                              <FileText size={14} />
                           </div>
                           <p className="text-sm font-bold text-white uppercase tracking-tight">{log.docTitle}</p>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex justify-center">
                           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                              {getActionIcon(log.action)}
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{log.action.replace('_', ' ')}</span>
                           </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black">
                               {log.performedBy[0]}
                            </div>
                            <p className="text-xs font-black text-slate-300">{log.performedBy}</p>
                         </div>
                      </td>
                      <td className="py-6 px-8 text-right">
                         <p className="text-[10px] font-bold text-slate-500 italic">{log.details}</p>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4 text-slate-500">
                          <Activity size={48} className="opacity-10" />
                          <p className="text-sm font-black uppercase tracking-widest opacity-30">No activity logs recorded yet.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
