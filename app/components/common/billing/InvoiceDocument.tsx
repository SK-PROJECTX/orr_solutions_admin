import React from 'react';
import { Invoice, InvoiceSettings } from '@/store/invoiceStore';
import { useLanguageStore } from '@/store/languageStore';

interface InvoiceDocumentProps {
  invoice: Invoice;
  settings: InvoiceSettings;
}

export default function InvoiceDocument({ invoice, settings }: InvoiceDocumentProps) {
  const { formatCurrency } = useLanguageStore();
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white text-slate-900 p-8 md:p-16 max-w-4xl mx-auto shadow-2xl rounded-sm print:shadow-none print:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-primary pb-8 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo.svg" alt="Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">ORR SOLUTIONS</h1>
          </div>
          <div className="text-sm text-slate-500 max-w-xs leading-relaxed">
            <p className="font-bold text-slate-700">{settings.companyName}</p>
            <p>{settings.companyAddress}</p>
            <p>Email: {settings.companyEmail}</p>
            <p>Phone: {settings.companyPhone}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-4 opacity-50">Invoice</h2>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Number</p>
            <p className="text-xl font-black text-primary">{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Bill To</h3>
          <div className="space-y-1">
            <p className="text-lg font-black text-slate-800">{invoice.clientName}</p>
            <p className="text-slate-500">{invoice.clientEmail}</p>
            {invoice.clientAddress && <p className="text-slate-500 whitespace-pre-line">{invoice.clientAddress}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</h3>
            <p className="font-bold text-slate-700">{formatDate(invoice.issueDate)}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Due</h3>
            <p className="font-bold text-slate-700">{formatDate(invoice.dueDate)}</p>
          </div>
          <div className="col-span-2 pt-4">
             <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' :
              invoice.status === 'overdue' ? 'bg-red-100 text-red-700 border border-red-200' :
              invoice.status === 'issued' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
              'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {invoice.status}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-100">
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoice.items.map((item) => (
              <tr key={item.id} className="group transition-colors">
                <td className="py-6 px-4 text-slate-700 font-medium">{item.description}</td>
                <td className="py-6 px-4 text-slate-500 text-center">{item.quantity}</td>
                <td className="py-6 px-4 text-slate-500 text-right">{formatCurrency(item.price)}</td>
                <td className="py-6 px-4 text-slate-900 font-bold text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end space-y-3">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="font-bold">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Tax ({invoice.taxRate}%)</span>
            <span className="font-bold">{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest">Amount Due</span>
            <span className="text-3xl font-black text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {invoice.notes && (
            <div className="space-y-2 max-w-md">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes & Instructions</h4>
              <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed italic">{invoice.notes}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">✓</div>
            <p className="text-xs font-bold text-slate-400">Professional Billing by ORR Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
