"use client";

// File: app/dashboard/_components/service-provider-profile-page.tsx

/**
 * Asancha Service Provider Profile Page
 *
 * Purpose:
 * Displays and updates the public business and professional profile linked to
 * the active service-provider context.
 *
 * Security notes:
 * - Client validation is UX guidance only.
 * - Backend profile ownership, account, verification, document, policy, and
 *   lifecycle rules remain authoritative.
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
import { SERVICE_CATEGORY_OPTIONS } from "../_config/service-provider-dashboard.config";
import type {
    ServiceProviderProfile,
    ServiceProviderProfileFormValues,
    UpdateServiceProviderProfilePayload,
} from "../_types/service-provider-dashboard.types";

function profileToFormValues(
    profile: ServiceProviderProfile,
): ServiceProviderProfileFormValues {
    return {
        displayName: profile.displayName,
        businessName: profile.businessName,

        professionalTitle:
            profile.professionalTitle,

        serviceCategories:
            profile.serviceCategories,

        shortDescription:
            profile.shortDescription,

        fullDescription:
            profile.fullDescription,

        yearsOfExperience:
            profile.yearsOfExperience,

        website: profile.website,

        contactEmail:
            profile.contactEmail,

        contactPhone:
            profile.contactPhone,

        businessRegistrationNumber:
            profile.businessRegistrationNumber,

        professionalMemberships:
            profile.professionalMemberships,

        primaryAddress:
            profile.primaryAddress,

        emergencyServiceAvailable:
            profile.emergencyServiceAvailable,

        remoteServiceAvailable:
            profile.remoteServiceAvailable,

        informationAccurateConfirmed:
            false,
    };
}

function splitLines(value: string): string[] {
    return value
        .split(/\r?\n/)
        .map(
            (item: string): string =>
                item.trim(),
        )
        .filter(Boolean);
}

function joinLines(values: string[]): string {
    return values.join("\n");
}

export function ServiceProviderProfilePage() {
    const [profile, setProfile] =
        useState<ServiceProviderProfile | null>(
            null,
        );

    const [values, setValues] =
        useState<ServiceProviderProfileFormValues | null>(
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
                    await authApiGet<ServiceProviderProfile>(
                        "/profiles/service-provider/me",
                    );

                setProfile(result);
                setValues(
                    profileToFormValues(result),
                );
            } catch {
                setErrorMessage(
                    "We could not load your service-provider profile.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadProfile();
    }, [loadProfile]);

    const updateRoot = <
        TKey extends keyof ServiceProviderProfileFormValues,
    >(
        key: TKey,
        value: ServiceProviderProfileFormValues[TKey],
    ): void => {
        setValues(
            (
                current:
                    | ServiceProviderProfileFormValues
                    | null,
            ):
                | ServiceProviderProfileFormValues
                | null =>
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

    const updateAddress = <
        TKey extends keyof ServiceProviderProfileFormValues["primaryAddress"],
    >(
        key: TKey,
        value: ServiceProviderProfileFormValues["primaryAddress"][TKey],
    ): void => {
        setValues(
            (
                current:
                    | ServiceProviderProfileFormValues
                    | null,
            ):
                | ServiceProviderProfileFormValues
                | null =>
                current
                    ? {
                          ...current,
                          primaryAddress: {
                              ...current.primaryAddress,
                              [key]: value,
                          },
                      }
                    : current,
        );

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleCategoryChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const selectedValues: string[] =
            Array.from(
                event.target.selectedOptions,
            ).map(
                (
                    option: HTMLOptionElement,
                ): string => option.value,
            );

        updateRoot(
            "serviceCategories",
            selectedValues,
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!profile || !values) {
            return;
        }

        if (!profile.canEdit) {
            setErrorMessage(
                "This profile cannot currently be edited.",
            );
            return;
        }

        if (
            values.serviceCategories.length === 0
        ) {
            setErrorMessage(
                "Select at least one service category.",
            );
            return;
        }

        if (
            values.shortDescription.trim()
                .length < 20
        ) {
            setErrorMessage(
                "Enter a clear short description of at least 20 characters.",
            );
            return;
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that the profile information is accurate.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateServiceProviderProfilePayload = {
            data: values,
        };

        try {
            const result =
                await authApiPatch<ServiceProviderProfile>(
                    "/profiles/service-provider/me",
                    payload,
                );

            setProfile(result);
            setValues(
                profileToFormValues(result),
            );

            setSuccessMessage(
                "Your service-provider profile has been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update your service-provider profile.",
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
                        "Your service-provider profile is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Provider identity
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Service profile
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Maintain the professional and
                    business information used to assess
                    verification and service visibility.
                </p>
            </header>

            <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold">
                    Profile: {profile.profileStatus}
                </span>

                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                    Verification:{" "}
                    {profile.verificationStatus}
                </span>

                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                    Visibility:{" "}
                    {profile.visibilityStatus}
                </span>
            </div>

            {profile.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {profile.safeUserMessage}
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
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Professional details
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="displayName"
                                className="text-sm font-semibold"
                            >
                                Display name
                            </label>

                            <input
                                id="displayName"
                                required
                                disabled={!profile.canEdit}
                                value={values.displayName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "displayName",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="businessName"
                                className="text-sm font-semibold"
                            >
                                Business name
                            </label>

                            <input
                                id="businessName"
                                disabled={!profile.canEdit}
                                value={
                                    values.businessName ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "businessName",
                                        event.target
                                            .value || null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="professionalTitle"
                                className="text-sm font-semibold"
                            >
                                Professional title
                            </label>

                            <input
                                id="professionalTitle"
                                disabled={!profile.canEdit}
                                value={
                                    values.professionalTitle ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "professionalTitle",
                                        event.target
                                            .value || null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="yearsOfExperience"
                                className="text-sm font-semibold"
                            >
                                Years of experience
                            </label>

                            <input
                                id="yearsOfExperience"
                                type="number"
                                min={0}
                                max={80}
                                disabled={!profile.canEdit}
                                value={
                                    values.yearsOfExperience ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "yearsOfExperience",
                                        event.target.value
                                            ? Number(
                                                  event
                                                      .target
                                                      .value,
                                              )
                                            : null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="serviceCategories"
                                className="text-sm font-semibold"
                            >
                                Service categories
                            </label>

                            <select
                                id="serviceCategories"
                                multiple
                                required
                                disabled={!profile.canEdit}
                                value={
                                    values.serviceCategories
                                }
                                onChange={
                                    handleCategoryChange
                                }
                                className={`${fieldClassName} min-h-48`}
                            >
                                {SERVICE_CATEGORY_OPTIONS.map(
                                    (option) => (
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
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="shortDescription"
                                className="text-sm font-semibold"
                            >
                                Short description
                            </label>

                            <textarea
                                id="shortDescription"
                                required
                                rows={3}
                                disabled={!profile.canEdit}
                                value={
                                    values.shortDescription
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "shortDescription",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="fullDescription"
                                className="text-sm font-semibold"
                            >
                                Full description
                            </label>

                            <textarea
                                id="fullDescription"
                                required
                                rows={7}
                                disabled={!profile.canEdit}
                                value={
                                    values.fullDescription
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "fullDescription",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Business and contact
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="contactEmail"
                                className="text-sm font-semibold"
                            >
                                Contact email
                            </label>

                            <input
                                id="contactEmail"
                                type="email"
                                required
                                disabled={!profile.canEdit}
                                value={
                                    values.contactEmail
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "contactEmail",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contactPhone"
                                className="text-sm font-semibold"
                            >
                                Contact phone
                            </label>

                            <input
                                id="contactPhone"
                                type="tel"
                                disabled={!profile.canEdit}
                                value={
                                    values.contactPhone ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "contactPhone",
                                        event.target
                                            .value || null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="website"
                                className="text-sm font-semibold"
                            >
                                Website
                            </label>

                            <input
                                id="website"
                                type="url"
                                disabled={!profile.canEdit}
                                value={
                                    values.website ?? ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "website",
                                        event.target
                                            .value || null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="businessRegistrationNumber"
                                className="text-sm font-semibold"
                            >
                                Business registration
                                number
                            </label>

                            <input
                                id="businessRegistrationNumber"
                                disabled={!profile.canEdit}
                                value={
                                    values.businessRegistrationNumber ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "businessRegistrationNumber",
                                        event.target
                                            .value || null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="professionalMemberships"
                                className="text-sm font-semibold"
                            >
                                Professional memberships
                            </label>

                            <textarea
                                id="professionalMemberships"
                                rows={4}
                                disabled={!profile.canEdit}
                                value={joinLines(
                                    values.professionalMemberships,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "professionalMemberships",
                                        splitLines(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                placeholder="Enter one membership per line"
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Primary address
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {(
                            [
                                {
                                    key: "addressLine1",
                                    label:
                                        "Address line 1",
                                },
                                {
                                    key: "addressLine2",
                                    label:
                                        "Address line 2",
                                },
                                {
                                    key: "townCity",
                                    label:
                                        "Town or city",
                                },
                                {
                                    key: "county",
                                    label: "County",
                                },
                                {
                                    key: "postcode",
                                    label: "Postcode",
                                },
                                {
                                    key: "country",
                                    label: "Country",
                                },
                            ] as const
                        ).map((field) => {
                            const fieldValue =
                                values.primaryAddress[
                                    field.key
                                ];

                            return (
                                <div key={field.key}>
                                    <label
                                        htmlFor={
                                            field.key
                                        }
                                        className="text-sm font-semibold"
                                    >
                                        {field.label}
                                    </label>

                                    <input
                                        id={field.key}
                                        disabled={
                                            !profile.canEdit
                                        }
                                        value={
                                            fieldValue ?? ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateAddress(
                                                field.key,
                                                event.target
                                                    .value ||
                                                    null,
                                            )
                                        }
                                        className={
                                            fieldClassName
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <div className="grid gap-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                disabled={!profile.canEdit}
                                checked={
                                    values.remoteServiceAvailable
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "remoteServiceAvailable",
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            />

                            <span className="text-sm leading-6">
                                I provide services remotely
                                where suitable.
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                disabled={!profile.canEdit}
                                checked={
                                    values.emergencyServiceAvailable
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "emergencyServiceAvailable",
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            />

                            <span className="text-sm leading-6">
                                I may accept emergency
                                service requests.
                            </span>
                        </label>

                        {profile.canEdit ? (
                            <label className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
                                <input
                                    type="checkbox"
                                    checked={
                                        values.informationAccurateConfirmed
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateRoot(
                                            "informationAccurateConfirmed",
                                            event.target
                                                .checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 accent-[var(--primary)]"
                                />

                                <span className="text-sm leading-6">
                                    I confirm that this
                                    professional and
                                    business information is
                                    accurate.
                                </span>
                            </label>
                        ) : null}
                    </div>

                    {profile.canEdit ? (
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                        >
                            {isSaving
                                ? "Saving…"
                                : "Save service profile"}
                        </button>
                    ) : null}
                </section>
            </form>
        </main>
    );
}