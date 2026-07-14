"use client";

// File: app/dashboard/_components/property-sourcer-compliance-page.tsx

/**
 * Asancha Property Sourcer Compliance Page
 *
 * Purpose:
 * Displays authoritative policy acceptance, verification, fee-model, payout,
 * and deal-submission readiness states.
 *
 * Security notes:
 * - Policy acceptance is read from backend policy records.
 * - Profile convenience flags are not authoritative.
 */

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { authApiGet } from "../../../src/lib/api/auth-fetch";
import { SOURCER_POLICY_ROUTES } from "../_config/property-sourcer-dashboard.config";
import type {
    SourcerComplianceStatus,
} from "../_types/property-sourcer-dashboard.types";

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string): string =>
            character.toUpperCase(),
        );
}

export function PropertySourcerCompliancePage() {
    const [status, setStatus] =
        useState<SourcerComplianceStatus | null>(
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
                    await authApiGet<SourcerComplianceStatus>(
                        "/profiles/property-sourcer/me/compliance",
                    );

                setStatus(result);
            } catch {
                setErrorMessage(
                    "We could not load your sourcer compliance status.",
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
                <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    if (!status) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Compliance status is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Sourcer compliance
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Compliance
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Review the declarations, policies,
                    verification and commercial
                    requirements controlling deal
                    submission and payout readiness.
                </p>
            </header>

            {status.safeUserMessage ? (
                <div className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {status.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Required policy
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                        Listing standards
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        Status:{" "}
                        <strong className="text-[var(--foreground)]">
                            {status.listingStandards
                                .accepted &&
                            !status.listingStandards
                                .requiresAcceptance
                                ? "Accepted"
                                : "Acceptance required"}
                        </strong>
                    </p>

                    {status.listingStandards
                        .acceptedVersion ? (
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Accepted version:{" "}
                            {
                                status.listingStandards
                                    .acceptedVersion
                            }
                        </p>
                    ) : null}

                    <Link
                        href={
                            SOURCER_POLICY_ROUTES.listing_standards
                        }
                        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Review listing standards
                    </Link>
                </article>

                <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Required declaration
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                        Sourcer compliance declaration
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        Status:{" "}
                        <strong className="text-[var(--foreground)]">
                            {status
                                .complianceDeclaration
                                .accepted &&
                            !status
                                .complianceDeclaration
                                .requiresAcceptance
                                ? "Accepted"
                                : "Acceptance required"}
                        </strong>
                    </p>

                    <Link
                        href={
                            SOURCER_POLICY_ROUTES.sourcer_compliance_declaration
                        }
                        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Review declaration
                    </Link>
                </article>
            </section>

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="text-xl font-bold">
                    Readiness
                </h2>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                            Verification
                        </dt>

                        <dd className="mt-1 font-semibold">
                            {formatValue(
                                status.verificationStatus,
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                            Fee model
                        </dt>

                        <dd className="mt-1 font-semibold">
                            {formatValue(
                                status.feeModelStatus,
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                            Payout readiness
                        </dt>

                        <dd className="mt-1 font-semibold">
                            {formatValue(
                                status.payoutReadinessStatus,
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                            Deal submission
                        </dt>

                        <dd className="mt-1 font-semibold">
                            {status.canSubmitDeal
                                ? "Available"
                                : "Locked"}
                        </dd>
                    </div>
                </dl>

                {!status.canSubmitDeal &&
                status.dealSubmissionLockedReason ? (
                    <p className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                        {
                            status.dealSubmissionLockedReason
                        }
                    </p>
                ) : null}
            </section>
        </main>
    );
}