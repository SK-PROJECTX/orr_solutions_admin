"use client";

import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  UserCheck,
  Wallet,
  X,
  LayoutGrid,
  PieChart,
  Bell,
  Lock,
  Search,
  ChevronLast,
  SquareArrowLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../lib/hooks/auth";
import { useLanguageStore } from "@/store/languageStore";
import { ThemeToggle } from "../ThemeToggle";
import LanguageToggle from "@/app/components/ui/LanguageToggle";

type OpenState = {
  home: boolean;
  operational: boolean;
  consultation: boolean;
  tickets: boolean;
  content: boolean;
  analytics: boolean;
  payments: boolean;
  vault: boolean;
  settings: boolean;
};

type NavItem = {
  label: string;
  href: string;
  subItems?: NavItem[];
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [open, setOpen] = useState<OpenState>({
    home: true,
    operational: true,
    consultation: false,
    tickets: false,
    content: false,
    analytics: false,
    payments: true,
    vault: true,
    settings: true,
  });
  const [subOpen, setSubOpen] = useState<{ [key: string]: boolean }>({});
  const [isMinimized, setIsMinimized] = useState(false);

  const toggle = (key: keyof OpenState) => setOpen({ ...open, [key]: !open[key] });
  const toggleSub = (key: string) => setSubOpen({ ...subOpen, [key]: !subOpen[key] });

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`h-screen bg-card text-white flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out border-r border-white/5 ${
        isMinimized ? 'w-20' : 'w-64'
      } ${isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-50 print:hidden shadow-xl`}>
        
        <div>
          {/* Header: Logo & Toggle */}
          <div className={`flex items-center mb-12 transition-all ${isMinimized ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                src="/images/logo.svg" 
                alt="Logo" 
                className={`${isMinimized ? 'w-12 h-12' : 'h-16 w-auto'} transition-all brightness-0 invert`} 
              />
            </div>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hidden md:flex w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl items-center justify-center transition-colors border border-white/10"
            >
              {isMinimized ? <ChevronLast size={20} /> : <SquareArrowLeft size={20} />}
            </button>
          </div>

          <nav className="space-y-10">
            {/* Group: Home */}
            <SidebarGroup
              label={t('sidebar.home_dashboard')}
              icon={<Home size={24} />}
              open={open.home}
              isMinimized={isMinimized}
              onClick={() => toggle("home")}
              items={[
                { label: t('sidebar.dashboard'), href: "/dashboard/" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Operational */}
            <SidebarGroup
              label={t('sidebar.operational_dashboard')}
              icon={<Settings size={24} />}
              open={open.operational}
              isMinimized={isMinimized}
              onClick={() => toggle("operational")}
              items={[
                { label: t('sidebar.quick_actions'), href: "/operational/quick-actions" },
                { label: t('sidebar.system_notifications'), href: "/operational/system-notifications" },
                { label: t('sidebar.billing_credit'), href: "/operational/billing-credit" },
                {
                  label: t('sidebar.client_management'),
                  href: "/client-management",
                  subItems: [
                    { label: t('sidebar.all_clients'), href: "/client-management" },
                    { label: t('sidebar.client_profiles'), href: "/client-management/profiles" },
                    { label: t('sidebar.client_workspaces'), href: "/client-management/workspaces" },
                    {
                      label: t('sidebar.client_meetings'),
                      href: "/client-management/meetings",
                      subItems: [
                        { label: t('sidebar.past'), href: "/client-management/meetings/past" },
                        { label: t('sidebar.upcoming'), href: "/client-management/meetings/upcoming" },
                        { label: t('sidebar.pending'), href: "/client-management/meetings/pending" }
                      ]
                    }
                  ]
                }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Consultation */}
            <SidebarGroup
              label={t('sidebar.consultation_management')}
              icon={<UserCheck size={24} />}
              open={open.consultation}
              isMinimized={isMinimized}
              onClick={() => toggle("consultation")}
              items={[
                {
                  label: t('sidebar.all_consultations'),
                  href: "/consultations",
                  subItems: [
                    { label: t('sidebar.past'), href: "/consultations/past" },
                    { label: t('sidebar.upcoming'), href: "/consultations/scheduled" }
                  ]
                },
                { label: t('sidebar.assigned_consultants'), href: "/consultations/consultants" },
                { label: t('sidebar.reports_drafts'), href: "/consultations/reports" },
                {
                  label: t('sidebar.meeting_management'),
                  href: "/schedule-meetings",
                  subItems: [
                    { label: t('sidebar.my_meetings'), href: "/schedule-meetings" },
                    { label: t('sidebar.requested_meetings'), href: "/schedule-meetings/requested" },
                    { label: t('sidebar.confirmed_meetings'), href: "/schedule-meetings/confirmed" }
                  ]
                }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Document Vault */}
            <SidebarGroup
              label={t('sidebar.document_vault')}
              icon={<FileText size={24} />}
              open={open.vault}
              isMinimized={isMinimized}
              onClick={() => toggle("vault")}
              items={[
                { label: t('sidebar.vault_all'), href: "/document-vault/all" },
                { label: t('sidebar.vault_studio'), href: "/document-vault/studio" },
                { label: t('sidebar.vault_folders'), href: "/document-vault/folders" },
                { label: t('sidebar.vault_intake'), href: "/document-vault/intake" },
                { label: t('sidebar.vault_access'), href: "/document-vault/access-rules" },
                { label: t('sidebar.vault_internal'), href: "/document-vault/internal" },
                { label: t('sidebar.vault_versions'), href: "/document-vault/versions" },
                { label: t('sidebar.vault_audit'), href: "/document-vault/audit" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Tickets */}
            <SidebarGroup
              label={t('sidebar.tickets_communication')}
              icon={<MessageSquare size={24} />}
              open={open.tickets}
              isMinimized={isMinimized}
              onClick={() => toggle("tickets")}
              items={[
                { label: t('sidebar.all_tickets'), href: "/tickets" },
                { label: t('sidebar.my_tickets'), href: "/tickets/my-tickets" },
                { label: t('sidebar.client_messages'), href: "/messages" },
                { label: t('sidebar.internal_comms'), href: "/tickets/internal-comms" },
                { label: t('sidebar.escalations'), href: "/tickets/escalations" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Payments */}
            <SidebarGroup
              label={t('sidebar.payment_management')}
              icon={<Wallet size={24} />}
              open={open.payments}
              isMinimized={isMinimized}
              onClick={() => toggle("payments")}
              items={[
                { label: t('sidebar.payments_billings'), href: "/payment-management/subscriptions" },
                { label: t('sidebar.wallet_logs'), href: "/payment-management/wallet" },
                { label: t('sidebar.financial_management'), href: "/payment-management/hub" },
                { label: t('sidebar.pro_rata_approval'), href: "/payment-management/pro-rata" },
                { label: t('sidebar.invoicing'), href: "/payment-management/invoicing" },
                { label: t('sidebar.payment_disputes'), href: "/payment-management/disputes" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Content */}
            <SidebarGroup
              label={t('sidebar.content_management')}
              icon={<FileText size={24} />}
              open={open.content}
              isMinimized={isMinimized}
              onClick={() => toggle("content")}
              items={[
                { label: t('sidebar.homepage_content'), href: "/content-management" },
                { label: t('sidebar.how_we_operate'), href: "/content-management/how-we-operate" },
                {
                  label: t('sidebar.services'),
                  href: "/content-management/services",
                  subItems: [
                    { label: t('sidebar.living_systems'), href: "/content-management/services/living-systems-regeneration" },
                    { label: t('sidebar.operational_systems'), href: "/content-management/services/operational-systems-infrastructure" },
                    { label: t('sidebar.strategy_advisory'), href: "/content-management/services/strategy-advisory-compliant" }
                  ]
                },
                { label: t('sidebar.resources_blogs'), href: "/content-management/resources-blogs" },
                { label: t('sidebar.legal_policy'), href: "/content-management/legal-policy" },
                { label: t('sidebar.contact'), href: "/content-management/contact" },
                { label: t('sidebar.templates'), href: "/content-management/templates" },
                { label: t('sidebar.content_drafts'), href: "/content-management/drafts" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Analytics */}
            <SidebarGroup
              label={t('sidebar.analytics_insights')}
              icon={<BarChart3 size={24} />}
              open={open.analytics}
              isMinimized={isMinimized}
              onClick={() => toggle("analytics")}
              items={[
                { label: t('sidebar.behaviour_analytics'), href: "/analytics/behaviour" },
                { label: t('sidebar.sector_insights'), href: "/analytics/sector" },
                { label: t('sidebar.consultation_metrics'), href: "/analytics/consultation-metrics" },
                { label: t('sidebar.workspace_usage'), href: "/analytics/workspace-usage" },
                { label: t('sidebar.funnel_reports'), href: "/analytics/funnel-reports" },
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Group: Settings */}
            <SidebarGroup
              label={t('sidebar.settings')}
              icon={<Settings size={24} />}
              open={open.settings}
              isMinimized={isMinimized}
              onClick={() => toggle("settings")}
              items={[
                { label: t('sidebar.global_settings'), href: "/settings" },
                { label: t('sidebar.audit_logs'), href: "/document-vault/audit" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />
          </nav>
        </div>

        <div className="mt-12 space-y-6">
          {/* Settings Card: DISPLAY & LANGUAGE */}
          {!isMinimized && (
            <div className="px-1 transition-opacity duration-300">
              <div className="bg-transparent border border-white/20 rounded-[2.5rem] p-8 space-y-6">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block px-1">
                  Display & Language
                </span>
                <div className="flex items-center justify-between gap-4">
                  <LanguageToggle />
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Card: Theme Aware */}
          <div className={`bg-primary/10 border border-primary/20 text-white rounded-[2rem] p-4 flex items-center transition-all ${isMinimized ? 'justify-center mx-1 h-14' : 'justify-between h-20 px-5'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black overflow-hidden border border-primary/30 flex-shrink-0">
                <span className="text-sm">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
              </div>
              {!isMinimized && (
                <div className="leading-tight overflow-hidden animate-in fade-in duration-500">
                  <div className="font-bold truncate max-w-[120px] text-[13px]">{user?.username || t('sidebar.admin')}</div>
                  <div className="text-[10px] opacity-60 truncate max-w-[120px] font-medium">{user?.email}</div>
                </div>
              )}
            </div>
            {!isMinimized && (
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 text-primary"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarGroup({
  label,
  icon,
  open,
  onClick,
  items,
  pathname,
  subOpen,
  toggleSub,
  onLinkClick,
  isMinimized
}: {
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onClick: () => void;
  items: NavItem[];
  pathname: string;
  subOpen: { [key: string]: boolean };
  toggleSub: (key: string) => void;
  onLinkClick: () => void;
  isMinimized?: boolean;
}) {
  const isActive = items.some(item =>
    pathname === item.href ||
    item.subItems?.some(sub =>
      pathname === sub.href ||
      sub.subItems?.some(nested => pathname === nested.href)
    )
  );

  return (
    <div className="space-y-4">
      <div
        className={`flex items-center gap-4 cursor-pointer transition-all duration-300 ${isMinimized ? 'justify-center' : 'justify-between'
          } ${isActive ? "text-white" : "text-white/60 hover:text-white"
          }`}
        onClick={() => !isMinimized && onClick()}
      >
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-white/40"}`}>
            {icon}
          </div>
          {!isMinimized && (
            <span className={`text-[15px] font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-300 ${
              isActive ? "text-white" : "text-white/60"
            }`}>
              {label}
            </span>
          )}
        </div>

        {!isMinimized && (
          <ChevronDown
            size={18}
            className={`transition-transform duration-500 opacity-40 ${open ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {!isMinimized && open && items.length > 0 && (
        <div className="pl-10 space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
          {items.map((item) => (
            <div key={item.href} className="relative">
              {item.subItems ? (
                <div>
                  <div
                    onClick={() => toggleSub(item.href)}
                    className={`flex items-center justify-between text-[15px] font-bold cursor-pointer transition-colors ${pathname === item.href || item.subItems.some(sub => pathname === sub.href) ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} className={`transition-transform duration-300 opacity-40 ${subOpen[item.href] ? 'rotate-90' : ''}`} />
                  </div>
                  {subOpen[item.href] && (
                    <div className="mt-3 ml-4 space-y-3 animate-in slide-in-from-left-1 duration-200 border-l border-white/10 pl-4">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={onLinkClick}
                          className={`block text-[14px] font-medium transition-all ${pathname === subItem.href
                            ? "text-white"
                            : "text-white/40 hover:text-white"
                            }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className={`block text-[15px] font-bold transition-all ${pathname === item.href
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
