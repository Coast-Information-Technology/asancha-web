// File: src/features/dashboard/constants/dashboard-navigation.constants.ts

/**
 * Asancha Dashboard Navigation Constants
 *
 * Purpose:
 * Defines the public/user dashboard endpoint, dashboard resolver paths,
 * role-specific navigation groups, and public-safe dashboard messages.
 *
 * Responsibilities:
 * - Keep dashboard routes in one place.
 * - Define the dashboard root resolver.
 * - Define navigation for each active business-profile type.
 * - Provide safe loading and error messages.
 * - Filter navigation against backend-provided action availability.
 *
 * Security notes:
 * - Navigation visibility is not an authorization control.
 * - Hidden or disabled links do not protect backend resources.
 * - Backend permission and resource-state checks remain final.
 * - Admin and staff navigation must never be added to this file.
 */

import type {
  DashboardActionState,
  DashboardNavigationGroup,
  DashboardProfileType,
} from "../types/dashboard.types";

export const DASHBOARD_API_ENDPOINTS = {
  state: "/me/dashboard-state",
} as const;

export const DASHBOARD_PAGE_ROUTES = {
  root: "/dashboard",

  investor: "/dashboard/investor",
  propertyOwner: "/dashboard/property-owner",
  propertyAgent: "/dashboard/property-agent",
  propertySourcer: "/dashboard/property-sourcer",
  serviceProvider: "/dashboard/service-provider",
  apiPartner: "/dashboard/api-partner",

  account: "/account",
  notifications: "/notifications",
} as const;

export const DASHBOARD_PROFILE_PATHS = {
  investor: DASHBOARD_PAGE_ROUTES.investor,
  property_owner: DASHBOARD_PAGE_ROUTES.propertyOwner,
  property_agent: DASHBOARD_PAGE_ROUTES.propertyAgent,
  property_sourcer: DASHBOARD_PAGE_ROUTES.propertySourcer,
  service_provider: DASHBOARD_PAGE_ROUTES.serviceProvider,
  api_partner: DASHBOARD_PAGE_ROUTES.apiPartner,
} as const satisfies Record<DashboardProfileType, string>;

const INVESTOR_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "workspace",
    label: null,
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/dashboard/investor",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        key: "opportunities",
        label: "Opportunities",
        href: "/dashboard/investor/opportunities",
        icon: "search",
      },
      {
        key: "saved",
        label: "Saved",
        href: "/dashboard/investor/saved",
        icon: "bookmark",
      },
      {
        key: "recommendations",
        label: "Recommendations",
        href: "/dashboard/investor/recommendations",
        icon: "sparkles",
        badgeKey: "newRecommendations",
      },
      {
        key: "ai-insights",
        label: "AI Insights",
        href: "/dashboard/investor/ai-insights",
        icon: "brain",
        requiredAction: "view_ai_insights",
      },
    ],
  },
  {
    key: "deals",
    label: "Deals",
    items: [
      {
        key: "reservations",
        label: "Reservations",
        href: "/dashboard/investor/reservations",
        icon: "calendar-check",
        requiredAction: "view_reservations",
      },
      {
        key: "bookings",
        label: "Bookings",
        href: "/dashboard/investor/bookings",
        icon: "calendar",
      },
      {
        key: "payments",
        label: "Payments",
        href: "/dashboard/investor/payments",
        icon: "credit-card",
      },
      {
        key: "documents",
        label: "Documents",
        href: "/dashboard/investor/documents",
        icon: "file-text",
      },
      {
        key: "verification",
        label: "Verification",
        href: "/dashboard/investor/verification",
        icon: "badge-check",
      },
    ],
  },
  {
    key: "preferences",
    label: "Preferences",
    items: [
      {
        key: "investment-preferences",
        label: "Investment Preferences",
        href: "/dashboard/investor/preferences/investment",
        icon: "settings",
      },
      {
        key: "location-preferences",
        label: "Location Preferences",
        href: "/dashboard/investor/preferences/locations",
        icon: "map-pin",
      },
    ],
  },
];

