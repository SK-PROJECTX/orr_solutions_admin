"use client";

import React from 'react';
import { ShieldCheck, Download, History, Wallet as WalletIcon } from 'lucide-react';
import WalletManager from '@/app/components/common/billing/WalletManager';
import ActionModals from '@/app/components/common/billing/ActionModals';

export default function WalletCreditsPage() {
  return (
    <div className="min-h-screen pb-24 text-white relative">
      <div className="fixed inset-0 bg-[#0d223c] -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <WalletIcon size={14} />
              Controlled Financial Interactions
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Wallet <span className="text-primary">&</span> Credits
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
              Advanced oversight of user wallet activities, automated settlements, and document vault activation events.
            </p>
          </div>
        </div>

        <section className="bg-card/30 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8">
            <WalletManager />
          </div>
        </section>

        <ActionModals />
      </div>
    </div>
  );
}
