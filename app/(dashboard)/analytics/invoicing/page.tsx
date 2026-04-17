"use client";

import LockedFeature from "@/app/components/admin/LockedFeature";
import { useLanguageStore } from "@/store/languageStore";

export default function InvoicingPage() {
  const { t, language } = useLanguageStore();

  return (
    <LockedFeature 
      title={t('sidebar.invoicing')} 
      description={t('analytics.invoicing_desc')}
      fullPage={true}
    />
  );
}