const PROPERTY_OWNER_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "workspace",
    label: null,
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/dashboard/property-owner",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        key: "properties",
        label: "Properties",
        href: "/dashboard/property-owner/properties",
        icon: "home",
      },
      {
        key: "new-property",
        label: "Add Property",
        href: "/dashboard/property-owner/properties/new",
        icon: "building",
        requiredAction: "create_property",
      },
      {
        key: "listings",
        label: "Listings",
        href: "/dashboard/property-owner/listings",
        icon: "list",
      },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    items: [
      {
        key: "bookings",
        label: "Bookings",
        href: "/dashboard/property-owner/bookings",
        icon: "calendar",
      },
      {
        key: "conversations",
        label: "Conversations",
        href: "/dashboard/property-owner/conversations",
        icon: "messages-square",
      },
      {
        key: "payments",
        label: "Payments",
        href: "/dashboard/property-owner/payments",
        icon: "credit-card",
      },
      {
        key: "documents",
        label: "Documents",
        href: "/dashboard/property-owner/documents",
        icon: "file-text",
      },
      {
        key: "verification",
        label: "Verification",
        href: "/dashboard/property-owner/verification",
        icon: "badge-check",
      },
    ],
  },
];

const PROPERTY_AGENT_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "workspace",
    label: null,
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/dashboard/property-agent",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        key: "company",
        label: "Company",
        href: "/dashboard/property-agent/company",
        icon: "building",
      },
      {
        key: "properties",
        label: "Properties",
        href: "/dashboard/property-agent/properties",
        icon: "home",
      },
      {
        key: "new-property",
        label: "Add Property",
        href: "/dashboard/property-agent/properties/new",
        icon: "building",
        requiredAction: "create_property",
      },
      {
        key: "listings",
        label: "Listings",
        href: "/dashboard/property-agent/listings",
        icon: "list",
      },
      {
        key: "authority-documents",
        label: "Authority Documents",
        href: "/dashboard/property-agent/authority-documents",
        icon: "shield-check",
      },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    items: [
      {
        key: "bookings",
        label: "Bookings",
        href: "/dashboard/property-agent/bookings",
        icon: "calendar",
      },
      {
        key: "conversations",
        label: "Conversations",
        href: "/dashboard/property-agent/conversations",
        icon: "messages-square",
      },
      {
        key: "payments",
        label: "Payments",
        href: "/dashboard/property-agent/payments",
        icon: "credit-card",
      },
      {
        key: "documents",
        label: "Documents",
        href: "/dashboard/property-agent/documents",
        icon: "file-text",
      },
      {
        key: "verification",
        label: "Verification",
        href: "/dashboard/property-agent/verification",
        icon: "badge-check",
      },
    ],
  },
];

const PROPERTY_SOURCER_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "workspace",
    label: null,
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/dashboard/property-sourcer",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        key: "deals",
        label: "Deals",
        href: "/dashboard/property-sourcer/deals",
        icon: "briefcase-business",
      },
      {
        key: "new-deal",
        label: "Add Deal",
        href: "/dashboard/property-sourcer/deals/new",
        icon: "building",
        requiredAction: "create_listing",
      },
      {
        key: "deal-packs",
        label: "Deal Packs",
        href: "/dashboard/property-sourcer/deal-packs",
        icon: "file-text",
      },
    ],
  },
  {
    key: "compliance",
    label: "Compliance",
    items: [
      {
        key: "compliance",
        label: "Compliance",
        href: "/dashboard/property-sourcer/compliance",
        icon: "shield-check",
      },
      {
        key: "declarations",
        label: "Declarations",
        href: "/dashboard/property-sourcer/compliance/declarations",
        icon: "clipboard-check",
      },
      {
        key: "listing-standards",
        label: "Listing Standards",
        href: "/dashboard/property-sourcer/compliance/listing-standards",
        icon: "book-open",
      },
      {
        key: "verification",
        label: "Verification",
        href: "/dashboard/property-sourcer/verification",
        icon: "badge-check",
      },
      {
        key: "documents",
        label: "Documents",
        href: "/dashboard/property-sourcer/documents",
        icon: "file-text",
      },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    items: [
      {
        key: "bookings",
        label: "Bookings",
        href: "/dashboard/property-sourcer/bookings",
        icon: "calendar",
      },
      {
        key: "conversations",
        label: "Conversations",
        href: "/dashboard/property-sourcer/conversations",
        icon: "messages-square",
      },
      {
        key: "payments",
        label: "Payments",
        href: "/dashboard/property-sourcer/payments",
        icon: "credit-card",
      },
    ],
  },
];

