// File: app/onboarding/_config/onboarding-page-config.ts

/**
 * Asancha Onboarding Page Configuration
 *
 * Purpose:
 * Defines the user-facing field configuration for general-profile and
 * role-specific onboarding routes.
 *
 * Responsibilities:
 * - Keep page files small and declarative.
 * - Define field labels, descriptions, options, and validation hints.
 * - Map business-profile types to their onboarding routes.
 * - Keep API partner onboarding separate from ordinary public onboarding.
 *
 * Security notes:
 * - Configuration does not grant access to any profile type.
 * - Backend account, role, profile, policy, and onboarding checks remain final.
 * - Do not place private KYC questions, internal risk fields, admin notes,
 *   secrets, provider data, or MongoDB ObjectIds here.
 */

export type OnboardingProfileType =
    | "general_profile"
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider";

export type OnboardingInputType =
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "url";

export interface OnboardingFieldOption {
    value: string;
    label: string;
}

export interface OnboardingFieldConfig {
    name: string;
    label: string;
    description?: string;
    placeholder?: string;

    type: OnboardingInputType;

    required?: boolean;
    minimum?: number;
    maximum?: number;
    step?: number;

    options?: OnboardingFieldOption[];
}

export interface OnboardingSectionConfig {
    key: string;
    title: string;
    description: string;
    fields: OnboardingFieldConfig[];
}

export interface OnboardingPageConfig {
    profileType: OnboardingProfileType;

    eyebrow: string;
    title: string;
    description: string;

    estimatedMinutes: number;
    sections: OnboardingSectionConfig[];

    submitLabel: string;
    successPath: string;

    policyNotice?: string;
    verificationNotice?: string;
}

const UK_COUNTRY_OPTIONS: OnboardingFieldOption[] = [
    {
        value: "United Kingdom",
        label: "United Kingdom",
    },
    {
        value: "Ireland",
        label: "Ireland",
    },
    {
        value: "Other",
        label: "Other",
    },
];

const PROPERTY_TYPE_OPTIONS: OnboardingFieldOption[] = [
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
        value: "land",
        label: "Land",
    },
    {
        value: "mixed_use",
        label: "Mixed-use property",
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

const STRATEGY_OPTIONS: OnboardingFieldOption[] = [
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
        value: "commercial",
        label: "Commercial property",
    },
    {
        value: "development",
        label: "Property development",
    },
    {
        value: "social_housing",
        label: "Social housing",
    },
    {
        value: "other",
        label: "Other",
    },
];

export const GENERAL_PROFILE_ONBOARDING_CONFIG: OnboardingPageConfig =
{
    profileType: "general_profile",

    eyebrow: "General profile",
    title: "Tell us about yourself",
    description:
        "Complete your personal identity and contact information before continuing to your business-profile setup.",

    estimatedMinutes: 4,

    submitLabel: "Save general profile",
    successPath: "/onboarding",

    sections: [
        {
            key: "identity",
            title: "Personal details",
            description:
                "Enter the information you use for your Asancha account.",
            fields: [
                {
                    name: "firstName",
                    label: "First name",
                    type: "text",
                    required: true,
                    placeholder: "Enter your first name",
                },
                {
                    name: "lastName",
                    label: "Last name",
                    type: "text",
                    required: true,
                    placeholder: "Enter your last name",
                },
                {
                    name: "displayName",
                    label: "Display name",
                    description:
                        "This is the name other users may see where appropriate.",
                    type: "text",
                    required: true,
                    placeholder: "Enter your display name",
                },
                {
                    name: "dateOfBirth",
                    label: "Date of birth",
                    type: "date",
                    required: true,
                },
                {
                    name: "nationality",
                    label: "Nationality",
                    type: "text",
                    required: true,
                    placeholder: "Enter your nationality",
                },
            ],
        },
        {
            key: "contact",
            title: "Contact information",
            description:
                "Tell us how Asancha should contact you about account and platform activity.",
            fields: [
                {
                    name: "phoneNumber",
                    label: "Phone number",
                    type: "tel",
                    required: true,
                    placeholder: "+44",
                },
                {
                    name: "preferredContactMethod",
                    label: "Preferred contact method",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "email",
                            label: "Email",
                        },
                        {
                            value: "phone",
                            label: "Phone",
                        },
                        {
                            value: "whatsapp",
                            label: "WhatsApp",
                        },
                    ],
                },
                {
                    name: "country",
                    label: "Country of residence",
                    type: "select",
                    required: true,
                    options: UK_COUNTRY_OPTIONS,
                },
                {
                    name: "residentialAddress",
                    label: "Residential address",
                    type: "textarea",
                    required: true,
                    placeholder:
                        "Enter your current residential address",
                },
                {
                    name: "postcode",
                    label: "Postcode",
                    type: "text",
                    required: true,
                    placeholder: "Enter your postcode",
                },
            ],
        },
    ],

    verificationNotice:
        "Some personal information may later require supporting identity or address documents.",
};

