// File: app/dashboard/_config/property-agent-dashboard.config.ts

/**
 * Asancha Property Agent Dashboard Configuration
 *
 * Purpose:
 * Defines property-agent workspace navigation, collection-page settings,
 * property options, and company-contact options.
 *
 * Security notes:
 * - Navigation visibility does not grant backend access.
 * - Company membership and a property-agent profile do not automatically grant
 *   permission to mutate company, property, listing, or document records.
 * - Backend membership, role, assignment, authority, verification, ownership,
 *   policy, and lifecycle checks remain authoritative.
 */

export interface PropertyAgentNavigationItem {
    label: string;
    href: string;
    description: string;
    exactMatch: boolean;
}

export interface PropertyAgentCollectionPageConfig {
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

export interface PropertyAgentOption {
    value: string;
    label: string;
}

export const PROPERTY_AGENT_NAVIGATION:
    readonly PropertyAgentNavigationItem[] = [
        {
            label: "Overview",
            href: "/dashboard/property-agent",
            description:
                "Property-agent dashboard overview",
            exactMatch: true,
        },
        {
            label: "Company",
            href: "/dashboard/property-agent/company",
            description:
                "Agency and company information",
            exactMatch: true,
        },
        {
            label: "Company verification",
            href: "/dashboard/property-agent/company/verification",
            description:
                "Company verification and correction requirements",
            exactMatch: true,
        },
        {
            label: "Company contacts",
            href: "/dashboard/property-agent/company/contacts",
            description:
                "Agency business and technical contacts",
            exactMatch: true,
        },
        {
            label: "Represented properties",
            href: "/dashboard/property-agent/properties",
            description:
                "Properties represented by the active property-agent profile",
            exactMatch: false,
        },
        {
            label: "Listings",
            href: "/dashboard/property-agent/listings",
            description:
                "Listings created from represented properties",
            exactMatch: true,
        },
        {
            label: "Authority documents",
            href: "/dashboard/property-agent/authority-documents",
            description:
                "Owner instructions and authority-to-represent documents",
            exactMatch: true,
        },
        {
            label: "Documents",
            href: "/dashboard/property-agent/documents",
            description:
                "Company, identity, agency, and property documents",
            exactMatch: true,
        },
        {
            label: "Verification",
            href: "/dashboard/property-agent/verification",
            description:
                "Property-agent profile verification",
            exactMatch: true,
        },
        {
            label: "Bookings",
            href: "/dashboard/property-agent/bookings",
            description:
                "Property viewings, inspections, and meetings",
            exactMatch: true,
        },
        {
            label: "Conversations",
            href: "/dashboard/property-agent/conversations",
            description:
                "Property, listing, and support conversations",
            exactMatch: true,
        },
        {
            label: "Payments",
            href: "/dashboard/property-agent/payments",
            description:
                "Property-agent payment requirements and history",
            exactMatch: true,
        },
    ];

export const PROPERTY_AGENT_COLLECTION_CONFIG = {
    companyVerification: {
        eyebrow: "Company verification",

        title: "Company verification",

        description:
            "Review company-registration, address, responsible-person, business-role, and correction requirements.",

        endpoint:
            "/verification-reviews/me?relatedType=company&profileType=property_agent",

        emptyTitle:
            "No company verification review has started",

        emptyDescription:
            "A company verification review will appear after your agency or company information has been submitted.",

        primaryActionLabel: "Review company",

        primaryActionPath:
            "/dashboard/property-agent/company",

        disclaimer:
            "Company membership does not by itself grant permission to submit or manage every company resource.",
    },

    listings: {
        eyebrow: "Agency listings",

        title: "Listings",

        description:
            "Track listing drafts, submissions, reviews, corrections, approvals, publication, pauses, withdrawals, and archives.",

        endpoint:
            "/listings/me?profileType=property_agent",

        emptyTitle: "No listings yet",

        emptyDescription:
            "Create listings only from represented properties that satisfy authority, property, company, and backend eligibility requirements.",

        primaryActionLabel:
            "View represented properties",

        primaryActionPath:
            "/dashboard/property-agent/properties",

        disclaimer:
            "Submitting a represented property does not automatically create or publish a marketplace listing.",
    },

    authorityDocuments: {
        eyebrow: "Representation authority",

        title: "Authority documents",

        description:
            "Review instructions, agency agreements, owner authority, company authority, and other evidence supporting your right to represent property.",

        endpoint:
            "/documents/me?profileType=property_agent&category=authority",

        emptyTitle:
            "No authority documents submitted",

        emptyDescription:
            "Upload authority evidence before performing actions that require proof that you may represent an owner, landlord, vendor, or developer.",

        primaryActionLabel:
            "Upload authority document",

        primaryActionPath:
            "/documents/upload?profileType=property_agent&category=authority",

        disclaimer:
            "An authority declaration alone may not be sufficient where documentary evidence is required.",
    },

    documents: {
        eyebrow: "Agent documents",

        title: "Documents",

        description:
            "Review company, identity, proof-of-address, agency, authority, property, and verification documents.",

        endpoint:
            "/documents/me?profileType=property_agent",

        emptyTitle: "No documents submitted",

        emptyDescription:
            "Upload documents when requested for company, profile, authority, property, or listing verification.",

        primaryActionLabel: "Upload document",

        primaryActionPath:
            "/documents/upload?profileType=property_agent",

        disclaimer:
            "Only safe document metadata and user-facing review messages are shown. Private storage locations and internal review notes remain hidden.",
    },

    verification: {
        eyebrow: "Property-agent verification",

        title: "Verification status",

        description:
            "Review profile verification, responsible-person requirements, correction requests, and safe next actions.",

        endpoint:
            "/verification-reviews/me?profileType=property_agent",

        emptyTitle:
            "No profile verification review has started",

        emptyDescription:
            "A property-agent verification review will appear after onboarding or verification submission.",

        primaryActionLabel:
            "Open verification centre",

        primaryActionPath: "/verification",

        disclaimer:
            "Internal KYC notes, risk assessments, private screening information, and staff-only review details are never displayed.",
    },

    bookings: {
        eyebrow: "Agent bookings",

        title: "Bookings and appointments",

        description:
            "Track property viewings, inspections, valuations, consultations, invitations, and approved schedule changes.",

        endpoint:
            "/bookings/me?profileType=property_agent",

        emptyTitle: "No bookings yet",

        emptyDescription:
            "Property viewings, inspections, and meetings linked to your property-agent profile will appear here.",

        primaryActionLabel: null,
        primaryActionPath: null,

        disclaimer:
            "Meeting links and sensitive participant details remain hidden until the backend allows access.",
    },

    conversations: {
        eyebrow: "Agent conversations",

        title: "Conversations",

        description:
            "Communicate about represented properties, listings, authority documents, verification, bookings, payments, and support.",

        endpoint:
            "/conversations/me?profileType=property_agent",

        emptyTitle: "No conversations yet",

        emptyDescription:
            "Property, listing, document, verification, booking, payment, and support conversations will appear here.",

        primaryActionLabel:
            "Open conversation centre",

        primaryActionPath: "/conversations",

        disclaimer:
            "Internal staff notes and messages outside your authorised conversation context are never returned.",
    },

    payments: {
        eyebrow: "Agent payments",

        title: "Payments",

        description:
            "Review property-agent payment references, expected amounts, proof states, review results, and required actions.",

        endpoint:
            "/payments/me?profileType=property_agent",

        emptyTitle: "No payment records",

        emptyDescription:
            "Property-agent payment requirements and historical payment activity will appear here.",

        primaryActionLabel: null,
        primaryActionPath: null,

        disclaimer:
            "Submitting proof or stating that a payment was made does not approve a payment. Backend verification remains authoritative.",
    },
} as const satisfies Record<
    string,
    PropertyAgentCollectionPageConfig
>;

export const AGENT_PROPERTY_TYPE_OPTIONS:
    readonly PropertyAgentOption[] = [
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

export const REPRESENTATION_TYPE_OPTIONS:
    readonly PropertyAgentOption[] = [
        {
            value: "sole_agency",
            label: "Sole agency",
        },
        {
            value: "joint_agency",
            label: "Joint agency",
        },
        {
            value: "multi_agency",
            label: "Multi-agency",
        },
        {
            value: "letting_management",
            label: "Letting or management instruction",
        },
        {
            value: "developer_instruction",
            label: "Developer instruction",
        },
        {
            value: "company_authority",
            label: "Company authority",
        },
        {
            value: "other",
            label: "Other authority",
        },
    ];