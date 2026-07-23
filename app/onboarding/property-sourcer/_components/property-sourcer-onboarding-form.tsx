"use client";

// File: app/onboarding/property-sourcer/_components/property-sourcer-onboarding-form.tsx

import { useRouter } from "next/navigation";
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
    PROPERTY_SOURCER_ONBOARDING_FLOW,
} from "../../_config/role-onboarding-flows";
import {
    getRoleStepSaveEndpoint,
    getRoleStepsEndpoint,
    getRoleSubmitEndpoint,
    type RoleOnboardingSubmitPayload,
} from "../../_lib/role-onboarding-flow";
import {
    authApiGet,
    authApiPost,
    authApiPut,
} from "../../../../src/lib/api/auth-fetch";

type PropertySourcerStepKey =
    | "sourcer_profile"
    | "coverage_specialisation"
    | "deal_criteria"
    | "verification"
    | "commercial_setup"
    | "listing_standards";

type FieldValue =
    | string
    | number
    | boolean
    | string[]
    | null;

type FormValues = Record<string, FieldValue>;
type UploadStatus =
    | "idle"
    | "uploading"
    | "uploaded"
    | "error";

type FieldType =
    | "checkbox"
    | "email"
    | "multiselect"
    | "number"
    | "select"
    | "tel"
    | "text"
    | "textarea"
    | "url"
    | "upload";

interface StepResponse {
    profileType: "property_sourcer";
    totalSteps: number;
    currentStep: PropertySourcerStepKey;
    nextStep?: PropertySourcerStepKey;
    completedSteps: PropertySourcerStepKey[];
    lockedSteps: PropertySourcerStepKey[];
    steps: StepMeta[];
    reviewSummary?: ReviewSummaryItem[];
}

interface StepMeta {
    stepKey: PropertySourcerStepKey;
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

interface StartResponse {
    profileType: "property_sourcer";
    businessProfileType: "property_sourcer";
    status: string;
    verificationStatus: string;
    currentStep?: PropertySourcerStepKey;
    data: Record<string, unknown>;
}

interface ReviewSummaryItem {
    stepKey: PropertySourcerStepKey;
    stepTitle: string;
    stepNumber: number;
    completed: boolean;
    data: Record<string, unknown>;
}

interface FieldOption {
    value: string;
    label: string;
}

interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    mustBeTrue?: boolean;
    options?: readonly FieldOption[];
    placeholder?: string;
}

interface StepConfig {
    stepKey: PropertySourcerStepKey;
    description: string;
    fields: readonly FieldConfig[];
}

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    resource_type: string;
}

const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ??
    "dgrrexhst";
const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ??
    "";

