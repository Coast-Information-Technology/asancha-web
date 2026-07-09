// File: src/lib/navigation/service-provider-navigation.ts

/**
 * Asancha Service Provider Navigation
 *
 * Purpose:
 * Defines role-specific dashboard navigation for the service provider workspace.
 *
 * Main responsibilities:
 * - Keep service provider workspace navigation scoped to /dashboard/service-provider
 * - Include service profile, services, bookings, documents, verification,
 *   conversations, and payments
 * - Avoid admin/staff operations and internal review notes
 *
 * Important Asancha Web Public rule:
 * Service provider navigation is public-user workspace navigation only.
 *
 * Security note:
 * Backend service, booking, document, verification, conversation, and payment
 * permissions remain final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const SERVICE_PROVIDER_DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    href: "/dashboard/service-provider",
    description: "Service provider dashboard overview.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Service Profile",
    href: "/dashboard/service-provider/service-profile",
    description: "Manage your service provider profile.",
    iconName: "UserRoundCog",
    access: "authenticated",
  },
  {
    label: "Services",
    href: "/dashboard/service-provider/services",
    description: "Manage services offered through Asancha.",
    iconName: "Wrench",
    access: "authenticated",
  },
  {
    label: "Bookings",
    href: "/bookings",
    description: "Manage service bookings and booking invitations.",
    iconName: "CalendarClock",
    access: "authenticated",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Upload and manage service provider documents.",
    iconName: "Files",
    access: "authenticated",
  },
  {
    label: "Verification",
    href: "/verification",
    description: "Track provider verification and correction requests.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Conversations",
    href: "/conversations",
    description:
      "Open service, booking, support, and verification conversations.",
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

export const SERVICE_PROVIDER_DASHBOARD_NAVIGATION_SECTIONS = [
  {
    label: "Service Provider Workspace",
    description: "Role-specific navigation for service provider activity.",
    items: SERVICE_PROVIDER_DASHBOARD_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];
