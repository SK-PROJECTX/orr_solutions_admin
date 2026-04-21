'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Send, ArrowLeft, RefreshCw, User, Mail, MapPin } from 'lucide-react';
import { useInvoiceStore, Invoice, InvoiceLineItem } from '@/store/invoiceStore';
import { useLanguageStore } from '@/store/languageStore';

interface InvoiceEditorProps {
  onClose: () => void;
  invoiceId?: string;
}

export default function InvoiceEditor({ onClose, invoiceId }: InvoiceEditorProps) {
  const { t } = useLanguageStore();
  const { getInvoiceById, createInvoice, updateInvoice, settings } = useInvoiceStore();
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    taxRate: settings.defaultTaxRate,
    taxAmount: 0,
    totalAmount: 0,
    notes: '',
    status: 'draft'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      const existingInvoice = getInvoiceById(invoiceId);
      if (existingInvoice) {
        setFormData(existingInvoice);
      }
    }
  }, [invoiceId, getInvoiceById]);

  const calculateTotals = (items: InvoiceLineItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      items,
      subtotal,
      taxAmount,
      totalAmount
    }));
  };

  const addItem = () => {
    const newItem: InvoiceLineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    calculateTotals([...(formData.items || []), newItem], formData.taxRate || 0);
  };

  const updateItem = (id: string, updates: Partial<InvoiceLineItem>) => {
    const newItems = (formData.items || []).map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.price;
        return updated;
      }
      return item;
    });
    calculateTotals(newItems, formData.taxRate || 0);
  };

  const removeItem = (id: string) => {
    const newItems = (formData.items || []).filter(item => item.id !== id);
    calculateTotals(newItems, formData.taxRate || 0);
  };

  const handleSave = async (status: 'draft' | 'issued') => {
    setIsLoading(true);
    try {
      const finalData = { ...formData, status };
      if (invoiceId) {
        await updateInvoice(invoiceId, finalData);
      } else {
        await createInvoice(finalData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save invoice', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {invoiceId ? t('invoices.editor.update') : t('invoices.editor.title')}
            </h1>
            <p className="text-xs text-white/40">{t('invoices.editor.details')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('draft')}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 inline mr-2" />}
            {t('invoices.editor.save_draft')}
          </button>
          <button 
            onClick={() => handleSave('issued')}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 inline mr-2" />}
            {t('invoices.editor.issue')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10 pb-24">
          {/* Client Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="font-bold text-sm uppercase tracking-widest">{t('invoices.editor.bill_to')}</h3>
              </div>
              <div className="bg-card/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text"
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder={t('invoices.editor.client_placeholder')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="email"
                    value={formData.clientEmail}
                    onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder={t('invoices.editor.email_placeholder')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea 
                    value={formData.clientAddress}
                    onChange={e => setFormData({ ...formData, clientAddress: e.target.value })}
                    placeholder={t('invoices.editor.address_placeholder')}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Metadata</h3>
              </div>
              <div className="bg-card/50 border border-white/5 rounded-2xl p-6 grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase ml-1">{t('invoices.date')}</label>
                  <input 
                    type="date"
                    value={formData.issueDate}
                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase ml-1">{t('invoices.due_date')}</label>
                  <input 
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="font-bold text-sm uppercase tracking-widest">{t('invoices.editor.items')}</h3>
              </div>
              <button 
                onClick={addItem}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-xs font-bold"
              >
                <Plus className="w-3 h-3 inline mr-1" /> {t('invoices.editor.add_item')}
              </button>
            </div>

            <div className="space-y-3">
              {formData.items?.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 bg-card/30 border border-white/5 p-4 rounded-2xl group relative items-start">
                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-[10px] font-bold text-white/20 uppercase px-1">Description</label>
                    <input 
                      type="text"
                      value={item.description}
                      onChange={e => updateItem(item.id, { description: e.target.value })}
                      placeholder="Service or product description..."
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-sm text-white outline-none focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-1 space-y-1 text-center">
                    <label className="text-[10px] font-bold text-white/20 uppercase px-1">Qty</label>
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-2 text-sm text-white text-center outline-none focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1 text-right">
                    <label className="text-[10px] font-bold text-white/20 uppercase px-1">Price</label>
                    <input 
                      type="number"
                      value={item.price}
                      onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-sm text-white text-right outline-none focus:bg-white/10 transition-all font-mono"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1 text-right">
                    <label className="text-[10px] font-bold text-white/20 uppercase px-1">Total</label>
                    <div className="w-full bg-white/5 border border-transparent rounded-lg px-4 py-2 text-sm text-white text-right font-bold font-mono">
                      ${item.total.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center pt-6">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {(!formData.items || formData.items.length === 0) && (
                <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/20 space-y-4">
                  <div className="p-4 bg-white/5 rounded-full">
                    <Plus className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">No items added yet. Click "Add Item" to begin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="font-bold text-sm uppercase tracking-widest">{t('invoices.editor.notes')}</h3>
              </div>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('invoices.editor.notes_placeholder')}
                rows={4}
                className="w-full bg-card/50 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-all resize-none shadow-inner"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-card/80 border border-white/10 rounded-3xl p-8 space-y-4 shadow-xl">
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40 uppercase font-bold tracking-widest">{t('invoices.editor.subtotal')}</span>
                  <span className="text-white font-mono font-bold">${formData.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 uppercase font-bold tracking-widest">{t('invoices.editor.tax')}</span>
                    <input 
                      type="number"
                      value={formData.taxRate}
                      onChange={e => calculateTotals(formData.items || [], Number(e.target.value))}
                      className="w-12 bg-white/5 border border-white/10 rounded px-1 text-center text-xs text-primary font-bold"
                    />
                    <span className="text-white/20 text-xs">%</span>
                  </div>
                  <span className="text-white font-mono font-bold">${formData.taxAmount?.toLocaleString()}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white uppercase tracking-tighter">{t('invoices.editor.total')}</span>
                  <span className="text-3xl font-black text-primary font-mono">${formData.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
