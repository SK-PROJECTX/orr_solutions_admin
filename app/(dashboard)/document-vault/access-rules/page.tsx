"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  CreditCard,
  Link as LinkIcon,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';

import { useVaultStore, Document, DocumentAccessRule } from '@/store/vaultStore';
import { useInvoiceStore, Invoice } from '@/store/invoiceStore';
import { useLanguageStore } from '@/store/languageStore';

export default function AccessRulesPage() {
  const { t } = useLanguageStore();
  const { documents, batchUpdate, addAuditLog } = useVaultStore();
  const { invoices } = useInvoiceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedInvoiceId, setSimulatedInvoiceId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.client.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBatchAssign = (type: DocumentAccessRule['type'], linkedId?: string) => {
    if (selectedDocs.length === 0) return;
    
    const rule: DocumentAccessRule = {
      type,
      linkedId,
      description: type === 'payment_linked' ? `Unlocked upon payment of ${linkedId}` : 'Immediate Access'
    };

    batchUpdate(selectedDocs, { accessRule: rule });
    
    addAuditLog({
       action: 'metadata_update',
       docId: 'BATCH',
       docTitle: `${selectedDocs.length} Documents`,
       performedBy: 'Current Admin',
       details: `Batch assigned access rule: ${type} ${linkedId ? '('+linkedId+')' : ''}`
    });

    setSelectedDocs([]);
  };

  const getDocStatus = (doc: Document) => {
    if (doc.accessRule.type === 'immediate') return 'unlocked';
    if (doc.accessRule.type === 'payment_linked') {
       const invoice = invoices.find(inv => inv.id === doc.accessRule.linkedId);
       return invoice?.status === 'paid' ? 'unlocked' : 'locked';
    }
    return 'locked';
  };

  const simulationResults = useMemo(() => {
    if (!simulatedInvoiceId) return [];
    return documents.filter(d => d.accessRule.linkedId === simulatedInvoiceId);
  }, [documents, simulatedInvoiceId]);

  return (
    <div className="min-h-screen pb-24 text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Lock size={14} />
              Policy Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Access & <span className="text-primary italic">Unlock Rules</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
              Define the conditions that govern document visibility. Tie high-value reports to specific invoices or payment milestones.
            </p>
          </div>

          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all shadow-xl ${
              isSimulating ? 'bg-rose-500 text-white shadow-rose-500/10' : 'bg-primary text-slate-900 shadow-primary/10 hover:bg-lemon'
            }`}
          >
            <Play size={18} className={isSimulating ? 'rotate-90' : ''} />
            {isSimulating ? 'Close Simulation' : 'Run Access Simulation'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-[32px] p-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              {selectedDocs.length > 0 && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl">
                    <span className="text-xs font-black text-primary uppercase">{selectedDocs.length} Selected</span>
                 </div>
              )}
            </div>

            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="py-6 px-8 w-10">
                       <input 
                         type="checkbox" 
                         onChange={(e) => setSelectedDocs(e.target.checked ? filteredDocs.map(d => d.id) : [])}
                         className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                       />
                    </th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Document</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Rule</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 px-8">
                         <input 
                           type="checkbox" 
                           checked={selectedDocs.includes(doc.id)}
                           onChange={() => toggleSelect(doc.id)}
                           className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                         />
                      </td>
                      <td className="py-6 px-8">
                         <p className="text-sm font-black text-white">{doc.title}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">{doc.client}</p>
                      </td>
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-white/5 ${doc.accessRule.type === 'immediate' ? 'text-emerald-400' : 'text-amber-400'}`}>
                               {doc.accessRule.type === 'immediate' ? <Unlock size={14} /> : <Lock size={14} />}
                            </div>
                            <p className="text-[10px] font-black uppercase text-slate-400">{doc.accessRule.description}</p>
                         </div>
                      </td>
                      <td className="py-6 px-8 text-center">
                         <div className="flex justify-center">
                            {getDocStatus(doc) === 'unlocked' ? (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                  <ShieldCheck size={10} /> Unlocked
                               </div>
                            ) : (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-[9px] font-black uppercase tracking-widest">
                                  <ShieldAlert size={10} /> Locked
                               </div>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-6">
             {/* Batch Actions */}
             <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Batch Policy Assignment</h3>
                <div className="space-y-4">
                   <button 
                     onClick={() => handleBatchAssign('immediate')}
                     disabled={selectedDocs.length === 0}
                     className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 group hover:bg-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                   >
                      <Unlock className="text-emerald-400" />
                      <div className="text-left">
                         <p className="text-xs font-black text-white uppercase">Set Immediate</p>
                         <p className="text-[9px] text-slate-500 italic">Always visible to client</p>
                      </div>
                   </button>
                   
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Tie to Invoice</p>
                      <select 
                        onChange={(e) => handleBatchAssign('payment_linked', e.target.value)}
                        disabled={selectedDocs.length === 0}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-xs font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-primary/50"
                      >
                         <option value="">Select Target Invoice</option>
                         {invoices.map(inv => (
                            <option key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.status.toUpperCase()}</option>
                         ))}
                      </select>
                   </div>
                </div>
             </div>

             {/* Simulation Engine */}
             <AnimatePresence>
                {isSimulating && (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="bg-primary/10 border border-primary/20 rounded-[32px] p-8 space-y-6"
                   >
                      <div className="flex items-center gap-3 text-primary">
                         <Play size={20} />
                         <h3 className="text-xs font-black uppercase tracking-widest">Access Simulator</h3>
                      </div>
                      
                      <div className="space-y-4">
                         <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest italic">
                            Select an invoice to see which documents would unlock upon payment confirmation.
                         </p>
                         
                         <select 
                           onChange={(e) => setSimulatedInvoiceId(e.target.value)}
                           className="w-full bg-primary/20 border border-primary/30 rounded-2xl py-4 px-4 text-xs font-black uppercase tracking-widest text-primary focus:outline-none"
                         >
                            <option value="">Choose Invoice...</option>
                            {invoices.map(inv => (
                               <option key={inv.id} value={inv.id}>{inv.invoiceNumber}</option>
                            ))}
                         </select>

                         {simulatedInvoiceId && (
                            <div className="space-y-3">
                               <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{simulationResults.length} Assets Affected</p>
                               <div className="space-y-2">
                                  {simulationResults.map(d => (
                                     <div key={d.id} className="flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-primary/20">
                                        <CheckCircle2 size={12} className="text-primary" />
                                        <p className="text-[10px] font-bold text-white uppercase truncate">{d.title}</p>
                                     </div>
                                  ))}
                                  {simulationResults.length === 0 && (
                                     <p className="text-[10px] text-slate-500 italic">No documents tied to this invoice.</p>
                                  )}
                               </div>
                            </div>
                         )}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
