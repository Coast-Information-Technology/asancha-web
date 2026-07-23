"use client";

// File: app/dashboard/_components/service-provider-overview-page.tsx

/**
 * Asancha Service Provider Overview Page
 *
 * Purpose:
 * Displays service-provider profile, service, booking, verification,
 * availability, document, payment, and conversation summaries.
 *
 * Security notes:
 * - Backend dashboard state remains authoritative.
 * - Dashboard access does not approve a profile, service, booking, document,
 *   verification review, or payment.
 */

import Link from "next/link";
import {
    useState,
    type ReactNode,
} from "react";

import type {
    ServiceProviderDashboardState,
} from "../_types/service-provider-dashboard.types";

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function ServiceProviderOverviewPage() {
    const [
        dashboardState,
    ] =
        useState<ServiceProviderDashboardState | null>(
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
        dashboardState?.serviceProviderSummary;

    const summaryCards = [
        {
            label: "All services",
            value: summary?.serviceCount ?? 0,
            href: "/dashboard/service-provider/services",
        },
        {
            label: "Active services",
            value:
                summary?.activeServiceCount ?? 0,
            href: "/dashboard/service-provider/services?status=active",
        },
        {
            label: "Services under review",
            value:
                summary?.serviceUnderReviewCount ??
                0,
            href: "/dashboard/service-provider/services?status=under_review",
        },
        {
            label: "New booking requests",
            value:
                summary?.newBookingRequestCount ??
                0,
            href: "/dashboard/service-provider/bookings?status=requested",
        },
        {
            label: "Upcoming bookings",
            value:
                summary?.upcomingBookingCount ??
                0,
            href: "/dashboard/service-provider/bookings?status=upcoming",
        },
        {
            label: "Completed bookings",
            value:
                summary?.completedBookingCount ??
                0,
            href: "/dashboard/service-provider/bookings?status=completed",
        },
    ];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="rounded-[var(--asancha-radius-xl)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sm:p-8">
                <p className="text-sm font-semibold opacity-80">
                    Service Provider Workspace
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
                    Manage your professional profile,
                    service catalogue, coverage areas,
                    availability, bookings, documents,
                    and client communication.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/service-provider/services/new"
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 py-2 text-sm font-semibold text-background hover:bg-foreground/80"
                    >
                        Add service
                    </Link>

                    <Link
                        href="/dashboard/service-provider/profile/availability"
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-current px-5 py-2 text-sm font-semibold"
                    >
                        Update availability
                    </Link>
                </div>
            </header>

            {dashboardState?.safeUserMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]"
                >
                    {dashboardState.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Service summary
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {summaryCards.map(
                        (card): ReactNode => (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--primary)]"
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
                        Profile readiness
                    </h2>

                    <dl className="mt-5 grid gap-4">
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Profile status
                            </dt>

                            <dd className="font-semibold">
                                {formatValue(
                                    summary?.profileStatus ??
                                        "not_started",
                                )}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Verification
                            </dt>

                            <dd className="font-semibold">
                                {formatValue(
                                    summary?.verificationStatus ??
                                        "not_started",
                                )}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Public visibility
                            </dt>

                            <dd className="font-semibold">
                                {formatValue(
                                    summary?.visibilityStatus ??
                                        "hidden",
                                )}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Availability
                            </dt>

                            <dd className="font-semibold">
                                {formatValue(
                                    summary?.availabilityStatus ??
                                        "not_configured",
                                )}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Pending documents
                            </dt>

                            <dd className="font-semibold">
                                {summary?.pendingDocumentCount ??
                                    0}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Pending payments
                            </dt>

                            <dd className="font-semibold">
                                {summary?.pendingPaymentCount ??
                                    0}
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
                                        className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
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
                            service-provider actions.
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

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        These actions remain unavailable
                        until the required profile,
                        verification, document, service,
                        or payment condition is met.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {dashboardState.lockedActions.map(
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
