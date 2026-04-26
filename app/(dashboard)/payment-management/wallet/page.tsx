"use client";

import React from 'react';
import { ShieldCheck, Download, History, Wallet as WalletIcon } from 'lucide-react';
import WalletManager from '@/app/components/common/billing/WalletManager';
import ActionModals from '@/app/components/common/billing/ActionModals';

import { useLanguageStore } from '@/store/languageStore';
import { useWalletStore } from '@/store/walletStore';

export default function WalletCreditsPage() {
  const { t } = useLanguageStore();
  const { fetchData, isLoading } = useWalletStore();

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen text-white relative">
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="p-8 animate-pulse space-y-8">
           <div className="h-12 bg-white/5 rounded-2xl w-1/3" />
           <div className="h-[500px] bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 text-white relative">
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <WalletIcon size={14} />
              {t('wallet.oversight')}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              {t('wallet.title').includes('&') ? (
                <>
                  {t('wallet.title').split('&')[0]} <span className="text-primary">&</span> {t('wallet.title').split('&')[1]}
                </>
              ) : (
                t('wallet.title')
              )}
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">
              {t('wallet.subtitle')}
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
