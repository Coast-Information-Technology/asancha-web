"use client";

// File: app/account/_components/account-overview-page.tsx

/**
 * Asancha Account Overview Page
 *
 * Purpose:
 * Displays account identity, active business profile, profile summaries,
 * policy, verification, document, and payment summaries.
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
    AccountBusinessProfileSummary,
    AccountOverview,
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

export function AccountOverviewPage() {
    const [account, setAccount] =
        useState<AccountOverview | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadAccount =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AccountOverview>(
                        "/me",
                    );

                setAccount(result);
            } catch {
                setErrorMessage(
                    "We could not load your account information.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadAccount();
    }, [loadAccount]);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!account) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Your account is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Account
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Account overview
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Review your account identity,
                    active business profile, setup state,
                    policies, verification, documents,
                    and payments.
                </p>
            </header>

            {account.safeUserMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]"
                >
                    {account.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Account",
                        value: formatValue(
                            account.accountStatus,
                        ),
                    },
                    {
                        label: "Email",
                        value: formatValue(
                            account.emailVerificationStatus,
                        ),
                    },
                    {
                        label: "Onboarding",
                        value: formatValue(
                            account.onboardingStatus,
                        ),
                    },
                    {
                        label: "Policies",
                        value:
                            account
                                .policyAcceptanceSummary
                                .complete
                                ? "Complete"
                                : `${account.policyAcceptanceSummary.missingCount} missing`,
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
                            {item.value}
                        </p>
                    </article>
                ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Account identity
                    </h2>

                    <dl className="mt-5 grid gap-4">
                        <div>
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Email
                            </dt>

                            <dd className="mt-1 font-semibold">
                                {account.email}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Phone number
                            </dt>

                            <dd className="mt-1 font-semibold">
                                {account.phoneNumber ??
                                    "Not provided"}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                            href="/account/profile"
                            className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                        >
                            Edit profile
                        </Link>

                        <Link
                            href="/account/security"
                            className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                        >
                            Security
                        </Link>
                    </div>
                </article>

                <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Active business profile
                    </h2>

                    {account.activeBusinessProfile ? (
                        <>
                            <p className="mt-4 text-lg font-bold">
                                {
                                    account
                                        .activeBusinessProfile
                                        .displayName
                                }
                            </p>

                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                {formatValue(
                                    account
                                        .activeBusinessProfile
                                        .profileType,
                                )}
                            </p>

                            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-[var(--muted-foreground)]">
                                        Onboarding
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {formatValue(
                                            account
                                                .activeBusinessProfile
                                                .onboardingStatus,
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[var(--muted-foreground)]">
                                        Verification
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {formatValue(
                                            account
                                                .activeBusinessProfile
                                                .verificationStatus,
                                        )}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {account
                                    .activeBusinessProfile
                                    .dashboardPath ? (
                                    <Link
                                        href={
                                            account
                                                .activeBusinessProfile
                                                .dashboardPath
                                        }
                                        className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                                    >
                                        Open dashboard
                                    </Link>
                                ) : null}

                                <Link
                                    href={
                                        account
                                            .activeBusinessProfile
                                            .detailPath
                                    }
                                    className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                >
                                    View profile
                                </Link>
                            </div>
                        </>
                    ) : (
                        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                            No active business profile is
                            available.
                        </p>
                    )}
                </article>
            </section>

            <section className="mt-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            Business profiles
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Profiles already linked to
                            this account.
                        </p>
                    </div>

                    <Link
                        href="/account/business-profiles/add"
                        className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Add business profile
                    </Link>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {account.availableBusinessProfiles.map(
                        (
                            profile:
                                AccountBusinessProfileSummary,
                        ): ReactNode => (
                            <article
                                key={
                                    profile.profilePublicId
                                }
                                className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                        {formatValue(
                                            profile.profileType,
                                        )}
                                    </span>

                                    {profile.isActive ? (
                                        <span className="rounded-full border border-[var(--primary)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                                            Active
                                        </span>
                                    ) : null}
                                </div>

                                <h3 className="mt-3 font-bold">
                                    {profile.displayName}
                                </h3>

                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                    Verification:{" "}
                                    {formatValue(
                                        profile.verificationStatus,
                                    )}
                                </p>

                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                    Pending actions:{" "}
                                    {
                                        profile.pendingActionCount
                                    }
                                </p>

                                <Link
                                    href={
                                        profile.detailPath
                                    }
                                    className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                >
                                    View profile
                                </Link>
                            </article>
                        ),
                    )}
                </div>
            </section>
        </main>
    );
}