const STEP_CONFIGS: Record<PropertySourcerStepKey, StepConfig> = {
    sourcer_profile: {
        stepKey: "sourcer_profile",
        description:
            "Tell us how your sourcing profile should be represented on Asancha.",
        fields: [
            {
                name: "accountHolderType",
                label: "Account holder type",
                type: "select",
                required: true,
                options: [
                    { value: "individual", label: "Individual" },
                    { value: "company", label: "Company" },
                ],
            },
            {
                name: "experienceLevel",
                label: "Experience level",
                type: "select",
                required: true,
                options: [
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "experienced", label: "Experienced" },
                    { value: "professional", label: "Professional" },
                ],
            },
            {
                name: "tradingName",
                label: "Trading name",
                type: "text",
                required: true,
            },
            {
                name: "publicName",
                label: "Public name",
                type: "text",
                required: true,
            },
            {
                name: "yearsSourcing",
                label: "Years sourcing",
                type: "number",
                required: true,
            },
            {
                name: "shortBio",
                label: "Short bio",
                type: "textarea",
                required: true,
            },
        ],
    },
    coverage_specialisation: {
        stepKey: "coverage_specialisation",
        description:
            "Define where you source, the property types you handle, and your main sourcing focus.",
        fields: [
            {
                name: "coverageAreas",
                label: "Coverage areas",
                type: "textarea",
                required: true,
                placeholder: "Manchester, Liverpool, Leeds",
            },
            {
                name: "propertyTypes",
                label: "Property types",
                type: "multiselect",
                required: true,
                options: [
                    { value: "terraced_house", label: "Terraced house" },
                    { value: "flats", label: "Flats" },
                    { value: "semi_detached", label: "Semi-detached" },
                    { value: "maisonette", label: "Maisonette" },
                    { value: "commercial", label: "Commercial" },
                ],
            },
            {
                name: "dealTypes",
                label: "Deal types",
                type: "multiselect",
                required: true,
                options: [
                    { value: "bmv", label: "BMV" },
                    { value: "buy_to_let", label: "Buy to let" },
                    { value: "refurb", label: "Refurb" },
                    { value: "portfolio", label: "Portfolio" },
                    { value: "development", label: "Development" },
                ],
            },
            {
                name: "mainSourcingFocus",
                label: "Main sourcing focus",
                type: "select",
                required: true,
                options: [
                    {
                        value: "below_market_value_residential",
                        label: "Below market value residential",
                    },
                    { value: "buy_to_let", label: "Buy to let" },
                    { value: "refurbishment", label: "Refurbishment" },
                    { value: "portfolio_sales", label: "Portfolio sales" },
                    { value: "off_market", label: "Off-market deals" },
                ],
            },
        ],
    },
    deal_criteria: {
        stepKey: "deal_criteria",
        description:
            "Set typical deal pricing, occupancy, refurb, and investor-outcome expectations.",
        fields: [
            { name: "typicalDealPriceMin", label: "Minimum typical deal price", type: "number", required: true },
            { name: "typicalDealPriceMax", label: "Maximum typical deal price", type: "number", required: true },
            { name: "typicalDealPriceCurrency", label: "Deal price currency", type: "select", required: true, options: [
                { value: "GBP", label: "GBP" },
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
            ] },
            { name: "occupancyPreference", label: "Occupancy preference", type: "select", required: true, options: [
                { value: "vacant_or_tenanted", label: "Vacant or tenanted" },
                { value: "vacant", label: "Vacant" },
                { value: "tenanted", label: "Tenanted" },
            ] },
            { name: "refurbLevelFocus", label: "Refurb level focus", type: "select", required: true, options: [
                { value: "none", label: "None" },
                { value: "light_refurb", label: "Light refurb" },
                { value: "light_to_medium_refurb", label: "Light to medium refurb" },
                { value: "medium_refurb", label: "Medium refurb" },
                { value: "heavy_refurb", label: "Heavy refurb" },
            ] },
            { name: "typicalInvestorOutcome", label: "Typical investor outcome", type: "select", required: true, options: [
                { value: "rental_income", label: "Rental income" },
                { value: "capital_growth", label: "Capital growth" },
                {
                    value: "rental_yield_and_capital_growth",
                    label: "Rental yield and capital growth",
                },
                { value: "bmv_discount", label: "BMV discount" },
                { value: "flip_profit", label: "Flip profit" },
            ] },
            { name: "minimumExpectedGrossYield", label: "Minimum expected gross yield", type: "number", required: true },
        ],
    },
    verification: {
        stepKey: "verification",
        description:
            "Provide identity and business evidence required for review.",
        fields: [
            { name: "governmentIdDocumentPublicId", label: "Government ID document", type: "upload", required: true },
            { name: "complianceDeclarationAccepted", label: "I accept the compliance declaration", type: "checkbox", required: true, mustBeTrue: true },
            { name: "companyRegistrationNumber", label: "Company registration number", type: "text", required: false },
            { name: "companyRegistrationDocumentPublicId", label: "Company registration document", type: "upload", required: false },
            { name: "proofOfBusinessIdentityDocumentPublicId", label: "Proof of business identity document", type: "upload", required: false },
        ],
    },
    commercial_setup: {
        stepKey: "commercial_setup",
        description:
            "Set your fee model, payout details, and billing contact.",
        fields: [
            { name: "feeModel", label: "Fee model", type: "select", required: true, options: [
                { value: "fixed_sourcing_fee", label: "Fixed sourcing fee" },
                { value: "percentage", label: "Percentage" },
                { value: "success_fee", label: "Success fee" },
                { value: "hybrid", label: "Hybrid" },
            ] },
            { name: "typicalFeeMin", label: "Minimum typical fee", type: "number", required: true },
            { name: "typicalFeeMax", label: "Maximum typical fee", type: "number", required: true },
            { name: "typicalFeeCurrency", label: "Fee currency", type: "select", required: true, options: [
                { value: "GBP", label: "GBP" },
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
            ] },
            { name: "payoutAccountName", label: "Payout account name", type: "text", required: true },
            { name: "payoutBankName", label: "Payout bank name", type: "text", required: true },
            { name: "payoutSortCode", label: "Payout sort code", type: "text", required: true },
            { name: "payoutAccountNumberLast4", label: "Payout account number last 4", type: "text", required: true },
            { name: "billingContactName", label: "Billing contact name", type: "text", required: true },
            { name: "billingContactEmail", label: "Billing contact email", type: "email", required: true },
            { name: "billingContactPhone", label: "Billing contact phone", type: "tel", required: true },
        ],
    },
    listing_standards: {
        stepKey: "listing_standards",
        description:
            "Confirm your deal standards and submit your profile for review.",
        fields: [
            { name: "onlyGenuineDealsConfirmed", label: "I will only submit genuine deals", type: "checkbox", required: true, mustBeTrue: true },
            { name: "authorisedDealsOnlyConfirmed", label: "I will only submit authorised deals", type: "checkbox", required: true, mustBeTrue: true },
            { name: "listingStandardsAccepted", label: "I accept the listing standards", type: "checkbox", required: true, mustBeTrue: true },
            { name: "sourcerComplianceDeclarationAccepted", label: "I accept the sourcer compliance declaration", type: "checkbox", required: true, mustBeTrue: true },
            { name: "submitFirstDealLater", label: "Submit first deal later", type: "checkbox", required: true },
        ],
    },
};

