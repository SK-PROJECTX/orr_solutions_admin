"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, Eye, Edit2, CheckCircle, FileText, Download, Clock, AlertCircle } from 'lucide-react';
import { useInvoiceStore, InvoiceStatus } from '@/store/invoiceStore';

export default function InvoiceManager() {
  const { invoices } = useInvoiceStore();
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusStyle = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'overdue': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'issued': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by client or invoice #..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="text-slate-500 hidden md:block" size={18} />
          {['all', 'paid', 'pending', 'issued', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-300 border ${
                filterStatus === status 
                  ? 'bg-primary text-slate-900 border-primary shadow-[0_0_15px_rgba(14,194,119,0.4)]' 
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Invoice</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {filteredInvoices.map((invoice, idx) => (
                  <motion.tr 
                    key={invoice.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group border-b border-white/5 hover:bg-white/[0.02] transition-all"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{invoice.invoiceNumber}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Ref: {invoice.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-bold text-white">{invoice.clientName}</p>
                      <p className="text-xs text-slate-500">{invoice.clientEmail}</p>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-black text-white">${invoice.totalAmount.toLocaleString()}</p>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-500" />
                        <p className="text-xs text-slate-400">{invoice.dueDate}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                          <Download size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/20 transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredInvoices.length === 0 && (
            <div className="py-20 flex flex-col items-center gap-4 text-slate-500">
              <AlertCircle size={48} className="opacity-20" />
              <p className="font-bold tracking-widest uppercase text-xs">No invoices found</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Automation Indicator */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
             <div className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
             <CheckCircle className="text-emerald-500" size={20} />
           </div>
           <div>
             <p className="text-xs font-bold text-white uppercase tracking-widest">Automation Active</p>
             <p className="text-[10px] text-slate-500">Last reminder sent 2 hours ago to 3 overdue clients</p>
           </div>
         </div>
         <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-lemon transition-colors">
           View Automation Logs
         </button>
      </div>
    </div>
  );
}