export const INVESTOR_ONBOARDING_CONFIG: OnboardingPageConfig =
{
    profileType: "investor",

    eyebrow: "Investor onboarding",
    title: "Build your investment profile",
    description:
        "Tell Asancha what opportunities you are looking for so we can provide more relevant marketplace results and recommendations.",

    estimatedMinutes: 8,

    submitLabel: "Complete investor setup",
    successPath: "/onboarding/pending-verification",

    sections: [
        {
            key: "investment-profile",
            title: "Investment profile",
            description:
                "Help us understand your experience and investment objectives.",
            fields: [
                {
                    name: "accountHolderType",
                    label: "Account holder type",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "individual",
                            label: "Individual",
                        },
                        {
                            value: "company",
                            label: "Company",
                        },
                        {
                            value: "trust",
                            label: "Trust or investment vehicle",
                        },
                        {
                            value: "joint",
                            label: "Joint investors",
                        },
                    ],
                },
                {
                    name: "experienceLevel",
                    label: "Investment experience",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "first_time",
                            label: "First-time investor",
                        },
                        {
                            value: "beginner",
                            label: "Beginner",
                        },
                        {
                            value: "intermediate",
                            label: "Intermediate",
                        },
                        {
                            value: "experienced",
                            label: "Experienced",
                        },
                        {
                            value: "professional",
                            label: "Professional investor",
                        },
                    ],
                },
                {
                    name: "investmentGoal",
                    label: "Primary investment goal",
                    type: "textarea",
                    required: true,
                    placeholder:
                        "Describe what you want to achieve through property investment",
                },
            ],
        },
        {
            key: "search-criteria",
            title: "Buying criteria",
            description:
                "Define the locations, budget and property types that interest you.",
            fields: [
                {
                    name: "preferredLocations",
                    label: "Preferred locations",
                    description:
                        "Separate multiple locations with commas.",
                    type: "text",
                    required: true,
                    placeholder:
                        "Manchester, Birmingham, Liverpool",
                },
                {
                    name: "minimumBudget",
                    label: "Minimum budget",
                    type: "number",
                    required: true,
                    minimum: 0,
                    step: 1000,
                },
                {
                    name: "maximumBudget",
                    label: "Maximum budget",
                    type: "number",
                    required: true,
                    minimum: 0,
                    step: 1000,
                },
                {
                    name: "propertyTypes",
                    label: "Preferred property types",
                    type: "multiselect",
                    required: true,
                    options: PROPERTY_TYPE_OPTIONS,
                },
                {
                    name: "strategies",
                    label: "Preferred investment strategies",
                    type: "multiselect",
                    required: true,
                    options: STRATEGY_OPTIONS,
                },
            ],
        },
        {
            key: "deal-preferences",
            title: "Deal preferences",
            description:
                "Set your preferred deal condition, return and refurbishment requirements.",
            fields: [
                {
                    name: "bmvPreference",
                    label: "Below-market-value preference",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "required",
                            label: "Required",
                        },
                        {
                            value: "preferred",
                            label: "Preferred",
                        },
                        {
                            value: "not_required",
                            label: "Not required",
                        },
                    ],
                },
                {
                    name: "occupancyPreferences",
                    label: "Occupancy preference",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "vacant",
                            label: "Vacant",
                        },
                        {
                            value: "tenanted",
                            label: "Tenanted",
                        },
                        {
                            value: "either",
                            label: "Either",
                        },
                    ],
                },
                {
                    name: "refurbishmentPreferences",
                    label: "Refurbishment preference",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "none",
                            label: "No refurbishment",
                        },
                        {
                            value: "light",
                            label: "Light refurbishment",
                        },
                        {
                            value: "medium",
                            label: "Medium refurbishment",
                        },
                        {
                            value: "heavy",
                            label: "Heavy refurbishment",
                        },
                        {
                            value: "development",
                            label: "Full development",
                        },
                    ],
                },
                {
                    name: "minimumGrossYield",
                    label: "Minimum preferred gross yield (%)",
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                    step: 0.1,
                },
                {
                    name: "minimumRoi",
                    label: "Minimum preferred ROI (%)",
                    type: "number",
                    minimum: 0,
                    maximum: 1000,
                    step: 0.1,
                },
                {
                    name: "dealBreakers",
                    label: "Deal breakers",
                    type: "textarea",
                    placeholder:
                        "Describe conditions that would make an opportunity unsuitable",
                },
            ],
        },
        {
            key: "funding",
            title: "Funding readiness",
            description:
                "Tell us how you expect to fund an acquisition.",
            fields: [
                {
                    name: "fundingMethod",
                    label: "Funding method",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "cash",
                            label: "Cash",
                        },
                        {
                            value: "mortgage",
                            label: "Mortgage",
                        },
                        {
                            value: "bridging",
                            label: "Bridging finance",
                        },
                        {
                            value: "joint_venture",
                            label: "Joint venture",
                        },
                        {
                            value: "other",
                            label: "Other",
                        },
                    ],
                },
                {
                    name: "purchaseTimeline",
                    label: "Target purchase timeline",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "immediately",
                            label: "Immediately",
                        },
                        {
                            value: "within_3_months",
                            label: "Within 3 months",
                        },
                        {
                            value: "within_6_months",
                            label: "Within 6 months",
                        },
                        {
                            value: "within_12_months",
                            label: "Within 12 months",
                        },
                        {
                            value: "researching",
                            label: "Researching only",
                        },
                    ],
                },
                {
                    name: "proofOfFundsAvailable",
                    label: "I currently have proof of funds available",
                    type: "checkbox",
                },
                {
                    name: "sourceOfFundsDeclaration",
                    label: "Source of funds declaration",
                    type: "textarea",
                    required: true,
                    placeholder:
                        "Briefly describe the expected source of investment funds",
                },
            ],
        },
    ],

    policyNotice:
        "You may be required to accept investor and marketplace policies before submitting this profile.",

    verificationNotice:
        "Proof of funds, identity and source-of-funds review may be required before sensitive deal actions are enabled.",
};

