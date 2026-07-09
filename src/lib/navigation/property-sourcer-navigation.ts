// File: src/lib/navigation/property-sourcer-navigation.ts

/**
 * Asancha Property Sourcer Navigation
 *
 * Purpose:
 * Defines role-specific dashboard navigation for the property sourcer workspace.
 *
 * Main responsibilities:
 * - Keep property sourcer workspace navigation scoped to /dashboard/property-sourcer
 * - Include deals, deal packs, compliance, documents, verification,
 *   bookings, conversations, payments, and performance
 * - Avoid exposing restricted investor data, internal notes, or private review data
 *
 * Important Asancha Web Public rule:
 * Property sourcer navigation must be distinct from property agent navigation.
 *
 * Security note:
 * Backend deal, deal-pack, compliance, verification, payment, conversation,
 * and booking permissions remain final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const PROPERTY_SOURCER_DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    href: "/dashboard/property-sourcer",
    description: "Property sourcer dashboard overview.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Deals",
    href: "/dashboard/property-sourcer/deals",
    description: "Manage sourced property opportunities.",
    iconName: "Handshake",
    access: "authenticated",
  },
  {
    label: "Deal Packs",
    href: "/dashboard/property-sourcer/deal-packs",
    description: "Manage deal-pack preparation and submission.",
    iconName: "PackageCheck",
    access: "authenticated",
  },
  {
    label: "Compliance",
    href: "/dashboard/property-sourcer/compliance",
    description: "Track compliance requirements and next actions.",
    iconName: "ClipboardCheck",
    access: "authenticated",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Upload and manage property sourcer documents.",
    iconName: "Files",
    access: "authenticated",
  },
  {
    label: "Verification",
    href: "/verification",
    description: "Track sourcer verification and correction requests.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Bookings",
    href: "/bookings",
    description: "Manage booking invitations and meetings.",
    iconName: "CalendarClock",
    access: "authenticated",
  },
  {
    label: "Conversations",
    href: "/conversations",
    description: "Open deal, verification, payment, and support conversations.",
    iconName: "MessagesSquare",
    access: "authenticated",
  },
  {
    label: "Payments",
    href: "/payments",
    description: "View payment references and payment statuses.",
    iconName: "CreditCard",
    access: "authenticated",
  },
  {
    label: "Performance",
    href: "/dashboard/property-sourcer/performance",
    description: "View safe performance summaries for sourced opportunities.",
    iconName: "ChartBar",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const PROPERTY_SOURCER_DASHBOARD_NAVIGATION_SECTIONS = [
  {
    label: "Property Sourcer Workspace",
    description: "Role-specific navigation for property sourcer activity.",
    items: PROPERTY_SOURCER_DASHBOARD_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];
