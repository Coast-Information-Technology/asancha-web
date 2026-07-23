"use client";

// File: app/account/_components/account-profile-page.tsx

/**
 * Asancha Account Profile Page
 *
 * Purpose:
 * Displays and updates the authenticated user's general profile.
 *
 * Security notes:
 * - Client-side validation is UX guidance only.
 * - Backend account ownership and profile rules remain authoritative.
 */

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
} from "../../../src/lib/api/auth-fetch";
import type {
    AccountGeneralProfile,
    AccountGeneralProfileFormValues,
    UpdateAccountGeneralProfilePayload,
} from "../_types/account.types";

const GENERAL_PROFILE_ENDPOINT =
    "/profiles/me/general";

function profileToFormValues(
    profile: AccountGeneralProfile,
): AccountGeneralProfileFormValues {
    return {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        displayName: profile.displayName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        preferredContactMethod:
            profile.preferredContactMethod ??
            "email",
        profileImageUrl:
            profile.profileImageUrl ?? "",
        informationAccurateConfirmed:
            false,
    };
}

function formatStatus(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function AccountProfilePage() {
    const [profile, setProfile] =
        useState<AccountGeneralProfile | null>(
            null,
        );

    const [values, setValues] =
        useState<AccountGeneralProfileFormValues | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const loadProfile =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AccountGeneralProfile>(
                        GENERAL_PROFILE_ENDPOINT,
                    );

                setProfile(result);
                setValues(
                    profileToFormValues(result),
                );
            } catch {
                setErrorMessage(
                    "We could not load your profile.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void Promise.resolve().then(loadProfile);
    }, [loadProfile]);

    const updateRoot = <
        TKey extends keyof AccountGeneralProfileFormValues,
    >(
        key: TKey,
        value: AccountGeneralProfileFormValues[TKey],
    ): void => {
        setValues((current) =>
            current
                ? {
                      ...current,
                      [key]: value,
                  }
                : current,
        );

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!values) {
            return;
        }

        const firstName =
            values.firstName.trim();
        const lastName =
            values.lastName.trim();
        const displayName =
            values.displayName.trim();
        const phoneNumber =
            values.phoneNumber.trim();
        const profileImageUrl =
            values.profileImageUrl.trim();

        if (
            !firstName ||
            !lastName ||
            !displayName
        ) {
            setErrorMessage(
                "Enter your first name, last name, and display name.",
            );
            return;
        }

        if (!phoneNumber) {
            setErrorMessage(
                "Enter your phone number.",
            );
            return;
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that your profile information is accurate.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateAccountGeneralProfilePayload = {
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
            const result =
                await authApiPatch<
                    AccountGeneralProfile,
                    UpdateAccountGeneralProfilePayload
                >(
                    GENERAL_PROFILE_ENDPOINT,
                    payload,
                );

            setProfile(result);
            setValues(
                profileToFormValues(result),
            );

            setSuccessMessage(
                "Your profile has been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update your profile.",
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

    if (!profile || !values) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Your profile is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Personal information
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Account profile
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Maintain the general profile details
                    shared across your Asancha account
                    and business workspaces.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Profile status:{" "}
                <strong className="text-[var(--foreground)]">
                    {formatStatus(
                        profile.profileCompletionStatus,
                    )}
                </strong>
            </div>

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
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Identity
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="text-sm font-semibold"
                            >
                                First name
                            </label>

                            <input
                                id="firstName"
                                required
                                disabled={isSaving}
                                value={values.firstName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "firstName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lastName"
                                className="text-sm font-semibold"
                            >
                                Last name
                            </label>

                            <input
                                id="lastName"
                                required
                                disabled={isSaving}
                                value={values.lastName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "lastName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="displayName"
                                className="text-sm font-semibold"
                            >
                                Display name
                            </label>

                            <input
                                id="displayName"
                                required
                                disabled={isSaving}
                                value={values.displayName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "displayName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Contact
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="text-sm font-semibold"
                            >
                                Phone number
                            </label>

                            <input
                                id="phoneNumber"
                                type="tel"
                                required
                                disabled={isSaving}
                                value={values.phoneNumber}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "phoneNumber",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="preferredContactMethod"
                                className="text-sm font-semibold"
                            >
                                Preferred contact method
                            </label>

                            <select
                                id="preferredContactMethod"
                                required
                                disabled={isSaving}
                                value={
                                    values.preferredContactMethod
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRoot(
                                        "preferredContactMethod",
                                        event.target
                                            .value as AccountGeneralProfileFormValues["preferredContactMethod"],
                                    )
                                }
                                className={fieldClassName}
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
                                htmlFor="profileImageUrl"
                                className="text-sm font-semibold"
                            >
                                Profile image URL
                            </label>

                            <input
                                id="profileImageUrl"
                                type="url"
                                disabled={isSaving}
                                value={values.profileImageUrl}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "profileImageUrl",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={
                                values.informationAccurateConfirmed
                            }
                            disabled={isSaving}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateRoot(
                                    "informationAccurateConfirmed",
                                    event.target.checked,
                                )
                            }
                            className="mt-1 h-4 w-4 accent-[var(--primary)]"
                        />

                        <span className="text-sm leading-6">
                            I confirm that this profile
                            information is accurate.
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save profile"}
                    </button>
                </section>
            </form>
        </main>
    );
}
