"use client";

// File: app/onboarding/general-profile/_components/general-profile-page-client.tsx

/**
 * Asancha General Profile Page Client
 *
 * Purpose:
 * Collects the authenticated user's non-role-specific identity and contact
 * details after email verification and sign-in.
 *
 * Security notes:
 * - Client validation is UX guidance only.
 * - Backend authentication, ownership, profile completion,
 *   active-profile, verification, and authorization checks remain final.
 * - This page must not expose tokens, ObjectIds, internal notes, or private
 *   profile-review data.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    authApiGet,
    authApiPatch,
    authApiPost,
} from "@/src/lib/api/auth-fetch";
import {
    getDashboardPathForBusinessProfile,
    isBusinessProfileType,
    type BusinessProfileType,
} from "@/src/lib/auth/role-guards";

type GeneralProfileCompletionStatus =
    | "not_started"
    | "in_progress"
    | "completed";

type PreferredContactMethod =
    | "email"
    | "phone"
    | "whatsapp"
    | "platform_message";

interface GeneralProfile {
    publicId: string;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    phoneNumber?: string | null;
    preferredContactMethod?: PreferredContactMethod | null;
    profileImageUrl?: string | null;
    profileCompletionStatus: GeneralProfileCompletionStatus;
    activeBusinessProfileType: BusinessProfileType | null;
    createdAt: string;
    updatedAt: string;
}

interface ActiveBusinessProfileSummary {
    activeBusinessProfile: {
        profileType: BusinessProfileType;
    } | null;
}

interface GeneralProfileFormValues {
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    preferredContactMethod: PreferredContactMethod;
    profileImageUrl: string;
    confirmCompletion: boolean;
}

interface UpdateGeneralProfilePayload {
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    preferredContactMethod: PreferredContactMethod;
    profileImageUrl: string | null;
}

interface CompleteGeneralProfilePayload {
    confirmCompletion: true;
}

const GENERAL_PROFILE_ENDPOINT = "/profiles/me/general";
const COMPLETE_GENERAL_PROFILE_ENDPOINT =
    "/profiles/me/general/complete";

const EMPTY_FORM_VALUES: GeneralProfileFormValues = {
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    preferredContactMethod: "email",
    profileImageUrl: "",
    confirmCompletion: false,
};

function getDashboardDestination(
    profileType: BusinessProfileType | null | undefined,
): string {
    if (!profileType || !isBusinessProfileType(profileType)) {
        return "/dashboard";
    }

    return getDashboardPathForBusinessProfile(profileType);
}

function profileToFormValues(
    profile: GeneralProfile,
): GeneralProfileFormValues {
    return {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        displayName: profile.displayName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        preferredContactMethod:
            profile.preferredContactMethod ?? "email",
        profileImageUrl: profile.profileImageUrl ?? "",
        confirmCompletion: false,
    };
}

function buildDisplayName(
    firstName: string,
    lastName: string,
): string {
    return `${firstName.trim()} ${lastName.trim()}`
        .trim()
        .replace(/\s+/g, " ");
}

export function GeneralProfilePageClient() {
    const router = useRouter();

    const [profile, setProfile] =
        useState<GeneralProfile | null>(null);
    const [values, setValues] =
        useState<GeneralProfileFormValues>(
            EMPTY_FORM_VALUES,
        );
    const [isLoading, setIsLoading] =
        useState(true);
    const [isSaving, setIsSaving] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);
    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const redirectToDashboard =
        useCallback(
            async (
                fallbackProfileType:
                    | BusinessProfileType
                    | null,
            ): Promise<void> => {
                try {
                    const activeProfile =
                        await authApiGet<ActiveBusinessProfileSummary>(
                            "/profiles/me/active-business-profile",
                        );

                    router.replace(
                        getDashboardDestination(
                            activeProfile
                                .activeBusinessProfile
                                ?.profileType ??
                                fallbackProfileType,
                        ),
                    );
                } catch {
                    router.replace(
                        getDashboardDestination(
                            fallbackProfileType,
                        ),
                    );
                }

                router.refresh();
            },
            [router],
        );

    const loadProfile =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<GeneralProfile>(
                        GENERAL_PROFILE_ENDPOINT,
                    );

                setProfile(result);
                setValues(profileToFormValues(result));

                if (
                    result.profileCompletionStatus ===
                    "completed"
                ) {
                    await redirectToDashboard(
                        result.activeBusinessProfileType,
                    );
                }
            } catch {
                setErrorMessage(
                    "We could not load your general profile. Refresh the page and try again.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [redirectToDashboard]);

    useEffect((): void => {
        void Promise.resolve().then(loadProfile);
    }, [loadProfile]);

    const updateValue = <
        TKey extends keyof GeneralProfileFormValues,
    >(
        key: TKey,
        value: GeneralProfileFormValues[TKey],
    ): void => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleNameChange = (
        key: "firstName" | "lastName",
        value: string,
    ): void => {
        setValues((current) => {
            const nextValues = {
                ...current,
                [key]: value,
            };

            return {
                ...nextValues,
                displayName:
                    current.displayName ===
                        buildDisplayName(
                            current.firstName,
                            current.lastName,
                        ) ||
                    current.displayName.trim() === ""
                        ? buildDisplayName(
                              nextValues.firstName,
                              nextValues.lastName,
                          )
                        : current.displayName,
            };
        });

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const firstName = values.firstName.trim();
        const lastName = values.lastName.trim();
        const displayName = values.displayName.trim();
        const phoneNumber = values.phoneNumber.trim();
        const profileImageUrl =
            values.profileImageUrl.trim();

        if (!firstName || !lastName || !displayName) {
            setErrorMessage(
                "Enter your first name, last name, and display name.",
            );
            return;
        }

        if (!phoneNumber) {
            setErrorMessage(
                "Enter a phone number for account contact and verification workflows.",
            );
            return;
        }

        if (!values.confirmCompletion) {
            setErrorMessage(
                "Confirm that your general profile is complete before continuing.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload: UpdateGeneralProfilePayload = {
            firstName,
            lastName,
            displayName,
            phoneNumber,
            preferredContactMethod:
                values.preferredContactMethod,
            profileImageUrl:
                profileImageUrl.length > 0
                    ? profileImageUrl
                    : null,
        };

        try {
            const updatedProfile =
                await authApiPatch<
                    GeneralProfile,
                    UpdateGeneralProfilePayload
                >(GENERAL_PROFILE_ENDPOINT, payload);

            const completedProfile =
                await authApiPost<
                    GeneralProfile,
                    CompleteGeneralProfilePayload
                >(COMPLETE_GENERAL_PROFILE_ENDPOINT, {
                    confirmCompletion: true,
                });

            setProfile(completedProfile);
            setValues(
                profileToFormValues(completedProfile),
            );
            setSuccessMessage(
                "Your general profile has been completed.",
            );

            await redirectToDashboard(
                completedProfile.activeBusinessProfileType ??
                    updatedProfile.activeBusinessProfileType,
            );
        } catch {
            setErrorMessage(
                "We could not complete your general profile. Review your details and try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    General profile
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Complete your profile details
                </h1>

                <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                    Add your identity and contact details before entering your
                    role dashboard. Dashboard state will be checked again after
                    completion.
                </p>
            </header>

            {profile ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    Profile status:{" "}
                    <strong className="text-[var(--foreground)]">
                        {profile.profileCompletionStatus.replace(
                            /_/g,
                            " ",
                        )}
                    </strong>
                </div>
            ) : null}

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            <form
                className="mt-6 grid gap-6"
                onSubmit={handleSubmit}
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Personal details
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="firstName"
                            >
                                First name
                            </label>
                            <input
                                autoComplete="given-name"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="firstName"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    handleNameChange(
                                        "firstName",
                                        event.target.value,
                                    )
                                }
                                required
                                value={values.firstName}
                            />
                        </div>

                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="lastName"
                            >
                                Last name
                            </label>
                            <input
                                autoComplete="family-name"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="lastName"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    handleNameChange(
                                        "lastName",
                                        event.target.value,
                                    )
                                }
                                required
                                value={values.lastName}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="displayName"
                            >
                                Display name
                            </label>
                            <input
                                autoComplete="name"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="displayName"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "displayName",
                                        event.target.value,
                                    )
                                }
                                required
                                value={values.displayName}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Contact preferences
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="phoneNumber"
                            >
                                Phone number
                            </label>
                            <input
                                autoComplete="tel"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="phoneNumber"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "phoneNumber",
                                        event.target.value,
                                    )
                                }
                                required
                                type="tel"
                                value={values.phoneNumber}
                            />
                        </div>

                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="preferredContactMethod"
                            >
                                Preferred contact method
                            </label>
                            <select
                                className={fieldClassName}
                                disabled={isSaving}
                                id="preferredContactMethod"
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateValue(
                                        "preferredContactMethod",
                                        event.target
                                            .value as PreferredContactMethod,
                                    )
                                }
                                required
                                value={
                                    values.preferredContactMethod
                                }
                            >
                                <option value="email">
                                    Email
                                </option>
                                <option value="phone">
                                    Phone
                                </option>
                                <option value="whatsapp">
                                    WhatsApp
                                </option>
                                <option value="platform_message">
                                    Platform message
                                </option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="profileImageUrl"
                            >
                                Profile image URL
                            </label>
                            <input
                                autoComplete="url"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="profileImageUrl"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "profileImageUrl",
                                        event.target.value,
                                    )
                                }
                                placeholder="https://..."
                                type="url"
                                value={values.profileImageUrl}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <label className="flex items-start gap-3">
                        <input
                            checked={values.confirmCompletion}
                            className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            disabled={isSaving}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "confirmCompletion",
                                    event.target.checked,
                                )
                            }
                            type="checkbox"
                        />

                        <span className="text-sm leading-6">
                            I confirm that my general profile details are
                            complete and accurate.
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                            href="/auth/sign-in"
                        >
                            Back to sign in
                        </Link>

                        <button
                            className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                            disabled={isSaving}
                            type="submit"
                        >
                            {isSaving
                                ? "Completing profile..."
                                : "Complete profile"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}
