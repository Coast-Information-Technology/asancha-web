"use client";

// File: app/onboarding/property-owner/_components/property-owner-onboarding-form.tsx

/**
 * Asancha Property Owner Onboarding Form
 *
 * Purpose:
 * Renders the backend-driven property-owner onboarding steps as a multi-step
 * form while the role-specific submit payloads are being finalised.
 *
 * Security notes:
 * - Required-field checks are user-experience guidance only.
 * - Backend onboarding, policy, document, authority, and verification checks
 *   remain authoritative.
 */

import {
    useRouter,
} from "next/navigation";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Circle,
    FileCheck2,
    Lock,
    RefreshCw,
    UploadCloud,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    authApiGet,
    authApiPost,
    authApiPut,
} from "../../../../src/lib/api/auth-fetch";

type PropertyOwnerStepKey =
    | "owner_profile"
    | "property_details"
    | "sale_motivation"
    | "documents_and_proof"
    | "policies_and_authority"
    | "review_submit";

type PropertyOwnerFormValue =
    | string
    | number
    | boolean
    | string[]
    | null;

type PropertyOwnerFormValues = Record<
    string,
    PropertyOwnerFormValue
>;

type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

type UploadStateByField = Record<string, UploadStatus>;

const COMPANY_OWNER_PROFILE_FIELDS = new Set([
    "companyPublicId",
    "companyName",
    "companyRegistrationNumber",
    "businessAddress",
    "companyEmail",
    "companyPhone",
    "contactPerson",
]);

const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ??
    "dgrrexhst";
const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ??
    "";

const CLOUDINARY_URL_VALUE_FIELDS = new Set([
    "proofOfOwnershipDocumentPublicId",
    "identityDocumentPublicId",
    "proofOfAddressDocumentPublicId",
]);

const CLOUDINARY_UPLOAD_CONFIRMATION_FIELDS = new Set([
    "propertyPhotosUploaded",
    "floorplanUploaded",
    "epcUploaded",
]);

type PropertyOwnerFieldType =
    | "checkbox"
    | "currency"
    | "email"
    | "multiselect"
    | "number"
    | "select"
    | "tel"
    | "text"
    | "textarea"
    | "url";

interface PropertyOwnerOnboardingStep {
    stepKey: PropertyOwnerStepKey;
    stepTitle: string;
    requiredFields: string[];
    optionalFields: string[];
    stepNumber: number;
    totalSteps: number;
    completed: boolean;
    current: boolean;
    locked: boolean;
    canEdit: boolean;
}

interface PropertyOwnerReviewSummaryItem {
    stepKey: PropertyOwnerStepKey;
    stepTitle: string;
    stepNumber: number;
    completed: boolean;
    data: Record<string, unknown>;
}

interface PropertyOwnerOnboardingStepsResponse {
    profileType: "property_owner";
    totalSteps: number;
    currentStep: PropertyOwnerStepKey;
    nextStep?: PropertyOwnerStepKey;
    completedSteps: PropertyOwnerStepKey[];
    lockedSteps: PropertyOwnerStepKey[];
    steps: PropertyOwnerOnboardingStep[];
    reviewSummary?: PropertyOwnerReviewSummaryItem[];
}

interface PropertyOwnerOnboardingStartResponse {
    publicId: string;
    profileType: "property_owner";
    businessProfileType: "property_owner";
    status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "completed"
        | "abandoned"
        | "correction_required";
    verificationStatus: string;
    data: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    resource_type: string;
    original_filename?: string;
}

interface FieldOption {
    value: string;
    label: string;
}

interface FieldConfig {
    name: string;
    label: string;
    type: PropertyOwnerFieldType;
    required: boolean;
    placeholder?: string;
    description?: string;
    options?: readonly FieldOption[];
    minimum?: number;
}

interface StepFormConfig {
    stepKey: PropertyOwnerStepKey;
    description: string;
    fields: readonly FieldConfig[];
}

const STEP_CONFIGS: Record<
    PropertyOwnerStepKey,
    StepFormConfig
