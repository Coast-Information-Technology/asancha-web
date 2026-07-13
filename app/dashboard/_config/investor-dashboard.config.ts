// File: app/dashboard/_config/investor-dashboard.config.ts

/**
 * Asancha Investor Dashboard Configuration
 *
 * Purpose:
 * Defines the protected investor dashboard navigation and reusable investor
 * collection-page configuration.
 *
 * Responsibilities:
 * - Define the investor workspace navigation.
 * - Define safe API endpoints for investor collection pages.
 * - Define page headings, empty states, actions, and disclaimers.
 * - Keep dashboard route values consistent across desktop and mobile layouts.
 *
 * Security notes:
 * - Navigation visibility is UX guidance only.
 * - Rendering a link does not grant access to its resource.
 * - Backend authentication, active-profile scoping, verification, payment,
 *   policy, document, reservation, and permission rules remain authoritative.
 * - Do not include admin or staff routes in this public frontend configuration.
 */

export interface InvestorNavigationItem {
    label: string;
    href: string;
    description: string;

    exactMatch: boolean;
}

export interface InvestorCollectionPageConfig {
    eyebrow: string;
    title: string;
    description: string;

    endpoint: string;

    emptyTitle: string;
    emptyDescription: string;

    primaryActionLabel: string | null;
    primaryActionPath: string | null;

    disclaimer: string | null;
}

export const INVESTOR_NAVIGATION:
    readonly InvestorNavigationItem[] = [
        {
            label: "Overview",
            href: "/dashboard/investor",
            description:
                "Investor dashboard overview",
            exactMatch: true,
        },
        {
            label: "Opportunities",
            href: "/dashboard/investor/opportunities",
            description:
                "Browse investor opportunities",
            exactMatch: true,
        },
        {
            label: "Recommended",
            href: "/dashboard/investor/opportunities/recommended",
            description:
                "Recommended investor opportunities",
            exactMatch: true,
        },
        {
            label: "Recently viewed",
            href: "/dashboard/investor/opportunities/recent",
            description:
                "Recently viewed opportunities",
            exactMatch: true,
        },
        {
            label: "Saved properties",
            href: "/dashboard/investor/saved",
            description:
                "Saved property opportunities",
            exactMatch: true,
        },
        {
            label: "AI recommendations",
            href: "/dashboard/investor/recommendations",
            description:
                "AI recommendation matches",
            exactMatch: true,
        },
        {
            label: "AI insights",
            href: "/dashboard/investor/ai-insights",
            description:
                "Safe investor-facing property intelligence",
            exactMatch: true,
        },
        {
            label: "Reservations",
            href: "/dashboard/investor/reservations",
            description:
                "Investor reservation activity",
            exactMatch: true,
        },
        {
            label: "Bookings",
            href: "/dashboard/investor/bookings",
            description:
                "Investor viewings and consultations",
            exactMatch: true,
        },
        {
            label: "Payments",
            href: "/dashboard/investor/payments",
            description:
                "Active investor payment requirements",
            exactMatch: true,
        },
        {
            label: "Payment history",
            href: "/dashboard/investor/payments/history",
            description:
                "Previous investor payment activity",
            exactMatch: true,
        },
        {
            label: "Documents",
            href: "/dashboard/investor/documents",
            description:
                "Investor documents",
            exactMatch: true,
        },
        {
            label: "Verification",
            href: "/dashboard/investor/verification",
            description:
                "Investor verification status",
            exactMatch: true,
        },
        {
            label: "Preferences",
            href: "/dashboard/investor/preferences",
            description:
                "Investor matching preferences",
            exactMatch: false,
        },
    ];

