"use client";

// File: app/account/_components/account-notifications-page.tsx

/**
 * Asancha Account Notification Preferences Page
 *
 * Purpose:
 * Displays and updates in-app and email notification preferences.
 *
 * Security notes:
 * - Required security and account notifications cannot be disabled.
 * - Backend notification policy remains authoritative.
 */

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    authApiGet,
    authApiPatch,
} from "../../../src/lib/api/auth-fetch";
import type {
    AccountNotificationPreference,
    AccountNotificationPreferencesResponse,
    UpdateNotificationPreferencesPayload,
} from "../_types/account.types";

export function AccountNotificationsPage() {
    const [response, setResponse] =
        useState<AccountNotificationPreferencesResponse | null>(
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
                const result =
                    await authApiGet<AccountNotificationPreferencesResponse>(
                        "/notifications/preferences",
                    );

                setResponse(result);
            } catch {
                setErrorMessage(
                    "We could not load your notification preferences.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadPreferences();
    }, [loadPreferences]);

    const updatePreference = (
        preferenceKey: string,
        field:
            | "inAppEnabled"
            | "emailEnabled",
        value: boolean,
    ): void => {
        setResponse((current) =>
            current
                ? {
                      ...current,
                      items: current.items.map(
                          (
                              item:
                                  AccountNotificationPreference,
                          ) =>
                              item.preferenceKey ===
                              preferenceKey
                                  ? {
                                        ...item,
                                        [field]:
                                            value,
                                    }
                                  : item,
                      ),
                  }
                : current,
        );

        setSuccessMessage(null);
        setErrorMessage(null);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!response) {
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateNotificationPreferencesPayload = {
            data: {
                preferences:
                    response.items.map(
                        (
                            item:
                                AccountNotificationPreference,
                        ) => ({
                            preferenceKey:
                                item.preferenceKey,

                            inAppEnabled:
                                item.inAppEnabled,

                            emailEnabled:
                                item.emailEnabled,
                        }),
                    ),
            },
        };

        try {
            const result =
                await authApiPatch<AccountNotificationPreferencesResponse>(
                    "/notifications/preferences",
                    payload,
                );

            setResponse(result);

            setSuccessMessage(
                "Your notification preferences have been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update your notification preferences.",
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
                    profile, document, verification,
                    listing, payment, booking, and
                    conversation updates.
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

            {response ? (
                <form
                    onSubmit={handleSubmit}
                    className="mt-6"
                >
                    {response.safeUserMessage ? (
                        <div className="mb-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                            {
                                response.safeUserMessage
                            }
                        </div>
                    ) : null}

                    <div className="overflow-x-auto rounded-[var(--asancha-radius-xl)] border border-[var(--border)]">
                        <table className="w-full min-w-[44rem] border-collapse text-sm">
                            <thead className="bg-[var(--muted)] text-left">
                                <tr>
                                    <th className="p-4">
                                        Notification
                                    </th>

                                    <th className="p-4 text-center">
                                        In app
                                    </th>

                                    <th className="p-4 text-center">
                                        Email
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {response.items.map(
                                    (
                                        item:
                                            AccountNotificationPreference,
                                    ): ReactNode => (
                                        <tr
                                            key={
                                                item.preferenceKey
                                            }
                                            className="border-t border-[var(--border)]"
                                        >
                                            <td className="p-4">
                                                <p className="font-semibold">
                                                    {
                                                        item.label
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                                    {
                                                        item.description
                                                    }
                                                </p>

                                                {item.required ? (
                                                    <p className="mt-1 text-xs font-semibold text-[var(--primary)]">
                                                        Required
                                                    </p>
                                                ) : null}
                                            </td>

                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Enable in-app notifications for ${item.label}`}
                                                    disabled={
                                                        item.required
                                                    }
                                                    checked={
                                                        item.inAppEnabled
                                                    }
                                                    onChange={(
                                                        event: ChangeEvent<HTMLInputElement>,
                                                    ): void =>
                                                        updatePreference(
                                                            item.preferenceKey,
                                                            "inAppEnabled",
                                                            event
                                                                .target
                                                                .checked,
                                                        )
                                                    }
                                                    className="h-4 w-4 accent-[var(--primary)]"
                                                />
                                            </td>

                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Enable email notifications for ${item.label}`}
                                                    disabled={
                                                        item.required
                                                    }
                                                    checked={
                                                        item.emailEnabled
                                                    }
                                                    onChange={(
                                                        event: ChangeEvent<HTMLInputElement>,
                                                    ): void =>
                                                        updatePreference(
                                                            item.preferenceKey,
                                                            "emailEnabled",
                                                            event
                                                                .target
                                                                .checked,
                                                        )
                                                    }
                                                    className="h-4 w-4 accent-[var(--primary)]"
                                                />
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
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