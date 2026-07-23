"use client";

// File: app/dashboard/_components/property-sourcer-overview-page.tsx

/**
 * Asancha Property Sourcer Overview Page
 *
 * Purpose:
 * Displays deal, compliance, verification, fee, payout, and activity summaries
 * for the active property-sourcer profile.
 *
 * Security notes:
 * - Dashboard state is backend-authored.
 * - Dashboard access does not approve deal submission, publication, payout, or
 *   restricted deal-pack access.
 */

import Link from "next/link";
import {
    useState,
    type ReactNode,
} from "react";

import type {
    PropertySourcerDashboardState,
} from "../_types/property-sourcer-dashboard.types";

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string): string =>
            character.toUpperCase(),
        );
}

export function PropertySourcerOverviewPage() {
    const [dashboardState] =
        useState<PropertySourcerDashboardState | null>(
            null,
        );

    const [isLoading] = useState(false);

    const [errorMessage] =
        useState<string | null>(null);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-48 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            </main>
        );
    }

    const summary =
        dashboardState?.propertySourcerSummary;

    const cards = [
        {
            label: "All deals",
            value: summary?.dealCount ?? 0,
            href: "/dashboard/property-sourcer/deals",
        },
        {
            label: "Draft deals",
            value:
                summary?.draftDealCount ?? 0,
            href: "/dashboard/property-sourcer/deals?status=draft",
        },
        {
            label: "Under review",
            value:
                summary?.dealUnderReviewCount ??
                0,
            href: "/dashboard/property-sourcer/deals?status=under_review",
        },
        {
            label: "Published deals",
            value:
                summary?.publishedDealCount ??
                0,
            href: "/dashboard/property-sourcer/deals?status=published",
        },
        {
            label: "Needs correction",
            value:
                summary?.correctionRequiredDealCount ??
                0,
            href: "/dashboard/property-sourcer/deals?status=correction_required",
        },
        {
            label: "Deal packs",
            value:
                summary?.dealPackCount ?? 0,
            href: "/dashboard/property-sourcer/deal-packs",
        },
    ];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="rounded-[var(--asancha-radius-xl)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sm:p-8">
                <p className="text-sm font-semibold opacity-80">
                    Property Sourcer Workspace
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Welcome
                    {dashboardState
                        ?.activeBusinessProfile
                        ?.displayName
                        ? `, ${dashboardState.activeBusinessProfile.displayName}`
                        : ""}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 opacity-90">
                    Package investment-focused
                    opportunities, maintain compliance,
                    track deal review, and understand safe
                    performance summaries.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/property-sourcer/deals/new"
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 py-2 text-sm font-semibold text-background hover:bg-foreground/80"
                    >
                        Submit deal
                    </Link>

                    <Link
                        href="/dashboard/property-sourcer/compliance"
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-current px-5 py-2 text-sm font-semibold"
                    >
                        Review compliance
                    </Link>
                </div>
            </header>

            {dashboardState?.safeUserMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]"
                >
                    {dashboardState.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Deal summary
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map(
                        (card): ReactNode => (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--primary)]"
                            >
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    {card.label}
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {card.value}
                                </p>
                            </Link>
                        ),
                    )}
                </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <article className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Compliance and readiness
                    </h2>

                    <dl className="mt-5 grid gap-4">
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Listing standards
                            </dt>
                            <dd className="font-semibold">
                                {summary
                                    ?.listingStandardsAccepted
                                    ? "Accepted"
                                    : "Action required"}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Compliance declaration
                            </dt>
                            <dd className="font-semibold">
                                {summary
                                    ?.complianceDeclarationAccepted
                                    ? "Accepted"
                                    : "Action required"}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Verification
                            </dt>
                            <dd className="font-semibold">
                                {formatValue(
                                    dashboardState
                                        ?.activeBusinessProfile
                                        ?.verificationStatus ??
                                        "not_started",
                                )}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Fee model
                            </dt>
                            <dd className="font-semibold">
                                {formatValue(
                                    summary?.feeModelStatus ??
                                        "not_started",
                                )}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Payout readiness
                            </dt>
                            <dd className="font-semibold">
                                {formatValue(
                                    summary?.payoutReadinessStatus ??
                                        "not_started",
                                )}
                            </dd>
                        </div>
                    </dl>
                </article>

                <article className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Next actions
                    </h2>

                    {dashboardState?.pendingActions
                        .length ? (
                        <ul className="mt-4 grid gap-3">
                            {dashboardState.pendingActions.map(
                                (action): ReactNode => (
                                    <li
                                        key={
                                            action.actionKey
                                        }
                                        className="rounded-md border border-[var(--border)] p-4"
                                    >
                                        <p className="font-semibold">
                                            {action.title}
                                        </p>

                                        {action.description ? (
                                            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                                {
                                                    action.description
                                                }
                                            </p>
                                        ) : null}

                                        {action.actionLabel &&
                                        action.actionPath ? (
                                            <Link
                                                href={
                                                    action.actionPath
                                                }
                                                className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                            >
                                                {
                                                    action.actionLabel
                                                }
                                            </Link>
                                        ) : null}
                                    </li>
                                ),
                            )}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                            There are no immediate
                            sourcer actions.
                        </p>
                    )}
                </article>
            </section>

            {dashboardState?.lockedActions
                .length ? (
                <section className="mt-8">
                    <h2 className="text-xl font-bold">
                        Locked actions
                    </h2>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {dashboardState.lockedActions.map(
                            (action): ReactNode => (
                                <article
                                    key={
                                        action.actionKey
                                    }
                                    className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5"
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
