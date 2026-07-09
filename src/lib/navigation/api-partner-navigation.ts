// File: src/lib/navigation/api-partner-navigation.ts

/**
 * Asancha API Partner Navigation
 *
 * Purpose:
 * Defines API partner public entry navigation and approved API partner
 * workspace navigation for Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep API partner application routes separate from ordinary public signup
 * - Keep API partner dashboard routes scoped to controlled partner access
 * - Avoid exposing full API keys, API key hashes, webhook secrets, or private logs
 *
 * Important Asancha Web Public rule:
 * API partner access must remain controlled and separate from ordinary signup.
 *
 * Security note:
 * Backend API partner approval, API client access, API key visibility,
 * webhook access, usage visibility, billing/payment permissions, and partner
 * documentation access remain final.
 */

import type { NavigationItem, NavigationSection } from "./public-navigation";

export const API_PARTNER_PUBLIC_NAVIGATION = [
  {
    label: "API Partner Overview",
    href: "/api-partner",
    description: "View API partner entry information.",
    iconName: "Plug",
    access: "api_partner_public",
  },
  {
    label: "Apply",
    href: "/api-partner/apply",
    description: "Submit an API partner application.",
    iconName: "ClipboardCheck",
    access: "api_partner_public",
  },
  {
    label: "Application Status",
    href: "/api-partner/application-status",
    description: "Check API partner application status.",
    iconName: "ListChecks",
    access: "api_partner_public",
  },
] as const satisfies readonly NavigationItem[];

export const API_PARTNER_DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    href: "/api-partner/dashboard",
    description: "API partner dashboard overview.",
    iconName: "LayoutDashboard",
    access: "api_partner_authenticated",
  },
  {
    label: "Client",
    href: "/api-partner/client",
    description: "View approved API client profile and partner-safe details.",
    iconName: "PanelTop",
    access: "api_partner_authenticated",
  },
  {
    label: "API Keys",
    href: "/api-partner/keys",
    description:
      "Manage API keys safely. Full keys are shown only when allowed.",
    iconName: "KeyRound",
    access: "api_partner_authenticated",
  },
  {
    label: "Usage",
    href: "/api-partner/usage",
    description: "View partner API usage summaries.",
    iconName: "ChartNoAxesCombined",
    access: "api_partner_authenticated",
  },
  {
    label: "Webhooks",
    href: "/api-partner/webhooks",
    description: "Manage partner webhook endpoints safely.",
    iconName: "Webhook",
    access: "api_partner_authenticated",
  },
  {
    label: "Documentation",
    href: "/api-partner/docs",
    description: "Read partner-safe API documentation.",
    iconName: "BookOpen",
    access: "api_partner_authenticated",
  },
  {
    label: "Billing",
    href: "/api-partner/billing",
    description: "View API partner billing context.",
    iconName: "ReceiptText",
    access: "api_partner_authenticated",
  },
  {
    label: "Payments",
    href: "/api-partner/payments",
    description: "View API partner payment references and statuses.",
    iconName: "CreditCard",
    access: "api_partner_authenticated",
  },
  {
    label: "Support",
    href: "/api-partner/support",
    description: "Get API partner support.",
    iconName: "Headphones",
    access: "api_partner_authenticated",
  },
] as const satisfies readonly NavigationItem[];

export const API_PARTNER_NAVIGATION_SECTIONS = [
  {
    label: "API Partner Access",
    description: "Public API partner application routes.",
    items: API_PARTNER_PUBLIC_NAVIGATION,
  },
  {
    label: "API Partner Workspace",
    description: "Approved API partner workspace navigation.",
    items: API_PARTNER_DASHBOARD_NAVIGATION,
  },
] as const satisfies readonly NavigationSection[];
