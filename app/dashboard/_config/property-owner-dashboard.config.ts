// File: app/dashboard/_config/property-owner-dashboard.config.ts

/**
 * Asancha Property Owner Dashboard Configuration
 *
 * Purpose:
 * Defines property-owner workspace navigation, collection screens, property
 * types, ownership capacities, and safe frontend route constants.
 *
 * Responsibilities:
 * - Keep owner navigation consistent across desktop and mobile layouts.
 * - Define owner-scoped list-screen configuration.
 * - Define safe property-form options.
 *
 * Security notes:
 * - Navigation visibility is UX guidance only.
 * - Backend ownership, active-profile, policy, verification, document, and
 *   lifecycle checks remain authoritative.
 * - No admin or staff routes belong in this public-user configuration.
 */

export interface PropertyOwnerNavigationItem {
    label: string;
    href: string;
    description: string;
    exactMatch: boolean;
}

export interface PropertyOwnerCollectionPageConfig {
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

export interface PropertyOption {
    value: string;
    label: string;
}

export const PROPERTY_OWNER_NAVIGATION:
    readonly PropertyOwnerNavigationItem[] = [
        {
            label: "Overview",
            href: "/dashboard/property-owner",
            description:
                "Property owner dashboard overview",
            exactMatch: true,
        },
        {
            label: "My Properties",
            href: "/dashboard/property-owner/properties",
            description:
                "Properties submitted through the active owner profile",
            exactMatch: false,
        },
        {
            label: "My Listings",
            href: "/dashboard/property-owner/listings",
            description:
                "Listings created from approved properties",
            exactMatch: true,
        },
        {
            label: "Documents",
            href: "/dashboard/property-owner/documents",
            description:
                "Ownership, authority, identity, and property documents",
            exactMatch: true,
        },
        {
            label: "Verification",
            href: "/dashboard/property-owner/verification",
            description:
                "Property-owner verification and correction requests",
            exactMatch: true,
        },
        {
            label: "Bookings",
            href: "/dashboard/property-owner/bookings",
            description:
                "Property viewings, inspections, and support appointments",
            exactMatch: true,
        },
        {
            label: "Conversations",
            href: "/dashboard/property-owner/conversations",
            description:
                "Property and support conversations",
            exactMatch: true,
        },
        {
            label: "Payments",
            href: "/dashboard/property-owner/payments",
            description:
                "Property-owner payment requirements and history",
            exactMatch: true,
        },
    ];

export const PROPERTY_OWNER_COLLECTION_CONFIG = {
    properties: {
        eyebrow: "Property portfolio",

        title: "My properties",

        description:
            "Review draft, submitted, under-review, approved, correction-required, rejected, and archived properties connected to your active property-owner profile.",

        endpoint: "/properties/me",

        emptyTitle:
            "You have not submitted any properties yet",

        emptyDescription:
            "Add your first property to begin the Asancha property review process.",

        primaryActionLabel: "Add property",

        primaryActionPath:
            "/dashboard/property-owner/properties/new",

        disclaimer:
            "Saving or submitting a property does not make it visible in the marketplace. Property review, listing creation, listing approval, and publication are separate stages.",
    },

    listings: {
        eyebrow: "Property listings",

        title: "My listings",

        description:
            "Track draft, submitted, under-review, approved, published, paused, rejected, withdrawn, and archived listings created from your approved properties.",

        endpoint: "/listings/me",

        emptyTitle: "No listings yet",

        emptyDescription:
            "A listing can be created only from a property that satisfies the backend property and ownership requirements.",

        primaryActionLabel: "View properties",

        primaryActionPath:
            "/dashboard/property-owner/properties",

        disclaimer:
            "A property may be approved without having a published listing. Listing publication remains a separate backend-controlled action.",
    },

    documents: {
        eyebrow: "Owner documents",

        title: "Documents",

        description:
            "Review ownership evidence, title-related documents, identity documents, proof of address, authority evidence, and property documents.",

        endpoint:
            "/documents/me?profileType=property_owner",

        emptyTitle: "No documents submitted",

        emptyDescription:
            "Upload ownership, identity, address, authority, or property documents when requested.",

        primaryActionLabel: "Upload document",

        primaryActionPath: "/documents/upload",

        disclaimer:
            "Only safe document metadata and user-facing review messages are displayed. Private storage URLs and internal review notes remain hidden.",
    },

    verification: {
        eyebrow: "Property-owner verification",

        title: "Verification status",

        description:
            "Review profile verification, ownership requirements, correction requests, and safe next actions.",

        endpoint:
            "/verification-reviews/me?profileType=property_owner",

        emptyTitle:
            "No verification review has started",

        emptyDescription:
            "A verification review will appear when the backend starts or receives a property-owner verification submission.",

        primaryActionLabel:
            "Open verification centre",

        primaryActionPath: "/verification",

        disclaimer:
            "Internal KYC notes, risk internals, private screening data, and staff-only review information are never displayed.",
    },

    bookings: {
        eyebrow: "Owner bookings",

        title: "Bookings and appointments",

        description:
            "Track property viewings, inspections, document-support meetings, and other property-related appointments.",

        endpoint:
            "/bookings/me?profileType=property_owner",

        emptyTitle: "No bookings yet",

        emptyDescription:
            "Viewings, inspections, and support appointments connected to your owner profile will appear here.",

        primaryActionLabel: null,

        primaryActionPath: null,

        disclaimer:
            "Meeting links and sensitive participant details remain hidden until the backend permits access.",
    },

    conversations: {
        eyebrow: "Owner conversations",

        title: "Conversations",

        description:
            "Communicate about property submissions, documents, verification, bookings, listings, payments, and support.",

        endpoint:
            "/conversations/me?profileType=property_owner",

        emptyTitle: "No conversations yet",

        emptyDescription:
            "Property, document, listing, booking, and support conversations will appear here.",

        primaryActionLabel:
            "Open conversation centre",

        primaryActionPath: "/conversations",

        disclaimer:
            "Internal admin notes and hidden messages are never included in the public-user conversation response.",
    },

    payments: {
        eyebrow: "Owner payments",

        title: "Payments",

        description:
            "Review property-owner payment references, expected amounts, proof status, and safe required actions.",

        endpoint:
            "/payments/me?profileType=property_owner",

        emptyTitle: "No payment records",

        emptyDescription:
            "Property-owner payment requirements and previous payment activity will appear here.",

        primaryActionLabel: null,

        primaryActionPath: null,

        disclaimer:
            "Submitting payment proof does not approve a payment. A valid payment must use an Asancha-generated reference and pass backend verification.",
    },
} as const satisfies Record<
    string,
    PropertyOwnerCollectionPageConfig
>;

export const PROPERTY_TYPE_OPTIONS:
    readonly PropertyOption[] = [
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
            value: "maisonette",
            label: "Maisonette",
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
            value: "other",
            label: "Other",
        },
    ];

export const OWNERSHIP_CAPACITY_OPTIONS:
    readonly PropertyOption[] = [
        {
            value: "sole_owner",
            label: "Sole owner",
        },
        {
            value: "joint_owner",
            label: "Joint owner",
        },
        {
            value: "company_owner",
            label: "Company owner",
        },
        {
            value: "landlord",
            label: "Landlord",
        },
        {
            value: "executor",
            label: "Executor",
        },
        {
            value: "authorised_representative",
            label: "Authorised representative",
        },
        {
            value: "other",
            label: "Other",
        },
    ];

export const PROPERTY_INTENT_OPTIONS:
    readonly PropertyOption[] = [
        {
            value: "sell",
            label: "Sell",
        },
        {
            value: "let",
            label: "Let",
        },
        {
            value: "find_investor",
            label: "Find an investor",
        },
        {
            value: "manage_portfolio",
            label: "Manage portfolio",
        },
        {
            value: "valuation",
            label: "Request valuation support",
        },
        {
            value: "other",
            label: "Other",
        },
    ];