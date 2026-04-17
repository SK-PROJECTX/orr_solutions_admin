"use client";

import { Briefcase, FolderOpen, Users } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function ClientWorkspacesPage() {
  const { t } = useLanguageStore();
  return (
    <div className="min-h-screen text-white relative overflow-hidden star">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8">
        <div className="bg-card backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{t('clients.workspaces_title')}</h1>
            <p className="text-gray-400">{t('clients.workspaces_subtitle')}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('clients.workspaces_title')}</h3>
            <p className="text-gray-400">
              {t('clients.workspace_placeholder')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
