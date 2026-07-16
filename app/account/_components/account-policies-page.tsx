"use client";

// File: app/account/_components/account-policies-page.tsx

/**
 * Asancha Account Policies Page
 *
 * Purpose:
 * Displays accepted, missing, and outdated account and profile policies.
 *
 * Security notes:
 * - Acceptance records remain backend-authoritative.
 * - A frontend checkbox is not proof of acceptance.
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
    AccountPolicyAcceptance,
    AccountPolicyAcceptanceResponse,
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

export function AccountPoliciesPage() {
    const [response, setResponse] =
        useState<AccountPolicyAcceptanceResponse | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadPolicies =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AccountPolicyAcceptanceResponse>(
                        "/policy-acceptances/me",
                    );

                setResponse(result);
            } catch {
                setErrorMessage(
                    "We could not load your policy acceptance records.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadPolicies();
    }, [loadPolicies]);

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
                    Legal and compliance
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Policies
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Review the policy versions accepted
                    by your account and business profiles.
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

            {response ? (
                <>
                    <section className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: "Accepted",
                                value:
                                    response.summary
                                        .acceptedCount,
                            },
                            {
                                label: "Missing",
                                value:
                                    response.summary
                                        .missingCount,
                            },
                            {
                                label: "Outdated",
                                value:
                                    response.summary
                                        .outdatedCount,
                            },
                        ].map((item) => (
                            <article
                                key={item.label}
                                className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    {item.label}
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {item.value}
                                </p>
                            </article>
                        ))}
                    </section>

                    {response.safeUserMessage ? (
                        <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                            {
                                response.safeUserMessage
                            }
                        </div>
                    ) : null}

                    <section className="mt-8">
                        <h2 className="text-xl font-bold">
                            Acceptance records
                        </h2>

                        {response.items.length ? (
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {response.items.map(
                                    (
                                        item:
                                            AccountPolicyAcceptance,
                                    ): ReactNode => (
                                        <article
                                            key={
                                                item.policyAcceptancePublicId
                                            }
                                            className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                                    {item.current
                                                        ? "Current"
                                                        : "Outdated"}
                                                </span>

                                                {item.profileType ? (
                                                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold">
                                                        {formatValue(
                                                            item.profileType,
                                                        )}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <h3 className="mt-3 font-bold">
                                                {
                                                    item.policyTitle
                                                }
                                            </h3>

                                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                                Accepted version:{" "}
                                                {
                                                    item.policyVersion
                                                }
                                            </p>

                                            {item.currentVersion ? (
                                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                                    Current version:{" "}
                                                    {
                                                        item.currentVersion
                                                    }
                                                </p>
                                            ) : null}

                                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                                Accepted:{" "}
                                                {item.acceptedAt
                                                    ? new Date(
                                                          item.acceptedAt,
                                                      ).toLocaleString(
                                                          "en-GB",
                                                      )
                                                    : "Not accepted"}
                                            </p>

                                            {item.safeUserMessage ? (
                                                <p className="mt-3 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                                    {
                                                        item.safeUserMessage
                                                    }
                                                </p>
                                            ) : null}

                                            {item.requiresAction &&
                                            item.actionPath ? (
                                                <Link
                                                    href={
                                                        item.actionPath
                                                    }
                                                    className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                                >
                                                    Review and accept
                                                </Link>
                                            ) : null}
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                                No policy acceptance records
                                are available.
                            </p>
                        )}
                    </section>
                </>
            ) : null}
        </main>
    );
}