> = {
    owner_profile: {
        stepKey: "owner_profile",
        description:
            "Tell us who owns or controls the property and how Asancha should contact the right person.",
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
                ],
            },
            {
                name: "ownerType",
                label: "Owner type",
                type: "select",
                required: true,
                options: [
                    {
                        value: "individual_owner",
                        label: "Individual owner",
                    },
                    {
                        value: "landlord",
                        label: "Landlord",
                    },
                    {
                        value: "developer",
                        label: "Developer",
                    },
                    {
                        value: "executor",
                        label: "Executor",
                    },
                    {
                        value: "authorised_representative",
                        label: "Authorised representative",
                    },
                ],
            },
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
                ],
            },
            {
                name: "fullName",
                label: "Full name",
                type: "text",
                required: true,
                placeholder: "Enter your legal full name",
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
                name: "companyPublicId",
                label: "Company public ID",
                type: "text",
                required: false,
            },
            {
                name: "companyName",
                label: "Company name",
                type: "text",
                required: false,
            },
            {
                name: "companyRegistrationNumber",
                label: "Company registration number",
                type: "text",
                required: false,
            },
            {
                name: "businessAddress",
                label: "Business address",
                type: "textarea",
                required: false,
            },
            {
                name: "companyEmail",
                label: "Company email",
                type: "email",
                required: false,
            },
            {
                name: "companyPhone",
                label: "Company phone",
                type: "tel",
                required: false,
            },
            {
                name: "contactPerson",
                label: "Contact person",
                type: "text",
                required: false,
            },
        ],
    },
    property_details: {
        stepKey: "property_details",
        description:
            "Add the core property details needed before a listing or review can begin.",
        fields: [
            {
                name: "address",
                label: "Property address",
                type: "textarea",
                required: true,
                placeholder: "Enter the full property address",
            },
            {
                name: "postcode",
                label: "Postcode",
                type: "text",
                required: true,
            },
            {
                name: "propertyType",
                label: "Property type",
                type: "select",
                required: true,
                options: [
                    {
                        value: "detached",
                        label: "Detached",
                    },
                    {
                        value: "semi_detached",
                        label: "Semi-detached",
                    },
                    {
                        value: "terraced",
                        label: "Terraced",
                    },
                    {
                        value: "flat",
                        label: "Flat",
                    },
                    {
                        value: "mixed_use",
                        label: "Mixed-use",
                    },
                    {
                        value: "commercial",
                        label: "Commercial",
                    },
                ],
            },
            {
                name: "bedrooms",
                label: "Bedrooms",
                type: "number",
                required: true,
                minimum: 0,
            },
            {
                name: "bathrooms",
                label: "Bathrooms",
                type: "number",
                required: true,
                minimum: 0,
            },
            {
                name: "tenure",
                label: "Tenure",
                type: "select",
                required: true,
                options: [
                    {
                        value: "freehold",
                        label: "Freehold",
                    },
                    {
                        value: "leasehold",
                        label: "Leasehold",
                    },
                    {
                        value: "share_of_freehold",
                        label: "Share of freehold",
                    },
                    {
                        value: "commonhold",
                        label: "Commonhold",
                    },
                ],
            },
            {
                name: "occupancyStatus",
                label: "Occupancy status",
                type: "select",
                required: true,
                options: [
                    {
                        value: "vacant",
                        label: "Vacant",
                    },
                    {
                        value: "owner_occupied",
                        label: "Owner occupied",
                    },
                    {
                        value: "tenanted",
                        label: "Tenanted",
                    },
                    {
                        value: "partially_occupied",
                        label: "Partially occupied",
                    },
                ],
            },
            {
                name: "estimatedValue",
                label: "Estimated value",
                type: "currency",
                required: true,
                minimum: 0,
            },
        ],
    },
    sale_motivation: {
        stepKey: "sale_motivation",
        description:
            "Help Asancha understand the commercial intent, timeline, and urgency.",
        fields: [
            {
                name: "propertySubmissionIntent",
                label: "Property submission intent",
                type: "select",
                required: true,
                options: [
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
                        value: "valuation",
                        label: "Get valuation guidance",
                    },
                ],
            },
            {
                name: "expectedSaleTimeline",
                label: "Expected sale timeline",
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
                        value: "flexible",
                        label: "Flexible",
                    },
                ],
            },
            {
                name: "sellerMotivation",
                label: "Seller motivation",
                type: "textarea",
                required: true,
                placeholder:
                    "Briefly explain why you are considering this transaction",
            },
            {
                name: "askingPrice",
                label: "Asking price",
                type: "currency",
                required: true,
                minimum: 0,
            },
            {
                name: "priceFlexibility",
                label: "Price flexibility",
                type: "select",
                required: true,
                options: [
                    {
                        value: "fixed",
                        label: "Fixed",
                    },
                    {
                        value: "slightly_flexible",
                        label: "Slightly flexible",
                    },
                    {
                        value: "open_to_offers",
                        label: "Open to offers",
                    },
                ],
            },
            {
                name: "saleUrgency",
                label: "Sale urgency",
                type: "select",
                required: true,
                options: [
                    {
                        value: "low",
                        label: "Low",
                    },
                    {
                        value: "medium",
                        label: "Medium",
                    },
                    {
                        value: "high",
                        label: "High",
                    },
                ],
            },
        ],
    },
    documents_and_proof: {
        stepKey: "documents_and_proof",
        description:
            "Reference uploaded documents and confirm which supporting materials are available.",
        fields: [
            {
                name: "proofOfOwnershipDocumentPublicId",
                label: "Proof of ownership document public ID",
                type: "text",
                required: true,
                placeholder: "Paste the uploaded document public ID",
            },
            {
                name: "propertyPhotosUploaded",
                label: "Property photos uploaded",
                type: "checkbox",
                required: true,
            },
            {
                name: "identityDocumentPublicId",
                label: "Identity document public ID",
                type: "text",
                required: false,
            },
            {
                name: "proofOfAddressDocumentPublicId",
                label: "Proof of address document public ID",
                type: "text",
                required: false,
            },
            {
                name: "floorplanUploaded",
                label: "Floorplan uploaded",
                type: "checkbox",
                required: false,
            },
            {
                name: "epcUploaded",
                label: "EPC uploaded",
                type: "checkbox",
                required: false,
            },
        ],
    },
    policies_and_authority: {
        stepKey: "policies_and_authority",
        description:
            "Accept the required policy and authority declarations before review.",
        fields: [
            {
                name: "acceptedPolicies",
                label: "Required policies accepted",
                type: "multiselect",
                required: true,
                options: [
                    {
                        value: "property_owner_terms",
                        label: "Property owner terms",
                    },
                    {
                        value: "property_submission_rules",
                        label: "Property submission rules",
                    },
                    {
                        value: "authority_declaration",
                        label: "Authority declaration",
                    },
                ],
            },
            {
                name: "authorityDeclarationAccepted",
                label: "I accept the authority declaration",
                type: "checkbox",
                required: true,
            },
            {
                name: "informationAccuracyDeclaration",
                label: "I confirm the information is accurate",
                type: "checkbox",
                required: true,
            },
            {
                name: "permissionToContact",
                label: "I give Asancha permission to contact me",
                type: "checkbox",
                required: true,
            },
        ],
    },
    review_submit: {
        stepKey: "review_submit",
        description:
            "Review your information and confirm you are ready to submit for review.",
        fields: [
            {
                name: "confirmAccuracy",
                label: "I confirm all onboarding information is accurate",
                type: "checkbox",
                required: true,
            },
            {
                name: "submitForReview",
                label: "Submit this property owner profile for review",
                type: "checkbox",
                required: true,
            },
        ],
    },
};

