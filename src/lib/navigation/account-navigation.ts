// File: src/lib/navigation/account-navigation.ts

/**
 * Asancha Account Navigation
 *
 * Purpose:
 * Defines authenticated account navigation for Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep account identity/settings navigation separate from dashboard workspace navigation
 * - Provide safe links for profile, policies, security, notifications, status, and support
 * - Exclude Business Profiles from normal account navigation because it is handled
 *   through the Active Business Profile Switcher modal and Add Business Profile drawer
 *
 * Important Asancha Web Public rule:
 * This file must not include admin/staff account management links.
 *
 * Security note:
 * These links are frontend navigation only.
 * Backend user/account/profile/policy/security enforcement remains final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const ACCOUNT_NAVIGATION = [
  {
    label: "Profile",
    href: "/account/profile",
    description: "Manage your core Asancha personal profile.",
    iconName: "UserRound",
    access: "authenticated",
  },
  {
    label: "Policies",
    href: "/account/policies",
    description: "View required platform policies and acceptance status.",
    iconName: "BookOpenCheck",
    access: "authenticated",
  },
  {
    label: "Security",
    href: "/account/security",
    description: "Manage password, email, sessions, and login security.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Notification Preferences",
    href: "/account/notifications",
    description: "Manage account notification preferences.",
    iconName: "BellRing",
    access: "authenticated",
  },
  {
    label: "Account Status",
    href: "/account/status",
    description: "View account status and required next actions.",
    iconName: "BadgeCheck",
    access: "authenticated",
  },
  {
    label: "Support",
    href: "/account/support",
    description: "Get account-aware support.",
    iconName: "Headphones",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const ACCOUNT_NAVIGATION_SECTIONS = [
  {
    label: "Account",
    description: "Core Asancha account identity and settings.",
    items: ACCOUNT_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];

export const ACCOUNT_AVATAR_MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Go to your active profile dashboard.",
    iconName: "LayoutDashboard",
    access: "authenticated",
  },
  {
    label: "Profile",
    href: "/account/profile",
    description: "Manage your personal profile.",
    iconName: "UserRound",
    access: "authenticated",
  },
  {
    label: "Security",
    href: "/account/security",
    description: "Manage sign-in and account security.",
    iconName: "ShieldCheck",
    access: "authenticated",
  },
  {
    label: "Notifications",
    href: "/notifications",
    description: "Open your notification inbox.",
    iconName: "Bell",
    access: "authenticated",
  },
  {
    label: "Support",
    href: "/account/support",
    description: "Get account support.",
    iconName: "Headphones",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const BUSINESS_PROFILE_SWITCHER_ACTIONS = [
  {
    label: "Switch Business Profile",
    href: "/dashboard",
    description: "Open the active business profile switcher modal.",
    iconName: "Repeat2",
    access: "authenticated",
  },
  {
    label: "Add Business Profile",
    href: "/account/business-profiles/add",
    description: "Start the Add New Business Profile flow from the drawer.",
    iconName: "PlusCircle",
    access: "authenticated",
  },
] as const satisfies readonly NavigationItem[];
