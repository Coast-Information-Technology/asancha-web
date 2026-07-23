"use client";

// File: app/onboarding/_components/onboarding-form-page.tsx

/**
 * Asancha Onboarding Form Page
 *
 * Purpose:
 * Renders general-profile and role-specific onboarding forms from approved
 * field configurations.
 *
 * Responsibilities:
 * - Render accessible onboarding fields and sections.
 * - Restore safe values returned by the backend.
 * - Save onboarding progress.
 * - Submit completed onboarding.
 * - Show safe progress, success, and error states.
 *
 * Security notes:
 * - Client-side required fields are UX validation only.
 * - Backend profile, policy, role, ownership, lifecycle, and submission checks
 *   remain final.
 * - Raw backend errors, ObjectIds, private KYC notes, internal notes, tokens,
 *   secrets, and private document URLs must never be rendered.
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
    authApiGet,
    authApiPatch,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import type {
    OnboardingFieldConfig,
    OnboardingFieldOption,
    OnboardingPageConfig,
    OnboardingProfileType,
} from "../_config/onboarding-page-config";

type OnboardingFormValue =
    | string
    | number
    | boolean
    | string[]
    | null;

type OnboardingFormValues = Record<
    string,
    OnboardingFormValue
>;

interface SafeOnboardingRecord {
    onboardingPublicId: string;
    profileType: OnboardingProfileType;

    status:
    | "not_started"
    | "in_progress"
    | "submitted"
    | "completed"
    | "correction_required";

    currentStep: string | null;
    progressPercent: number;

    data: OnboardingFormValues;

    safeUserMessage: string | null;
}

interface SafeGeneralProfileRecord {
    profilePublicId: string;

    completionStatus:
    | "not_started"
    | "in_progress"
    | "completed";

    data: OnboardingFormValues;
}

interface SaveOnboardingPayload
    extends Record<string, unknown> {
    data: {
        profileType: OnboardingProfileType;
        currentStep: string;
        formData: OnboardingFormValues;
    };
}

interface SubmitOnboardingPayload
    extends Record<string, unknown> {
    data: {
        profileType: OnboardingProfileType;
        informationAccurateConfirmed: true;
    };
}

interface SaveGeneralProfilePayload
    extends Record<string, unknown> {
    data: OnboardingFormValues;
}

interface CompleteGeneralProfilePayload
    extends Record<string, unknown> {
    data: {
        informationAccurateConfirmed: true;
    };
}

export interface OnboardingFormPageProps {
    config: OnboardingPageConfig;
}

const SAFE_MESSAGES = {
    loadError:
        "We could not load your saved onboarding information. You may continue, but review your details before submitting.",

    saveError:
        "We could not save your progress. Check your connection and try again.",

    saved:
        "Your onboarding progress has been saved.",

    submitError:
        "We could not submit your onboarding. Review the required fields and try again.",

    submitted:
        "Your onboarding information has been submitted.",

    generalProfileSaved:
        "Your general profile has been saved.",
} as const;

function getInitialValues(
    config: OnboardingPageConfig,
): OnboardingFormValues {
    const values: OnboardingFormValues = {};

    for (const section of config.sections) {
        for (const field of section.fields) {
            switch (field.type) {
                case "checkbox":
                    values[field.name] = false;
                    break;

                case "multiselect":
                    values[field.name] = [];
                    break;

                case "number":
                    values[field.name] = null;
                    break;

                default:
                    values[field.name] = "";
            }
        }
    }

    return values;
}

function isFieldValueComplete(
    value: OnboardingFormValue | undefined,
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

function calculateProgress(
    config: OnboardingPageConfig,
    values: OnboardingFormValues,
): number {
    const requiredFields =
        config.sections.flatMap(
            (section) =>
                section.fields.filter(
                    (field) => field.required,
                ),
        );

    if (requiredFields.length === 0) {
        return 100;
    }

    const completedFields =
        requiredFields.filter(
            (field): boolean =>
                isFieldValueComplete(
                    values[field.name],
                ),
        );

    return Math.round(
        (completedFields.length /
            requiredFields.length) *
        100,
    );
}

function validateRequiredFields(
    config: OnboardingPageConfig,
    values: OnboardingFormValues,
): string[] {
    const missingFields: string[] = [];

    for (const section of config.sections) {
        for (const field of section.fields) {
            if (!field.required) {
                continue;
            }

            const fieldComplete =
                isFieldValueComplete(
                    values[field.name],
                );

            if (!fieldComplete) {
                missingFields.push(field.label);
            }
        }
    }

    return missingFields;
}

export function OnboardingFormPage({
    config,
}: OnboardingFormPageProps) {
    const router = useRouter();

    const [values, setValues] =
        useState<OnboardingFormValues>(() =>
            getInitialValues(config),
        );

    const [
        activeSectionIndex,
        setActiveSectionIndex,
    ] = useState(0);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [
        informationAccurateConfirmed,
        setInformationAccurateConfirmed,
    ] = useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const progressPercent = useMemo(
        (): number =>
            calculateProgress(config, values),
        [config, values],
    );

    const activeSection =
        config.sections[activeSectionIndex];

    const loadExistingData = useCallback(
        async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                if (
                    config.profileType ===
                    "general_profile"
                ) {
                    const profile =
                        await authApiGet<any>(
                            "/profiles/me/general",
                        );

                    setValues(
                        (
                            currentValues:
                                OnboardingFormValues,
                        ): OnboardingFormValues => ({
                            ...currentValues,
                            ...profile,
                        }),
                    );

                    return;
                }

                const onboarding =
                    await authApiGet<SafeOnboardingRecord>(
                        "/onboarding/me",
                    );

                if (
                    onboarding.profileType ===
                    config.profileType
                ) {
                    setValues(
                        (
                            currentValues:
                                OnboardingFormValues,
                        ): OnboardingFormValues => ({
                            ...currentValues,
                            ...onboarding.data,
                        }),
                    );

                    const savedSectionIndex =
                        config.sections.findIndex(
                            (section): boolean =>
                                section.key ===
                                onboarding.currentStep,
                        );

                    if (
                        savedSectionIndex >= 0
                    ) {
                        setActiveSectionIndex(
                            savedSectionIndex,
                        );
                    }
                }
            } catch {
                setErrorMessage(
                    SAFE_MESSAGES.loadError,
                );
            } finally {
                setIsLoading(false);
            }
        },
        [config],
    );

    useEffect((): void => {
        void loadExistingData();
    }, [loadExistingData]);

    const updateValue = (
        name: string,
        value: OnboardingFormValue,
    ): void => {
        setValues(
            (
                currentValues:
                    OnboardingFormValues,
            ): OnboardingFormValues => ({
                ...currentValues,
                [name]: value,
            }),
        );

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleStandardInputChange = (
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
            updateValue(
                name,
                event.target.checked,
            );

            return;
        }

        if (
            type === "number" &&
            event.target instanceof
            HTMLInputElement
        ) {
            const inputValue =
                event.target.value.trim();

            const parsedValue: number | null =
                inputValue === ""
                    ? null
                    : Number(inputValue);

            updateValue(name, parsedValue);

            return;
        }

        updateValue(
            name,
            event.target.value,
        );
    };

    const handleSelectChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const { name } = event.target;

        if (event.target.multiple) {
            const selectedValues: string[] =
                Array.from(
                    event.target.selectedOptions,
                ).map(
                    (
                        option: HTMLOptionElement,
                    ): string => option.value,
                );

            updateValue(
                name,
                selectedValues,
            );

            return;
        }

        updateValue(
            name,
            event.target.value,
        );
    };

    const saveProgress =
        async (): Promise<boolean> => {
            setIsSaving(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            try {
                if (
                    config.profileType ===
                    "general_profile"
                ) {
                    await authApiPatch(
                        "/profiles/me/general",
                        values,
                    );

                    setSuccessMessage(
                        SAFE_MESSAGES
                            .generalProfileSaved,
                    );

                    return true;
                }

                const payload:
                    SaveOnboardingPayload = {
                    data: {
                        profileType:
                            config.profileType,

                        currentStep:
                            activeSection.key,

                        formData: values,
                    },
                };

                await authApiPatch(
                    "/onboarding/me",
                    payload,
                );

                setSuccessMessage(
                    SAFE_MESSAGES.saved,
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

    const goToPreviousSection = (): void => {
        setActiveSectionIndex(
            (
                currentIndex: number,
            ): number =>
                Math.max(
                    0,
                    currentIndex - 1,
                ),
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const goToNextSection =
        async (): Promise<void> => {
            const currentSectionMissingFields:
                string[] =
                activeSection.fields
                    .filter(
                        (field): boolean =>
                            Boolean(
                                field.required,
                            ),
                    )
                    .filter(
                        (field): boolean =>
                            !isFieldValueComplete(
                                values[
                                field.name
                                ],
                            ),
                    )
                    .map(
                        (field): string =>
                            field.label,
                    );

            if (
                currentSectionMissingFields
                    .length > 0
            ) {
                setErrorMessage(
                    `Complete the following fields before continuing: ${currentSectionMissingFields.join(
                        ", ",
                    )}.`,
                );

                return;
            }

            const saved =
                await saveProgress();

            if (!saved) {
                return;
            }

            setActiveSectionIndex(
                (
                    currentIndex: number,
                ): number =>
                    Math.min(
                        config.sections
                            .length - 1,

                        currentIndex + 1,
                    ),
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const missingFields:
            string[] =
            validateRequiredFields(
                config,
                values,
            );

        if (missingFields.length > 0) {
            setErrorMessage(
                `Complete the following required fields: ${missingFields.join(
                    ", ",
                )}.`,
            );

            return;
        }

        if (
            !informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that the information you have provided is accurate.",
            );

            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            if (
                config.profileType ===
                "general_profile"
            ) {
                await authApiPatch(
                    "/profiles/me/general",
                    values,
                );

                const completePayload = {
                    confirmCompletion: true,
                };

                await authApiPost(
                    "/profiles/me/general/complete",
                    completePayload,
                );

                setSuccessMessage(
                    SAFE_MESSAGES
                        .generalProfileSaved,
                );

                router.push(
                    config.successPath,
                );

                router.refresh();

                return;
            }

            const finalSection =
                config.sections[
                config.sections.length -
                1
                ];

            const savePayload:
                SaveOnboardingPayload = {
                data: {
                    profileType:
                        config.profileType,

                    currentStep:
                        finalSection.key,

                    formData: values,
                },
            };

            await authApiPatch(
                "/onboarding/me",
                savePayload,
            );

            const submitPayload:
                SubmitOnboardingPayload = {
                data: {
                    profileType:
                        config.profileType,

                    informationAccurateConfirmed:
                        true,
                },
            };

            await authApiPost(
                "/onboarding/me/submit",
                submitPayload,
            );

            setSuccessMessage(
                SAFE_MESSAGES.submitted,
            );

            router.push(
                config.successPath,
            );

            router.refresh();
        } catch {
            setErrorMessage(
                SAFE_MESSAGES.submitError,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (
        field: OnboardingFieldConfig,
    ): ReactNode => {
        const fieldId =
            `${config.profileType}-${field.name}`;

        const descriptionId =
            field.description
                ? `${fieldId}-description`
                : undefined;

        const fieldValue:
            OnboardingFormValue =
            values[field.name] ?? null;

        const stringValue: string =
            typeof fieldValue === "string"
                ? fieldValue
                : "";

        const numberOrStringValue:
            string | number =
            typeof fieldValue === "string" ||
                typeof fieldValue === "number"
                ? fieldValue
                : "";

        const multiselectValue: string[] =
            Array.isArray(fieldValue)
                ? fieldValue
                : [];

        const checkboxValue: boolean =
            fieldValue === true;

        const sharedClassName =
            "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60";

        if (
            field.type === "checkbox"
        ) {
            return (
                <label
                    key={field.name}
                    htmlFor={fieldId}
                    className="flex cursor-pointer items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4"
                >
                    <input
                        id={fieldId}
                        name={field.name}
                        type="checkbox"
                        required={field.required}
                        checked={
                            checkboxValue
                        }
                        disabled={
                            isLoading ||
                            isSaving ||
                            isSubmitting
                        }
                        onChange={
                            handleStandardInputChange
                        }
                        className="mt-1 h-4 w-4 accent-[var(--primary)]"
                    />

                    <span>
                        <span className="block text-sm font-semibold text-[var(--foreground)]">
                            {field.label}

                            {field.required ? (
                                <span
                                    className="ml-1 text-[var(--destructive)]"
                                    aria-hidden="true"
                                >
                                    *
                                </span>
                            ) : null}
                        </span>

                        {field.description ? (
                            <span className="mt-1 block text-sm leading-6 text-[var(--muted-foreground)]">
                                {
                                    field.description
                                }
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
                    {field.label}

                    {field.required ? (
                        <span
                            className="ml-1 text-[var(--destructive)]"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    ) : null}
                </label>

                {field.description ? (
                    <p
                        id={descriptionId}
                        className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]"
                    >
                        {field.description}
                    </p>
                ) : null}

                {field.type ===
                    "textarea" ? (
                    <textarea
                        id={fieldId}
                        name={field.name}
                        required={
                            field.required
                        }
                        value={stringValue}
                        placeholder={
                            field.placeholder
                        }
                        aria-describedby={
                            descriptionId
                        }
                        disabled={
                            isLoading ||
                            isSaving ||
                            isSubmitting
                        }
                        rows={5}
                        onChange={
                            handleStandardInputChange
                        }
                        className={`${sharedClassName} resize-y`}
                    />
                ) : field.type ===
                    "select" ||
                    field.type ===
                    "multiselect" ? (
                    <select
                        id={fieldId}
                        name={field.name}
                        required={
                            field.required
                        }
                        multiple={
                            field.type ===
                            "multiselect"
                        }
                        value={
                            field.type ===
                                "multiselect"
                                ? multiselectValue
                                : stringValue
                        }
                        aria-describedby={
                            descriptionId
                        }
                        disabled={
                            isLoading ||
                            isSaving ||
                            isSubmitting
                        }
                        onChange={
                            handleSelectChange
                        }
                        className={`${sharedClassName} ${field.type ===
                                "multiselect"
                                ? "min-h-36"
                                : ""
                            }`}
                    >
                        {field.type ===
                            "select" ? (
                            <option value="">
                                Select an
                                option
                            </option>
                        ) : null}

                        {field.options?.map(
                            (
                                option:
                                    OnboardingFieldOption,
                            ): ReactNode => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            ),
                        )}
                    </select>
                ) : (
                    <input
                        id={fieldId}
                        name={field.name}
                        type={field.type}
                        required={
                            field.required
                        }
                        min={field.minimum}
                        max={field.maximum}
                        step={field.step}
                        value={
                            numberOrStringValue
                        }
                        placeholder={
                            field.placeholder
                        }
                        aria-describedby={
                            descriptionId
                        }
                        disabled={
                            isLoading ||
                            isSaving ||
                            isSubmitting
                        }
                        onChange={
                            handleStandardInputChange
                        }
                        className={
                            sharedClassName
                        }
                    />
                )}
            </div>
        );
    };

    if (!activeSection) {
        return (
            <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-5 text-sm text-[var(--destructive)]"
                >
                    This onboarding section is not
                    available.
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8 lg:py-12">
                <aside className="self-start rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 lg:sticky lg:top-6">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        {config.eyebrow}
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight">
                        {config.title}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        {config.description}
                    </p>

                    <div className="mt-5">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                            <span>
                                Profile progress
                            </span>

                            <span>
                                {progressPercent}%
                            </span>
                        </div>

                        <div
                            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--muted)]"
                            role="progressbar"
                            aria-label="Onboarding completion"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={
                                progressPercent
                            }
                        >
                            <div
                                className="h-full rounded-full bg-[var(--primary)] transition-[width]"
                                style={{
                                    width: `${progressPercent}%`,
                                }}
                            />
                        </div>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
                        Estimated time:
                        approximately{" "}
                        {config.estimatedMinutes}{" "}
                        minutes.
                    </p>

                    <ol className="mt-6 grid gap-2">
                        {config.sections.map(
                            (
                                section,
                                index,
                            ): ReactNode => {
                                const active:
                                    boolean =
                                    index ===
                                    activeSectionIndex;

                                const completed:
                                    boolean =
                                    index <
                                    activeSectionIndex;

                                return (
                                    <li
                                        key={
                                            section.key
                                        }
                                    >
                                        <button
                                            type="button"
                                            className={`flex w-full items-center gap-3 rounded-[var(--asancha-radius-md)] px-3 py-2 text-left text-sm ${active
                                                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                                }`}
                                            onClick={(): void =>
                                                setActiveSectionIndex(
                                                    index,
                                                )
                                            }
                                        >
                                            <span
                                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${active
                                                        ? "border-[var(--primary-foreground)]"
                                                        : "border-[var(--border)]"
                                                    }`}
                                            >
                                                {completed
                                                    ? "✓"
                                                    : index +
                                                    1}
                                            </span>

                                            <span>
                                                {
                                                    section.title
                                                }
                                            </span>
                                        </button>
                                    </li>
                                );
                            },
                        )}
                    </ol>
                </aside>

                <form
                    onSubmit={handleSubmit}
                    className="min-w-0"
                >
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <header className="border-b border-[var(--border)] p-5 sm:p-7">
                            <p className="text-sm font-semibold text-[var(--primary)]">
                                Step{" "}
                                {activeSectionIndex +
                                    1}{" "}
                                of{" "}
                                {
                                    config.sections
                                        .length
                                }
                            </p>

                            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                                {
                                    activeSection.title
                                }
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                                {
                                    activeSection.description
                                }
                            </p>
                        </header>

                        <div className="grid gap-6 p-5 sm:p-7">
                            {isLoading ? (
                                <div
                                    role="status"
                                    className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]"
                                >
                                    Loading your
                                    saved
                                    information…
                                </div>
                            ) : null}

                            {errorMessage ? (
                                <div
                                    role="alert"
                                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[color-mix(in_srgb,var(--destructive)_6%,var(--card))] p-4 text-sm leading-6 text-[var(--destructive)]"
                                >
                                    {
                                        errorMessage
                                    }
                                </div>
                            ) : null}

                            {successMessage ? (
                                <div
                                    role="status"
                                    className="rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] bg-[color-mix(in_srgb,var(--secondary)_8%,var(--card))] p-4 text-sm leading-6"
                                >
                                    {
                                        successMessage
                                    }
                                </div>
                            ) : null}

                            <div className="grid gap-5 md:grid-cols-2">
                                {activeSection.fields.map(
                                    renderField,
                                )}
                            </div>

                            {activeSectionIndex ===
                                config.sections.length -
                                1 ? (
                                <div className="grid gap-4 border-t border-[var(--border)] pt-6">
                                    {config.policyNotice ? (
                                        <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                                            <strong className="text-[var(--foreground)]">
                                                Policy
                                                requirement:
                                            </strong>{" "}
                                            {
                                                config.policyNotice
                                            }
                                        </div>
                                    ) : null}

                                    {config.verificationNotice ? (
                                        <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                                            <strong className="text-[var(--foreground)]">
                                                Verification:
                                            </strong>{" "}
                                            {
                                                config.verificationNotice
                                            }
                                        </div>
                                    ) : null}

                                    <label className="flex cursor-pointer items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4">
                                        <input
                                            type="checkbox"
                                            checked={
                                                informationAccurateConfirmed
                                            }
                                            disabled={
                                                isSaving ||
                                                isSubmitting
                                            }
                                            onChange={(
                                                event: ChangeEvent<HTMLInputElement>,
                                            ): void =>
                                                setInformationAccurateConfirmed(
                                                    event
                                                        .target
                                                        .checked,
                                                )
                                            }
                                            className="mt-1 h-4 w-4 accent-[var(--primary)]"
                                        />

                                        <span className="text-sm leading-6">
                                            I confirm
                                            that the
                                            information I
                                            have provided
                                            is accurate
                                            and that I am
                                            authorised to
                                            provide it.
                                        </span>
                                    </label>
                                </div>
                            ) : null}
                        </div>

                        <footer className="flex flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                            <button
                                type="button"
                                disabled={
                                    activeSectionIndex ===
                                    0 ||
                                    isSaving ||
                                    isSubmitting
                                }
                                onClick={
                                    goToPreviousSection
                                }
                                className="min-h-11 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    disabled={
                                        isSaving ||
                                        isSubmitting
                                    }
                                    onClick={(): void => {
                                        void saveProgress();
                                    }}
                                    className="min-h-11 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
                                >
                                    {isSaving
                                        ? "Saving…"
                                        : "Save progress"}
                                </button>

                                {activeSectionIndex <
                                    config.sections
                                        .length -
                                    1 ? (
                                    <button
                                        type="button"
                                        disabled={
                                            isSaving ||
                                            isSubmitting
                                        }
                                        onClick={(): void => {
                                            void goToNextSection();
                                        }}
                                        className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:cursor-wait disabled:opacity-60"
                                    >
                                        Save and
                                        continue
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={
                                            isSaving ||
                                            isSubmitting ||
                                            !informationAccurateConfirmed
                                        }
                                        className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:cursor-wait disabled:opacity-60"
                                    >
                                        {isSubmitting
                                            ? "Submitting…"
                                            : config.submitLabel}
                                    </button>
                                )}
                            </div>
                        </footer>
                    </section>
                </form>
            </div>
        </main>
    );
}