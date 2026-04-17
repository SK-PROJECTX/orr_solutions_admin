"use client";

import LockedFeature from "@/app/components/admin/LockedFeature";
import { useLanguageStore } from '@/store/languageStore';

export default function TemplatesPage() {
  const { t } = useLanguageStore();
  return (
    <LockedFeature 
      title={t('content_management.templates_title')} 
      description={t('content_management.templates_subtitle')}
      fullPage={true}
    />
  );
}
