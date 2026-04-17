"use client";

import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";

export default function ClientMeetingsPage() {
  const { t } = useLanguageStore();
  return (
    <div className="min-h-screen text-white relative overflow-hidden star">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8">
        <div className="bg-card backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{t('meetings.title')}</h1>
            <p className="text-gray-400">{t('meetings.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/client-management/meetings/past" className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all">
              <Calendar size={32} className="text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('meetings.past_meetings')}</h3>
              <p className="text-gray-400 text-sm">{t('meetings.past_desc')}</p>
            </Link>

            <Link href="/client-management/meetings/upcoming" className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all">
              <Clock size={32} className="text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('meetings.upcoming_meetings')}</h3>
              <p className="text-gray-400 text-sm">{t('meetings.upcoming_desc')}</p>
            </Link>

            <Link href="/client-management/meetings/pending" className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all">
              <Calendar size={32} className="text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('meetings.pending_meetings')}</h3>
              <p className="text-gray-400 text-sm">{t('meetings.pending_desc')}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