export const PROPERTY_OWNER_ONBOARDING_CONFIG: OnboardingPageConfig =
{
    profileType: "property_owner",

    eyebrow: "Property owner onboarding",
    title: "Set up your property owner profile",
    description:
        "Tell us about your ownership capacity and the property activity you expect to manage through Asancha.",

    estimatedMinutes: 6,

    submitLabel: "Complete property owner setup",
    successPath: "/onboarding/pending-verification",

    sections: [
        {
            key: "owner-profile",
            title: "Owner profile",
            description:
                "Describe how you own or control property.",
            fields: [
                {
                    name: "ownershipCapacity",
                    label: "Ownership capacity",
                    type: "select",
                    required: true,
                    options: [
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
                    ],
                },
                {
                    name: "publicName",
                    label: "Public profile name",
                    type: "text",
                    required: true,
                    placeholder:
                        "Enter the name to display where appropriate",
                },
                {
                    name: "companyName",
                    label: "Company name",
                    description:
                        "Complete this only where property is company-owned.",
                    type: "text",
                },
            ],
        },
        {
            key: "property-intent",
            title: "Property intent",
            description:
                "Tell us why you expect to submit property.",
            fields: [
                {
                    name: "propertySubmissionIntent",
                    label: "Property submission intent",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "sell",
                            label: "Sell a property",
                        },
                        {
                            value: "let",
                            label: "Let a property",
                        },
                        {
                            value: "source_investor",
                            label: "Find an investor",
                        },
                        {
                            value: "value_property",
                            label: "Understand property value",
                        },
                        {
                            value: "manage_portfolio",
                            label: "Manage a portfolio",
                        },
                    ],
                },
                {
                    name: "expectedSaleTimeline",
                    label: "Expected sale or letting timeline",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "immediately",
                            label: "Immediately",
                        },
                        {
                            value: "within_3_months",
                            label: "Within 3 months",
                        },
                        {
                            value: "within_6_months",
                            label: "Within 6 months",
                        },
                        {
                            value: "within_12_months",
                            label: "Within 12 months",
                        },
                        {
                            value: "not_decided",
                            label: "Not decided",
                        },
                    ],
                },
                {
                    name: "propertyTypes",
                    label: "Property types",
                    type: "multiselect",
                    required: true,
                    options: PROPERTY_TYPE_OPTIONS,
                },
                {
                    name: "broadPropertyLocations",
                    label: "Broad property locations",
                    type: "text",
                    required: true,
                    placeholder:
                        "Enter towns, cities or regions",
                },
                {
                    name: "sellerMotivation",
                    label: "Property or seller circumstances",
                    type: "textarea",
                    placeholder:
                        "Provide a short summary where relevant",
                },
            ],
        },
        {
            key: "authority",
            title: "Ownership and authority",
            description:
                "Confirm your authority to provide property information.",
            fields: [
                {
                    name: "ownershipEvidenceAvailable",
                    label:
                        "I can provide ownership or authority evidence where required",
                    type: "checkbox",
                    required: true,
                },
                {
                    name: "authorityDeclarationAccepted",
                    label:
                        "I confirm that I own or am authorised to represent submitted property",
                    type: "checkbox",
                    required: true,
                },
                {
                    name: "permissionToContact",
                    label:
                        "I give Asancha permission to contact me about submitted property",
                    type: "checkbox",
                    required: true,
                },
            ],
        },
    ],

    policyNotice:
        "Property submission rules and an authority declaration may be required before completion.",

    verificationNotice:
        "Ownership, identity, company or authority documents may be requested before publication or other sensitive actions.",
};

