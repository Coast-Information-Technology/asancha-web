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

import type { BusinessProfileType } from "@/src/lib/auth/role-guards";
import { getRoleLabel } from "@/src/lib/auth/role-guards";
import { getDashboardNavigationSectionsByProfileType } from "@/src/lib/navigation/dashboard-navigation";
import { isActiveNavigationItem } from "@/src/lib/navigation/public-navigation";

interface DashboardSidebarProps {
  activeProfileType: BusinessProfileType;
  activeProfileName?: string | null;
  pathname: string;
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
    <aside className="hidden w-[var(--asancha-dashboard-sidebar-width)] shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-gray-200 p-5">
          <Link
            className="inline-flex items-center gap-2 rounded-lg font-extrabold text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/dashboard"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-xl bg-gray-950 text-white"
            >
              A
            </span>
            <span>Asancha</span>
          </Link>

          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Current workspace
            </p>
            <p className="mt-1 text-sm font-bold text-gray-950">
              {activeProfileName || getRoleLabel(activeProfileType)}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Navigation changes when your active business profile changes.
            </p>
          </div>
        </div>

        <nav
          aria-label="Dashboard sidebar navigation"
          className="flex-1 overflow-y-auto p-4"
        >
          {sections.map((section) => (
            <section className="mb-6" key={section.label}>
              <h2 className="px-3 text-xs font-bold uppercase tracking-wide text-gray-500">
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

        <div className="border-t border-gray-200 p-4">
          <Link
            className="block rounded-lg px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/account"
          >
            Account settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