const SERVICE_PROVIDER_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "workspace",
    label: null,
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/dashboard/service-provider",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        key: "services",
        label: "Services",
        href: "/dashboard/service-provider/services",
        icon: "briefcase-business",
      },
      {
        key: "bookings",
        label: "Bookings",
        href: "/dashboard/service-provider/bookings",
        icon: "calendar",
      },
      {
        key: "conversations",
        label: "Conversations",
        href: "/dashboard/service-provider/conversations",
        icon: "messages-square",
      },
      {
        key: "payments",
        label: "Payments",
        href: "/dashboard/service-provider/payments",
        icon: "credit-card",
      },
      {
        key: "documents",
        label: "Documents",
        href: "/dashboard/service-provider/documents",
        icon: "file-text",
      },
      {
        key: "verification",
        label: "Verification",
        href: "/dashboard/service-provider/verification",
        icon: "badge-check",
      },
    ],
  },
];

const API_PARTNER_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "workspace",
    label: null,
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/dashboard/api-partner",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        key: "application",
        label: "Application",
        href: "/api-partner/application-status",
        icon: "clipboard-check",
      },
      {
        key: "keys",
        label: "API Keys",
        href: "/api-partner/keys",
        icon: "key-round",
        requiredAction: "manage_api_keys",
      },
      {
        key: "usage",
        label: "Usage",
        href: "/api-partner/usage",
        icon: "chart-no-axes-combined",
      },
      {
        key: "webhooks",
        label: "Webhooks",
        href: "/api-partner/webhooks",
        icon: "webhook",
        requiredAction: "manage_webhooks",
      },
      {
        key: "documentation",
        label: "Documentation",
        href: "/api-partner/docs",
        icon: "code-xml",
        requiredAction: "view_partner_docs",
      },
    ],
  },
];

export const DASHBOARD_NAVIGATION_BY_PROFILE = {
  investor: INVESTOR_NAVIGATION,
  property_owner: PROPERTY_OWNER_NAVIGATION,
  property_agent: PROPERTY_AGENT_NAVIGATION,
  property_sourcer: PROPERTY_SOURCER_NAVIGATION,
  service_provider: SERVICE_PROVIDER_NAVIGATION,
  api_partner: API_PARTNER_NAVIGATION,
} as const satisfies Record<DashboardProfileType, DashboardNavigationGroup[]>;

export const DASHBOARD_SHARED_NAVIGATION: DashboardNavigationGroup[] = [
  {
    key: "account",
    label: "Account",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        href: "/notifications",
        icon: "bell",
        badgeKey: "unreadNotifications",
      },
      {
        key: "account",
        label: "Account",
        href: "/account",
        icon: "user-round",
      },
    ],
  },
];

export const DASHBOARD_SAFE_MESSAGES = {
  loadError: "We could not load your dashboard. Please refresh the page.",
  noActiveProfile: "Choose or create a business profile to continue.",
  dashboardUnavailable:
    "Your dashboard is not available for the current account state.",
  verificationPending:
    "Your dashboard is available while verification continues. Some actions may remain locked.",
  correctionRequired:
    "Some information needs your attention before restricted actions can be unlocked.",
} as const;

export function getDashboardPath(profileType: DashboardProfileType): string {
  return DASHBOARD_PROFILE_PATHS[profileType];
}

export function getDashboardNavigation(
  profileType: DashboardProfileType | null,
): DashboardNavigationGroup[] {
  if (!profileType) {
    return DASHBOARD_SHARED_NAVIGATION;
  }

  return [
    ...DASHBOARD_NAVIGATION_BY_PROFILE[profileType],
    ...DASHBOARD_SHARED_NAVIGATION,
  ];
}

export function filterDashboardNavigation(
  groups: DashboardNavigationGroup[],
  actions: DashboardActionState[],
): DashboardNavigationGroup[] {
  const actionMap = new Map(actions.map((action) => [action.action, action]));

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.requiredAction) {
          return true;
        }

        const action = actionMap.get(item.requiredAction);

        return action?.availability !== "locked";
      }),
    }))
    .filter((group) => group.items.length > 0);
}
