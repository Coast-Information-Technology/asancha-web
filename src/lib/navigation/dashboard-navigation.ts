// File: src/lib/navigation/dashboard-navigation.ts

/**
 * Asancha Dashboard Navigation
 *
 * Purpose:
 * Centralises authenticated dashboard, top bar, mobile, and role-specific
 * navigation for Asancha Web Public.
 *
 * Main responsibilities:
 * - Provide global authenticated dashboard navigation
 * - Provide role-specific sidebar navigation by active business profile
 * - Keep dashboard workspace navigation separate from account navigation
 * - Keep API partner dashboard navigation controlled and separate
 *
 * Important Asancha Web Public rule:
 * This file must not include admin/staff navigation or staff permission logic.
 *
 * Security note:
 * Navigation is frontend guidance only.
 * Backend dashboard-state, active business profile, locked/unlocked actions,
 * verification, document, payment, API partner approval, and permissions remain final.
 */

import type { BusinessProfileType } from "../auth/role-guards";
import type { NavigationItem, NavigationSection } from "./public-navigation";

import { ACCOUNT_AVATAR_MENU_ITEMS } from "./account-navigation";
import {
  API_PARTNER_DASHBOARD_NAVIGATION,
  API_PARTNER_NAVIGATION_SECTIONS,
} from "./api-partner-navigation";
import {
  INVESTOR_DASHBOARD_NAVIGATION,
  INVESTOR_DASHBOARD_NAVIGATION_SECTIONS,
} from "./investor-navigation";
import {
  PROPERTY_AGENT_DASHBOARD_NAVIGATION,
  PROPERTY_AGENT_DASHBOARD_NAVIGATION_SECTIONS,
} from "./property-agent-navigation";
import {
  PROPERTY_OWNER_DASHBOARD_NAVIGATION,
  PROPERTY_OWNER_DASHBOARD_NAVIGATION_SECTIONS,
} from "./property-owner-navigation";
import {
  PROPERTY_SOURCER_DASHBOARD_NAVIGATION,
  PROPERTY_SOURCER_DASHBOARD_NAVIGATION_SECTIONS,
} from "./property-sourcer-navigation";
import {
  SERVICE_PROVIDER_DASHBOARD_NAVIGATION,
  SERVICE_PROVIDER_DASHBOARD_NAVIGATION_SECTIONS,
} from "./service-provider-navigation";

export const AUTHENTICATED_TOP_BAR_NAVIGATION = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Go to the active business profile dashboard.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    description: "Browse safe public listing previews.",
    iconName: "Building2",
    access: "public",
  },
  {
    label: "Notifications",
    href: "/notifications",
    description: "Open the notification inbox.",
    iconName: "Bell",
    access: "authenticated",
  },
  {
    label: "Support",
    href: "/support",
    description: "Get public or account-aware support.",
    iconName: "Headphones",
    access: "public",
  },
] as const satisfies readonly NavigationItem[];

export const DASHBOARD_DESKTOP_TOP_BAR_ITEMS = [
  {
    label: "Marketplace",
    href: "/marketplace",
    description: "Browse safe public listing previews.",
    iconName: "Building2",
    access: "public",
  },
  {
    label: "Search",
    href: "/marketplace",
    description: "Search marketplace listings.",
    iconName: "Search",
    access: "public",
  },
  {
    label: "Notifications",
    href: "/notifications",
    description: "View notification inbox.",
    iconName: "Bell",
    access: "authenticated",
  },
  {
    label: "Help / Support",
    href: "/support",
    description: "Open support.",
    iconName: "Headphones",
    access: "public",
  },
] as const satisfies readonly NavigationItem[];

