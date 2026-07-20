// File: src/components/layout/dashboard-sidebar/dashboard-sidebar.tsx

/**
 * Asancha Dashboard Sidebar
 *
 * Purpose:
 * Provides desktop dashboard sidebar navigation for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render role-specific navigation using active business profile type
 * - Keep profile context visible
 * - Keep dashboard navigation separate from account navigation
 *
 * Important Asancha Web Public rule:
 * This component must not include admin/staff navigation.
 *
 * Security note:
 * Sidebar visibility is frontend guidance only.
 * Backend dashboard-state, locked actions, and resource permissions remain final.
 */

import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CreditCard,
  FileText,
  Gauge,
  Headphones,
  Home,
  LineChart,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserCircle,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { BusinessProfileType } from "@/src/lib/auth/role-guards";
import { getRoleLabel } from "@/src/lib/auth/role-guards";
import { getDashboardNavigationSectionsByProfileType } from "@/src/lib/navigation/dashboard-navigation";
import { isActiveNavigationItem } from "@/src/lib/navigation/public-navigation";
import type { NavigationItem } from "@/src/lib/navigation/public-navigation";

interface DashboardSidebarProps {
  activeProfileType: BusinessProfileType;
  activeProfileName?: string | null;
  pathname: string;
}

function getSidebarIcon(item: NavigationItem): LucideIcon {
  const label = item.label.toLowerCase();
  const href = item.href;

  if (label.includes("dashboard") || label.includes("overview")) {
    return Home;
  }

  if (
    label.includes("property") ||
    label.includes("properties") ||
    label.includes("services")
  ) {
    return Building2;
  }

  if (
    label.includes("listing") ||
    label.includes("opportunit") ||
    label.includes("deal")
  ) {
    return Search;
  }

  if (label.includes("document") || label.includes("authority")) {
    return FileText;
  }

  if (label.includes("verification") || label.includes("compliance")) {
    return ShieldCheck;
  }

  if (label.includes("booking") || label.includes("reservation")) {
    return CalendarCheck;
  }

  if (label.includes("conversation")) {
    return MessageSquare;
  }

  if (label.includes("payment")) {
    return CreditCard;
  }

  if (label.includes("saved")) {
    return Bookmark;
  }

  if (label.includes("recommendation") || label.includes("ai")) {
    return Bot;
  }

  if (label.includes("preference") || label.includes("availability")) {
    return SlidersHorizontal;
  }

  if (label.includes("performance")) {
    return LineChart;
  }

  if (label.includes("profile") || label.includes("company")) {
    return BriefcaseBusiness;
  }

  if (href.includes("service-areas")) {
    return MapPin;
  }

  if (href.includes("support")) {
    return Headphones;
  }

  if (href.includes("notifications")) {
    return Bell;
  }

  if (href.includes("account")) {
    return UserCircle;
  }

  if (href.includes("settings")) {
    return Settings;
  }

  if (href.includes("maintenance")) {
    return Wrench;
  }

  if (href.includes("api-partner")) {
    return BadgeCheck;
  }

  return Gauge;
}

/**
 * Renders the desktop dashboard sidebar.
 */
export function DashboardSidebar({
  activeProfileName,
  activeProfileType,
  pathname,
}: DashboardSidebarProps) {
  const sections =
    getDashboardNavigationSectionsByProfileType(activeProfileType);

  return (
    <aside className="hidden w-[var(--asancha-dashboard-sidebar-width)] shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-border p-5">
          <Link
            className="inline-flex items-center gap-2 rounded-lg font-extrabold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/dashboard"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"
            >
              A
            </span>
            <span>Asancha</span>
          </Link>

          <div className="mt-5 rounded-xl border border-border bg-background p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Current workspace
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {activeProfileName || getRoleLabel(activeProfileType)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Static role navigation with account-aware workspace links.
            </p>
          </div>
        </div>

        <nav
          aria-label="Dashboard sidebar navigation"
          className="flex-1 overflow-y-auto p-4"
        >
          {sections.map((section) => (
            <section className="mb-6" key={section.label}>
              <h2 className="px-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {section.label}
              </h2>

              <ul className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const active = isActiveNavigationItem(item, pathname);
                  const Icon = getSidebarIcon(item);

                  return (
                    <li key={item.href}>
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={`group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        href={item.href}
                      >
                        <span
                          aria-hidden="true"
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${
                            active
                              ? "bg-primary-foreground/15 text-primary-foreground"
                              : "bg-background text-muted-foreground group-hover:text-primary"
                          }`}
                        >
                          <Icon size={17} strokeWidth={2.4} />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/account"
          >
            <UserCircle aria-hidden="true" size={17} strokeWidth={2.4} />
            Account settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
