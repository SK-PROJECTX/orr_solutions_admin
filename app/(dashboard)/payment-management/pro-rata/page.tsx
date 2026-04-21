"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProRataRequest {
  id: string;
  userName: string;
  userEmail: string;
  currentPlan: string;
  newPlan: string;
  adjustmentAmount: number;
  reason: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_REQUESTS: ProRataRequest[] = [
  {
    id: 'pr1',
    userName: 'Nexus Systems',
    userEmail: 'accounts@nexus.sys',
    currentPlan: 'Scale',
    newPlan: 'Enterprise',
    adjustmentAmount: 1250.50,
    reason: 'Mid-cycle upgrade from Scale to Enterprise',
    timestamp: '2026-04-21T10:00:00Z',
    status: 'pending'
  },
  {
    id: 'pr2',
    userName: 'Global Tech',
    userEmail: 'finance@globaltech.io',
    currentPlan: 'Seed',
    newPlan: 'Scale',
    adjustmentAmount: 450.00,
    reason: 'Addition of 5 new seats mid-month',
    timestamp: '2026-04-20T15:30:00Z',
    status: 'pending'
  }
];

export default function ProRataApprovalsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="min-h-screen pb-24 text-white relative">
      <div className="fixed inset-0 bg-[#0d223c] -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <TrendingUp size={14} />
              Billing Precision Control
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Pro-rata <span className="text-primary italic">Approvals</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
              Review and authorize mid-cycle plan adjustments and usage-based billing overrides.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col xl:flex-row gap-8 items-start xl:items-center hover:border-primary/30 transition-all group"
              >
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                         <User size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white">{request.userName}</h3>
                         <p className="text-xs text-slate-500">{request.userEmail}</p>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                         <span className="text-white/40 mr-2">From:</span>
                         <span className="font-bold text-white uppercase tracking-wider">{request.currentPlan}</span>
                      </div>
                      <ArrowRight className="text-primary" size={16} />
                      <div className="px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
                         <span className="text-primary/60 mr-2">To:</span>
                         <span className="font-black text-primary uppercase tracking-wider">{request.newPlan}</span>
                      </div>
                   </div>

                   <p className="text-sm text-slate-400 font-medium">
                      <span className="text-white/60 font-black uppercase text-[10px] tracking-widest mr-2">Justification:</span>
                      {request.reason}
                   </p>
                </div>

                <div className="flex flex-col items-end gap-3 w-full xl:w-auto">
                   <div className="text-right mb-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adjustment Total</p>
                      <p className="text-3xl font-black text-white tracking-tighter">${request.adjustmentAmount.toLocaleString()}</p>
                   </div>
                   
                   <div className="flex gap-2 w-full xl:w-auto">
                      <button 
                        onClick={() => handleAction(request.id, 'rejected')}
                        className="flex-1 xl:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
                      >
                         Reject
                      </button>
                      <button 
                         onClick={() => handleAction(request.id, 'approved')}
                         className="flex-1 xl:flex-none px-6 py-3 bg-primary text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-lemon transition-all shadow-xl shadow-primary/10"
                      >
                         Approve Adjustment
                      </button>
                   </div>
                   <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      Requires Level 2 Auth
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {requests.filter(r => r.status === 'pending').length === 0 && (
            <div className="bg-card/20 backdrop-blur-md border border-dashed border-white/10 rounded-3xl p-20 flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={32} />
               </div>
               <div className="text-center">
                  <p className="text-xl font-black text-white italic uppercase tracking-widest">Queue Cleared</p>
                  <p className="text-sm text-slate-500">No pending pro-rata adjustments require attention.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
