"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, ShieldCheck, Download, LayoutGrid } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import InvoiceManager from '@/app/components/common/billing/InvoiceManager';
import ActionModals from '@/app/components/common/billing/ActionModals';

import { useInvoiceStore } from '@/store/invoiceStore';

export default function InvoicingManagementPage() {
  const { t } = useLanguageStore();
  const { fetchInvoices } = useInvoiceStore();
  
  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Handle Generate New via ActionModals state if needed, 
  // or just rely on ActionModals being present.
  // In ActionModals.tsx, the buttons are fixed at the bottom right.
  // We can also trigger the modal from here if we expose the setter.
  // For now, let's just localize the UI.

  return (
    <div className="min-h-screen pb-24 text-white relative">
      <div className="fixed inset-0 bg-[#0d223c] -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <FileText size={14} />
              {t('invoicing.orchestration')}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
               {t('invoicing.title')} <span className="text-primary italic">{t('invoicing.management')}</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
               {t('invoicing.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-slate-900 rounded-xl text-xs font-bold shadow-lg shadow-primary/10 hover:bg-lemon transition-all">
               <Plus size={16} /> {t('invoicing.generate_new_btn')}
             </button>
          </div>
        </div>

        <section className="bg-card/30 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8">
            <InvoiceManager />
          </div>
        </section>

        <ActionModals />
      </div>
    </div>
  );
}
