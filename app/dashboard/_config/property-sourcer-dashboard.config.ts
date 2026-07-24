// File: app/dashboard/_config/property-sourcer-dashboard.config.ts

/**
 * Asancha Property Sourcer Dashboard Configuration
 *
 * Purpose:
 * Defines property-sourcer navigation, collection-page settings, deal options,
 * compliance policies, and performance views.
 *
 * Responsibilities:
 * - Keep sourcer dashboard routes consistent.
 * - Define safe user-facing page content.
 * - Define investment-focused deal-form options.
 * - Keep policy acceptance separate from profile convenience flags.
 *
 * Security notes:
 * - Navigation visibility does not grant backend access.
 * - The backend remains authoritative for profile status, verification,
 *   policies, listing eligibility, publication, payments, payouts, and access.
 * - Public pages must not expose internal listing scores, staff notes,
 *   audit logs, private investor data, provider payloads, or MongoDB ObjectIds.
 */

export interface PropertySourcerNavigationItem {
    label: string;
    href: string;
    description: string;
    exactMatch: boolean;
}

export interface PropertySourcerCollectionPageConfig {
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

export interface PropertySourcerOption {
    value: string;
    label: string;
}

export type PropertySourcerPolicyKey =
    | "sourcer_compliance_declaration"
    | "listing_standards";

export const PROPERTY_SOURCER_NAVIGATION:
    readonly PropertySourcerNavigationItem[] = [
        {
            label: "Overview",
            href: "/dashboard/property-sourcer",
            description:
                "Property-sourcer dashboard overview",
            exactMatch: true,
        },
        {
            label: "Deals",
            href: "/dashboard/property-sourcer/deals",
            description:
                "Investment-focused deals submitted by the active sourcer profile",
            exactMatch: false,
        },
        {
            label: "Deal packs",
            href: "/dashboard/property-sourcer/deal-packs",
            description:
                "Deal-pack drafts and published investor materials",
            exactMatch: false,
        },
        {
            label: "Compliance",
            href: "/dashboard/property-sourcer/compliance",
            description:
                "Sourcer compliance and policy acceptance",
            exactMatch: false,
        },
        {
            label: "Documents",
            href: "/dashboard/property-sourcer/documents",
            description:
                "Sourcer, company, compliance, and deal documents",
            exactMatch: true,
        },
        {
            label: "Verification",
            href: "/dashboard/property-sourcer/verification",
            description:
                "Sourcer verification and correction requests",
            exactMatch: true,
        },
        {
            label: "Bookings",
            href: "/dashboard/property-sourcer/bookings",
            description:
                "Deal meetings, viewings, and consultations",
            exactMatch: true,
        },
        {
            label: "Conversations",
            href: "/dashboard/property-sourcer/conversations",
            description:
                "Deal, compliance, and support conversations",
            exactMatch: true,
        },
        {
            label: "Payments",
            href: "/dashboard/property-sourcer/payments",
            description:
                "Active payment requirements",
            exactMatch: false,
        },
        {
            label: "Performance",
            href: "/dashboard/property-sourcer/performance",
            description:
                "Safe deal-performance summaries",
            exactMatch: false,
        },
    ];

export const PROPERTY_SOURCER_COLLECTION_CONFIG = {
    dealPacks: {
        eyebrow: "Investor deal materials",
        title: "Deal packs",
        description:
            "Review deal-pack drafts, submissions, review states, published versions, and access requirements.",

        endpoint:
            "/deal-packs/me?profileType=property_sourcer",

        emptyTitle: "No deal packs yet",
        emptyDescription:
            "Create a deal pack after an eligible deal has enough verified information for investor-facing packaging.",

        primaryActionLabel: "Create deal pack",
        primaryActionPath:
            "/dashboard/property-sourcer/deal-packs/new",

        disclaimer:
            "Deal packs must not contain unsupported claims, private seller data, restricted documents, internal analysis, or guaranteed investment outcomes.",
    },

    documents: {
        eyebrow: "Sourcer documents",
        title: "Documents",
        description:
            "Review identity, company, compliance, authority, insurance, deal, property, and payout-readiness documents.",

        endpoint:
            "/documents/me?profileType=property_sourcer",

        emptyTitle: "No documents submitted",
        emptyDescription:
            "Upload documents when requested for verification, compliance, deal review, or payout readiness.",

        primaryActionLabel: "Upload document",
        primaryActionPath:
            "/documents/upload?profileType=property_sourcer",

        disclaimer:
            "Only safe document metadata and user-facing review messages are displayed. Private storage locations and internal review notes remain hidden.",
    },

    verification: {
        eyebrow: "Sourcer verification",
        title: "Verification status",
        description:
            "Review identity, company, business, compliance, correction, and supporting-document requirements.",

        endpoint:
            "/verification-reviews/me?profileType=property_sourcer",

        emptyTitle:
            "No verification review has started",
        emptyDescription:
            "A property-sourcer verification review will appear after onboarding or verification submission.",

        primaryActionLabel:
            "Open verification centre",
        primaryActionPath: "/verification",

        disclaimer:
            "Internal KYC notes, risk ratings, screening details, and staff-only verification information are never displayed.",
    },

    bookings: {
        eyebrow: "Sourcer bookings",
        title: "Bookings and meetings",
        description:
            "Track investor meetings, property viewings, deal reviews, inspections, and support appointments.",

        endpoint:
            "/bookings/me?profileType=property_sourcer",

        emptyTitle: "No bookings yet",
        emptyDescription:
            "Deal-related meetings and appointments connected to your active sourcer profile will appear here.",

        primaryActionLabel: null,
        primaryActionPath: null,

        disclaimer:
            "Meeting links and sensitive participant information remain hidden until the platform permits access.",
    },

    conversations: {
        eyebrow: "Sourcer conversations",
        title: "Conversations",
        description:
            "Communicate about deals, deal packs, compliance, verification, documents, bookings, payments, and support.",

        endpoint:
            "/conversations/me?profileType=property_sourcer",

        emptyTitle: "No conversations yet",
        emptyDescription:
            "Deal, compliance, verification, payment, booking, and support conversations will appear here.",

        primaryActionLabel:
            "Open conversation centre",
        primaryActionPath: "/conversations",

        disclaimer:
            "Internal staff notes and messages outside your authorised conversation context are never returned.",
    },

    payments: {
        eyebrow: "Sourcer payments",
        title: "Active payments",
        description:
            "Review current payment references, expected amounts, proof states, review results, and required actions.",

        endpoint:
            "/payments/me?profileType=property_sourcer&activeOnly=true",

        emptyTitle: "No active payment requirements",
        emptyDescription:
            "You do not currently have an active property-sourcer payment requirement.",

        primaryActionLabel: null,
        primaryActionPath: null,

        disclaimer:
            "Submitting payment proof does not approve a payment. Every valid payment must use an Asancha-generated reference and pass secure verification.",
    },

    paymentHistory: {
        eyebrow: "Sourcer payments",
        title: "Payment history",
        description:
            "Review previous sourcer payment references and safe payment-status information.",

        endpoint:
            "/payments/me?profileType=property_sourcer",

        emptyTitle: "No payment history",
        emptyDescription:
            "Completed, rejected, expired, failed, and cancelled payments will appear here.",

        primaryActionLabel: null,
        primaryActionPath: null,

        disclaimer:
            "Payment records must not expose provider secrets, bank credentials, webhook secrets, or raw provider payloads.",
    },
} as const satisfies Record<
    string,
    PropertySourcerCollectionPageConfig
>;

export const SOURCER_PROPERTY_TYPE_OPTIONS:
    readonly PropertySourcerOption[] = [
        {
            value: "detached",
            label: "Detached house",
        },
        {
            value: "semi_detached",
            label: "Semi-detached house",
        },
        {
            value: "terraced",
            label: "Terraced house",
        },
        {
            value: "flat",
            label: "Flat or apartment",
        },
        {
            value: "bungalow",
            label: "Bungalow",
        },
        {
            value: "commercial",
            label: "Commercial property",
        },
        {
            value: "mixed_use",
            label: "Mixed-use property",
        },
        {
            value: "land",
            label: "Land",
        },
        {
            value: "development",
            label: "Development opportunity",
        },
        {
            value: "portfolio",
            label: "Property portfolio",
        },
        {
            value: "other",
            label: "Other",
        },
    ];

export const SOURCER_STRATEGY_OPTIONS:
    readonly PropertySourcerOption[] = [
        {
            value: "buy_to_let",
            label: "Buy to let",
        },
        {
            value: "hmo",
            label: "HMO",
        },
        {
            value: "buy_refurbish_refinance",
            label: "Buy, refurbish and refinance",
        },
        {
            value: "flip",
            label: "Refurbish and resell",
        },
        {
            value: "serviced_accommodation",
            label: "Serviced accommodation",
        },
        {
            value: "social_housing",
            label: "Social housing",
        },
        {
            value: "commercial",
            label: "Commercial",
        },
        {
            value: "development",
            label: "Development",
        },
        {
            value: "other",
            label: "Other",
        },
    ];

export const SOURCER_DEAL_TYPE_OPTIONS:
    readonly PropertySourcerOption[] = [
        {
            value: "bmv",
            label: "Below market value",
        },
        {
            value: "off_market",
            label: "Off-market",
        },
        {
            value: "distressed",
            label: "Distressed sale",
        },
        {
            value: "auction",
            label: "Auction-led",
        },
        {
            value: "tenanted",
            label: "Tenanted investment",
        },
        {
            value: "vacant",
            label: "Vacant property",
        },
        {
            value: "refurbishment",
            label: "Refurbishment opportunity",
        },
        {
            value: "development",
            label: "Development opportunity",
        },
        {
            value: "portfolio",
            label: "Portfolio opportunity",
        },
        {
            value: "other",
            label: "Other",
        },
    ];

export const SOURCER_FEE_MODEL_OPTIONS:
    readonly PropertySourcerOption[] = [
        {
            value: "fixed_fee",
            label: "Fixed fee",
        },
        {
            value: "percentage",
            label: "Percentage",
        },
        {
            value: "fixed_plus_percentage",
            label: "Fixed fee plus percentage",
        },
        {
            value: "case_by_case",
            label: "Case by case",
        },
        {
            value: "not_applicable",
            label: "No sourcing fee",
        },
    ];

export const SOURCER_POLICY_ROUTES: Record<
    PropertySourcerPolicyKey,
    string
> = {
    sourcer_compliance_declaration:
        "/dashboard/property-sourcer/compliance/declarations",

    listing_standards:
        "/dashboard/property-sourcer/compliance/listing-standards",
};