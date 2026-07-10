"use client";

// File: src/components/layout/mobile-dashboard-drawer/mobile-dashboard-drawer.tsx

/**
 * Asancha Mobile Dashboard Drawer
 *
 * Purpose:
 * Provides mobile dashboard navigation drawer for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render role-specific dashboard navigation on mobile
 * - Keep active business profile visible
 * - Support accessible close behaviour
 *
 * Important Asancha Web Public rule:
 * Mobile dashboard navigation must keep profile context and critical actions accessible.
 *
 * Security note:
 * Drawer navigation is frontend guidance only.
 * Backend permissions and dashboard-state remain final.
 */

import Link from "next/link";

import type { BusinessProfileType } from "@/src/lib/auth/role-guards";
import { getRoleLabel } from "@/src/lib/auth/role-guards";
import { Drawer } from "@/src/components/ui/drawer/drawer";
import { getDashboardNavigationSectionsByProfileType } from "@/src/lib/navigation/dashboard-navigation";
import { isActiveNavigationItem } from "@/src/lib/navigation/public-navigation";

interface MobileDashboardDrawerProps {
  open: boolean;
  activeProfileType: BusinessProfileType;
  activeProfileName?: string | null;
  pathname: string;
  onClose: () => void;
}

/**
 * Renders the mobile dashboard navigation drawer.
 */
export function MobileDashboardDrawer({
  activeProfileName,
  activeProfileType,
  onClose,
  open,
  pathname,
}: MobileDashboardDrawerProps) {
  const sections =
    getDashboardNavigationSectionsByProfileType(activeProfileType);

  return (
    <Drawer
      description="Use these links to navigate your active Asancha workspace."
      onClose={onClose}
      open={open}
      side="left"
      title="Dashboard navigation"
    >
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Current workspace
        </p>
        <p className="mt-1 text-sm font-bold text-gray-950">
          {activeProfileName || getRoleLabel(activeProfileType)}
        </p>
      </div>

      <nav aria-label="Mobile dashboard navigation" className="mt-5 space-y-6">
        {sections.map((section) => (
          <section key={section.label}>
            <h2 className="px-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              {section.label}
            </h2>

            <ul className="mt-2 space-y-1">
              {section.items.map((item) => {
                const active = isActiveNavigationItem(item, pathname);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        active
                          ? "bg-gray-950 text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-950"
                      }`}
                      href={item.href}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    </Drawer>
  );
}