const DEFAULT_STEPS: StepResponse = {
    profileType: "property_sourcer",
    totalSteps: 6,
    currentStep: "sourcer_profile",
    nextStep: "sourcer_profile",
    completedSteps: [],
    lockedSteps: [
        "coverage_specialisation",
        "deal_criteria",
        "verification",
        "commercial_setup",
        "listing_standards",
    ],
    steps: [
        {
            stepKey: "sourcer_profile",
            stepTitle: "Sourcer Profile",
            requiredFields: [
                "accountHolderType",
                "tradingName",
                "publicName",
                "experienceLevel",
                "yearsSourcing",
                "shortBio",
            ],
            optionalFields: [],
            stepNumber: 1,
            totalSteps: 6,
            completed: false,
            current: true,
            locked: false,
            canEdit: true,
        },
        {
            stepKey: "coverage_specialisation",
            stepTitle: "Coverage & Specialisation",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 2,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "deal_criteria",
            stepTitle: "Deal Criteria",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 3,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "verification",
            stepTitle: "Verification",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 4,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "commercial_setup",
            stepTitle: "Commercial Setup",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 5,
            totalSteps: 6,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "listing_standards",
            stepTitle: "Listing Standards",
            requiredFields: [],
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

function getInitialValues(): FormValues {
    const values: FormValues = {};

    Object.values(STEP_CONFIGS).forEach((step) => {
        step.fields.forEach((field) => {
            if (field.type === "checkbox") {
                values[field.name] = false;
            } else if (field.type === "multiselect") {
                values[field.name] = [];
            } else {
                values[field.name] = "";
            }
        });
    });

    values.typicalDealPriceCurrency = "GBP";
    values.typicalFeeCurrency = "GBP";

    return values;
}

function isComplete(value: FieldValue | undefined): boolean {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "boolean") return true;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "string") return value.trim().length > 0;
    return false;
}

function formatFieldName(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) => character.toUpperCase());
}

function formatValue(value: unknown): string {
    if (Array.isArray(value)) {
        return value.map((item) => String(item)).join(", ");
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object" && value !== null) {
        return Object.values(value)
            .filter(Boolean)
            .join(", ");
    }

    return typeof value === "string" && value.startsWith("http")
        ? "View file"
        : String(value ?? "Not provided");
}

function splitCommaList(value: FieldValue | undefined): string[] {
    if (Array.isArray(value)) return value;

    if (typeof value !== "string") return [];

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function isStepResponse(value: unknown): value is StepResponse {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        (value as StepResponse).profileType === "property_sourcer" &&
        Array.isArray((value as StepResponse).steps)
    );
}

function isStartResponse(value: unknown): value is StartResponse {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        (value as StartResponse).profileType === "property_sourcer"
    );
}

function isCloudinaryUploadResponse(
    value: unknown,
): value is CloudinaryUploadResponse {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        typeof (value as CloudinaryUploadResponse).secure_url === "string"
    );
}

