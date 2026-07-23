"use client";

// File: app/onboarding/investor/_components/investor-onboarding-form.tsx

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
    INVESTOR_ONBOARDING_FLOW,
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

type InvestorStepKey =
    | "investment_profile"
    | "buying_criteria"
    | "deal_preferences"
    | "funding_readiness"
    | "review_submit";

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
    profileType: "investor";
    totalSteps: number;
    currentStep: InvestorStepKey;
    nextStep?: InvestorStepKey;
    completedSteps: InvestorStepKey[];
    lockedSteps: InvestorStepKey[];
    steps: StepMeta[];
    reviewSummary?: ReviewSummaryItem[];
}

interface StepMeta {
    stepKey: InvestorStepKey;
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
    profileType: "investor";
    businessProfileType: "investor";
    status: string;
    verificationStatus: string;
    currentStep?: InvestorStepKey;
    data: Record<string, unknown>;
}

interface ReviewSummaryItem {
    stepKey: InvestorStepKey;
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
    stepKey: InvestorStepKey;
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

const STEP_CONFIGS: Record<InvestorStepKey, StepConfig> = {
    investment_profile: {
        stepKey: "investment_profile",
        description:
            "Tell us about your investment experience, goals, and investor type.",
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
                name: "investmentGoals",
                label: "Investment goals",
                type: "multiselect",
                required: true,
                options: [
                    { value: "rental_income", label: "Rental income" },
                    { value: "capital_growth", label: "Capital growth" },
                    { value: "short_term_resale", label: "Short-term resale" },
                    { value: "portfolio_growth", label: "Portfolio growth" },
                ],
            },
            {
                name: "investorCategory",
                label: "Investor category",
                type: "select",
                required: true,
                options: [
                    { value: "private_investor", label: "Private investor" },
                    { value: "company_investor", label: "Company investor" },
                    { value: "fund", label: "Fund" },
                    { value: "developer", label: "Developer" },
                ],
            },
            {
                name: "companyPublicId",
                label: "Company public ID",
                type: "text",
                required: false,
            },
        ],
    },
    buying_criteria: {
        stepKey: "buying_criteria",
        description:
            "Set your location, budget, property type, and buying strategy criteria.",
        fields: [
            {
                name: "preferredLocations",
                label: "Preferred locations",
                type: "textarea",
                required: true,
                placeholder: "Manchester, Liverpool, Leeds",
            },
            {
                name: "budgetMin",
                label: "Minimum budget",
                type: "number",
                required: true,
            },
            {
                name: "budgetMax",
                label: "Maximum budget",
                type: "number",
                required: true,
            },
            {
                name: "budgetCurrency",
                label: "Budget currency",
                type: "select",
                required: true,
                options: [
                    { value: "GBP", label: "GBP" },
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" },
                ],
            },
            {
                name: "preferredPropertyTypes",
                label: "Preferred property types",
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
                name: "investmentStrategy",
                label: "Investment strategy",
                type: "select",
                required: true,
                options: [
                    { value: "buy_to_let", label: "Buy to let" },
                    { value: "bmv", label: "Below market value" },
                    { value: "light_refurb", label: "Light refurb" },
                    { value: "flip", label: "Flip" },
                ],
            },
            { name: "excludedLocations", label: "Excluded locations", type: "textarea", required: false },
            { name: "priorityLocations", label: "Priority locations", type: "textarea", required: false },
            { name: "acceptablePropertyTypes", label: "Acceptable property types", type: "multiselect", required: false, options: [
                { value: "terraced_house", label: "Terraced house" },
                { value: "flats", label: "Flats" },
                { value: "semi_detached", label: "Semi-detached" },
                { value: "maisonette", label: "Maisonette" },
                { value: "commercial", label: "Commercial" },
            ] },
            { name: "excludedPropertyTypes", label: "Excluded property types", type: "multiselect", required: false, options: [
                { value: "terraced_house", label: "Terraced house" },
                { value: "flats", label: "Flats" },
                { value: "semi_detached", label: "Semi-detached" },
                { value: "maisonette", label: "Maisonette" },
                { value: "commercial", label: "Commercial" },
            ] },
        ],
    },
    deal_preferences: {
        stepKey: "deal_preferences",
        description:
            "Define the deal types, returns, and constraints that matter most.",
        fields: [
            { name: "strategies", label: "Strategies", type: "multiselect", required: true, options: [
                { value: "bmv", label: "BMV" },
                { value: "buy_to_let", label: "Buy to let" },
                { value: "light_refurb", label: "Light refurb" },
                { value: "flip", label: "Flip" },
            ] },
            { name: "bmvRequired", label: "Interested in BMV deals", type: "checkbox", required: true },
            { name: "occupancyPreference", label: "Occupancy preference", type: "select", required: true, options: [
                { value: "vacant_or_tenanted", label: "Vacant or tenanted" },
                { value: "vacant", label: "Vacant" },
                { value: "tenanted", label: "Tenanted" },
            ] },
            { name: "refurbPreference", label: "Refurb preference", type: "select", required: true, options: [
                { value: "none", label: "None" },
                { value: "light_refurb", label: "Light refurb" },
                { value: "medium_refurb", label: "Medium refurb" },
                { value: "heavy_refurb", label: "Heavy refurb" },
            ] },
            { name: "strategyBadges", label: "Strategy badges", type: "textarea", required: false },
            { name: "minimumBmvPercentage", label: "Minimum BMV percentage", type: "number", required: false },
            { name: "minimumGrossYield", label: "Minimum gross yield", type: "number", required: false },
            { name: "minimumRoi", label: "Minimum ROI", type: "number", required: false },
            { name: "dealBreakers", label: "Deal breakers", type: "textarea", required: false },
            { name: "priorityYield", label: "Yield priority weight", type: "number", required: false },
            { name: "priorityDiscount", label: "Discount priority weight", type: "number", required: false },
            { name: "priorityLocation", label: "Location priority weight", type: "number", required: false },
        ],
    },
    funding_readiness: {
        stepKey: "funding_readiness",
        description:
            "Confirm how you will fund purchases and how quickly you can proceed.",
        fields: [
            { name: "fundingMethod", label: "Funding method", type: "select", required: true, options: [
                { value: "cash", label: "Cash" },
                { value: "mortgage", label: "Mortgage" },
                { value: "cash_and_mortgage", label: "Cash and mortgage" },
                { value: "bridging_finance", label: "Bridging finance" },
            ] },
            { name: "proofOfFundsStatus", label: "Proof of funds status", type: "select", required: true, options: [
                { value: "available", label: "Available" },
                { value: "available_on_request", label: "Available on request" },
                { value: "not_available", label: "Not available" },
            ] },
            { name: "sourceOfFundsDeclaration", label: "I confirm my source of funds declaration", type: "checkbox", required: true, mustBeTrue: true },
            { name: "purchaseTimeline", label: "Purchase timeline", type: "select", required: true, options: [
                { value: "immediately", label: "Immediately" },
                { value: "within_3_months", label: "Within 3 months" },
                { value: "within_6_months", label: "Within 6 months" },
                { value: "exploring", label: "Exploring" },
            ] },
            { name: "canProceedImmediately", label: "Can proceed immediately", type: "checkbox", required: true },
            { name: "cashAvailable", label: "Cash available", type: "number", required: false },
            { name: "mortgageAgreementInPrinciple", label: "Mortgage agreement in principle", type: "checkbox", required: false },
        ],
    },
    review_submit: {
        stepKey: "review_submit",
        description:
            "Review your information and confirm it is ready for verification.",
        fields: [],
    },
};

