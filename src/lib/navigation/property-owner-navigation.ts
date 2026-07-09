// File: src/lib/navigation/property-owner-navigation.ts

/**
 * Asancha Property Owner Navigation
 *
 * Purpose:
 * Defines role-specific dashboard navigation for the property owner workspace.
 *
 * Main responsibilities:
 * - Keep property owner workspace navigation scoped to /dashboard/property-owner
 * - Include properties, listings, documents, verification, bookings,
 *   conversations, and payments
 * - Avoid admin/staff routes and internal review notes
 *
 * Important Asancha Web Public rule:
 * Dashboard navigation must reflect the active business profile context.
 *
 * Security note:
 * Backend ownership, listing, document, verification, booking, conversation,
 * and payment permission checks remain final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const PROPERTY_OWNER_DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    href: "/dashboard/property-owner",
    description: "Property owner dashboard overview.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "My Properties",
    href: "/dashboard/property-owner/properties",
    description: "Manage properties connected to your owner profile.",
    iconName: "House",
    access: "authenticated",
  },
  {
    label: "My Listings",
    href: "/dashboard/property-owner/listings",
    description: "Manage your public and private listing workflow.",
    iconName: "PanelsTopLeft",
    access: "authenticated",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Upload and replace required property owner documents.",
    iconName: "Files",
    access: "authenticated",
  },
  {
    label: "Verification",
    href: "/verification",
    description:
      "Track verification status and respond to correction requests.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Bookings",
    href: "/bookings",
    description: "Manage booking invitations and scheduled meetings.",
    iconName: "CalendarClock",
    access: "authenticated",
  },
  {
    label: "Conversations",
    href: "/conversations",
    description: "Open property, listing, booking, and support conversations.",
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

export const PROPERTY_OWNER_DASHBOARD_NAVIGATION_SECTIONS = [
  {
    label: "Property Owner Workspace",
    description: "Role-specific navigation for property owner activity.",
    items: PROPERTY_OWNER_DASHBOARD_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];
