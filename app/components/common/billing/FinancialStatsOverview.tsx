"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, FileText, AlertCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useWalletStore } from '@/store/walletStore';

export default function FinancialStatsOverview() {
  const { invoices } = useInvoiceStore();
  const { wallets } = useWalletStore();

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'issued' || inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
  
  const aggregateWalletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const stats = [
    {
      label: 'Total Paid Invoices',
      value: `$${totalPaid.toLocaleString()}`,
      icon: <DollarSign className="text-emerald-400" size={24} />,
      trend: '+12.5%',
      trendUp: true,
      color: 'emerald'
    },
    {
      label: 'Total Outstanding',
      value: `$${totalOutstanding.toLocaleString()}`,
      icon: <FileText className="text-blue-400" size={24} />,
      trend: '-2.4%',
      trendUp: false,
      color: 'blue'
    },
    {
      label: 'Overdue Invoices',
      value: overdueCount.toString(),
      icon: <AlertCircle className="text-rose-400" size={24} />,
      trend: '+1 this week',
      trendUp: false,
      color: 'rose'
    },
    {
      label: 'Total Wallet Balances',
      value: `$${aggregateWalletBalance.toLocaleString()}`,
      icon: <Wallet className="text-purple-400" size={24} />,
      trend: '+5.2%',
      trendUp: true,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group overflow-hidden bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-500"
        >
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            {React.cloneElement(stat.icon as React.ReactElement, { size: 120 })}
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
              {stat.icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {stat.trend}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-black tracking-tight text-white">{stat.value}</h3>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Real-time Data</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
