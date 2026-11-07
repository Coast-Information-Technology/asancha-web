"use client";

// File: app/account/_components/account-notifications-page.tsx

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";

import { notificationsApi } from "../../../src/features/notifications/api/notifications.api";
import {
    NOTIFICATION_SAFE_MESSAGES,
} from "../../../src/features/notifications/constants/notifications.constants";
import { notificationPreferencesSchema } from "../../../src/features/notifications/schemas/notification-preferences.schema";
import type {
    NotificationChannelPreferences,
    NotificationPreferences,
    NotificationPreferenceValues,
    UpdateNotificationPreferencesPayload,
} from "../../../src/features/notifications/types/notifications.types";

type PreferenceCategoryKey =
    keyof NotificationChannelPreferences;
type PreferenceChannel = "inApp" | "email";

interface PreferenceCategoryOption {
    key: PreferenceCategoryKey;
    label: string;
    description: string;
}

const PREFERENCE_CATEGORIES:
    readonly PreferenceCategoryOption[] = [
        {
            key: "account",
            label: "Account",
            description:
                "Account access, status, and identity updates.",
        },
        {
            key: "security",
            label: "Security",
            description:
                "Sign-in, password, session, and account-protection alerts.",
        },
        {
            key: "profile",
            label: "Profile",
            description:
                "Changes involving your general or business profiles.",
        },
        {
            key: "onboarding",
            label: "Onboarding",
            description:
                "Onboarding progress, missing information, and next steps.",
        },
        {
            key: "policy",
            label: "Policies",
            description:
                "Required policy acceptance and policy-version updates.",
        },
        {
            key: "verification",
            label: "Verification",
            description:
                "Verification progress, results, and required changes.",
        },
        {
            key: "document",
            label: "Documents",
            description:
                "Document upload, review, approval, and replacement updates.",
        },
        {
            key: "listing",
            label: "Listings",
            description:
                "Property and opportunity listing activity.",
        },
        {
            key: "reservation",
            label: "Reservations",
            description:
                "Reservation requests, status changes, and required actions.",
        },
        {
            key: "payment",
            label: "Payments",
            description:
                "Payment status, evidence, confirmation, and failure alerts.",
        },
        {
            key: "booking",
            label: "Bookings",
            description:
                "Booking requests, confirmations, changes, and reminders.",
        },
        {
            key: "conversation",
            label: "Conversations",
            description:
                "New messages and conversation updates.",
        },
        {
            key: "ai",
            label: "Recommendations",
            description:
                "Eligible property recommendations and matching updates.",
        },
        {
            key: "apiPartner",
            label: "API partner",
            description:
                "API application, client, key, webhook, and usage updates.",
        },
        {
            key: "system",
            label: "System",
            description:
                "Essential platform availability and service notifications.",
        },
    ];

function toChannelValues(
    channel: NotificationChannelPreferences,
): NotificationPreferenceValues["inApp"] {
    return Object.fromEntries(
        PREFERENCE_CATEGORIES.map(
            (category) => [
                category.key,
                channel[category.key].enabled,
            ],
        ),
    ) as NotificationPreferenceValues["inApp"];
}

function toPreferenceValues(
    preferences: NotificationPreferences,
): NotificationPreferenceValues {
    return {
        inApp: toChannelValues(preferences.inApp),
        email: toChannelValues(preferences.email),
        timezone: preferences.timezone,
        digestEnabled: preferences.digestEnabled,
        digestFrequency:
            preferences.digestFrequency,
    };
}

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function isCategoryPreference(
    value: unknown,
): boolean {
    return (
        isRecord(value) &&
        typeof value.enabled === "boolean" &&
        typeof value.canDisable === "boolean" &&
        (value.lockedReason === null ||
            typeof value.lockedReason === "string")
    );
}

function isNotificationPreferences(
    value: unknown,
): value is NotificationPreferences {
    if (!isRecord(value)) {
        return false;
    }

    const inApp = value.inApp;
    const email = value.email;

    return (
        isRecord(inApp) &&
        isRecord(email) &&
        PREFERENCE_CATEGORIES.every(
            ({ key }) =>
                isCategoryPreference(inApp[key]) &&
                isCategoryPreference(email[key]),
        ) &&
        typeof value.timezone === "string" &&
        typeof value.digestEnabled === "boolean" &&
        (value.digestFrequency === "daily" ||
            value.digestFrequency === "weekly" ||
            value.digestFrequency === "never")
    );
}

