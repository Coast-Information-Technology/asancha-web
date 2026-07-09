// File: src/lib/navigation/investor-navigation.ts

/**
 * Asancha Investor Navigation
 *
 * Purpose:
 * Defines role-specific dashboard navigation for the investor profile workspace.
 *
 * Main responsibilities:
 * - Keep investor workspace navigation scoped to /dashboard/investor
 * - Include investor opportunity, saved property, recommendation, reservation,
 *   booking, payment, document, verification, and preference routes
 * - Avoid exposing private listing data, internal notes, or admin-only routes
 *
 * Important Asancha Web Public rule:
 * Dashboard navigation is role/profile workspace navigation, not account navigation.
 *
 * Security note:
 * The backend dashboard-state and resource permission checks remain final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const INVESTOR_DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    href: "/dashboard/investor",
    description: "Investor dashboard overview.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Opportunities",
    href: "/dashboard/investor/opportunities",
    description: "Browse investor-suitable opportunities.",
    iconName: "Building2",
    access: "authenticated",
  },
  {
    label: "Saved Properties",
    href: "/dashboard/investor/saved-properties",
    description: "View properties saved under the investor profile.",
    iconName: "Bookmark",
    access: "authenticated",
  },
  {
    label: "AI Recommendations",
    href: "/recommendations",
    description: "View safe AI-assisted property recommendations.",
    iconName: "Sparkles",
    access: "authenticated",
  },
  {
    label: "Reservations",
    href: "/reservations",
    description: "Manage investor reservations.",
    iconName: "CalendarCheck",
    access: "authenticated",
  },
  {
    label: "Bookings",
    href: "/bookings",
    description: "Manage viewings, meetings, and booking invitations.",
    iconName: "CalendarClock",
    access: "authenticated",
  },
  {
    label: "Payments",
    href: "/payments",
    description: "View payment references, status, and safe payment actions.",
    iconName: "CreditCard",
    access: "authenticated",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Upload and manage investor documents.",
    iconName: "Files",
    access: "authenticated",
  },
  {
    label: "Verification",
    href: "/verification",
    description: "Track investor verification status and correction requests.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Preferences",
    href: "/dashboard/investor/preferences",
    description: "Manage investor buying and recommendation preferences.",
    iconName: "SlidersHorizontal",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const INVESTOR_DASHBOARD_NAVIGATION_SECTIONS = [
  {
    label: "Investor Workspace",
    description: "Role-specific navigation for investor activity.",
    items: INVESTOR_DASHBOARD_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];
