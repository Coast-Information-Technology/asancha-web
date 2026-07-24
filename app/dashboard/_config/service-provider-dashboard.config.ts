// File: app/dashboard/_config/service-provider-dashboard.config.ts

/**
 * Asancha Service Provider Dashboard Configuration
 *
 * Purpose:
 * Defines service-provider navigation, collection-page settings, service
 * categories, delivery modes, availability options, and route constants.
 *
 * Responsibilities:
 * - Keep service-provider navigation consistent.
 * - Define reusable list-page content.
 * - Define safe service and availability options.
 *
 * Security notes:
 * - Navigation visibility does not grant access.
 * - Backend profile ownership, verification, document, booking, payment,
 *   policy, availability, and service-lifecycle rules remain authoritative.
 * - Admin and staff routes must not appear in this public-user configuration.
 */

export interface ServiceProviderNavigationItem {
    label: string;
    href: string;
    description: string;
    exactMatch: boolean;
}

export interface ServiceProviderCollectionPageConfig {
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

export interface ServiceProviderOption {
    value: string;
    label: string;
}

export const SERVICE_PROVIDER_NAVIGATION:
    readonly ServiceProviderNavigationItem[] = [
        {
            label: "Overview",
            href: "/dashboard/service-provider",
            description:
                "Service-provider dashboard overview",
            exactMatch: true,
        },
        {
            label: "Service profile",
            href: "/dashboard/service-provider/profile",
            description:
                "Public business and professional profile",
            exactMatch: true,
        },
        {
            label: "Service areas",
            href: "/dashboard/service-provider/profile/service-areas",
            description:
                "Locations covered by the service provider",
            exactMatch: true,
        },
        {
            label: "Availability",
            href: "/dashboard/service-provider/profile/availability",
            description:
                "Weekly availability and booking settings",
            exactMatch: true,
        },
        {
            label: "Services",
            href: "/dashboard/service-provider/services",
            description:
                "Services offered by the active provider profile",
            exactMatch: false,
        },
        {
            label: "Bookings",
            href: "/dashboard/service-provider/bookings",
            description:
                "Booking requests, upcoming work, and completed jobs",
            exactMatch: true,
        },
        {
            label: "Documents",
            href: "/dashboard/service-provider/documents",
            description:
                "Professional, business, insurance, and identity documents",
            exactMatch: true,
        },
        {
            label: "Verification",
            href: "/dashboard/service-provider/verification",
            description:
                "Service-provider verification status",
            exactMatch: true,
        },
        {
            label: "Conversations",
            href: "/dashboard/service-provider/conversations",
            description:
                "Booking, service, and support conversations",
            exactMatch: true,
        },
        {
            label: "Payments",
            href: "/dashboard/service-provider/payments",
            description:
                "Service-provider payment requirements and history",
            exactMatch: true,
        },
    ];

export const SERVICE_PROVIDER_COLLECTION_CONFIG = {
    bookings: {
        eyebrow: "Service bookings",

        title: "Bookings",

        description:
            "Track new requests, accepted bookings, upcoming work, completed jobs, cancellations, and reschedule requests.",

        endpoint:
            "/bookings/me?profileType=service_provider",

        emptyTitle: "No bookings yet",

        emptyDescription:
            "Booking requests and confirmed work connected to your active service-provider profile will appear here.",

        primaryActionLabel: null,

        primaryActionPath: null,

        disclaimer:
            "A requested booking is not confirmed until it is accepted or confirmed.",
    },

    documents: {
        eyebrow: "Provider documents",

        title: "Documents",

        description:
            "Review identity, business, professional, certification, insurance, licence, and compliance documents.",

        endpoint:
            "/documents/me?profileType=service_provider",

        emptyTitle: "No documents submitted",

        emptyDescription:
            "Upload documents when requested for profile verification, professional validation, insurance, licensing, or service eligibility.",

        primaryActionLabel: "Upload document",

        primaryActionPath:
            "/documents/upload?profileType=service_provider",

        disclaimer:
            "Only safe document metadata and user-facing review messages are displayed. Private storage paths and internal review notes remain hidden.",
    },

    verification: {
        eyebrow: "Provider verification",

        title: "Verification status",

        description:
            "Review identity, business, professional, insurance, certification, correction, and supporting-document requirements.",

        endpoint:
            "/verification-reviews/me?profileType=service_provider",

        emptyTitle:
            "No verification review has started",

        emptyDescription:
            "A service-provider verification review will appear after onboarding or verification submission.",

        primaryActionLabel:
            "Open verification centre",

        primaryActionPath: "/verification",

        disclaimer:
            "Internal KYC notes, staff-only comments, risk assessments, and private screening information are never displayed.",
    },

    conversations: {
        eyebrow: "Provider conversations",

        title: "Conversations",

        description:
            "Communicate about service enquiries, booking requests, appointments, documents, payments, verification, and support.",

        endpoint:
            "/conversations/me?profileType=service_provider",

        emptyTitle: "No conversations yet",

        emptyDescription:
            "Service, booking, verification, payment, and support conversations will appear here.",

        primaryActionLabel:
            "Open conversation centre",

        primaryActionPath: "/conversations",

        disclaimer:
            "Internal staff notes and conversations outside your authorised context are never returned.",
    },

    payments: {
        eyebrow: "Provider payments",

        title: "Payments",

        description:
            "Review active and historical payment references, expected amounts, proof states, review outcomes, and safe next actions.",

        endpoint:
            "/payments/me?profileType=service_provider",

        emptyTitle: "No payment records",

        emptyDescription:
            "Service-provider payment requirements and previous payment activity will appear here.",

        primaryActionLabel: null,

        primaryActionPath: null,

        disclaimer:
            "Submitting payment proof does not approve a payment. Payment validity remains subject to reference and provider verification.",
    },
} as const satisfies Record<
    string,
    ServiceProviderCollectionPageConfig
>;

export const SERVICE_CATEGORY_OPTIONS:
    readonly ServiceProviderOption[] = [
        {
            value: "property_management",
            label: "Property management",
        },
        {
            value: "lettings_management",
            label: "Lettings management",
        },
        {
            value: "building_surveying",
            label: "Building surveying",
        },
        {
            value: "valuation",
            label: "Property valuation",
        },
        {
            value: "conveyancing",
            label: "Conveyancing",
        },
        {
            value: "mortgage_brokerage",
            label: "Mortgage brokerage",
        },
        {
            value: "insurance",
            label: "Property insurance",
        },
        {
            value: "architecture",
            label: "Architecture",
        },
        {
            value: "planning",
            label: "Planning consultancy",
        },
        {
            value: "construction",
            label: "Construction",
        },
        {
            value: "refurbishment",
            label: "Refurbishment",
        },
        {
            value: "electrical",
            label: "Electrical services",
        },
        {
            value: "plumbing",
            label: "Plumbing and heating",
        },
        {
            value: "roofing",
            label: "Roofing",
        },
        {
            value: "decorating",
            label: "Painting and decorating",
        },
        {
            value: "cleaning",
            label: "Property cleaning",
        },
        {
            value: "photography",
            label: "Property photography",
        },
        {
            value: "inventory",
            label: "Inventory services",
        },
        {
            value: "energy_assessment",
            label: "Energy assessment",
        },
        {
            value: "legal",
            label: "Legal services",
        },
        {
            value: "accounting_tax",
            label: "Property accounting and tax",
        },
        {
            value: "other",
            label: "Other property service",
        },
    ];

export const SERVICE_DELIVERY_MODE_OPTIONS:
    readonly ServiceProviderOption[] = [
        {
            value: "on_site",
            label: "On-site",
        },
        {
            value: "remote",
            label: "Remote",
        },
        {
            value: "hybrid",
            label: "Hybrid",
        },
    ];

export const SERVICE_PRICING_MODEL_OPTIONS:
    readonly ServiceProviderOption[] = [
        {
            value: "fixed",
            label: "Fixed price",
        },
        {
            value: "hourly",
            label: "Hourly",
        },
        {
            value: "daily",
            label: "Daily",
        },
        {
            value: "per_property",
            label: "Per property",
        },
        {
            value: "percentage",
            label: "Percentage",
        },
        {
            value: "starting_from",
            label: "Starting from",
        },
        {
            value: "quote_required",
            label: "Quote required",
        },
    ];

export const WEEKDAY_OPTIONS = [
    {
        value: "monday",
        label: "Monday",
    },
    {
        value: "tuesday",
        label: "Tuesday",
    },
    {
        value: "wednesday",
        label: "Wednesday",
    },
    {
        value: "thursday",
        label: "Thursday",
    },
    {
        value: "friday",
        label: "Friday",
    },
    {
        value: "saturday",
        label: "Saturday",
    },
    {
        value: "sunday",
        label: "Sunday",
    },
] as const;
