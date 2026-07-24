"use client";

// File: app/account/_components/account-status-page.tsx

/**
 * Asancha Account Status Page
 *
 * Purpose:
 * Displays backend-authored account, setup, verification, document, payment,
 * policy, and locked-action status.
 */

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { authApiGet } from "../../../src/lib/api/auth-fetch";
import type {
    AccountStatusResponse,
} from "../_types/account.types";

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function AccountStatusPage() {
    const [status, setStatus] =
        useState<AccountStatusResponse | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadStatus =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AccountStatusResponse>(
                        "/me/dashboard-state",
                    );

                setStatus(result);
            } catch {
                setErrorMessage(
                    "We could not load your account status.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadStatus();
    }, [loadStatus]);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!status) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Account status is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Account readiness
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Account status
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Review the current status controlling your account and
                    profile actions.
                </p>
            </header>

            {status.suspended ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-5 text-sm text-[var(--destructive)]"
                >
                    <strong>
                        Account access is restricted.
                    </strong>

                    <p className="mt-2 leading-6">
                        {status.suspensionMessage ??
                            "Some account actions are unavailable. Contact Asancha support for assistance."}
                    </p>
                </div>
            ) : null}

            {status.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {status.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                    {
                        label: "Account",
                        value:
                            status.accountStatus,
                    },
                    {
                        label: "Email verification",
                        value:
                            status.emailVerificationStatus,
                    },
                    {
                        label: "General profile",
                        value:
                            status.generalProfileStatus,
                    },
                    {
                        label: "Onboarding",
                        value:
                            status.onboardingStatus,
                    },
                    {
                        label: "Verification",
                        value:
                            status.verificationStatus,
                    },
                    {
                        label: "Policies",
                        value:
                            status
                                .policyAcceptanceStatus
                                .complete
                                ? "complete"
                                : "action_required",
                    },
                ].map((item) => (
                    <article
                        key={item.label}
                        className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                    >
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {item.label}
                        </p>

                        <p className="mt-2 text-xl font-bold">
                            {formatValue(
                                item.value,
                            )}
                        </p>
                    </article>
                ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Documents
                    </h2>

                    <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(
                            status.documentStatusSummary,
                        ).map(
                            ([key, value]) => (
                                <div key={key}>
                                    <dt className="text-[var(--muted-foreground)]">
                                        {formatValue(
                                            key,
                                        )}
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {value}
                                    </dd>
                                </div>
                            ),
                        )}
                    </dl>

                    <Link
                        href="/documents"
                        className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                        View documents
                    </Link>
                </article>

                <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Payments
                    </h2>

                    <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(
                            status.paymentStatusSummary,
                        ).map(
                            ([key, value]) => (
                                <div key={key}>
                                    <dt className="text-[var(--muted-foreground)]">
                                        {formatValue(
                                            key,
                                        )}
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {value}
                                    </dd>
                                </div>
                            ),
                        )}
                    </dl>

                    <Link
                        href="/payments"
                        className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                        View payments
                    </Link>
                </article>
            </section>

            {status.lockedActions.length ? (
                <section className="mt-8">
                    <h2 className="text-xl font-bold">
                        Locked actions
                    </h2>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {status.lockedActions.map(
                            (action): ReactNode => (
                                <article
                                    key={
                                        action.actionKey
                                    }
                                    className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--muted)] p-5"
                                >
                                    <h3 className="font-bold">
                                        {action.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {action.lockedReason ??
                                            "This action is currently unavailable."}
                                    </p>

                                    {action.actionLabel &&
                                    action.actionPath ? (
                                        <Link
                                            href={
                                                action.actionPath
                                            }
                                            className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                        >
                                            {
                                                action.actionLabel
                                            }
                                        </Link>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                </section>
            ) : null}
        </main>
    );
}
