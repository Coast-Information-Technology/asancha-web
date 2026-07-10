"use client";

// File: src/components/layout/mobile-bottom-bar/mobile-bottom-bar.tsx

/**
 * Asancha Mobile Bottom Bar
 *
 * Purpose:
 * Provides mobile-first quick navigation for Asancha Web Public dashboards.
 *
 * Main responsibilities:
 * - Keep dashboard, marketplace, search, notifications, and menu accessible
 * - Support active route indication
 * - Avoid hiding critical mobile actions deep inside menus
 *
 * Important Asancha Web Public rule:
 * Critical dashboard actions and notifications should remain accessible on mobile.
 *
 * Security note:
 * Bottom bar visibility is frontend guidance only.
 * Backend permissions and dashboard-state remain final.
 */

import Link from "next/link";

import { DASHBOARD_MOBILE_BOTTOM_BAR_ITEMS } from "@/src/lib/navigation/dashboard-navigation";
import { isActiveNavigationItem } from "@/src/lib/navigation/public-navigation";

interface MobileBottomBarProps {
  pathname: string;
  notificationCount?: number;
  onOpenMenu?: () => void;
}

/**
 * Renders the mobile dashboard bottom bar.
 */
export function MobileBottomBar({
  notificationCount = 0,
  onOpenMenu,
  pathname,
}: MobileBottomBarProps) {
  return (
    <nav
      aria-label="Mobile dashboard quick navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white lg:hidden"
    >
      <ul className="grid h-[var(--asancha-mobile-bottom-bar-height)] grid-cols-5">
        {DASHBOARD_MOBILE_BOTTOM_BAR_ITEMS.map((item) => {
          const active = isActiveNavigationItem(item, pathname);
          const isMenu = item.label === "Menu";

          return (
            <li key={item.label}>
              {isMenu ? (
                <button
                  aria-label="Open dashboard menu"
                  className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  onClick={onOpenMenu}
                  type="button"
                >
                  <span aria-hidden="true">☰</span>
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                    active ? "text-gray-950" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  href={item.href}
                >
                  <span aria-hidden="true">•</span>
                  <span>{item.label}</span>

                  {item.href === "/notifications" && notificationCount > 0 ? (
                    <span className="absolute right-4 top-2 rounded-full bg-gray-950 px-1.5 py-0.5 text-[0.65rem] text-white">
                      <span className="sr-only">Unread notifications: </span>
                      {notificationCount}
                    </span>
                  ) : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