export const INVESTOR_COLLECTION_CONFIG = {
    opportunities: {
        eyebrow: "Investor opportunities",

        title: "Browse opportunities",

        description:
            "Browse public-safe investment opportunities available to your active investor profile.",

        endpoint: "/marketplace",

        emptyTitle: "No opportunities found",

        emptyDescription:
            "No opportunities currently match this view. Adjust your marketplace filters or check again later.",

        primaryActionLabel: "Open marketplace",

        primaryActionPath: "/marketplace",

        disclaimer:
            "Listing information is provided for discovery and must not be treated as guaranteed investment, rental, financing, legal, resale, or completion advice.",
    },

    recommendedOpportunities: {
        eyebrow: "Matched opportunities",

        title: "Recommended opportunities",

        description:
            "Review opportunities matched against the preferences stored for your active investor profile.",

        endpoint:
            "/ai/recommendations/me?status=active",

        emptyTitle: "No recommendations yet",

        emptyDescription:
            "Complete your investment preferences to help Asancha match you with suitable opportunities.",

        primaryActionLabel:
            "Update investment preferences",

        primaryActionPath:
            "/dashboard/investor/preferences/investment",

        disclaimer:
            "Recommendation scores are estimates and do not guarantee investment returns, financing, rental income, capital growth, resale outcomes, or completion.",
    },

    recentOpportunities: {
        eyebrow: "Recent activity",

        title: "Recently viewed opportunities",

        description:
            "Return to opportunities you recently opened from the marketplace or recommendations.",

        endpoint:
            "/marketplace/recently-viewed/me",

        emptyTitle:
            "No recently viewed opportunities",

        emptyDescription:
            "Properties you view will appear here where recent-view tracking is available.",

        primaryActionLabel:
            "Browse marketplace",

        primaryActionPath: "/marketplace",

        disclaimer: null,
    },

    saved: {
        eyebrow: "Saved properties",

        title: "Saved opportunities",

        description:
            "Review property opportunities saved under your active investor profile.",

        endpoint: "/wishlist/me",

        emptyTitle:
            "You have not saved any opportunities yet",

        emptyDescription:
            "Browse the marketplace and save opportunities that match your goals.",

        primaryActionLabel:
            "Browse marketplace",

        primaryActionPath: "/marketplace",

        disclaimer: null,
    },

    recommendations: {
        eyebrow: "AI recommendations",

        title: "Your recommendations",

        description:
            "Review match scores, safe reasons, mismatch warnings, confidence information, and available actions.",

        endpoint: "/ai/recommendations/me",

        emptyTitle: "No recommendations yet",

        emptyDescription:
            "Complete your investment preferences to help Asancha match you with suitable opportunities.",

        primaryActionLabel:
            "Review preferences",

        primaryActionPath:
            "/dashboard/investor/preferences",

        disclaimer:
            "AI recommendations are guidance only and do not guarantee rental income, financing, legal outcomes, capital growth, refurbishment costs, resale value, or investment return.",
    },

    aiInsights: {
        eyebrow: "Property intelligence",

        title: "AI insights",

        description:
            "Review safe investor-facing property insights generated for eligible opportunities.",

        endpoint: "/ai/insights/me",

        emptyTitle:
            "No AI insights available",

        emptyDescription:
            "AI insights will appear when eligible analysis is available for your active investor profile.",

        primaryActionLabel:
            "View recommendations",

        primaryActionPath:
            "/dashboard/investor/recommendations",

        disclaimer:
            "AI output is informational guidance only. Verify material assumptions independently before making investment decisions.",
    },

    reservations: {
        eyebrow: "Deal reservations",

        title: "Your reservations",

        description:
            "Track requested, payment-related, reviewed, confirmed, cancelled, rejected, and expired reservation states.",

        endpoint: "/reservations",

        emptyTitle: "No reservations yet",

        emptyDescription:
            "Eligible reservation requests will appear here after you reserve an available opportunity.",

        primaryActionLabel:
            "Browse opportunities",

        primaryActionPath:
            "/dashboard/investor/opportunities",

        disclaimer:
            "Submitting a reservation request or payment proof does not confirm a reservation. Backend review remains authoritative.",
    },

    bookings: {
        eyebrow: "Investor bookings",

        title: "Bookings and viewings",

        description:
            "Track property viewings, consultations, invitations, cancellations, and approved schedule changes.",

        endpoint: "/bookings/me",

        emptyTitle: "No bookings yet",

        emptyDescription:
            "Eligible property viewings and consultations will appear here.",

        primaryActionLabel:
            "Browse opportunities",

        primaryActionPath:
            "/dashboard/investor/opportunities",

        disclaimer:
            "Meeting details may remain hidden until a booking is confirmed and all applicable requirements are satisfied.",
    },

    payments: {
        eyebrow: "Investor payments",

        title: "Payment requirements",

        description:
            "Review active payment references, expected amounts, proof status, and required next actions.",

        endpoint:
            "/payments/me?activeOnly=true",

        emptyTitle: "No active payments",

        emptyDescription:
            "You do not currently have an active investor payment requirement.",

        primaryActionLabel: null,

        primaryActionPath: null,

        disclaimer:
            "Submitting payment proof does not approve a payment. Asancha verifies the reference, payer, amount, currency, provider state, and related action.",
    },

    paymentHistory: {
        eyebrow: "Payment history",

        title: "Previous payments",

        description:
            "Review previous investor payment references and safe payment-status information.",

        endpoint: "/payments/me",

        emptyTitle: "No payment history",

        emptyDescription:
            "Completed, rejected, failed, expired, or cancelled payment activity will appear here.",

        primaryActionLabel: null,

        primaryActionPath: null,

        disclaimer:
            "Payment records never display provider secrets, webhook secrets, private bank credentials, or raw provider payloads.",
    },

    documents: {
        eyebrow: "Investor documents",

        title: "Documents",

        description:
            "Review identity, address, proof-of-funds, source-of-funds, and other investor document requirements.",

        endpoint:
            "/documents/me?profileType=investor",

        emptyTitle:
            "No documents submitted",

        emptyDescription:
            "Upload documents when requested to support verification or eligible investor actions.",

        primaryActionLabel:
            "Open document centre",

        primaryActionPath: "/documents",

        disclaimer:
            "Only safe document metadata is displayed. Private storage locations and internal review notes remain hidden.",
    },

    verification: {
        eyebrow: "Investor verification",

        title: "Verification status",

        description:
            "Review investor verification, correction requests, document requirements, and safe next actions.",

        endpoint:
            "/verification-reviews/me?profileType=investor",

        emptyTitle:
            "No verification review",

        emptyDescription:
            "A verification review will appear when investor verification is started.",

        primaryActionLabel:
            "Open verification centre",

        primaryActionPath: "/verification",

        disclaimer:
            "Internal KYC notes, risk internals, private screening data, and staff-only review information are never displayed.",
    },
} as const satisfies Record<
    string,
    InvestorCollectionPageConfig
>;