export const PROPERTY_AGENT_ONBOARDING_CONFIG: OnboardingPageConfig =
{
    profileType: "property_agent",

    eyebrow: "Property agent onboarding",
    title: "Set up your property agent profile",
    description:
        "Provide your agency identity, coverage, inventory focus and authority to represent property owners.",

    estimatedMinutes: 7,

    submitLabel: "Complete property agent setup",
    successPath: "/onboarding/pending-verification",

    sections: [
        {
            key: "agency-profile",
            title: "Agent or agency profile",
            description:
                "Tell us whether you operate individually or through a company.",
            fields: [
                {
                    name: "accountType",
                    label: "Account type",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "individual",
                            label: "Individual agent",
                        },
                        {
                            value: "company",
                            label: "Agency or company",
                        },
                    ],
                },
                {
                    name: "publicName",
                    label: "Public name",
                    type: "text",
                    required: true,
                },
                {
                    name: "agencyName",
                    label: "Agency name",
                    type: "text",
                },
                {
                    name: "agencyType",
                    label: "Agency type",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "estate_agent",
                            label: "Estate agent",
                        },
                        {
                            value: "letting_agent",
                            label: "Letting agent",
                        },
                        {
                            value: "commercial_agent",
                            label: "Commercial agent",
                        },
                        {
                            value: "developer_sales",
                            label: "Developer sales team",
                        },
                        {
                            value: "mixed",
                            label: "Mixed agency",
                        },
                        {
                            value: "other",
                            label: "Other",
                        },
                    ],
                },
                {
                    name: "website",
                    label: "Website",
                    type: "url",
                    placeholder: "https://",
                },
            ],
        },
        {
            key: "company-details",
            title: "Company details",
            description:
                "Complete the registered business information where applicable.",
            fields: [
                {
                    name: "companyName",
                    label: "Company name",
                    type: "text",
                },
                {
                    name: "companyRegistrationNumber",
                    label: "Company registration number",
                    type: "text",
                },
                {
                    name: "businessAddress",
                    label: "Business address",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "companyEmail",
                    label: "Company email",
                    type: "email",
                    required: true,
                },
                {
                    name: "companyPhone",
                    label: "Company phone number",
                    type: "tel",
                },
                {
                    name: "contactPerson",
                    label: "Primary contact person",
                    type: "text",
                    required: true,
                },
            ],
        },
        {
            key: "coverage",
            title: "Coverage and inventory",
            description:
                "Describe the locations and property inventory you represent.",
            fields: [
                {
                    name: "coverageAreas",
                    label: "Coverage areas",
                    type: "text",
                    required: true,
                    placeholder:
                        "Separate multiple areas with commas",
                },
                {
                    name: "propertyTypesRepresented",
                    label: "Property types represented",
                    type: "multiselect",
                    required: true,
                    options: PROPERTY_TYPE_OPTIONS,
                },
                {
                    name: "inventoryTypes",
                    label: "Inventory types",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "sales",
                            label: "Sales",
                        },
                        {
                            value: "lettings",
                            label: "Lettings",
                        },
                        {
                            value: "developments",
                            label: "New developments",
                        },
                        {
                            value: "commercial",
                            label: "Commercial",
                        },
                        {
                            value: "portfolio",
                            label: "Portfolio stock",
                        },
                    ],
                },
            ],
        },
        {
            key: "authority",
            title: "Authority to represent",
            description:
                "Confirm that you have authority to represent owners or vendors.",
            fields: [
                {
                    name: "canRepresentOwners",
                    label:
                        "I am authorised to represent owners, landlords, vendors or developers",
                    type: "checkbox",
                    required: true,
                },
                {
                    name: "authorityDeclarationAccepted",
                    label:
                        "I accept the authority-to-represent declaration",
                    type: "checkbox",
                    required: true,
                },
                {
                    name: "authorityDocumentsAvailable",
                    label:
                        "I can provide authority documents where requested",
                    type: "checkbox",
                    required: true,
                },
            ],
        },
    ],

    policyNotice:
        "An authority-to-represent declaration and applicable company policies must be accepted.",

    verificationNotice:
        "Company registration, responsible-user identity, agency or authority documents may require review.",
};

