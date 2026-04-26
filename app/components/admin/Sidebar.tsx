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
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../../../lib/hooks/auth";
import { useLanguageStore } from "@/store/languageStore";
import { ThemeToggle } from "../ThemeToggle";

type OpenState = {
  home: boolean;
  operational: boolean;
  consultation: boolean;
  tickets: boolean;
  content: boolean;
  analytics: boolean;
  payments: boolean;
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
  });
  const [subOpen, setSubOpen] = useState<{ [key: string]: boolean }>({});

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
      <aside className={`w-64 h-screen bg-card text-white flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed z-50`}>
        <div>
          <div className="flex items-center justify-between px-2 mb-8">
            <img src="/images/logo.svg" alt="ORR Solutions" className="w-fit h-auto" />
            <ThemeToggle />
          </div>

          <nav className="space-y-1">
            {/* Home / Dashboard */}
            <SidebarGroup
              label={t('sidebar.home_dashboard')}
              icon={Home}
              open={open.home}
              onClick={() => toggle("home")}
              items={[
                { label: t('sidebar.dashboard'), href: "/dashboard/" }
              ]}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onClose}
            />

            {/* Operational Dashboard */}
            <SidebarGroup
              label={t('sidebar.operational_dashboard')}
              icon={Settings}
              open={open.operational}
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

            {/* Consultation Management */}
            <SidebarGroup
              label={t('sidebar.consultation_management')}
              icon={UserCheck}
              open={open.consultation}
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

            {/* Tickets & Communication */}
            <SidebarGroup
              label={t('sidebar.tickets_communication')}
              icon={MessageSquare}
              open={open.tickets}
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

            {/* Content Management */}
            <SidebarGroup
              label={t('sidebar.content_management')}
              icon={FileText}
              open={open.content}
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

            {/* Analytics & Insights */}
            <SidebarGroup
              label={t('sidebar.analytics_insights')}
              icon={BarChart3}
              open={open.analytics}
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

            {/* Payment Management */}
            <SidebarGroup
              label={t('sidebar.payment_management')}
              icon={Wallet}
              open={open.payments}
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
          </nav>
        </div>

        <div className="bg-primary text-background rounded-xl p-3 mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="leading-tight text-[12px] font-medium">
              {user?.username || t('sidebar.admin')}
              <div className="text-[10px] opacity-80 truncate max-w-[120px]">{user?.email || ''}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-background/20 rounded-lg transition-colors"
            title={t('sidebar.logout')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarGroup({
  label,
  icon: Icon,
  open,
  onClick,
  items,
  pathname,
  subOpen,
  toggleSub,
  onLinkClick
}: {
  label: string;
  icon: any;
  open: boolean;
  onClick: () => void;
  items: NavItem[];
  pathname: string;
  subOpen: { [key: string]: boolean };
  toggleSub: (key: string) => void;
  onLinkClick: () => void;
}) {
  const isActive = items.some(item =>
    pathname === item.href ||
    item.subItems?.some(sub =>
      pathname === sub.href ||
      sub.subItems?.some(nested => pathname === nested.href)
    )
  );

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition text-white ${isActive ? "bg-lemon text-black" : "hover:bg-primary hover:bg-opacity-20"
          }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} />
          {label}
        </div>
        <ChevronDown size={16} className={`${open ? "rotate-180" : ""} transition`} />
      </div>

      {open && items.length > 0 && (
        <div className="ml-6 mt-1 space-y-1">
          {items.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              pathname={pathname}
              subOpen={subOpen}
              toggleSub={toggleSub}
              onLinkClick={onLinkClick}
              level={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavItemComponent({
  item,
  pathname,
  subOpen,
  toggleSub,
  onLinkClick,
  level
}: {
  item: NavItem;
  pathname: string;
  subOpen: { [key: string]: boolean };
  toggleSub: (key: string) => void;
  onLinkClick: () => void;
  level: number;
}) {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = pathname === item.href || item.subItems?.some(sub =>
    pathname === sub.href || sub.subItems?.some(nested => pathname === nested.href)
  );

  if (hasSubItems) {
    return (
      <div>
        <div className="flex items-center justify-between px-3 py-1 text-sm rounded hover:bg-primary hover:bg-opacity-10">
          <Link
            href={item.href}
            onClick={onLinkClick}
            className={`flex-1 ${isActive ? "text-lemon" : "text-white"
              }`}
          >
            {item.label}
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSub(item.href);
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            {subOpen[item.href] ?
              <ChevronDown size={14} className="transition" /> :
              <ChevronRight size={14} className="transition" />
            }
          </button>
        </div>
        {subOpen[item.href] && (
          <div className="ml-4 mt-1 space-y-1">
            {item.subItems!.map((subItem) => (
              <NavItemComponent
                key={subItem.href}
                item={subItem}
                pathname={pathname}
                subOpen={subOpen}
                toggleSub={toggleSub}
                onLinkClick={onLinkClick}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onLinkClick}
      className={`block px-3 py-1 text-${level > 0 ? 'xs' : 'sm'} rounded cursor-pointer hover:bg-primary hover:bg-opacity-10 ${pathname === item.href ? "text-lemon" : "text-white opacity-70"
        }`}
    >
      {item.label}
    </Link>
  );
}
