"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, ExternalLink, ShieldAlert, History, Search } from 'lucide-react';

interface Dispute {
  id: string;
  transactionId: string;
  userName: string;
  amount: number;
  reason: string;
  status: 'needs_response' | 'under_review' | 'won' | 'lost';
  dueDate: string;
  timestamp: string;
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'dp1',
    transactionId: 'tx_928374',
    userName: 'Acme Corp',
    amount: 1500.00,
    reason: 'Product not as described',
    status: 'needs_response',
    dueDate: '2026-05-02',
    timestamp: '2026-04-20T09:00:00Z'
  },
  {
    id: 'dp2',
    transactionId: 'tx_123456',
    userName: 'Private User',
    amount: 75.00,
    reason: 'Fraudulent - transaction unrecognized',
    status: 'under_review',
    dueDate: '2026-04-28',
    timestamp: '2026-04-15T14:20:00Z'
  }
];

export default function PaymentDisputesPage() {
  const [disputes] = useState(MOCK_DISPUTES);

  return (
    <div className="min-h-screen pb-24 text-white relative">
      <div className="fixed inset-0 bg-[#0d223c] -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <ShieldAlert size={14} />
              Risk Mitigation & Chargebacks
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Payment <span className="text-rose-500 italic">Disputes</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
              Monitor and respond to external financial disputes, chargebacks, and high-risk transaction alerts.
            </p>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
             <div className="flex gap-2">
                {['All', 'Needs Response', 'Under Review', 'Resolved'].map(tab => (
                  <button key={tab} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                    {tab}
                  </button>
                ))}
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="text" 
                  placeholder="Reference ID..."
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-rose-500/50"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5">
                      <th className="py-6 px-8">Dispute / Entity</th>
                      <th className="py-6 px-8">Reason</th>
                      <th className="py-6 px-8 text-right">Amount</th>
                      <th className="py-6 px-8">Status</th>
                      <th className="py-6 px-8 text-right">Deadline</th>
                      <th className="py-6 px-8 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {disputes.map((dp) => (
                     <tr key={dp.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-6 px-8">
                           <div>
                              <p className="text-xs font-mono text-slate-500 mt-1 uppercase">ID: {dp.id}</p>
                              <p className="text-sm font-bold text-white uppercase tracking-tight">{dp.userName}</p>
                              <p className="text-[10px] text-slate-500">Ref: {dp.transactionId}</p>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <p className="text-xs text-slate-400 max-w-xs">{dp.reason}</p>
                        </td>
                        <td className="py-6 px-8 text-right text-lg font-black text-white">
                           ${dp.amount.toLocaleString()}
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${dp.status === 'needs_response' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${dp.status === 'needs_response' ? 'text-rose-500' : 'text-blue-500'}`}>
                                 {dp.status.replace('_', ' ')}
                              </span>
                           </div>
                        </td>
                        <td className="py-6 px-8 text-right">
                           <div className="flex flex-col items-end">
                              <p className="text-sm font-bold text-white">{dp.dueDate}</p>
                              <p className="text-[9px] font-black uppercase text-rose-500/60">Final Deadline</p>
                           </div>
                        </td>
                        <td className="py-6 px-8 text-right">
                           <div className="flex justify-end gap-2">
                              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2">
                                 <FileText size={14} /> Evidence
                              </button>
                              <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                                 <ExternalLink size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
           <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500">
              <AlertCircle size={32} />
           </div>
           <div className="flex-1">
              <h4 className="text-lg font-black text-rose-400 uppercase tracking-tight">External Dispute Webhooks</h4>
              <p className="text-sm text-slate-400">The system is currently listening to Stripe/PayPal dispute notifications. These records are updated automatically upon status transitions.</p>
           </div>
           <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all border border-white/10">
              <History size={16} className="inline mr-2" /> Dispute History
           </button>
        </div>
      </div>
    </div>
  );
}