function mergeStoredValues(
    currentValues: FormValues,
    storedData: Record<string, unknown>,
): FormValues {
    const nextValues = { ...currentValues };
    const sources = [
        storedData,
        ...Object.values(storedData).filter(
            (value): value is Record<string, unknown> =>
                Boolean(value) &&
                typeof value === "object" &&
                !Array.isArray(value),
        ),
    ];

    sources.forEach((source) => {
        Object.entries(source).forEach(([key, value]) => {
            if (
                key === "typicalDealPriceRange" &&
                value &&
                typeof value === "object"
            ) {
                const priceRange = value as Record<string, unknown>;
                nextValues.typicalDealPriceMin =
                    typeof priceRange.min === "number"
                        ? priceRange.min
                        : "";
                nextValues.typicalDealPriceMax =
                    typeof priceRange.max === "number"
                        ? priceRange.max
                        : "";
                nextValues.typicalDealPriceCurrency =
                    typeof priceRange.currency === "string"
                        ? priceRange.currency
                        : "GBP";
                return;
            }

            if (
                key === "typicalFeeRange" &&
                value &&
                typeof value === "object"
            ) {
                const feeRange = value as Record<string, unknown>;
                nextValues.typicalFeeMin =
                    typeof feeRange.min === "number"
                        ? feeRange.min
                        : "";
                nextValues.typicalFeeMax =
                    typeof feeRange.max === "number"
                        ? feeRange.max
                        : "";
                nextValues.typicalFeeCurrency =
                    typeof feeRange.currency === "string"
                        ? feeRange.currency
                        : "GBP";
                return;
            }

            if (key === "payoutDetails" && value && typeof value === "object") {
                const payout = value as Record<string, unknown>;
                nextValues.payoutAccountName =
                    typeof payout.accountName === "string"
                        ? payout.accountName
                        : "";
                nextValues.payoutBankName =
                    typeof payout.bankName === "string" ? payout.bankName : "";
                nextValues.payoutSortCode =
                    typeof payout.sortCode === "string" ? payout.sortCode : "";
                nextValues.payoutAccountNumberLast4 =
                    typeof payout.accountNumberLast4 === "string"
                        ? payout.accountNumberLast4
                        : "";
                return;
            }

            if (key === "billingContact" && value && typeof value === "object") {
                const billing = value as Record<string, unknown>;
                nextValues.billingContactName =
                    typeof billing.name === "string" ? billing.name : "";
                nextValues.billingContactEmail =
                    typeof billing.email === "string" ? billing.email : "";
                nextValues.billingContactPhone =
                    typeof billing.phoneNumber === "string"
                        ? billing.phoneNumber
                        : "";
                return;
            }

            if (key in nextValues) {
                if (
                    typeof value === "string" ||
                    typeof value === "boolean" ||
                    typeof value === "number" ||
                    Array.isArray(value)
                ) {
                    nextValues[key] = value as FieldValue;
                }
            }
        });
    });

    return nextValues;
}

