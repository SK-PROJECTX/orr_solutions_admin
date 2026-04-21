"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Settings as SettingsIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  FileDown
} from "lucide-react";
import Link from "next/link";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import InvoiceEditor from "@/app/components/admin/invoices/InvoiceEditor";
import InvoiceDocument from "@/app/components/common/billing/InvoiceDocument";

export default function InvoicingPage() {
  const { t } = useLanguageStore();
  const { invoices, fetchInvoices, deleteInvoice, settings, isLoading } = useInvoiceStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'issued': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice(id);
    }
  };

  const openEditor = (id?: string) => {
    setSelectedInvoiceId(id || null);
    setIsEditorOpen(true);
  };

  if (isEditorOpen) {
    return <InvoiceEditor onClose={() => setIsEditorOpen(false)} invoiceId={selectedInvoiceId || undefined} />;
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-background">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                {t('invoices.title')}
              </h1>
              <p className="text-white/40 mt-1">{t('invoices.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/analytics/invoicing/settings"
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-white/60 hover:text-white"
              >
                <SettingsIcon className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => openEditor()}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
              >
                <Plus className="w-4 h-4" /> {t('invoices.create_new')}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Invoiced', value: `$${invoices.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}`, icon: FileText, color: 'text-primary' },
              { label: 'Pending Payment', value: `$${invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}`, icon: Clock, color: 'text-yellow-400' },
              { label: 'Total Paid', value: `$${invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}`, icon: CheckCircle, color: 'text-green-400' },
              { label: 'Overdue', value: `$${invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}`, icon: AlertCircle, color: 'text-red-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-card/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table Controls */}
          <div className="bg-card/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder={t('invoices.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-2xl items-center border border-white/5">
                  {['all', 'draft', 'issued', 'paid', 'overdue'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        statusFilter === status ? 'bg-primary text-white shadow-lg' : 'text-white/30 hover:text-white'
                      }`}
                    >
                      {status === 'all' ? 'All' : t(`invoices.${status}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    <th className="py-6 px-8">{t('invoices.invoice_no')}</th>
                    <th className="py-6 px-8">{t('invoices.client')}</th>
                    <th className="py-6 px-8">{t('invoices.amount')}</th>
                    <th className="py-6 px-8">{t('invoices.status')}</th>
                    <th className="py-6 px-8 text-right">{t('invoices.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-white tracking-wider">{inv.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-white tracking-tight">{inv.clientName}</span>
                          <span className="text-xs text-white/30">{inv.clientEmail}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className="font-black text-white tracking-tighter text-lg">${inv.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="py-6 px-8">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2 text-white/40">
                          <button 
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-2 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditor(inv.id)}
                            className="p-2 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(inv.id)}
                            className="p-2 hover:bg-white/5 hover:text-red-400 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 text-white/10">
                          <FileText className="w-16 h-16" />
                          <p className="text-xl font-bold italic uppercase tracking-widest">No invoices found</p>
                          <button 
                             onClick={() => openEditor()}
                             className="text-primary hover:underline text-sm font-bold uppercase tracking-widest"
                          >
                            Create your first invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination / Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                Showing {filteredInvoices.length} of {invoices.length} records
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">Previous</button>
                <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setPreviewInvoice(null)} />
          <div className="relative w-full max-w-5xl max-h-screen overflow-auto bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 right-0 p-4 flex justify-end gap-3 z-30 bg-white/10 backdrop-blur-sm pointer-events-none">
              <button 
                onClick={() => window.print()}
                className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl pointer-events-auto hover:scale-105 transition-transform"
              >
                <FileDown className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPreviewInvoice(null)}
                className="p-3 bg-slate-100 text-slate-900 rounded-2xl shadow-xl pointer-events-auto hover:bg-slate-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-90 md:rotate-0" />
              </button>
            </div>
            <div className="p-4 md:p-0">
              <InvoiceDocument invoice={previewInvoice} settings={settings} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