export const DASHBOARD_MOBILE_TOP_BAR_ITEMS = [
  {
    label: "Notifications",
    href: "/notifications",
    description: "Open notifications.",
    iconName: "Bell",
    access: "authenticated",
  },
  {
    label: "Menu",
    href: "/dashboard",
    description: "Open mobile navigation drawer.",
    iconName: "Menu",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const DASHBOARD_MOBILE_BOTTOM_BAR_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Active dashboard resolver.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    description: "Browse marketplace.",
    iconName: "Building2",
    access: "public",
  },
  {
    label: "Search",
    href: "/marketplace",
    description: "Search marketplace listings.",
    iconName: "Search",
    access: "public",
  },
  {
    label: "Notifications",
    href: "/notifications",
    description: "Open notifications.",
    iconName: "Bell",
    access: "authenticated",
  },
  {
    label: "Menu",
    href: "/dashboard",
    description: "Open dashboard menu.",
    iconName: "Menu",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const SHARED_AUTHENTICATED_DOMAIN_NAVIGATION = [
  {
    label: "Documents",
    href: "/documents",
    description: "Manage user and profile documents.",
    iconName: "Files",
    access: "authenticated",
  },
  {
    label: "Verification",
    href: "/verification",
    description: "Track verification and correction requests.",
    iconName: "ShieldCheck",
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
    label: "Reservations",
    href: "/reservations",
    description: "Manage reservations.",
    iconName: "CalendarCheck",
    access: "authenticated",
  },
  {
    label: "Bookings",
    href: "/bookings",
    description: "Manage bookings.",
    iconName: "CalendarClock",
    access: "authenticated",
  },
  {
    label: "Conversations",
    href: "/conversations",
    description: "Open conversations.",
    iconName: "MessagesSquare",
    access: "authenticated",
  },
  {
    label: "Recommendations",
    href: "/recommendations",
    description: "View AI recommendations with safe disclaimers.",
    iconName: "Sparkles",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const DASHBOARD_NAVIGATION_BY_PROFILE_TYPE = {
  investor: INVESTOR_DASHBOARD_NAVIGATION,
  property_owner: PROPERTY_OWNER_DASHBOARD_NAVIGATION,
  property_agent: PROPERTY_AGENT_DASHBOARD_NAVIGATION,
  property_sourcer: PROPERTY_SOURCER_DASHBOARD_NAVIGATION,
  service_provider: SERVICE_PROVIDER_DASHBOARD_NAVIGATION,
  api_partner: API_PARTNER_DASHBOARD_NAVIGATION,
} as const satisfies Record<BusinessProfileType, readonly NavigationItem[]>;

export const DASHBOARD_NAVIGATION_SECTIONS_BY_PROFILE_TYPE = {
  investor: INVESTOR_DASHBOARD_NAVIGATION_SECTIONS,
  property_owner: PROPERTY_OWNER_DASHBOARD_NAVIGATION_SECTIONS,
  property_agent: PROPERTY_AGENT_DASHBOARD_NAVIGATION_SECTIONS,
  property_sourcer: PROPERTY_SOURCER_DASHBOARD_NAVIGATION_SECTIONS,
  service_provider: SERVICE_PROVIDER_DASHBOARD_NAVIGATION_SECTIONS,
  api_partner: API_PARTNER_NAVIGATION_SECTIONS,
} as const satisfies Record<BusinessProfileType, readonly NavigationSection[]>;

export const DASHBOARD_ACCOUNT_MENU_ITEMS = ACCOUNT_AVATAR_MENU_ITEMS;

/**
 * Returns the role-specific dashboard navigation for an active business profile.
 */
export function getDashboardNavigationByProfileType(
  profileType: BusinessProfileType,
): readonly NavigationItem[] {
  return DASHBOARD_NAVIGATION_BY_PROFILE_TYPE[profileType];
}

/**
 * Returns grouped dashboard navigation sections for an active business profile.
 */
export function getDashboardNavigationSectionsByProfileType(
  profileType: BusinessProfileType,
): readonly NavigationSection[] {
  return DASHBOARD_NAVIGATION_SECTIONS_BY_PROFILE_TYPE[profileType];
}

/**
 * Checks whether a dashboard profile type should use the API partner workspace.
 */
export function isApiPartnerDashboardProfile(
  profileType: BusinessProfileType,
): boolean {
  return profileType === "api_partner";
}