const DEFAULT_STEPS: PropertyOwnerOnboardingStepsResponse = {
    profileType: "property_owner",
    totalSteps: 6,
    currentStep: "owner_profile",
    nextStep: "owner_profile",
    completedSteps: [],
    lockedSteps: [
        "property_details",
        "sale_motivation",
        "documents_and_proof",
        "policies_and_authority",
        "review_submit",
    ],
    steps: [
        {
            stepKey: "owner_profile",
            stepTitle: "Seller / Owner Profile",
            requiredFields: [
                "accountHolderType",
                "ownerType",
                "ownershipCapacity",
                "fullName",
                "preferredContactMethod",
            ],
            optionalFields: [
                "companyPublicId",
                "companyName",
                "companyRegistrationNumber",
                "businessAddress",
                "companyEmail",
                "companyPhone",
                "contactPerson",
            ],
            stepNumber: 1,
            totalSteps: 6,
            completed: false,
            current: true,
            locked: false,
            canEdit: true,
        },
        {
            stepKey: "property_details",
            stepTitle: "Property Details",
            requiredFields: [
                "address",
                "postcode",
                "propertyType",
                "bedrooms",
                "bathrooms",
                "tenure",
                "occupancyStatus",
                "estimatedValue",
            ],
            optionalFields: [],
            stepNumber: 2,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "sale_motivation",
            stepTitle: "Sale Motivation",
            requiredFields: [
                "propertySubmissionIntent",
                "expectedSaleTimeline",
                "sellerMotivation",
                "askingPrice",
                "priceFlexibility",
                "saleUrgency",
            ],
            optionalFields: [],
            stepNumber: 3,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "documents_and_proof",
            stepTitle: "Documents & Proof",
            requiredFields: [
                "proofOfOwnershipDocumentPublicId",
                "propertyPhotosUploaded",
            ],
            optionalFields: [
                "identityDocumentPublicId",
                "proofOfAddressDocumentPublicId",
                "floorplanUploaded",
                "epcUploaded",
            ],
            stepNumber: 4,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "policies_and_authority",
            stepTitle: "Policies & Authority",
            requiredFields: [
                "acceptedPolicies",
                "authorityDeclarationAccepted",
                "informationAccuracyDeclaration",
                "permissionToContact",
            ],
            optionalFields: [],
            stepNumber: 5,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "review_submit",
            stepTitle: "Review & Verify",
            requiredFields: [
                "confirmAccuracy",
                "submitForReview",
            ],
            optionalFields: [],
            stepNumber: 6,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
    ],
};

const SAFE_MESSAGES = {
    loadError:
        "We could not load your property owner onboarding steps. You can still review the first step.",
    lockedStep:
        "This step is locked until the previous onboarding step is accepted by the backend.",
    requiredFields:
        "Complete the required fields before continuing.",
    saved:
        "Your onboarding step has been saved.",
    submitted:
        "Your property owner onboarding has been submitted.",
    saveError:
        "We could not save this onboarding step. Review the fields and try again.",
    submitError:
        "We could not submit your property owner onboarding. Review the fields and try again.",
} as const;

function getInitialValues(): PropertyOwnerFormValues {
    const values: PropertyOwnerFormValues = {};

    for (const step of Object.values(
        STEP_CONFIGS,
    )) {
        for (const field of step.fields) {
            if (field.type === "checkbox") {
                values[field.name] = false;
            } else if (
                field.type === "number" ||
                field.type === "currency"
            ) {
                values[field.name] = null;
            } else if (
                field.type === "multiselect"
            ) {
                values[field.name] = [];
            } else {
                values[field.name] = "";
            }
        }
    }

    return values;
}

function isComplete(
    value: PropertyOwnerFormValue | undefined,
): boolean {
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return Number.isFinite(value);
    }

    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    return false;
}

function formatFieldName(fieldName: string): string {
    return fieldName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) =>
            character.toUpperCase(),
        );
}

function getFieldConfig(
    stepKey: PropertyOwnerStepKey,
    fieldName: string,
    required: boolean,
): FieldConfig {
    const knownField = STEP_CONFIGS[
        stepKey
    ].fields.find(
        (field) => field.name === fieldName,
    );

    if (knownField) {
        return {
            ...knownField,
            required,
        };
    }

    return {
        name: fieldName,
        label: formatFieldName(fieldName),
        type: "text",
        required,
    };
}

function getStepFields(
    step: PropertyOwnerOnboardingStep,
): FieldConfig[] {
    return [
        ...step.requiredFields.map((fieldName) =>
            getFieldConfig(
                step.stepKey,
                fieldName,
                true,
            ),
        ),
        ...step.optionalFields.map((fieldName) =>
            getFieldConfig(
                step.stepKey,
                fieldName,
                false,
            ),
        ),
    ];
}

function getFieldLabel(
    stepKey: PropertyOwnerStepKey,
    fieldName: string,
): string {
    return getFieldConfig(
        stepKey,
        fieldName,
        false,
    ).label;
}

function formatReviewValue(value: unknown): string {
    if (Array.isArray(value)) {
        return value.length > 0
            ? value
                  .map((item) =>
                      typeof item === "string"
                          ? formatFieldName(item)
                          : String(item),
                  )
                  .join(", ")
            : "Not provided";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "number") {
        return new Intl.NumberFormat("en-GB").format(
            value,
        );
    }

    if (typeof value === "string") {
        return value.trim()
            ? value
                  .split("_")
                  .map(formatFieldName)
                  .join(" ")
            : "Not provided";
    }

    return "Not provided";
}