export function PropertySourcerOnboardingForm() {
    const router = useRouter();
    const [stepsResponse, setStepsResponse] = useState(DEFAULT_STEPS);
    const [values, setValues] = useState<FormValues>(getInitialValues);
    const [activeStepKey, setActiveStepKey] =
        useState<PropertySourcerStepKey>(DEFAULT_STEPS.currentStep);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasLoadedSteps, setHasLoadedSteps] = useState(false);
    const [uploadStates, setUploadStates] = useState<
        Record<string, UploadStatus>
    >({});
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);
    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);
    const [
        isSubmitConfirmationOpen,
        setIsSubmitConfirmationOpen,
    ] = useState(false);

    const loadSteps = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        setHasLoadedSteps(false);

        try {
            const start = await authApiPost<
                unknown,
                { profileType: "property_sourcer" }
            >("/onboarding/start", {
                profileType: PROPERTY_SOURCER_ONBOARDING_FLOW.profileType,
            });

            if (!isStartResponse(start)) {
                throw new Error("Invalid property sourcer onboarding start response.");
            }

            setValues((current) => mergeStoredValues(current, start.data));

            const steps = await authApiGet<unknown>(
                getRoleStepsEndpoint(PROPERTY_SOURCER_ONBOARDING_FLOW),
            );

            if (!isStepResponse(steps)) {
                throw new Error("Invalid property sourcer onboarding steps response.");
            }

            setStepsResponse(steps);
            setHasLoadedSteps(true);
            setActiveStepKey(
                steps.currentStep ?? steps.nextStep ?? "sourcer_profile",
            );
        } catch {
            setStepsResponse(DEFAULT_STEPS);
            setActiveStepKey("sourcer_profile");
            setErrorMessage(
                "We could not load your property sourcer onboarding steps.",
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

    const activeStep =
        stepsResponse.steps.find((step) => step.stepKey === activeStepKey) ??
        stepsResponse.steps[0];
    const activeFields = STEP_CONFIGS[activeStep.stepKey].fields;
    const reviewSummary = useMemo(() => {
        if (stepsResponse.reviewSummary?.length) {
            return stepsResponse.reviewSummary;
        }

        return stepsResponse.steps
            .filter((step) => step.stepKey !== "listing_standards")
            .map((step) => ({
                stepKey: step.stepKey,
                stepTitle: step.stepTitle,
                stepNumber: step.stepNumber,
                completed: step.completed,
                data: Object.fromEntries(
                    STEP_CONFIGS[step.stepKey].fields
                        .filter((field) => isComplete(values[field.name]))
                        .map((field) => [field.name, values[field.name]]),
                ),
            }));
    }, [stepsResponse, values]);
    const progressPercent =
        stepsResponse.totalSteps > 0
            ? Math.round(
                  (stepsResponse.completedSteps.length /
                      stepsResponse.totalSteps) *
                      100,
              )
            : 0;

    const updateValue = (name: string, value: FieldValue) => {
        setValues((current) => ({
            ...current,
            [name]: value,
        }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const uploadFile = async (field: FieldConfig, file: File) => {
        if (!CLOUDINARY_UPLOAD_PRESET) {
            setErrorMessage(
                "Cloudinary upload preset is missing. Add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your environment.",
            );
            return;
        }

        setUploadStates((current) => ({
            ...current,
            [field.name]: "uploading",
        }));
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.set("file", file);
            formData.set("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.set("folder", PROPERTY_SOURCER_ONBOARDING_FLOW.uploadFolder);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );
            const body = (await response.json()) as unknown;

            if (!response.ok || !isCloudinaryUploadResponse(body)) {
                throw new Error("Upload failed.");
            }

            updateValue(field.name, body.secure_url);
            setUploadStates((current) => ({
                ...current,
                [field.name]: "uploaded",
            }));
        } catch {
            setErrorMessage("We could not upload that file. Try again.");
            setUploadStates((current) => ({
                ...current,
                [field.name]: "error",
            }));
        }
    };

    const createStepPayload = (
        stepKey: PropertySourcerStepKey,
    ): Record<string, unknown> => {
        if (stepKey === "sourcer_profile") {
            return {
                accountHolderType: values.accountHolderType,
                tradingName: values.tradingName,
                publicName: values.publicName,
                experienceLevel: values.experienceLevel,
                yearsSourcing: Number(values.yearsSourcing),
                shortBio: values.shortBio,
            };
        }

        if (stepKey === "coverage_specialisation") {
            return {
                coverageAreas: splitCommaList(values.coverageAreas),
                propertyTypes: values.propertyTypes,
                dealTypes: values.dealTypes,
                mainSourcingFocus: values.mainSourcingFocus,
            };
        }

        if (stepKey === "deal_criteria") {
            return {
                typicalDealPriceRange: {
                    min: Number(values.typicalDealPriceMin),
                    max: Number(values.typicalDealPriceMax),
                    currency: values.typicalDealPriceCurrency,
                },
                occupancyPreference: values.occupancyPreference,
                refurbLevelFocus: values.refurbLevelFocus,
                typicalInvestorOutcome: values.typicalInvestorOutcome,
                minimumExpectedGrossYield:
                    Number(values.minimumExpectedGrossYield),
            };
        }

        if (stepKey === "verification") {
            return {
                governmentIdDocumentPublicId:
                    values.governmentIdDocumentPublicId,
                complianceDeclarationAccepted:
                    values.complianceDeclarationAccepted,
                ...(isComplete(values.companyRegistrationNumber)
                    ? {
                          companyRegistrationNumber:
                              values.companyRegistrationNumber,
                      }
                    : {}),
                ...(isComplete(values.companyRegistrationDocumentPublicId)
                    ? {
                          companyRegistrationDocumentPublicId:
                              values.companyRegistrationDocumentPublicId,
                      }
                    : {}),
                ...(isComplete(values.proofOfBusinessIdentityDocumentPublicId)
                    ? {
                          proofOfBusinessIdentityDocumentPublicId:
                              values.proofOfBusinessIdentityDocumentPublicId,
                      }
                    : {}),
            };
        }

        if (stepKey === "commercial_setup") {
            return {
                feeModel: values.feeModel,
                typicalFeeRange: {
                    min: Number(values.typicalFeeMin),
                    max: Number(values.typicalFeeMax),
                    currency: values.typicalFeeCurrency,
                },
                payoutDetails: {
                    accountName: values.payoutAccountName,
                    bankName: values.payoutBankName,
                    sortCode: values.payoutSortCode,
                    accountNumberLast4: values.payoutAccountNumberLast4,
                },
                billingContact: {
                    name: values.billingContactName,
                    email: values.billingContactEmail,
                    phoneNumber: values.billingContactPhone,
                },
            };
        }

        if (stepKey === "listing_standards") {
            return {
                onlyGenuineDealsConfirmed:
                    values.onlyGenuineDealsConfirmed,
                authorisedDealsOnlyConfirmed:
                    values.authorisedDealsOnlyConfirmed,
                listingStandardsAccepted:
                    values.listingStandardsAccepted,
                sourcerComplianceDeclarationAccepted:
                    values.sourcerComplianceDeclarationAccepted,
                submitFirstDealLater: values.submitFirstDealLater,
            };
        }

        const payload: Record<string, unknown> = {};

        activeFields.forEach((field) => {
            const value = values[field.name];

            if (field.required || isComplete(value)) {
                payload[field.name] = value;
            }
        });

        return payload;
    };

    const validateStep = (): boolean => {
        const missing = activeFields.filter(
            (field) =>
                field.required &&
                (field.mustBeTrue
                    ? values[field.name] !== true
                    : !isComplete(values[field.name])),
        );

        if (missing.length > 0) {
            setErrorMessage(
                `Complete required fields: ${missing
                    .map((field) => field.label)
                    .join(", ")}.`,
            );
            return false;
        }

        return true;
    };

    const saveStep = async (
        stepKey: PropertySourcerStepKey,
    ): Promise<boolean> => {
        if (!hasLoadedSteps) {
            setErrorMessage(
                "Property sourcer onboarding steps must load before saving.",
            );
            return false;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await authApiPut<
                StepResponse,
                Record<string, unknown>
            >(
                getRoleStepSaveEndpoint(
                    PROPERTY_SOURCER_ONBOARDING_FLOW,
                    stepKey,
                ),
                createStepPayload(stepKey),
            );

            setStepsResponse(result);
            setHasLoadedSteps(true);
            setActiveStepKey(
                result.currentStep ?? result.nextStep ?? stepKey,
            );
            setSuccessMessage("Your onboarding step has been saved.");
            return true;
        } catch {
            setErrorMessage(
                "We could not save this onboarding step. Review the fields and try again.",
            );
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const submitOnboarding = async () => {
        setIsSaving(true);
        setErrorMessage(null);

        try {
            await authApiPost<
                unknown,
                RoleOnboardingSubmitPayload
            >(
                getRoleSubmitEndpoint(
                    PROPERTY_SOURCER_ONBOARDING_FLOW,
                ),
                PROPERTY_SOURCER_ONBOARDING_FLOW.submitPayload,
            );

            router.replace(PROPERTY_SOURCER_ONBOARDING_FLOW.dashboardPath);
            router.refresh();
        } catch {
            setErrorMessage(
                "We could not submit your property sourcer onboarding.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (activeStep.locked) {
            setErrorMessage("This step is locked.");
            return;
        }

        if (activeStep.stepKey === "listing_standards") {
            if (!validateStep()) return;

            const saved = await saveStep("listing_standards");

            if (saved) {
                setIsSubmitConfirmationOpen(true);
            }

            return;
        }

        if (!validateStep()) return;

        await saveStep(activeStep.stepKey);
    };

    const renderField = (field: FieldConfig): ReactNode => {
        const value = values[field.name];
        const disabled =
            isLoading ||
            isSaving ||
            activeStep.locked ||
            !activeStep.canEdit;
        const fieldId = `property-sourcer-${field.name}`;
        const inputClass =
            "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm";

        if (field.type === "upload") {
            const uploadStatus = uploadStates[field.name] ?? "idle";
            const hasValue =
                typeof value === "string" && value.trim().length > 0;

            return (
                <div
                    key={field.name}
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-4"
                >
                    <label htmlFor={fieldId} className="text-sm font-semibold">
                        {field.required ? (
                            <span className="mr-1 text-[var(--destructive)]">*</span>
                        ) : null}
                        {field.label}
                    </label>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            id={fieldId}
                            type="file"
                            accept="image/*,application/pdf"
                            disabled={disabled || uploadStatus === "uploading"}
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) void uploadFile(field, file);

                                event.target.value = "";
                            }}
                            className="block w-full text-sm file:mr-4 file:min-h-10 file:rounded-[var(--asancha-radius-md)] file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background hover:file:bg-foreground/80"
                        />
                        <span className="inline-flex min-h-10 items-center gap-2 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)]">
                            <UploadCloud className="size-4" aria-hidden="true" />
                            {uploadStatus === "uploading"
                                ? "Uploading..."
                                : hasValue
                                  ? "Uploaded"
                                  : "Awaiting file"}
                        </span>
                    </div>

                    {hasValue ? (
                        <a
                            href={value as string}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
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
                    className="flex min-h-16 items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-4 text-sm"
                >
                    <input
                        type="checkbox"
                        checked={value === true}
                        disabled={disabled}
                        onChange={(event) =>
                            updateValue(field.name, event.target.checked)
                        }
                        className="mt-1 size-4 accent-[var(--primary)]"
                    />
                    <span className="font-semibold">
                        {field.required ? (
                            <span className="mr-1 text-[var(--destructive)]">*</span>
                        ) : null}
                        {field.label}
                    </span>
                </label>
            );
        }

        return (
            <div key={field.name}>
                <label htmlFor={fieldId} className="text-sm font-semibold">
                    {field.required ? (
                        <span className="mr-1 text-[var(--destructive)]">*</span>
                    ) : null}
                    {field.label}
                </label>

                {field.type === "textarea" ? (
                    <textarea
                        id={fieldId}
                        rows={4}
                        value={typeof value === "string" ? value : ""}
                        disabled={disabled}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                            updateValue(field.name, event.target.value)
                        }
                        className={`${inputClass} resize-y`}
                    />
                ) : field.type === "select" || field.type === "multiselect" ? (
                    <select
                        id={fieldId}
                        multiple={field.type === "multiselect"}
                        value={
                            field.type === "multiselect"
                                ? Array.isArray(value)
                                    ? value
                                    : []
                                : typeof value === "string"
                                  ? value
                                  : ""
                        }
                        disabled={disabled}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                            if (event.target.multiple) {
                                updateValue(
                                    field.name,
                                    Array.from(event.target.selectedOptions).map(
                                        (option) => option.value,
                                    ),
                                );
                            } else {
                                updateValue(field.name, event.target.value);
                            }
                        }}
                        className={`${inputClass} ${
                            field.type === "multiselect" ? "min-h-32" : ""
                        }`}
                    >
                        {field.type === "select" ? (
                            <option value="">Select an option</option>
                        ) : null}
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={fieldId}
                        type={field.type}
                        value={
                            typeof value === "string" ||
                            typeof value === "number"
                                ? String(value)
                                : ""
                        }
                        disabled={disabled}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                            updateValue(field.name, event.target.value)
                        }
                        className={inputClass}
                    />
                )}
            </div>
        );
    };

    const renderReviewSummary = () => (
        <div className="grid gap-5">
            {reviewSummary.map((item) => (
                <section
                    key={item.stepKey}
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-5"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Step {item.stepNumber}
                    </p>
                    <h3 className="mt-1 font-bold">{item.stepTitle}</h3>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        {Object.entries(item.data).map(([key, value]) => {
                            const isLink =
                                typeof value === "string" &&
                                value.startsWith("http");

                            return (
                                <div
                                    key={key}
                                    className="rounded-[var(--asancha-radius-sm)] bg-[var(--muted)] p-3"
                                >
                                    <dt className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
                                        {formatFieldName(key)}
                                    </dt>
                                    <dd className="mt-1 break-words text-sm font-semibold">
                                        {isLink ? (
                                            <a
                                                href={value}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[var(--primary)] hover:underline"
                                            >
                                                View file
                                            </a>
                                        ) : (
                                            formatValue(value)
                                        )}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </section>
            ))}
        </div>
    );

    return (
        <main className="bg-[var(--background)]">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:px-8 lg:py-10">
                <aside className="self-start rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm lg:sticky lg:top-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                                {PROPERTY_SOURCER_ONBOARDING_FLOW.workspaceLabel}
                            </p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight">
                                Complete your property sourcer setup
                            </h1>
                        </div>
                        <FileCheck2 className="size-6 text-[var(--primary)]" aria-hidden="true" />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        Work through each step before your property sourcer profile is ready for review.
                    </p>

                    <div className="mt-5">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                            <div
                                className="h-full rounded-full bg-[var(--primary)]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <ol className="mt-6 grid gap-2">
                        {stepsResponse.steps.map((step) => {
                            const active = step.stepKey === activeStep.stepKey;
                            const Icon = step.completed ? Check : step.locked ? Lock : Circle;

                            return (
                                <li key={step.stepKey}>
                                    <button
                                        type="button"
                                        disabled={step.locked && !step.current}
                                        onClick={() => {
                                            setActiveStepKey(step.stepKey);
                                            setErrorMessage(
                                                step.locked
                                                    ? "This step is locked."
                                                    : null,
                                            );
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-[var(--asancha-radius-md)] px-3 py-3 text-left text-sm transition ${
                                            active
                                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                        } disabled:cursor-not-allowed disabled:opacity-55`}
                                    >
                                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-current">
                                            <Icon className="size-4" aria-hidden="true" />
                                        </span>
                                        <span>
                                            <span className="block font-semibold">
                                                {step.stepTitle}
                                            </span>
                                            <span className="text-xs opacity-80">
                                                Step {step.stepNumber} of {step.totalSteps}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </aside>

                <form onSubmit={handleSubmit} className="min-w-0">
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <header className="border-b border-[var(--border)] p-5 sm:p-7">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--primary)]">
                                        Step {activeStep.stepNumber} of {activeStep.totalSteps}
                                    </p>
                                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                                        {activeStep.stepTitle}
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                                        {STEP_CONFIGS[activeStep.stepKey].description}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => void loadSteps()}
                                    disabled={isLoading || isSaving}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                                >
                                    <RefreshCw className="size-4" aria-hidden="true" />
                                    Refresh steps
                                </button>
                            </div>
                        </header>

                        <div className="grid gap-6 p-5 sm:p-7">
                            {isLoading ? (
                                <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                                    {PROPERTY_SOURCER_ONBOARDING_FLOW.loadingMessage}
                                </div>
                            ) : null}

                            {errorMessage ? (
                                <div
                                    role="alert"
                                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                                >
                                    {errorMessage}
                                </div>
                            ) : null}

                            {successMessage ? (
                                <div className="rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm">
                                    {successMessage}
                                </div>
                            ) : null}

                            <div className="grid gap-5 md:grid-cols-2">
                                {activeFields.map(renderField)}
                            </div>

                            {activeStep.stepKey === "listing_standards" ? (
                                <div className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] p-5">
                                    <h3 className="font-bold">
                                        Review summary
                                    </h3>
                                    <div className="mt-4">
                                        {renderReviewSummary()}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <footer className="flex flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                            <button
                                type="button"
                                disabled={activeStep.stepNumber === 1 || isSaving}
                                onClick={() => {
                                    const previous = stepsResponse.steps.find(
                                        (step) =>
                                            step.stepNumber === activeStep.stepNumber - 1,
                                    );

                                    if (previous) setActiveStepKey(previous.stepKey);
                                }}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold disabled:opacity-50"
                            >
                                <ChevronLeft className="size-4" aria-hidden="true" />
                                Previous
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    isSaving ||
                                    !hasLoadedSteps ||
                                    activeStep.locked ||
                                    !activeStep.canEdit
                                }
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:opacity-60"
                            >
                                {isSaving
                                    ? "Saving..."
                                    : activeStep.stepKey === "listing_standards"
                                      ? "Submit review"
                                      : "Save step"}
                                <ChevronRight className="size-4" aria-hidden="true" />
                            </button>
                        </footer>
                    </section>
                </form>
            </div>

            {isSubmitConfirmationOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
                    <section
                        aria-modal="true"
                        role="dialog"
                        className="w-full max-w-md rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold">
                            {PROPERTY_SOURCER_ONBOARDING_FLOW.submitConfirmationTitle}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                            {PROPERTY_SOURCER_ONBOARDING_FLOW.submitConfirmationDescription}
                        </p>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => setIsSubmitConfirmationOpen(false)}
                                className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] px-5 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                            >
                                Go back
                            </button>
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                    setIsSubmitConfirmationOpen(false);
                                    void submitOnboarding();
                                }}
                                className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                            >
                                {isSaving ? "Submitting..." : "Submit for review"}
                            </button>
                        </div>
                    </section>
                </div>
            ) : null}
        </main>
    );
}
