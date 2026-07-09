// File: src/lib/navigation/property-agent-navigation.ts

/**
 * Asancha Property Agent Navigation
 *
 * Purpose:
 * Defines role-specific dashboard navigation for the property agent workspace.
 *
 * Main responsibilities:
 * - Keep property agent workspace navigation scoped to /dashboard/property-agent
 * - Include company properties, listings, authority documents, general documents,
 *   verification, bookings, conversations, and payments
 * - Keep broad old agent behaviour out of the public frontend
 *
 * Important Asancha Web Public rule:
 * Property agent navigation is separate from property owner and property sourcer navigation.
 *
 * Security note:
 * Backend company authority, ownership, verification, listing, booking,
 * conversation, and payment checks remain final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const PROPERTY_AGENT_DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    href: "/dashboard/property-agent",
    description: "Property agent dashboard overview.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Company Properties",
    href: "/dashboard/property-agent/company-properties",
    description: "Manage properties represented by your agency profile.",
    iconName: "Building",
    access: "authenticated",
  },
  {
    label: "Listings",
    href: "/dashboard/property-agent/listings",
    description: "Manage agency listing workflow.",
    iconName: "PanelsTopLeft",
    access: "authenticated",
  },
  {
    label: "Authority Documents",
    href: "/dashboard/property-agent/authority-documents",
    description: "Manage authority-to-represent documents.",
    iconName: "FileCheck2",
    access: "authenticated",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Upload and manage agent profile documents.",
    iconName: "Files",
    access: "authenticated",
  },
  {
    label: "Verification",
    href: "/verification",
    description: "Track agent verification and correction requests.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Bookings",
    href: "/bookings",
    description: "Manage property viewings and meeting bookings.",
    iconName: "CalendarClock",
    access: "authenticated",
  },
  {
    label: "Conversations",
    href: "/conversations",
    description:
      "Open listing, booking, support, and verification conversations.",
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
] as const satisfies readonly NavigationItem[];

export const PROPERTY_AGENT_DASHBOARD_NAVIGATION_SECTIONS = [
  {
    label: "Property Agent Workspace",
    description: "Role-specific navigation for property agent activity.",
    items: PROPERTY_AGENT_DASHBOARD_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];
