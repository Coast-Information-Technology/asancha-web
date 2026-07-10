"use client";

// File: src/components/layout/dashboard-top-bar/dashboard-top-bar.tsx

/**
 * Asancha Dashboard Top Bar
 *
 * Purpose:
 * Provides the authenticated dashboard top bar for Asancha Web Public.
 *
 * Main responsibilities:
 * - Show active profile context where provided
 * - Provide quick access to marketplace, notifications, support, and account menu
 * - Provide a mobile menu trigger for dashboard navigation
 *
 * Important Asancha Web Public rule:
 * This component must not include admin/staff navigation or permission logic.
 *
 * Security note:
 * Displayed profile/status values should come from backend dashboard-state.
 */

import Link from "next/link";

import type { BusinessProfileType } from "@/src/lib/auth/role-guards";
import { getRoleLabel } from "@/src/lib/auth/role-guards";
import {
  DASHBOARD_DESKTOP_TOP_BAR_ITEMS,
  DASHBOARD_ACCOUNT_MENU_ITEMS,
} from "@/src/lib/navigation/dashboard-navigation";

interface DashboardTopBarProps {
  activeProfileType?: BusinessProfileType | null;
  activeProfileName?: string | null;
  notificationCount?: number;
  onOpenMobileMenu?: () => void;
}

/**
 * Renders the dashboard top bar.
 */
export function DashboardTopBar({
  activeProfileName,
  activeProfileType,
  notificationCount = 0,
  onOpenMobileMenu,
}: DashboardTopBarProps) {
  const activeProfileLabel = activeProfileType
    ? getRoleLabel(activeProfileType)
    : "No active profile";

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open dashboard navigation"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-950 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 lg:hidden"
            onClick={onOpenMobileMenu}
            type="button"
          >
            <span aria-hidden="true">☰</span>
          </button>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Active profile
            </p>
            <p className="truncate text-sm font-bold text-gray-950">
              {activeProfileName || activeProfileLabel}
            </p>
          </div>
        </div>

        <nav
          aria-label="Dashboard top bar navigation"
          className="hidden items-center gap-2 md:flex"
        >
          {DASHBOARD_DESKTOP_TOP_BAR_ITEMS.map((item) => (
            <Link
              className="relative inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href={item.href}
              key={item.href}
            >
              {item.label}
              {item.href === "/notifications" && notificationCount > 0 ? (
                <span className="ml-2 rounded-full bg-gray-950 px-2 py-0.5 text-xs text-white">
                  <span className="sr-only">Unread notifications: </span>
                  {notificationCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <details className="relative">
          <summary className="list-none rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-950 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100">
            Account
          </summary>

          <nav
            aria-label="Account menu"
            className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            {DASHBOARD_ACCOUNT_MENU_ITEMS.map((item) => (
              <Link
                className="block rounded-lg px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
