"use client";

// File: app/dashboard/_components/investor-preferences-page.tsx

/**
 * Asancha Investor Preferences Page
 *
 * Purpose:
 * Displays and updates investor matching preferences by overview, investment
 * and location sections.
 *
 * Security notes:
 * - Preferences guide matching but do not guarantee recommendation outcomes.
 * - Backend validation remains authoritative.
 */

import Link from "next/link";
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
    InvestorPreferenceSection,
    InvestorPreferenceSummary,
} from "../_types/dashboard.types";

export interface InvestorPreferencesPageProps {
    section: InvestorPreferenceSection;
}

type InvestorPreferencesPayload =
    Record<string, unknown> & {
        data: Partial<InvestorPreferenceSummary>;
    };

function joinValues(values: string[]): string {
    return values.join(", ");
}

function splitValues(value: string): string[] {
    return value
        .split(",")
        .map((item: string): string =>
            item.trim(),
        )
        .filter(Boolean);
}

export function InvestorPreferencesPage({
    section,
}: InvestorPreferencesPageProps) {
    const [preferences, setPreferences] =
        useState<InvestorPreferenceSummary | null>(
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

    const loadPreferences =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response =
                    await authApiGet<InvestorPreferenceSummary>(
                        "/profiles/investor/me",
                    );

                setPreferences(response);
            } catch {
                setErrorMessage(
                    "We could not load your investor preferences.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadPreferences();
    }, [loadPreferences]);

    const updateField = <
        TKey extends keyof InvestorPreferenceSummary,
    >(
        key: TKey,
        value: InvestorPreferenceSummary[TKey],
    ): void => {
        setPreferences(
            (
                current:
                    | InvestorPreferenceSummary
                    | null,
            ): InvestorPreferenceSummary | null =>
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

        if (!preferences) {
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            InvestorPreferencesPayload = {
            data: preferences,
        };

        try {
            const response =
                await authApiPatch<InvestorPreferenceSummary>(
                    "/profiles/investor/me",
                    payload,
                );

            setPreferences(response);

            setSuccessMessage(
                "Your investor preferences have been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update your investor preferences.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-64 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!preferences) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Your investor profile is not available."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Investor matching
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    {section === "investment"
                        ? "Investment preferences"
                        : section === "locations"
                            ? "Location preferences"
                            : "Investor preferences"}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Keep your investment preferences
                    current to improve marketplace
                    filtering and recommendation
                    relevance.
                </p>
            </header>

            <nav
                aria-label="Investor preference sections"
                className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4"
            >
                {[
                    {
                        label: "Overview",
                        href: "/dashboard/investor/preferences",
                        value: "overview",
                    },
                    {
                        label: "Investment",
                        href: "/dashboard/investor/preferences/investment",
                        value: "investment",
                    },
                    {
                        label: "Locations",
                        href: "/dashboard/investor/preferences/locations",
                        value: "locations",
                    },
                ].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={
                            section === item.value
                                ? "page"
                                : undefined
                        }
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${section === item.value
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "border border-[var(--border)] hover:bg-[var(--muted)]"
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-md border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-md border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            <form
                onSubmit={handleSubmit}
                className="mt-6 rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
            >
                {section === "overview" ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="investmentGoal"
                                className="text-sm font-semibold"
                            >
                                Investment goal
                            </label>

                            <textarea
                                id="investmentGoal"
                                rows={5}
                                value={
                                    preferences.investmentGoal ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateField(
                                        "investmentGoal",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="experienceLevel"
                                className="text-sm font-semibold"
                            >
                                Experience level
                            </label>

                            <select
                                id="experienceLevel"
                                value={
                                    preferences.experienceLevel ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateField(
                                        "experienceLevel",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select level
                                </option>
                                <option value="first_time">
                                    First-time investor
                                </option>
                                <option value="beginner">
                                    Beginner
                                </option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="experienced">
                                    Experienced
                                </option>
                                <option value="professional">
                                    Professional
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="fundingMethods"
                                className="text-sm font-semibold"
                            >
                                Funding methods
                            </label>

                            <input
                                id="fundingMethods"
                                value={joinValues(
                                    preferences.fundingMethods,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateField(
                                        "fundingMethods",
                                        splitValues(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                placeholder="Cash, mortgage, bridging"
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="purchaseTimeline"
                                className="text-sm font-semibold"
                            >
                                Purchase timeline
                            </label>

                            <input
                                id="purchaseTimeline"
                                value={
                                    preferences.purchaseTimeline ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateField(
                                        "purchaseTimeline",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>
                    </div>
                ) : null}

                {section === "investment" ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="minimumBudget"
                                className="text-sm font-semibold"
                            >
                                Minimum budget
                            </label>

                            <input
                                id="minimumBudget"
                                type="number"
                                min={0}
                                value={
                                    preferences.minimumBudget ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateField(
                                        "minimumBudget",
                                        event.target
                                            .value ===
                                            ""
                                            ? null
                                            : Number(
                                                event
                                                    .target
                                                    .value,
                                            ),
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="maximumBudget"
                                className="text-sm font-semibold"
                            >
                                Maximum budget
                            </label>

                            <input
                                id="maximumBudget"
                                type="number"
                                min={0}
                                value={
                                    preferences.maximumBudget ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateField(
                                        "maximumBudget",
                                        event.target
                                            .value ===
                                            ""
                                            ? null
                                            : Number(
                                                event
                                                    .target
                                                    .value,
                                            ),
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="strategies"
                                className="text-sm font-semibold"
                            >
                                Strategies
                            </label>

                            <input
                                id="strategies"
                                value={joinValues(
                                    preferences.strategies,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateField(
                                        "strategies",
                                        splitValues(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="propertyTypes"
                                className="text-sm font-semibold"
                            >
                                Property types
                            </label>

                            <input
                                id="propertyTypes"
                                value={joinValues(
                                    preferences.propertyTypes,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateField(
                                        "propertyTypes",
                                        splitValues(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        {[
                            {
                                key: "minimumGrossYield",
                                label:
                                    "Minimum gross yield (%)",
                            },
                            {
                                key: "minimumRoi",
                                label: "Minimum ROI (%)",
                            },
                            {
                                key: "minimumBmvDiscount",
                                label:
                                    "Minimum BMV discount (%)",
                            },
                        ].map((item) => (
                            <div key={item.key}>
                                <label
                                    htmlFor={item.key}
                                    className="text-sm font-semibold"
                                >
                                    {item.label}
                                </label>

                                <input
                                    id={item.key}
                                    type="number"
                                    min={0}
                                    step="0.1"
                                    value={
                                        preferences[
                                        item.key as
                                        | "minimumGrossYield"
                                        | "minimumRoi"
                                        | "minimumBmvDiscount"
                                        ] ?? ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateField(
                                            item.key as
                                            | "minimumGrossYield"
                                            | "minimumRoi"
                                            | "minimumBmvDiscount",
                                            event.target
                                                .value ===
                                                ""
                                                ? null
                                                : Number(
                                                    event
                                                        .target
                                                        .value,
                                                ),
                                        )
                                    }
                                    className={
                                        fieldClassName
                                    }
                                />
                            </div>
                        ))}

                        <div className="md:col-span-2">
                            <label
                                htmlFor="dealBreakers"
                                className="text-sm font-semibold"
                            >
                                Deal breakers
                            </label>

                            <textarea
                                id="dealBreakers"
                                rows={4}
                                value={joinValues(
                                    preferences.dealBreakers,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateField(
                                        "dealBreakers",
                                        splitValues(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                ) : null}

                {section === "locations" ? (
                    <div className="grid gap-6">
                        <div>
                            <label
                                htmlFor="preferredLocations"
                                className="text-sm font-semibold"
                            >
                                Preferred locations
                            </label>

                            <textarea
                                id="preferredLocations"
                                rows={4}
                                value={joinValues(
                                    preferences.preferredLocations,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateField(
                                        "preferredLocations",
                                        splitValues(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                placeholder="Manchester, Birmingham, Leeds"
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="excludedLocations"
                                className="text-sm font-semibold"
                            >
                                Excluded locations
                            </label>

                            <textarea
                                id="excludedLocations"
                                rows={4}
                                value={joinValues(
                                    preferences.excludedLocations,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateField(
                                        "excludedLocations",
                                        splitValues(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                ) : null}

                <div className="mt-7 border-t border-[var(--border)] pt-5">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSaving
                            ? "Saving…"
                            : "Save preferences"}
                    </button>
                </div>
            </form>

            <p className="mt-5 text-sm leading-6 text-[var(--muted-foreground)]">
                Preferences improve matching relevance
                but do not guarantee that a recommended
                opportunity is suitable or available.
            </p>
        </main>
    );
}