export function AccountNotificationsPage() {
    const [preferences, setPreferences] =
        useState<NotificationPreferences | null>(null);
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
                const result: unknown =
                    await notificationsApi.getPreferences();

                if (!isNotificationPreferences(result)) {
                    throw new Error(
                        "Unexpected notification preferences response.",
                    );
                }

                setPreferences(result);
            } catch {
                setErrorMessage(
                    NOTIFICATION_SAFE_MESSAGES.preferencesLoadError,
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        queueMicrotask(() => {
            void loadPreferences();
        });
    }, [loadPreferences]);

    const clearMessages = (): void => {
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    const updateChannelPreference = (
        channel: PreferenceChannel,
        categoryKey: PreferenceCategoryKey,
        enabled: boolean,
    ): void => {
        setPreferences((current) => {
            if (!current) {
                return current;
            }

            const currentPreference =
                current[channel][categoryKey];

            if (
                !currentPreference.canDisable &&
                !enabled
            ) {
                return current;
            }

            return {
                ...current,
                [channel]: {
                    ...current[channel],
                    [categoryKey]: {
                        ...currentPreference,
                        enabled,
                    },
                },
            };
        });

        clearMessages();
    };

    const updateDigestEnabled = (
        enabled: boolean,
    ): void => {
        setPreferences((current) =>
            current
                ? {
                      ...current,
                      digestEnabled: enabled,
                      digestFrequency: enabled
                          ? current.digestFrequency ===
                            "never"
                              ? "daily"
                              : current.digestFrequency
                          : "never",
                  }
                : current,
        );
        clearMessages();
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!preferences) {
            return;
        }

        const validationResult =
            notificationPreferencesSchema.safeParse(
                toPreferenceValues(preferences),
            );

        if (!validationResult.success) {
            setErrorMessage(
                validationResult.error.issues[0]
                    ?.message ??
                    "Review your notification preferences and try again.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateNotificationPreferencesPayload = {
            data: validationResult.data,
        };

        try {
            const result =
                await notificationsApi.updatePreferences(
                    payload,
                );

            if (
                !isNotificationPreferences(
                    result.preferences,
                )
            ) {
                throw new Error(
                    "Unexpected notification preferences response.",
                );
            }

            setPreferences(result.preferences);
            setSuccessMessage(
                result.message ||
                    NOTIFICATION_SAFE_MESSAGES.preferencesSaved,
            );
        } catch {
            setErrorMessage(
                NOTIFICATION_SAFE_MESSAGES.preferencesSaveError,
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-72 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Communication preferences
                </p>
                <h1 className="mt-2 text-3xl font-bold">
                    Notifications
                </h1>
                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Choose how Asancha sends eligible
                    account, profile, property, payment,
                    booking, and conversation updates.
                </p>
            </header>

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

            {preferences ? (
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid gap-6"
                >
                    <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                        {
                            NOTIFICATION_SAFE_MESSAGES.criticalPreference
                        }{" "}
                        {
                            NOTIFICATION_SAFE_MESSAGES.operationalOnly
                        }
                    </div>

                    <section aria-labelledby="notification-channel-heading">
                        <h2
                            id="notification-channel-heading"
                            className="text-xl font-bold"
                        >
                            Notification channels
                        </h2>

                        <div className="mt-4 overflow-x-auto rounded-[var(--asancha-radius-xl)] border border-[var(--border)]">
                            <table className="w-full min-w-[44rem] border-collapse text-sm">
                                <caption className="sr-only">
                                    In-app and email notification
                                    preferences by category
                                </caption>
                                <thead className="bg-[var(--muted)] text-left">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="p-4"
                                        >
                                            Notification
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-center"
                                        >
                                            In app
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-center"
                                        >
                                            Email
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {PREFERENCE_CATEGORIES.map(
                                        (
                                            category,
                                        ): ReactNode => {
                                            const descriptionId =
                                                `notification-${category.key}-description`;

                                            return (
                                                <tr
                                                    key={
                                                        category.key
                                                    }
                                                    className="border-t border-[var(--border)] transition-colors hover:bg-[var(--muted)]/60"
                                                >
                                                    <th
                                                        scope="row"
                                                        className="p-4 text-left font-normal"
                                                    >
                                                        <span className="block font-semibold">
                                                            {
                                                                category.label
                                                            }
                                                        </span>
                                                        <span
                                                            id={
                                                                descriptionId
                                                            }
                                                            className="mt-1 block text-sm leading-6 text-[var(--muted-foreground)]"
                                                        >
                                                            {
                                                                category.description
                                                            }
                                                        </span>
                                                    </th>

                                                    {(
                                                        [
                                                            {
                                                                channel:
                                                                    "inApp" as const,
                                                                label:
                                                                    "in-app",
                                                            },
                                                            {
                                                                channel:
                                                                    "email" as const,
                                                                label:
                                                                    "email",
                                                            },
                                                        ]
                                                    ).map(
                                                        ({
                                                            channel,
                                                            label,
                                                        }) => {
                                                            const preference =
                                                                preferences[
                                                                    channel
                                                                ][
                                                                    category
                                                                        .key
                                                                ];
                                                            const lockedReasonId =
                                                                `notification-${category.key}-${channel}-locked`;

                                                            return (
                                                                <td
                                                                    key={
                                                                        channel
                                                                    }
                                                                    className="p-4 text-center align-middle"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            preference.enabled
                                                                        }
                                                                        disabled={
                                                                            isSaving ||
                                                                            !preference.canDisable
                                                                        }
                                                                        aria-label={`Enable ${label} notifications for ${category.label}`}
                                                                        aria-describedby={
                                                                            !preference.canDisable
                                                                                ? `${descriptionId} ${lockedReasonId}`
                                                                                : descriptionId
                                                                        }
                                                                        onChange={(
                                                                            event: ChangeEvent<HTMLInputElement>,
                                                                        ): void =>
                                                                            updateChannelPreference(
                                                                                channel,
                                                                                category.key,
                                                                                event.target.checked,
                                                                            )
                                                                        }
                                                                        className="h-5 w-5 cursor-pointer accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                                                    />

                                                                    {!preference.canDisable ? (
                                                                        <span
                                                                            id={
                                                                                lockedReasonId
                                                                            }
                                                                            className="mt-1 block text-xs font-semibold text-[var(--muted-foreground)]"
                                                                        >
                                                                            {preference.lockedReason ??
                                                                                "Required"}
                                                                        </span>
                                                                    ) : null}
                                                                </td>
                                                            );
                                                        },
                                                    )}
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section
                        aria-labelledby="notification-digest-heading"
                        className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
                    >
                        <h2
                            id="notification-digest-heading"
                            className="text-xl font-bold"
                        >
                            Email digest
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                            Group eligible email updates into
                            a daily or weekly summary.
                        </p>

                        <label className="mt-5 flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    preferences.digestEnabled
                                }
                                disabled={isSaving}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateDigestEnabled(
                                        event.target.checked,
                                    )
                                }
                                className="mt-1 h-5 w-5 cursor-pointer accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                            />
                            <span>
                                <span className="block font-semibold">
                                    Enable email digest
                                </span>
                                <span className="mt-1 block text-sm leading-6 text-[var(--muted-foreground)]">
                                    Critical notifications may
                                    still be sent immediately.
                                </span>
                            </span>
                        </label>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="digestFrequency"
                                    className="text-sm font-semibold"
                                >
                                    Digest frequency
                                </label>
                                <select
                                    id="digestFrequency"
                                    value={
                                        preferences.digestFrequency
                                    }
                                    disabled={
                                        isSaving ||
                                        !preferences.digestEnabled
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>,
                                    ): void => {
                                        setPreferences(
                                            (current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          digestFrequency:
                                                              event.target.value as NotificationPreferences["digestFrequency"],
                                                      }
                                                    : current,
                                        );
                                        clearMessages();
                                    }}
                                    className="mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="daily">
                                        Daily
                                    </option>
                                    <option value="weekly">
                                        Weekly
                                    </option>
                                    <option value="never">
                                        Never
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="notificationTimezone"
                                    className="text-sm font-semibold"
                                >
                                    Timezone
                                </label>
                                <input
                                    id="notificationTimezone"
                                    type="text"
                                    value={preferences.timezone}
                                    disabled={isSaving}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void => {
                                        setPreferences(
                                            (current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          timezone:
                                                              event.target.value,
                                                      }
                                                    : current,
                                        );
                                        clearMessages();
                                    }}
                                    placeholder="Europe/London"
                                    spellCheck={false}
                                    className="mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="min-h-11 w-fit cursor-pointer rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving
                            ? "Saving…"
                            : "Save preferences"}
                    </button>
                </form>
            ) : null}
        </main>
    );
}
