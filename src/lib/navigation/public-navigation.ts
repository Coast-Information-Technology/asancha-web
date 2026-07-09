// File: src/lib/navigation/public-navigation.ts

/**
 * Asancha Public Navigation
 *
 * Purpose:
 * Defines public website navigation, public footer navigation, and shared
 * navigation types/helpers for Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep public header navigation lean and safe
 * - Group role pages under Solutions
 * - Keep API Partner public entry separate from ordinary signup
 * - Provide reusable navigation item types for other navigation files
 *
 * Important Asancha Web Public rule:
 * This file must not include admin/staff navigation, staff URLs,
 * internal backend URLs, private document URLs, or restricted API key links.
 *
 * Security note:
 * Navigation visibility is only frontend guidance.
 * Backend authentication, authorization, active profile checks, verification,
 * payment, policy, document, API partner approval, and resource permissions
 * remain the final enforcement layer.
 */

export type NavigationAccess =
  | "public"
  | "guest_preferred"
  | "authenticated"
  | "setup_gated"
  | "api_partner_public"
  | "api_partner_authenticated";

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  iconName?: string;
  access: NavigationAccess;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
  children?: readonly NavigationItem[];
}

export interface NavigationSection {
  label: string;
  description?: string;
  items: readonly NavigationItem[];
}

export const PUBLIC_HEADER_NAVIGATION = [
  {
    label: "Home",
    href: "/",
    description: "Return to the Asancha homepage.",
    iconName: "Home",
    access: "public",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    description: "Browse safe public property and opportunity previews.",
    iconName: "Building2",
    access: "public",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Understand how Asancha works for public users.",
    iconName: "Route",
    access: "public",
  },
  {
    label: "Solutions",
    href: "/solutions",
    description: "Explore role-specific Asancha solutions.",
    iconName: "Layers3",
    access: "public",
    children: [
      {
        label: "Investors",
        href: "/solutions/investors",
        description: "Find property opportunities and manage investments.",
        iconName: "ChartNoAxesCombined",
        access: "public",
      },
      {
        label: "Property Owners",
        href: "/solutions/property-owners",
        description: "List and manage property opportunities.",
        iconName: "House",
        access: "public",
      },
      {
        label: "Property Agents",
        href: "/solutions/property-agents",
        description: "Manage agency-backed property listings and enquiries.",
        iconName: "BriefcaseBusiness",
        access: "public",
      },
      {
        label: "Property Sourcers",
        href: "/solutions/property-sourcers",
        description: "Submit sourced opportunities and manage deal packs.",
        iconName: "SearchCheck",
        access: "public",
      },
      {
        label: "Service Providers",
        href: "/solutions/service-providers",
        description: "Offer property-related services through Asancha.",
        iconName: "Wrench",
        access: "public",
      },
    ],
  },
  {
    label: "API Partners",
    href: "/api-partners",
    description: "Learn about controlled API partner access.",
    iconName: "Plug",
    access: "public",
  },
  {
    label: "Pricing",
    href: "/pricing",
    description:
      "View public pricing and platform fee information where enabled.",
    iconName: "BadgePoundSterling",
    access: "public",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Contact Asancha for general enquiries.",
    iconName: "Mail",
    access: "public",
  },
] as const satisfies readonly NavigationItem[];

export const PUBLIC_GUEST_ACTIONS = [
  {
    label: "Sign In",
    href: "/auth/sign-in",
    description: "Access your Asancha account.",
    iconName: "LogIn",
    access: "guest_preferred",
  },
  {
    label: "Get Started",
    href: "/auth/sign-up",
    description: "Create a public Asancha account.",
    iconName: "UserRoundPlus",
    access: "guest_preferred",
  },
] as const satisfies readonly NavigationItem[];

export const PUBLIC_AUTH_SUPPORT_NAVIGATION = [
  {
    label: "Forgot Password",
    href: "/auth/forgot-password",
    description: "Reset access to your Asancha account.",
    iconName: "KeyRound",
    access: "guest_preferred",
  },
  {
    label: "Verify Email",
    href: "/auth/verify-email",
    description: "Continue email verification where required.",
    iconName: "MailCheck",
    access: "public",
  },
  {
    label: "Unauthorized",
    href: "/auth/unauthorized",
    description: "Safe access-denied screen.",
    iconName: "ShieldAlert",
    access: "public",
  },
  {
    label: "Suspended",
    href: "/auth/suspended",
    description: "Safe suspended-account guidance.",
    iconName: "CircleOff",
    access: "public",
  },
] as const satisfies readonly NavigationItem[];