export const PROPERTY_SOURCER_ONBOARDING_CONFIG: OnboardingPageConfig =
{
    profileType: "property_sourcer",

    eyebrow: "Property sourcer onboarding",
    title: "Set up your property sourcer profile",
    description:
        "Tell us about your sourcing operation, market coverage, deal focus and compliance readiness.",

    estimatedMinutes: 7,

    submitLabel: "Complete property sourcer setup",
    successPath: "/onboarding/pending-verification",

    sections: [
        {
            key: "business-profile",
            title: "Sourcing profile",
            description:
                "Describe how you operate as a property sourcer.",
            fields: [
                {
                    name: "accountType",
                    label: "Account type",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "individual",
                            label: "Individual sourcer",
                        },
                        {
                            value: "company",
                            label: "Sourcing company",
                        },
                    ],
                },
                {
                    name: "tradingName",
                    label: "Trading or public name",
                    type: "text",
                    required: true,
                },
                {
                    name: "companyName",
                    label: "Registered company name",
                    type: "text",
                },
                {
                    name: "companyRegistrationNumber",
                    label: "Company registration number",
                    type: "text",
                },
                {
                    name: "website",
                    label: "Website",
                    type: "url",
                    placeholder: "https://",
                },
            ],
        },
        {
            key: "coverage-focus",
            title: "Coverage and sourcing focus",
            description:
                "Describe the markets and opportunity types you work with.",
            fields: [
                {
                    name: "coverageAreas",
                    label: "Coverage areas",
                    type: "text",
                    required: true,
                    placeholder:
                        "Separate multiple towns, cities or regions with commas",
                },
                {
                    name: "propertyTypes",
                    label: "Property types sourced",
                    type: "multiselect",
                    required: true,
                    options: PROPERTY_TYPE_OPTIONS,
                },
                {
                    name: "strategies",
                    label: "Investment strategies sourced",
                    type: "multiselect",
                    required: true,
                    options: STRATEGY_OPTIONS,
                },
                {
                    name: "typicalDealDescription",
                    label: "Typical deal profile",
                    type: "textarea",
                    required: true,
                    placeholder:
                        "Describe the opportunities you normally source",
                },
            ],
        },
        {
            key: "experience",
            title: "Experience and operations",
            description:
                "Help Asancha understand your sourcing experience and expected activity.",
            fields: [
                {
                    name: "experienceYears",
                    label: "Years of sourcing experience",
                    type: "number",
                    required: true,
                    minimum: 0,
                    maximum: 80,
                },
                {
                    name: "estimatedMonthlyDeals",
                    label: "Estimated deals submitted per month",
                    type: "number",
                    required: true,
                    minimum: 0,
                    maximum: 10000,
                },
                {
                    name: "sourcingFeeModel",
                    label: "Sourcing fee model",
                    type: "textarea",
                    required: true,
                    placeholder:
                        "Describe when and how sourcing fees are normally charged",
                },
            ],
        },
        {
            key: "compliance",
            title: "Compliance readiness",
            description:
                "Confirm your readiness to provide required business and compliance evidence.",
            fields: [
                {
                    name: "professionalIndemnityAvailable",
                    label:
                        "Professional indemnity insurance is available where applicable",
                    type: "checkbox",
                },
                {
                    name: "amlRegistrationAvailable",
                    label:
                        "AML registration or equivalent evidence is available where applicable",
                    type: "checkbox",
                },
                {
                    name: "propertyRedressMembershipAvailable",
                    label:
                        "Property redress scheme membership is available where applicable",
                    type: "checkbox",
                },
                {
                    name: "dealInformationAccuracyConfirmed",
                    label:
                        "I will provide accurate and supportable deal information",
                    type: "checkbox",
                    required: true,
                },
            ],
        },
    ],

    policyNotice:
        "Property sourcing, deal submission, fee disclosure and authority policies may be required.",

    verificationNotice:
        "Identity, company, AML, redress, insurance or authority evidence may be reviewed before deals can be published.",
};

