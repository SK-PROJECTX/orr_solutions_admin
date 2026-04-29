"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  History, 
  Clock,
  User,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  ChevronRight,
  MoreVertical,
  Download,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

import { useVaultStore, Document, DocumentVersion } from '@/store/vaultStore';
import { useLanguageStore } from '@/store/languageStore';

export default function VersionControlPage() {
  const { t } = useLanguageStore();
  const { documents } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState('');

  const multiVersionDocs = useMemo(() => {
    return documents
      .filter(doc => 
        (doc.versions.length > 1 || doc.currentVersion > 1) &&
        (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         doc.client.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => b.versions.length - a.versions.length);
  }, [documents, searchQuery]);

  return (
    <div className="min-h-screen pb-24 text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <History size={14} />
            Version Orchestration
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
            Centralized <span className="text-primary italic">Version Control</span>
          </h1>
          <p className="text-slate-400 max-w-xl text-sm font-medium">
            Manage document lineage across the entire repository. Identify outdated files, perform rollbacks, and track changes.
          </p>
        </div>

        {/* Search */}
        <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search documents with history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Multi-Version Docs List */}
        <div className="space-y-6">
          <AnimatePresence mode='popLayout'>
            {multiVersionDocs.map((doc, idx) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden"
              >
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                         <FileText size={32} />
                         <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-slate-900 flex items-center justify-center text-[10px] font-black border-4 border-background">
                            {doc.versions.length}
                         </div>
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white uppercase tracking-tighter">{doc.title}</h3>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{doc.client}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.project}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Version</p>
                         <p className="text-xs font-black text-white uppercase tracking-widest">v{doc.currentVersion} (Latest)</p>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                         <Download size={14} /> Master Copy
                      </button>
                   </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {doc.versions.map((v, vIdx) => (
                      <div 
                        key={v.id} 
                        className={`p-4 rounded-3xl border transition-all ${
                          vIdx === 0 ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <div className="px-2 py-0.5 bg-background/50 rounded text-[9px] font-black text-slate-400 border border-white/5">
                               VER {v.versionNumber}
                            </div>
                            {vIdx === 0 ? (
                               <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Active</span>
                            ) : (
                               <button className="text-primary hover:underline text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                  <RotateCcw size={10} /> Rollback
                               </button>
                            )}
                         </div>
                         <p className="text-[11px] font-bold text-white uppercase truncate mb-1">{v.fileName}</p>
                         <div className="space-y-1 mt-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                               <Clock size={10} /> {new Date(v.uploadedAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                               <User size={10} /> {v.uploadedBy}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {multiVersionDocs.length === 0 && (
            <div className="py-24 flex flex-col items-center gap-4 text-slate-600">
               <History size={64} className="opacity-10" />
               <p className="text-sm font-black uppercase tracking-widest opacity-30">No document history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
