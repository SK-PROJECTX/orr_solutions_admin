import React from 'react';
import { Invoice, InvoiceSettings } from '@/store/invoiceStore';

interface ReceiptDocumentProps {
  invoice: Invoice;
  settings: InvoiceSettings;
}

export default function ReceiptDocument({ invoice, settings }: ReceiptDocumentProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white text-slate-900 p-8 md:p-16 max-w-4xl mx-auto shadow-2xl rounded-sm print:shadow-none print:p-0">
      {/* Receipt Header */}
      <div className="flex flex-col items-center text-center border-b-2 border-primary pb-12 space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl">✓</div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Payment Receipt</h1>
          <p className="text-slate-500 font-medium">Thank you for your payment!</p>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="py-12 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-y-4 pt-4">
              <span className="text-sm text-slate-500">Invoice Number:</span>
              <span className="text-sm font-bold text-slate-800">{invoice.invoiceNumber}</span>
              <span className="text-sm text-slate-500">Payment Date:</span>
              <span className="text-sm font-bold text-slate-800">{formatDate(invoice.updatedAt)}</span>
              <span className="text-sm text-slate-500">Payment Status:</span>
              <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Successful</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-8 rounded-2xl min-w-[300px]">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Amount Paid</h3>
          <p className="text-5xl font-black text-center text-slate-900 mb-2">${invoice.totalAmount.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">Fully Settled</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed To</h3>
          <div className="space-y-1">
            <p className="text-lg font-black text-slate-800">{invoice.clientName}</p>
            <p className="text-slate-500">{invoice.clientEmail}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</h3>
          <div className="space-y-1 text-sm text-slate-500">
            <p className="font-bold text-slate-800">{settings.companyName}</p>
            <p>{settings.companyAddress}</p>
            <p>{settings.companyEmail}</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 flex flex-col items-center space-y-6 pt-12 border-t border-slate-100">
        <div className="flex items-center gap-2 opacity-50 grayscale">
          <img src="/images/logo.svg" alt="Logo" className="w-6 h-6" />
          <span className="text-sm font-bold text-slate-900 tracking-tighter">ORR SOLUTIONS</span>
        </div>
        <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirmation ID</p>
            <p className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded mt-1">REC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
        <p className="text-[10px] text-slate-400 max-w-sm text-center leading-relaxed">
          This receipt is an official confirmation of payment for the services listed in invoice {invoice.invoiceNumber}. For any billing inquiries, please contact finance@orr.solutions.
        </p>
      </div>
    </div>
  );
}