function createReviewSummaryFromValues(
    steps: readonly PropertyOwnerOnboardingStep[],
    values: PropertyOwnerFormValues,
): PropertyOwnerReviewSummaryItem[] {
    return steps
        .filter(
            (step) => step.stepKey !== "review_submit",
        )
        .map((step) => {
            const data: Record<string, unknown> = {};

            for (const field of getStepFields(step)) {
                const value = values[field.name];

                if (isComplete(value)) {
                    data[field.name] = value;
                }
            }

            return {
                stepKey: step.stepKey,
                stepTitle: step.stepTitle,
                stepNumber: step.stepNumber,
                completed: step.completed,
                data,
            };
        });
}

function isPropertyOwnerStepsResponse(
    value: unknown,
): value is PropertyOwnerOnboardingStepsResponse {
    if (!value || typeof value !== "object") {
        return false;
    }

    const response =
        value as Partial<PropertyOwnerOnboardingStepsResponse>;

    return (
        response.profileType === "property_owner" &&
        typeof response.totalSteps === "number" &&
        typeof response.currentStep === "string" &&
        (typeof response.nextStep === "string" ||
            typeof response.nextStep === "undefined") &&
        Array.isArray(response.completedSteps) &&
        Array.isArray(response.lockedSteps) &&
        Array.isArray(response.steps)
    );
}

function isPropertyOwnerStartResponse(
    value: unknown,
): value is PropertyOwnerOnboardingStartResponse {
    if (!value || typeof value !== "object") {
        return false;
    }

    const response =
        value as Partial<PropertyOwnerOnboardingStartResponse>;

    return (
        typeof response.publicId === "string" &&
        response.profileType === "property_owner" &&
        response.businessProfileType ===
            "property_owner" &&
        typeof response.status === "string"
    );
}

function getAllFieldConfigs(): FieldConfig[] {
    return Object.values(STEP_CONFIGS).flatMap(
        (step) => step.fields,
    );
}

function normalizeStoredValue(
    field: FieldConfig,
    value: unknown,
): PropertyOwnerFormValue | undefined {
    if (value === null || typeof value === "undefined") {
        return undefined;
    }

    if (field.type === "checkbox") {
        return typeof value === "boolean"
            ? value
            : undefined;
    }

    if (
        field.type === "number" ||
        field.type === "currency"
    ) {
        if (
            typeof value === "number" &&
            Number.isFinite(value)
        ) {
            return value;
        }

        if (
            typeof value === "string" &&
            value.trim()
        ) {
            const numericValue = Number(value);

            return Number.isFinite(numericValue)
                ? numericValue
                : undefined;
        }

        return undefined;
    }

    if (field.type === "multiselect") {
        return Array.isArray(value)
            ? value.filter(
                  (item): item is string =>
                      typeof item === "string",
              )
            : undefined;
    }

    return typeof value === "string" ? value : undefined;
}

function mergeStoredValues(
    currentValues: PropertyOwnerFormValues,
    storedData: Record<string, unknown>,
): PropertyOwnerFormValues {
    const nextValues = {
        ...currentValues,
    };
    const storedSources = [
        storedData,
        ...Object.values(storedData).filter(
            (
                value,
            ): value is Record<string, unknown> =>
                Boolean(value) &&
                typeof value === "object" &&
                !Array.isArray(value),
        ),
    ];

    for (const field of getAllFieldConfigs()) {
        const storedSource = storedSources.find(
            (source) => field.name in source,
        );

        if (!storedSource) {
            continue;
        }

        const normalizedValue = normalizeStoredValue(
            field,
            storedSource[field.name],
        );

        if (typeof normalizedValue !== "undefined") {
            nextValues[field.name] = normalizedValue;
        }
    }

    return nextValues;
}

function isCloudinaryUploadResponse(
    value: unknown,
): value is CloudinaryUploadResponse {
    if (!value || typeof value !== "object") {
        return false;
    }

    const response =
        value as Partial<CloudinaryUploadResponse>;

    return (
        typeof response.secure_url === "string" &&
        typeof response.public_id === "string" &&
        typeof response.resource_type === "string"
    );
}

function isCloudinaryUploadField(fieldName: string): boolean {
    return (
        CLOUDINARY_URL_VALUE_FIELDS.has(fieldName) ||
        CLOUDINARY_UPLOAD_CONFIRMATION_FIELDS.has(fieldName)
    );
}

function getCloudinaryAcceptType(fieldName: string): string {
    if (
        fieldName === "propertyPhotosUploaded" ||
        fieldName === "floorplanUploaded"
    ) {
        return "image/*";
    }

    return "image/*,application/pdf";
}