export const PUBLIC_FOOTER_NAVIGATION = [
  {
    label: "Platform",
    description: "Public Asancha platform pages.",
    items: [
      {
        label: "Home",
        href: "/",
        description: "Asancha homepage.",
        iconName: "Home",
        access: "public",
      },
      {
        label: "About",
        href: "/about",
        description: "Learn about Asancha.",
        iconName: "Info",
        access: "public",
      },
      {
        label: "How It Works",
        href: "/how-it-works",
        description: "Understand the platform flow.",
        iconName: "Route",
        access: "public",
      },
      {
        label: "Marketplace",
        href: "/marketplace",
        description: "Browse safe public listing previews.",
        iconName: "Building2",
        access: "public",
      },
      {
        label: "FAQs",
        href: "/faqs",
        description: "Read common questions.",
        iconName: "CircleHelp",
        access: "public",
      },
    ],
  },
  {
    label: "Solutions",
    description: "Public role-specific pages.",
    items: [
      {
        label: "Investors",
        href: "/solutions/investors",
        description: "Investor solution page.",
        iconName: "ChartNoAxesCombined",
        access: "public",
      },
      {
        label: "Property Owners",
        href: "/solutions/property-owners",
        description: "Property owner solution page.",
        iconName: "House",
        access: "public",
      },
      {
        label: "Property Agents",
        href: "/solutions/property-agents",
        description: "Property agent solution page.",
        iconName: "BriefcaseBusiness",
        access: "public",
      },
      {
        label: "Property Sourcers",
        href: "/solutions/property-sourcers",
        description: "Property sourcer solution page.",
        iconName: "SearchCheck",
        access: "public",
      },
      {
        label: "Service Providers",
        href: "/solutions/service-providers",
        description: "Service provider solution page.",
        iconName: "Wrench",
        access: "public",
      },
    ],
  },
  {
    label: "API Partners",
    description: "Controlled API partner entry points.",
    items: [
      {
        label: "API Partners",
        href: "/api-partners",
        description: "API partner overview.",
        iconName: "Plug",
        access: "public",
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
    ],
  },
  {
    label: "Support",
    description: "Public help and contact routes.",
    items: [
      {
        label: "Contact",
        href: "/contact",
        description: "Contact Asancha.",
        iconName: "Mail",
        access: "public",
      },
      {
        label: "Support",
        href: "/support",
        description: "Get support.",
        iconName: "Headphones",
        access: "public",
      },
      {
        label: "Pricing",
        href: "/pricing",
        description: "View pricing where enabled.",
        iconName: "BadgePoundSterling",
        access: "public",
      },
    ],
  },
  {
    label: "Legal",
    description: "Public legal and policy routes.",
    items: [
      {
        label: "Legal",
        href: "/legal",
        description: "Legal overview.",
        iconName: "Scale",
        access: "public",
      },
      {
        label: "Terms",
        href: "/legal/terms",
        description: "Terms of use.",
        iconName: "ScrollText",
        access: "public",
      },
      {
        label: "Privacy",
        href: "/legal/privacy",
        description: "Privacy policy.",
        iconName: "ShieldCheck",
        access: "public",
      },
      {
        label: "Platform Rules",
        href: "/legal/platform-rules",
        description: "Asancha platform rules.",
        iconName: "BookOpenCheck",
        access: "public",
      },
      {
        label: "Data Processing",
        href: "/legal/data-processing",
        description: "Data processing information.",
        iconName: "Database",
        access: "public",
      },
      {
        label: "Cookies",
        href: "/cookies",
        description: "Cookie information.",
        iconName: "Cookie",
        access: "public",
      },
    ],
  },
] as const satisfies readonly NavigationSection[];

/**
 * Normalises a pathname for active-link checks.
 */
export function normalizeNavigationPath(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

/**
 * Checks whether a navigation item is active for a pathname.
 */
export function isActiveNavigationItem(
  item: NavigationItem,
  pathname: string,
): boolean {
  const currentPath = normalizeNavigationPath(pathname);
  const itemPath = normalizeNavigationPath(item.href);

  if (itemPath === "/") {
    return currentPath === "/";
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

/**
 * Filters disabled navigation items from a navigation list.
 */
export function getEnabledNavigationItems(
  items: readonly NavigationItem[],
): NavigationItem[] {
  return items.filter((item) => !item.disabled);
}

/**
 * Finds a navigation item by href in a flat or nested navigation list.
 */
export function findNavigationItemByHref(
  items: readonly NavigationItem[],
  href: string,
): NavigationItem | null {
  for (const item of items) {
    if (item.href === href) {
      return item;
    }

    if (item.children) {
      const childMatch = findNavigationItemByHref(item.children, href);

      if (childMatch) {
        return childMatch;
      }
    }
  }

  return null;
}
