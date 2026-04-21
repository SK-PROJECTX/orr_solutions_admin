"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Hash, 
  Mail, 
  MapPin, 
  Phone, 
  Percent,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";

export default function InvoiceSettingsPage() {
  const { t } = useLanguageStore();
  const { settings, updateSettings } = useInvoiceStore();
  
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await updateSettings(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen text-white bg-background relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/analytics/invoicing"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                {t('invoices.settings.title')}
              </h1>
              <p className="text-white/40">{t('invoices.settings.subtitle')}</p>
            </div>
          </div>
          
          <button 
            form="settings-form"
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t('invoices.settings.save')}
          </button>
        </div>

        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-400 animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-bold">Settings saved successfully!</p>
          </div>
        )}

        <form id="settings-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Numbering Config */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Hash className="w-5 h-5" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em]">{t('invoices.settings.numbering')}</h3>
            </div>
            
            <div className="bg-card/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.prefix')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-primary transition-colors italic font-black">PRE</div>
                  <input 
                    type="text" 
                    value={formData.numberPrefix}
                    onChange={e => setFormData({ ...formData, numberPrefix: e.target.value })}
                    placeholder={t('invoices.settings.prefix_placeholder')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.next_number')}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.nextInvoiceNumber}
                    onChange={e => setFormData({ ...formData, nextInvoiceNumber: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em]">Financial Details</h3>
            </div>
            
            <div className="bg-card/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.tax_rate')}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.defaultTaxRate}
                    onChange={e => setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-mono font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branding Config */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em]">{t('invoices.settings.branding')}</h3>
            </div>
            
            <div className="bg-card/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.company_name')}</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.company_email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="email" 
                      value={formData.companyEmail}
                      onChange={e => setFormData({ ...formData, companyEmail: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.company_phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      value={formData.companyPhone}
                      onChange={e => setFormData({ ...formData, companyPhone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all text-xs"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('invoices.settings.company_address')}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea 
                    value={formData.companyAddress}
                    onChange={e => setFormData({ ...formData, companyAddress: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Company Logo</label>
                <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <img src="/images/logo.svg" alt="Company Logo" className="w-10 h-10" />
                  </div>
                  <div className="flex-1 space-y-2">
                     <p className="text-xs text-white/40 italic">System logo will be used for all generated PDFs and receipts.</p>
                     <button type="button" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Change Logo Asset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
