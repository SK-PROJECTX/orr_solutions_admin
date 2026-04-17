"use client";

import LockedFeature from "@/app/components/admin/LockedFeature";
import { useLanguageStore } from "@/store/languageStore";

export default function ProRataApprovalsPage() {
  const { t, language } = useLanguageStore();

  return (
    <LockedFeature 
      title={t('sidebar.pro_rata')} 
      description={t('analytics.pro_rata_desc')}
      fullPage={true}
    />
  );
}
