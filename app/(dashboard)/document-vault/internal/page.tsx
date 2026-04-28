"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  EyeOff,
  Lock,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
  Clock,
  Trash2,
  Plus,
  FolderLock
} from 'lucide-react';

import { useVaultStore, Document, FileType } from '@/store/vaultStore';
import { useLanguageStore } from '@/store/languageStore';

export default function InternalVaultPage() {
  const { t } = useLanguageStore();
  const { documents, toggleVisibility, deleteDocument } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState('');

  const internalDocs = useMemo(() => {
    return documents.filter(doc => 
      doc.visibility === 'internal' && 
      (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       doc.project.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [documents, searchQuery]);

  return (
    <div className="min-h-screen pb-24 text-white relative overflow-hidden">
      {/* Restrictive Background Accent */}
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Warning Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 flex items-center gap-4">
           <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <ShieldAlert size={20} />
           </div>
           <div className="space-y-0.5">
              <p className="text-xs font-black uppercase tracking-widest text-amber-500">Restricted Access Zone</p>
              <p className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest">Only administrators can view or manage these documents. Client exposure is strictly disabled.</p>
           </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <FolderLock size={14} />
              Internal Infrastructure
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              ORR <span className="text-amber-500 italic">Exclusive Vault</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
              Confidential internal repository for legal drafts, compliance audits, and sensitive project blueprints.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search internal archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {internalDocs.map((doc, idx) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 hover:border-amber-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <EyeOff size={48} className="text-amber-500" />
                </div>

                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-500">
                      <FileText size={28} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter">{doc.title}</h3>
                      <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">{doc.category} Archive</p>
                   </div>
                </div>

                <p className="text-xs text-slate-400 font-medium line-clamp-2 h-10 mb-6">{doc.description}</p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex flex-col">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Modified</p>
                      <p className="text-[10px] font-bold text-white uppercase">{new Date(doc.updatedAt).toLocaleDateString()}</p>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => toggleVisibility(doc.id)}
                        className="p-3 bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-2xl border border-white/10 transition-all"
                        title="Move to Public Vault"
                      >
                         <Plus size={18} />
                      </button>
                      <button 
                        onClick={() => deleteDocument(doc.id)}
                        className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-2xl border border-white/10 transition-all"
                        title="Delete Permanent"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {internalDocs.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center gap-4 text-slate-600">
               <EyeOff size={64} className="opacity-10" />
               <p className="text-sm font-black uppercase tracking-widest opacity-30">The restricted vault is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