const DEFAULT_STEPS: StepResponse = {
    profileType: "investor",
    totalSteps: 5,
    currentStep: "investment_profile",
    nextStep: "investment_profile",
    completedSteps: [],
    lockedSteps: [
        "buying_criteria",
        "deal_preferences",
        "funding_readiness",
        "review_submit",
    ],
    steps: [
        {
            stepKey: "investment_profile",
            stepTitle: "Investment Profile",
            requiredFields: [
                "accountHolderType",
                "experienceLevel",
                "investmentGoals",
                "investorCategory",
            ],
            optionalFields: ["companyPublicId"],
            stepNumber: 1,
            totalSteps: 5,
            completed: false,
            current: true,
            locked: false,
            canEdit: true,
        },
        {
            stepKey: "buying_criteria",
            stepTitle: "Buying Criteria",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 2,
            totalSteps: 5,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "deal_preferences",
            stepTitle: "Deal Preferences",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 3,
            totalSteps: 5,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "funding_readiness",
            stepTitle: "Funding Readiness",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 4,
            totalSteps: 5,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
        {
            stepKey: "review_submit",
            stepTitle: "Review & Verify",
            requiredFields: [],
            optionalFields: [],
            stepNumber: 5,
            totalSteps: 5,
            completed: false,
            current: false,
            locked: true,
            canEdit: false,
        },
    ],
};

const REVIEW_STEP_PAYLOAD = {
    confirmAccuracy: true,
    acceptInvestorTerms: true,
    submitForReview: true,
} as const;

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

    values.budgetCurrency = "GBP";

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
        (value as StepResponse).profileType === "investor" &&
        Array.isArray((value as StepResponse).steps)
    );
}

