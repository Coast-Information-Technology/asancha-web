"use client";

// File: app/dashboard/_components/investor-overview-page.tsx

/**
 * Asancha Investor Overview Page
 *
 * Purpose:
 * Displays backend-authored investor dashboard summaries, next actions and
 * locked actions.
 *
 * Security notes:
 * - The frontend does not derive action permissions.
 * - Locked and unlocked action states come from /me/dashboard-state.
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
    DashboardAction,
    DashboardState,
} from "../_types/dashboard.types";
import {
    USE_DASHBOARD_DUMMY_DATA,
    getPreviewDashboardState,
} from "../_lib/dashboard-preview-state";

function formatStatus(status: string): string {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

export function InvestorOverviewPage() {
    const [dashboardState, setDashboardState] =
        useState<DashboardState | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadState =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                if (USE_DASHBOARD_DUMMY_DATA) {
                    setDashboardState(
                        getPreviewDashboardState<DashboardState>(
                            "investor",
                        ),
                    );
                    return;
                }

                const state =
                    await authApiGet<DashboardState>(
                        "/me/dashboard-state",
                    );

                setDashboardState(state);
            } catch {
                setErrorMessage(
                    "We could not load your investor dashboard.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        queueMicrotask(() => {
            void loadState();
        });
    }, [loadState]);

    const summary =
        dashboardState?.investorSummary;

    const summaryCards = [
        {
            label: "Recommended deals",
            value:
                summary?.recommendedDealCount ??
                0,
            href: "/dashboard/investor/opportunities/recommended",
        },
        {
            label: "Saved properties",
            value:
                summary?.savedDealCount ?? 0,
            href: "/dashboard/investor/saved",
        },
        {
            label: "Active reservations",
            value:
                summary?.activeReservationCount ??
                0,
            href: "/dashboard/investor/reservations",
        },
        {
            label: "Upcoming bookings",
            value:
                summary?.upcomingBookingCount ??
                0,
            href: "/dashboard/investor/bookings",
        },
        {
            label: "Pending payments",
            value:
                summary?.pendingPaymentCount ??
                0,
            href: "/dashboard/investor/payments",
        },
        {
            label: "Pending documents",
            value:
                summary?.pendingDocumentCount ??
                0,
            href: "/dashboard/investor/documents",
        },
    ];

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    className="h-40 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]"
                    aria-label="Loading investor dashboard"
                />
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-5 text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="rounded-[var(--asancha-radius-xl)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sm:p-8">
                <p className="text-sm font-semibold opacity-80">
                    Investor workspace
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Welcome back
                    {dashboardState
                        ?.activeBusinessProfile
                        ?.displayName
                        ? `, ${dashboardState.activeBusinessProfile.displayName}`
                        : ""}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 opacity-90">
                    Discover suitable opportunities,
                    manage saved deals and track the
                    requirements needed for sensitive
                    investor actions.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/investor/opportunities"
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground hover:bg-foreground/80 px-5 py-2 text-sm font-semibold text-[var(--card-foreground)]"
                    >
                        Browse opportunities
                    </Link>

                    <Link
                        href="/dashboard/investor/recommendations"
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-current px-5 py-2 text-sm font-semibold"
                    >
                        View recommendations
                    </Link>
                </div>
            </header>

            {dashboardState?.safeUserMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]"
                >
                    {
                        dashboardState.safeUserMessage
                    }
                </div>
            ) : null}

            <section
                className="mt-8"
                aria-labelledby="investor-summary-heading"
            >
                <h2
                    id="investor-summary-heading"
                    className="text-xl font-bold"
                >
                    Investor summary
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {summaryCards.map(
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
                <div className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Profile status
                    </h2>

                    <dl className="mt-5 grid gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Onboarding
                            </dt>
                            <dd className="font-semibold">
                                {formatStatus(
                                    dashboardState
                                        ?.status
                                        .onboardingStatus ??
                                    "not_started",
                                )}
                            </dd>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Verification
                            </dt>
                            <dd className="font-semibold">
                                {formatStatus(
                                    dashboardState
                                        ?.status
                                        .verificationStatus ??
                                    "not_started",
                                )}
                            </dd>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Approved documents
                            </dt>
                            <dd className="font-semibold">
                                {dashboardState
                                    ?.status
                                    .documentStatusSummary
                                    .approved ?? 0}
                            </dd>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Missing policies
                            </dt>
                            <dd className="font-semibold">
                                {dashboardState
                                    ?.status
                                    .policyAcceptanceStatus
                                    .missingCount ?? 0}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Next actions
                    </h2>

                    {dashboardState?.nextActions
                        .length ? (
                        <ul className="mt-4 grid gap-3">
                            {dashboardState.nextActions.map(
                                (
                                    action: DashboardAction,
                                ): ReactNode => (
                                    <li
                                        key={
                                            action.actionKey
                                        }
                                        className="rounded-md border border-[var(--border)] p-4"
                                    >
                                        <p className="font-semibold">
                                            {
                                                action.title
                                            }
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
                            You have no immediate
                            actions.
                        </p>
                    )}
                </div>
            </section>

            {dashboardState?.lockedActions
                .length ? (
                <section className="mt-8">
                    <h2 className="text-xl font-bold">
                        Locked actions
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        These actions remain unavailable
                        until the stated requirement is
                        completed or reviewed.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {dashboardState.lockedActions.map(
                            (
                                action: DashboardAction,
                            ): ReactNode => (
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
                                            action.description ??
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