export function PropertyOwnerOnboardingForm() {
    const router = useRouter();

    const [stepsResponse, setStepsResponse] =
        useState<PropertyOwnerOnboardingStepsResponse>(
            DEFAULT_STEPS,
        );
    const [values, setValues] =
        useState<PropertyOwnerFormValues>(
            getInitialValues,
        );
    const [activeStepKey, setActiveStepKey] =
        useState<PropertyOwnerStepKey>(
            DEFAULT_STEPS.currentStep,
        );
    const [isLoading, setIsLoading] =
        useState(true);
    const [isSaving, setIsSaving] =
        useState(false);
    const [uploadStates, setUploadStates] =
        useState<UploadStateByField>({});
    const [
        isSubmitConfirmationOpen,
        setIsSubmitConfirmationOpen,
    ] = useState(false);
    const [hasLoadedBackendSteps, setHasLoadedBackendSteps] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);
    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const loadSteps =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);
            setHasLoadedBackendSteps(false);

            try {
                const onboardingStart =
                    await authApiPost<
                        unknown,
                        {
                            profileType: "property_owner";
                        }
                    >("/onboarding/start", {
                        profileType: "property_owner",
                    });

                if (
                    !isPropertyOwnerStartResponse(
                        onboardingStart,
                    )
                ) {
                    throw new Error(
                        "Invalid property owner onboarding start response.",
                    );
                }

                setValues((currentValues) =>
                    mergeStoredValues(
                        currentValues,
                        onboardingStart.data,
                    ),
                );

                const result =
                    await authApiGet<unknown>(
                        "/onboarding/me/property_owner/steps",
                    );

                if (!isPropertyOwnerStepsResponse(result)) {
                    throw new Error(
                        "Invalid property owner onboarding steps response.",
                    );
                }

                setStepsResponse(result);
                setHasLoadedBackendSteps(true);
                setActiveStepKey(
                    result.currentStep ??
                        result.nextStep ??
                        "owner_profile",
                );
            } catch {
                setStepsResponse(DEFAULT_STEPS);
                setActiveStepKey("owner_profile");
                setErrorMessage(
                    SAFE_MESSAGES.loadError,
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void loadSteps();
        });
    }, [loadSteps]);

    const activeStep = useMemo(
        () =>
            stepsResponse.steps.find(
                (step) =>
                    step.stepKey ===
                    activeStepKey,
            ) ?? stepsResponse.steps[0],
        [activeStepKey, stepsResponse.steps],
    );

    const activeStepFields = useMemo(
        () =>
            activeStep
                ? getStepFields(activeStep)
                : [],
        [activeStep],
    );

    const completedRequiredCount =
        activeStepFields.filter(
            (field) =>
                field.required &&
                isComplete(values[field.name]),
        ).length;
    const totalRequiredCount =
        activeStepFields.filter(
            (field) => field.required,
        ).length;
    const progressPercent =
        stepsResponse.totalSteps > 0
            ? Math.round(
                  (stepsResponse.completedSteps
                      .length /
                      stepsResponse.totalSteps) *
                      100,
              )
            : 0;
    const reviewSummary = useMemo(
        () =>
            stepsResponse.reviewSummary?.length
                ? stepsResponse.reviewSummary
                : createReviewSummaryFromValues(
                      stepsResponse.steps,
                      values,
                  ),
        [stepsResponse, values],
    );

    const updateValue = (
        name: string,
        value: PropertyOwnerFormValue,
    ): void => {
        setValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleInputChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ): void => {
        const { name, type } = event.target;

        if (
            type === "checkbox" &&
            event.target instanceof
                HTMLInputElement
        ) {
            updateValue(name, event.target.checked);
            return;
        }

        if (
            type === "number" &&
            event.target instanceof
                HTMLInputElement
        ) {
            updateValue(
                name,
                event.target.value.trim()
                    ? Number(event.target.value)
                    : null,
            );
            return;
        }

        updateValue(name, event.target.value);
    };

    const handleSelectChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        if (event.target.multiple) {
            updateValue(
                event.target.name,
                Array.from(
                    event.target.selectedOptions,
                ).map((option) => option.value),
            );
            return;
        }

        updateValue(
            event.target.name,
            event.target.value,
        );
    };

    const uploadFileToCloudinary = async (
        field: FieldConfig,
        file: File,
    ): Promise<void> => {
        if (!CLOUDINARY_UPLOAD_PRESET) {
            setErrorMessage(
                "Cloudinary upload preset is missing. Add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your environment.",
            );
            setUploadStates((currentStates) => ({
                ...currentStates,
                [field.name]: "error",
            }));
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setUploadStates((currentStates) => ({
            ...currentStates,
            [field.name]: "uploading",
        }));

        try {
            const formData = new FormData();

            formData.set("file", file);
            formData.set(
                "upload_preset",
                CLOUDINARY_UPLOAD_PRESET,
            );
            formData.set(
                "folder",
                "asancha/onboarding/property-owner",
            );

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );
            const responseBody =
                (await response.json()) as unknown;

            if (
                !response.ok ||
                !isCloudinaryUploadResponse(responseBody)
            ) {
                throw new Error(
                    "Cloudinary upload failed.",
                );
            }

            if (
                CLOUDINARY_UPLOAD_CONFIRMATION_FIELDS.has(
                    field.name,
                )
            ) {
                updateValue(field.name, true);
            } else {
                updateValue(
                    field.name,
                    responseBody.secure_url,
                );
            }

            setUploadStates((currentStates) => ({
                ...currentStates,
                [field.name]: "uploaded",
            }));
        } catch {
            setErrorMessage(
                "We could not upload that file. Try again or choose a different file.",
            );
            setUploadStates((currentStates) => ({
                ...currentStates,
                [field.name]: "error",
            }));
        }
    };

    const validateActiveStep = (): boolean => {
        const missingFields = activeStepFields
            .filter((field) => field.required)
            .filter(
                (field) =>
                    !isComplete(values[field.name]),
            )
            .map((field) => field.label);

        if (missingFields.length > 0) {
            setErrorMessage(
                `${SAFE_MESSAGES.requiredFields} Missing: ${missingFields.join(
                    ", ",
                )}.`,
            );
            return false;
        }

        return true;
    };

    const createStepPayload = (
        fields: readonly FieldConfig[],
    ): PropertyOwnerFormValues => {
        const payload: PropertyOwnerFormValues = {};
        const isCompanyAccount =
            values.accountHolderType === "company";

        for (const field of fields) {
            if (
                !isCompanyAccount &&
                COMPANY_OWNER_PROFILE_FIELDS.has(
                    field.name,
                )
            ) {
                continue;
            }

            const value = values[field.name];

            if (typeof value === "string") {
                const trimmedValue = value.trim();

                if (!field.required && !trimmedValue) {
                    continue;
                }

                payload[field.name] = trimmedValue;
                continue;
            }

            if (
                Array.isArray(value) &&
                !field.required &&
                value.length === 0
            ) {
                continue;
            }

            if (
                value === null ||
                typeof value === "undefined"
            ) {
                if (field.required) {
                    payload[field.name] = null;
                }

                continue;
            }

            payload[field.name] = value;
        }

        return payload;
    };

    const saveActiveStep =
        async (): Promise<boolean> => {
            if (!activeStep) {
                return false;
            }

            if (!hasLoadedBackendSteps) {
                setErrorMessage(
                    "Property owner onboarding steps must load from the backend before saving. Refresh the steps and try again.",
                );

                return false;
            }

            setIsSaving(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            try {
                const savedSteps =
                    await authApiPut<
                    PropertyOwnerOnboardingStepsResponse,
                    PropertyOwnerFormValues
                >(
                    `/onboarding/me/property_owner/steps/${activeStep.stepKey}`,
                    createStepPayload(
                        activeStepFields,
                    ),
                );

                setSuccessMessage(
                    SAFE_MESSAGES.saved,
                );

                setStepsResponse(savedSteps);
                setHasLoadedBackendSteps(true);
                setActiveStepKey(
                    savedSteps.currentStep ??
                        savedSteps.nextStep ??
                        activeStep.stepKey,
                );

                return true;
            } catch {
                setErrorMessage(
                    SAFE_MESSAGES.saveError,
                );

                return false;
            } finally {
                setIsSaving(false);
            }
        };

    const submitPropertyOwnerOnboarding =
        async (): Promise<void> => {
            setIsSaving(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            try {
                await authApiPost<
                    unknown,
                    {
                        confirmAccuracy: true;
                        submitForReview: true;
                    }
                >(
                    "/onboarding/me/property_owner/submit",
                    {
                        confirmAccuracy: true,
                        submitForReview: true,
                    },
                );

                setSuccessMessage(
                    SAFE_MESSAGES.submitted,
                );
                router.replace(
                    "/dashboard/property-owner",
                );
                router.refresh();
            } catch {
                setErrorMessage(
                    SAFE_MESSAGES.submitError,
                );
            } finally {
                setIsSaving(false);
            }
        };

    const handleFormSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!activeStep || activeStep.locked) {
            setErrorMessage(SAFE_MESSAGES.lockedStep);
            return;
        }

        if (activeStep.stepKey === "review_submit") {
            setIsSubmitConfirmationOpen(true);
            return;
        }

        if (!validateActiveStep()) {
            return;
        }

        await saveActiveStep();
    };

    const renderReviewSummary = (): ReactNode => {
        return (
            <div className="grid gap-5">
                {reviewSummary.map((summaryItem) => (
                    <section
                        key={summaryItem.stepKey}
                        className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-5"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                                    Step{" "}
                                    {summaryItem.stepNumber}
                                </p>
                                <h3 className="mt-1 text-base font-bold">
                                    {summaryItem.stepTitle}
                                </h3>
                            </div>

                            <span className="inline-flex w-fit rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">
                                {summaryItem.completed
                                    ? "Completed"
                                    : "Pending"}
                            </span>
                        </div>

                        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                            {Object.entries(
                                summaryItem.data,
                            ).length > 0 ? (
                                Object.entries(
                                    summaryItem.data,
                                ).map(
                                    ([
                                        fieldName,
                                        fieldValue,
                                    ]) => {
                                        const isLink =
                                            typeof fieldValue ===
                                                "string" &&
                                            fieldValue.startsWith(
                                                "http",
                                            );

                                        return (
                                            <div
                                                key={fieldName}
                                                className="rounded-[var(--asancha-radius-sm)] bg-[var(--muted)] p-3"
                                            >
                                                <dt className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
                                                    {getFieldLabel(
                                                        summaryItem.stepKey,
                                                        fieldName,
                                                    )}
                                                </dt>
                                                <dd className="mt-1 break-words text-sm font-semibold">
                                                    {isLink ? (
                                                        <a
                                                            href={
                                                                fieldValue
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                                                        >
                                                            View file
                                                        </a>
                                                    ) : (
                                                        formatReviewValue(
                                                            fieldValue,
                                                        )
                                                    )}
                                                </dd>
                                            </div>
                                        );
                                    },
                                )
                            ) : (
                                <div className="rounded-[var(--asancha-radius-sm)] bg-[var(--muted)] p-3 text-sm text-[var(--muted-foreground)] sm:col-span-2">
                                    No details were provided for
                                    this step.
                                </div>
                            )}
                        </dl>
                    </section>
                ))}
            </div>
        );
    };

    const renderField = (
        field: FieldConfig,
    ): ReactNode => {
        const fieldId = `property-owner-${field.name}`;
        const value = values[field.name];
        const disabled =
            isLoading ||
            isSaving ||
            !hasLoadedBackendSteps ||
            Boolean(activeStep?.locked) ||
            !activeStep?.canEdit;
        const inputClassName =
            "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-60";

        if (
            activeStep?.stepKey ===
                "documents_and_proof" &&
            isCloudinaryUploadField(field.name)
        ) {
            const uploadStatus =
                uploadStates[field.name] ?? "idle";
            const hasUploadedValue =
                typeof value === "string"
                    ? value.trim().length > 0
                    : value === true;

            return (
                <div
                    key={field.name}
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-4"
                >
                    <label
                        htmlFor={fieldId}
                        className="block text-sm font-semibold text-[var(--foreground)]"
                    >
                        {field.required ? (
                            <span
                                aria-hidden="true"
                                className="mr-1 text-[var(--destructive)]"
                            >
                                *
                            </span>
                        ) : null}
                        {field.label}
                    </label>

                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                        Add a clear file so our review
                        team can verify this part of your
                        property submission.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            id={fieldId}
                            type="file"
                            accept={getCloudinaryAcceptType(
                                field.name,
                            )}
                            disabled={
                                disabled ||
                                uploadStatus ===
                                    "uploading"
                            }
                            onChange={(event) => {
                                const file =
                                    event.target.files?.[0];

                                if (file) {
                                    void uploadFileToCloudinary(
                                        field,
                                        file,
                                    );
                                }

                                event.target.value = "";
                            }}
                            className="block w-full text-sm file:mr-4 file:min-h-10 file:rounded-[var(--asancha-radius-md)] file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--background)] hover:file:bg-[var(--foreground)]/80 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <span className="inline-flex min-h-10 items-center gap-2 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)]">
                            <UploadCloud
                                aria-hidden="true"
                                className="size-4"
                            />
                            {uploadStatus === "uploading"
                                ? "Uploading..."
                                : hasUploadedValue
                                  ? "Uploaded"
                                  : "Awaiting file"}
                        </span>
                    </div>

                    {typeof value === "string" &&
                    value.trim() ? (
                        <a
                            href={value}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                        >
                            View uploaded file
                        </a>
                    ) : null}
                </div>
            );
        }

        if (field.type === "checkbox") {
            return (
                <label
                    key={field.name}
                    htmlFor={fieldId}
                    className="flex min-h-16 cursor-pointer items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-4 text-sm transition hover:border-[var(--primary)]/40 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
                >
                    <input
                        id={fieldId}
                        name={field.name}
                        type="checkbox"
                        checked={value === true}
                        required={field.required}
                        disabled={disabled}
                        onChange={handleInputChange}
                        className="mt-1 size-4 accent-[var(--primary)]"
                    />

                    <span>
                        <span className="block font-semibold">
                            {field.required ? (
                                <span
                                    aria-hidden="true"
                                    className="mr-1 text-[var(--destructive)]"
                                >
                                    *
                                </span>
                            ) : null}
                            {field.label}
                        </span>

                        {field.description ? (
                            <span className="mt-1 block leading-6 text-[var(--muted-foreground)]">
                                {field.description}
                            </span>
                        ) : null}
                    </span>
                </label>
            );
        }

        return (
            <div key={field.name}>
                <label
                    htmlFor={fieldId}
                    className="block text-sm font-semibold text-[var(--foreground)]"
                >
                    {field.required ? (
                        <span
                            aria-hidden="true"
                            className="mr-1 text-[var(--destructive)]"
                        >
                            *
                        </span>
                    ) : null}
                    {field.label}
                </label>

                {field.description ? (
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                        {field.description}
                    </p>
                ) : null}

                {field.type === "textarea" ? (
                    <textarea
                        id={fieldId}
                        name={field.name}
                        required={field.required}
                        disabled={disabled}
                        rows={4}
                        value={
                            typeof value === "string"
                                ? value
                                : ""
                        }
                        placeholder={field.placeholder}
                        onChange={handleInputChange}
                        className={`${inputClassName} resize-y`}
                    />
                ) : field.type === "select" ||
                  field.type === "multiselect" ? (
                    <select
                        id={fieldId}
                        name={field.name}
                        required={field.required}
                        multiple={
                            field.type === "multiselect"
                        }
                        disabled={disabled}
                        value={
                            field.type === "multiselect"
                                ? Array.isArray(value)
                                    ? value
                                    : []
                                : typeof value === "string"
                                  ? value
                                  : ""
                        }
                        onChange={handleSelectChange}
                        className={`${inputClassName} ${
                            field.type === "multiselect"
                                ? "min-h-32"
                                : ""
                        }`}
                    >
                        {field.type === "select" ? (
                            <option value="">
                                Select an option
                            </option>
                        ) : null}

                        {field.options?.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={fieldId}
                        name={field.name}
                        type={
                            field.type === "currency"
                                ? "number"
                                : field.type
                        }
                        required={field.required}
                        min={field.minimum}
                        disabled={disabled}
                        value={
                            typeof value === "number" ||
                            typeof value === "string"
                                ? value
                                : ""
                        }
                        placeholder={field.placeholder}
                        onChange={handleInputChange}
                        className={inputClassName}
                    />
                )}
            </div>
        );
    };

    if (!activeStep) {
        return (
            <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    Property owner onboarding is not
                    available.
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[var(--background)]">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:px-8 lg:py-10">
                <aside className="self-start rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm lg:sticky lg:top-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                                Property owner onboarding
                            </p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight">
                                Complete your owner setup
                            </h1>
                        </div>

                        <FileCheck2
                            aria-hidden="true"
                            className="size-6 text-[var(--primary)]"
                        />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        Work through each backend-controlled
                        step before your property owner
                        profile is ready for review.
                    </p>

                    <div className="mt-5">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                            <span>Backend progress</span>
                            <span>{progressPercent}%</span>
                        </div>

                        <div
                            aria-label="Property owner onboarding progress"
                            aria-valuemax={100}
                            aria-valuemin={0}
                            aria-valuenow={progressPercent}
                            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--muted)]"
                            role="progressbar"
                        >
                            <div
                                className="h-full rounded-full bg-[var(--primary)] transition-[width]"
                                style={{
                                    width: `${progressPercent}%`,
                                }}
                            />
                        </div>
                    </div>

                    <ol className="mt-6 grid gap-2">
                        {stepsResponse.steps.map((step) => {
                            const active =
                                step.stepKey ===
                                activeStep.stepKey;
                            const Icon = step.completed
                                ? Check
                                : step.locked
                                  ? Lock
                                  : Circle;

                            return (
                                <li key={step.stepKey}>
                                    <button
                                        type="button"
                                        disabled={
                                            step.locked &&
                                            !step.current
                                        }
                                        onClick={() => {
                                            setActiveStepKey(
                                                step.stepKey,
                                            );
                                            setSuccessMessage(
                                                null,
                                            );
                                            setErrorMessage(
                                                step.locked
                                                    ? SAFE_MESSAGES.lockedStep
                                                    : null,
                                            );
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-[var(--asancha-radius-md)] px-3 py-3 text-left text-sm transition ${
                                            active
                                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                        } disabled:cursor-not-allowed disabled:opacity-55`}
                                    >
                                        <span
                                            className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full border ${
                                                active
                                                    ? "border-[var(--primary-foreground)]"
                                                    : "border-[var(--border)]"
                                            }`}
                                        >
                                            <Icon
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block font-semibold">
                                                {
                                                    step.stepTitle
                                                }
                                            </span>
                                            <span className="mt-0.5 block text-xs opacity-80">
                                                Step{" "}
                                                {
                                                    step.stepNumber
                                                }{" "}
                                                of{" "}
                                                {
                                                    step.totalSteps
                                                }
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </aside>

                <form
                    onSubmit={handleFormSubmit}
                    className="min-w-0"
                >
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <header className="border-b border-[var(--border)] p-5 sm:p-7">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--primary)]">
                                        Step{" "}
                                        {
                                            activeStep.stepNumber
                                        }{" "}
                                        of{" "}
                                        {
                                            activeStep.totalSteps
                                        }
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                                        {
                                            activeStep.stepTitle
                                        }
                                    </h2>

                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                                        {
                                            STEP_CONFIGS[
                                                activeStep
                                                    .stepKey
                                            ].description
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        void loadSteps();
                                    }}
                                    disabled={
                                        isLoading ||
                                        isSaving
                                    }
                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                                >
                                    <RefreshCw
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    Refresh steps
                                </button>
                            </div>

                            <div className="mt-5 grid gap-3 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm sm:grid-cols-3">
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                                        Required
                                    </span>
                                    <strong>
                                        {
                                            completedRequiredCount
                                        }
                                        /
                                        {
                                            totalRequiredCount
                                        }{" "}
                                        complete
                                    </strong>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                                        Status
                                    </span>
                                    <strong>
                                        {activeStep.locked
                                            ? "Locked"
                                            : activeStep.completed
                                              ? "Completed"
                                              : "Editable"}
                                    </strong>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                                        Current backend step
                                    </span>
                                    <strong>
                                        {
                                            stepsResponse.currentStep
                                        }
                                    </strong>
                                </div>
                            </div>
                        </header>

                        <div className="grid gap-6 p-5 sm:p-7">
                            {isLoading ? (
                                <div
                                    role="status"
                                    className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]"
                                >
                                    Loading property owner
                                    onboarding steps…
                                </div>
                            ) : null}

                            {errorMessage ? (
                                <div
                                    role="alert"
                                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[color-mix(in_srgb,var(--destructive)_6%,var(--card))] p-4 text-sm leading-6 text-[var(--destructive)]"
                                >
                                    {errorMessage}
                                </div>
                            ) : null}

                            {successMessage ? (
                                <div
                                    role="status"
                                    className="rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] bg-[color-mix(in_srgb,var(--secondary)_8%,var(--card))] p-4 text-sm leading-6"
                                >
                                    {successMessage}
                                </div>
                            ) : null}

                            {activeStep.locked ? (
                                <div className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-5">
                                    <div className="flex items-start gap-3">
                                        <Lock
                                            aria-hidden="true"
                                            className="mt-0.5 size-5 text-[var(--muted-foreground)]"
                                        />
                                        <div>
                                            <h3 className="font-bold">
                                                Step locked
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                                The backend has
                                                locked this step.
                                                Complete and save
                                                the previous step
                                                first.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {activeStep.stepKey ===
                            "review_submit" ? (
                                renderReviewSummary()
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2">
                                    {activeStepFields.map(
                                        renderField,
                                    )}
                                </div>
                            )}
                        </div>

                        <footer className="flex flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                            <button
                                type="button"
                                disabled={
                                activeStep.stepNumber ===
                                    1 ||
                                isSaving
                                }
                                onClick={() => {
                                    const previousStep =
                                        stepsResponse.steps.find(
                                            (step) =>
                                                step.stepNumber ===
                                                activeStep.stepNumber -
                                                    1,
                                        );

                                    if (previousStep) {
                                        setActiveStepKey(
                                            previousStep.stepKey,
                                        );
                                    }
                                }}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ChevronLeft
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Previous
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    isSaving ||
                                    !hasLoadedBackendSteps ||
                                    activeStep.locked ||
                                    !activeStep.canEdit
                                }
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving
                                    ? "Saving..."
                                    : activeStep.stepNumber ===
                                        activeStep.totalSteps
                                      ? "Submit review"
                                      : "Save step"}
                                <ChevronRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </button>
                        </footer>
                    </section>
                </form>
            </div>

            {isSubmitConfirmationOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6"
                    role="presentation"
                >
                    <section
                        aria-labelledby="property-owner-submit-confirmation-title"
                        aria-modal="true"
                        className="w-full max-w-md rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
                        role="dialog"
                    >
                        <h2
                            id="property-owner-submit-confirmation-title"
                            className="text-xl font-bold"
                        >
                            Submit for review?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                            Once submitted, your property
                            owner profile will be sent for
                            review. You can go back now if
                            you need to change anything.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                    setIsSubmitConfirmationOpen(
                                        false,
                                    );
                                }}
                                className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] px-5 py-2 text-sm font-semibold hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Go back
                            </button>

                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                    setIsSubmitConfirmationOpen(
                                        false,
                                    );
                                    void submitPropertyOwnerOnboarding();
                                }}
                                className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving
                                    ? "Submitting..."
                                    : "Submit for review"}
                            </button>
                        </div>
                    </section>
                </div>
            ) : null}
        </main>
    );
}