export const SERVICE_PROVIDER_ONBOARDING_CONFIG: OnboardingPageConfig =
{
    profileType: "service_provider",

    eyebrow: "Service provider onboarding",
    title: "Set up your service provider profile",
    description:
        "Describe your professional services, qualifications, coverage and booking availability.",

    estimatedMinutes: 7,

    submitLabel: "Complete service provider setup",
    successPath: "/onboarding/pending-verification",

    sections: [
        {
            key: "provider-profile",
            title: "Provider profile",
            description:
                "Tell users who provides the service.",
            fields: [
                {
                    name: "accountType",
                    label: "Provider type",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "individual",
                            label: "Individual professional",
                        },
                        {
                            value: "company",
                            label: "Company or practice",
                        },
                    ],
                },
                {
                    name: "publicName",
                    label: "Public name",
                    type: "text",
                    required: true,
                },
                {
                    name: "companyName",
                    label: "Company name",
                    type: "text",
                },
                {
                    name: "companyRegistrationNumber",
                    label: "Company registration number",
                    type: "text",
                },
                {
                    name: "website",
                    label: "Website",
                    type: "url",
                    placeholder: "https://",
                },
            ],
        },
        {
            key: "services",
            title: "Services offered",
            description:
                "Choose the professional services you provide.",
            fields: [
                {
                    name: "serviceCategories",
                    label: "Service categories",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "legal",
                            label: "Legal or conveyancing",
                        },
                        {
                            value: "mortgage_finance",
                            label: "Mortgage or finance",
                        },
                        {
                            value: "survey",
                            label: "Surveying",
                        },
                        {
                            value: "valuation",
                            label: "Valuation",
                        },
                        {
                            value: "inspection",
                            label: "Property inspection",
                        },
                        {
                            value: "refurbishment",
                            label: "Refurbishment",
                        },
                        {
                            value: "construction",
                            label: "Construction",
                        },
                        {
                            value: "architecture",
                            label: "Architecture or planning",
                        },
                        {
                            value: "property_management",
                            label: "Property management",
                        },
                        {
                            value: "insurance",
                            label: "Insurance",
                        },
                        {
                            value: "tax_accounting",
                            label: "Tax or accounting",
                        },
                        {
                            value: "other",
                            label: "Other property service",
                        },
                    ],
                },
                {
                    name: "serviceDescription",
                    label: "Service description",
                    type: "textarea",
                    required: true,
                    placeholder:
                        "Explain what you provide and who the service is for",
                },
                {
                    name: "coverageAreas",
                    label: "Coverage areas",
                    type: "text",
                    required: true,
                },
                {
                    name: "remoteServicesAvailable",
                    label: "Remote services are available",
                    type: "checkbox",
                },
            ],
        },
        {
            key: "qualifications",
            title: "Qualifications and experience",
            description:
                "Provide relevant professional and business information.",
            fields: [
                {
                    name: "experienceYears",
                    label: "Years of experience",
                    type: "number",
                    required: true,
                    minimum: 0,
                    maximum: 80,
                },
                {
                    name: "professionalQualifications",
                    label: "Professional qualifications",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "professionalMemberships",
                    label: "Professional memberships",
                    type: "textarea",
                },
                {
                    name: "insuranceAvailable",
                    label:
                        "Professional or public liability insurance is available where applicable",
                    type: "checkbox",
                },
            ],
        },
        {
            key: "availability",
            title: "Availability and delivery",
            description:
                "Tell users how your service can be booked and delivered.",
            fields: [
                {
                    name: "deliveryMethods",
                    label: "Delivery methods",
                    type: "multiselect",
                    required: true,
                    options: [
                        {
                            value: "in_person",
                            label: "In person",
                        },
                        {
                            value: "remote",
                            label: "Remote",
                        },
                        {
                            value: "phone",
                            label: "Phone",
                        },
                        {
                            value: "video",
                            label: "Video meeting",
                        },
                        {
                            value: "site_visit",
                            label: "Site visit",
                        },
                    ],
                },
                {
                    name: "typicalResponseTime",
                    label: "Typical response time",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "same_day",
                            label: "Same day",
                        },
                        {
                            value: "one_business_day",
                            label: "Within one business day",
                        },
                        {
                            value: "two_business_days",
                            label: "Within two business days",
                        },
                        {
                            value: "three_plus_days",
                            label: "Three or more business days",
                        },
                    ],
                },
                {
                    name: "bookingNotes",
                    label: "Booking information",
                    type: "textarea",
                    placeholder:
                        "Explain any information users should provide before booking",
                },
            ],
        },
    ],

    policyNotice:
        "Service-provider conduct, booking and professional-responsibility policies may apply.",

    verificationNotice:
        "Qualifications, company information, insurance or professional memberships may require verification.",
};

export const ONBOARDING_CONFIG_BY_PROFILE: Record<
    OnboardingProfileType,
    OnboardingPageConfig
> = {
    general_profile: GENERAL_PROFILE_ONBOARDING_CONFIG,
    investor: INVESTOR_ONBOARDING_CONFIG,
    property_owner: PROPERTY_OWNER_ONBOARDING_CONFIG,
    property_agent: PROPERTY_AGENT_ONBOARDING_CONFIG,
    property_sourcer: PROPERTY_SOURCER_ONBOARDING_CONFIG,
    service_provider: SERVICE_PROVIDER_ONBOARDING_CONFIG,
};

export const ONBOARDING_ROLE_ROUTES: Record<
    Exclude<OnboardingProfileType, "general_profile">,
    string
> = {
    investor: "/onboarding/investor",
    property_owner: "/onboarding/property-owner",
    property_agent: "/onboarding/property-agent",
    property_sourcer: "/onboarding/property-sourcer",
    service_provider: "/onboarding/service-provider",
};