function isStartResponse(value: unknown): value is StartResponse {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        (value as StartResponse).profileType === "investor"
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
            if (key === "budgetRange" && value && typeof value === "object") {
                const budgetRange = value as Record<string, unknown>;
                nextValues.budgetMin =
                    typeof budgetRange.min === "number"
                        ? budgetRange.min
                        : "";
                nextValues.budgetMax =
                    typeof budgetRange.max === "number"
                        ? budgetRange.max
                        : "";
                nextValues.budgetCurrency =
                    typeof budgetRange.currency === "string"
                        ? budgetRange.currency
                        : "GBP";
                return;
            }

            if (key === "priorityWeights" && value && typeof value === "object") {
                const priorityWeights = value as Record<string, unknown>;
                nextValues.priorityYield =
                    typeof priorityWeights.yield === "number"
                        ? priorityWeights.yield
                        : "";
                nextValues.priorityDiscount =
                    typeof priorityWeights.discount === "number"
                        ? priorityWeights.discount
                        : "";
                nextValues.priorityLocation =
                    typeof priorityWeights.location === "number"
                        ? priorityWeights.location
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

export function InvestorOnboardingForm() {
    const router = useRouter();
    const [stepsResponse, setStepsResponse] = useState(DEFAULT_STEPS);
    const [values, setValues] = useState<FormValues>(getInitialValues);
    const [activeStepKey, setActiveStepKey] =
        useState<InvestorStepKey>(DEFAULT_STEPS.currentStep);
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
                { profileType: "investor" }
            >("/onboarding/start", {
                profileType: INVESTOR_ONBOARDING_FLOW.profileType,
            });

            if (!isStartResponse(start)) {
                throw new Error("Invalid investor onboarding start response.");
            }

            setValues((current) => mergeStoredValues(current, start.data));

            const steps = await authApiGet<unknown>(
                getRoleStepsEndpoint(INVESTOR_ONBOARDING_FLOW),
            );

            if (!isStepResponse(steps)) {
                throw new Error("Invalid investor onboarding steps response.");
            }

            setStepsResponse(steps);
            setHasLoadedSteps(true);
            setActiveStepKey(
                steps.currentStep ?? steps.nextStep ?? "investment_profile",
            );
        } catch {
            setStepsResponse(DEFAULT_STEPS);
            setActiveStepKey("investment_profile");
            setErrorMessage(
                "We could not load your investor onboarding steps.",
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
            .filter((step) => step.stepKey !== "review_submit")
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
            formData.set("folder", INVESTOR_ONBOARDING_FLOW.uploadFolder);

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
        stepKey: InvestorStepKey,
    ): Record<string, unknown> => {
        if (stepKey === "review_submit") {
            return REVIEW_STEP_PAYLOAD;
        }

        if (stepKey === "investment_profile") {
            return {
                accountHolderType: values.accountHolderType,
                experienceLevel: values.experienceLevel,
                investmentGoals: values.investmentGoals,
                investorCategory: values.investorCategory,
                ...(isComplete(values.companyPublicId)
                    ? { companyPublicId: values.companyPublicId }
                    : {}),
            };
        }

        if (stepKey === "buying_criteria") {
            return {
                preferredLocations: splitCommaList(values.preferredLocations),
                ...(isComplete(values.excludedLocations)
                    ? { excludedLocations: splitCommaList(values.excludedLocations) }
                    : {}),
                ...(isComplete(values.priorityLocations)
                    ? { priorityLocations: splitCommaList(values.priorityLocations) }
                    : {}),
                budgetRange: {
                    min: Number(values.budgetMin),
                    max: Number(values.budgetMax),
                    currency: values.budgetCurrency,
                },
                preferredPropertyTypes: values.preferredPropertyTypes,
                ...(isComplete(values.acceptablePropertyTypes)
                    ? {
                          acceptablePropertyTypes:
                              values.acceptablePropertyTypes,
                      }
                    : {}),
                ...(isComplete(values.excludedPropertyTypes)
                    ? { excludedPropertyTypes: values.excludedPropertyTypes }
                    : {}),
                investmentStrategy: values.investmentStrategy,
            };
        }

        if (stepKey === "deal_preferences") {
            return {
                strategies: values.strategies,
                ...(isComplete(values.strategyBadges)
                    ? { strategyBadges: splitCommaList(values.strategyBadges) }
                    : {}),
                bmvRequired: values.bmvRequired,
                ...(isComplete(values.minimumBmvPercentage)
                    ? {
                          minimumBmvPercentage:
                              Number(values.minimumBmvPercentage),
                      }
                    : {}),
                occupancyPreference: values.occupancyPreference,
                refurbPreference: values.refurbPreference,
                ...(isComplete(values.minimumGrossYield)
                    ? { minimumGrossYield: Number(values.minimumGrossYield) }
                    : {}),
                ...(isComplete(values.minimumRoi)
                    ? { minimumRoi: Number(values.minimumRoi) }
                    : {}),
                ...(isComplete(values.dealBreakers)
                    ? { dealBreakers: splitCommaList(values.dealBreakers) }
                    : {}),
                priorityWeights: {
                    ...(isComplete(values.priorityYield)
                        ? { yield: Number(values.priorityYield) }
                        : {}),
                    ...(isComplete(values.priorityDiscount)
                        ? { discount: Number(values.priorityDiscount) }
                        : {}),
                    ...(isComplete(values.priorityLocation)
                        ? { location: Number(values.priorityLocation) }
                        : {}),
                },
            };
        }

        if (stepKey === "funding_readiness") {
            return {
                fundingMethod: values.fundingMethod,
                proofOfFundsStatus: values.proofOfFundsStatus,
                ...(isComplete(values.cashAvailable)
                    ? { cashAvailable: Number(values.cashAvailable) }
                    : {}),
                mortgageAgreementInPrinciple:
                    values.mortgageAgreementInPrinciple,
                sourceOfFundsDeclaration:
                    values.sourceOfFundsDeclaration,
                purchaseTimeline: values.purchaseTimeline,
                canProceedImmediately: values.canProceedImmediately,
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
        stepKey: InvestorStepKey,
    ): Promise<boolean> => {
        if (!hasLoadedSteps) {
            setErrorMessage(
                "Investor onboarding steps must load before saving.",
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
                    INVESTOR_ONBOARDING_FLOW,
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
                    INVESTOR_ONBOARDING_FLOW,
                ),
                INVESTOR_ONBOARDING_FLOW.submitPayload,
            );

            router.replace(INVESTOR_ONBOARDING_FLOW.dashboardPath);
            router.refresh();
        } catch {
            setErrorMessage(
                "We could not submit your investor onboarding.",
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

        if (activeStep.stepKey === "review_submit") {
            const saved = await saveStep("review_submit");

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
        const fieldId = `investor-${field.name}`;
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
                                {INVESTOR_ONBOARDING_FLOW.workspaceLabel}
                            </p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight">
                                Complete your investor setup
                            </h1>
                        </div>
                        <FileCheck2 className="size-6 text-[var(--primary)]" aria-hidden="true" />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        Work through each step before your investor profile is ready for review.
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
                                    {INVESTOR_ONBOARDING_FLOW.loadingMessage}
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

                            {activeStep.stepKey === "review_submit" ? (
                                renderReviewSummary()
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2">
                                    {activeFields.map(renderField)}
                                </div>
                            )}
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
                                    : activeStep.stepKey === "review_submit"
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
                            {INVESTOR_ONBOARDING_FLOW.submitConfirmationTitle}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                            {INVESTOR_ONBOARDING_FLOW.submitConfirmationDescription}
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
