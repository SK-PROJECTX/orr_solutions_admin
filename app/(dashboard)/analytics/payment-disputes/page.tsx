"use client";

import LockedFeature from "@/app/components/admin/LockedFeature";
import { useLanguageStore } from "@/store/languageStore";

export default function PaymentDisputesPage() {
  const { t, language } = useLanguageStore();
  
  return (
    <LockedFeature 
      title={t('sidebar.payment_disputes')} 
      description={t('analytics.payment_disputes_desc')}
      fullPage={true}
    />
  );
}
