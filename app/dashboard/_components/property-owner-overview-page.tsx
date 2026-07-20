"use client";

// File: app/dashboard/_components/property-owner-overview-page.tsx

/**
 * Asancha Property Owner Overview Page
 *
 * Purpose:
 * Displays the backend-authored property-owner dashboard summary, pending
 * actions, locked actions, and quick workspace links.
 *
 * Security notes:
 * - Dashboard action permissions must come from the backend.
 * - Dashboard access does not imply property or listing approval.
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
    PropertyOwnerDashboardState,
} from "../_types/property-owner-dashboard.types";
import {
    USE_DASHBOARD_DUMMY_DATA,
    getPreviewDashboardState,
} from "../_lib/dashboard-preview-state";

export function PropertyOwnerOverviewPage() {
    const [dashboardState, setDashboardState] =
        useState<PropertyOwnerDashboardState | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadDashboardState =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                if (USE_DASHBOARD_DUMMY_DATA) {
                    setDashboardState(
                        getPreviewDashboardState<PropertyOwnerDashboardState>(
                            "property_owner",
                        ),
                    );
                    return;
                }

                const state =
                    await authApiGet<PropertyOwnerDashboardState>(
                        "/me/dashboard-state",
                    );

                setDashboardState(state);
            } catch {
                setErrorMessage(
                    "We could not load your property-owner dashboard.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        queueMicrotask(() => {
            void loadDashboardState();
        });
    }, [loadDashboardState]);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    className="h-48 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]"
                    aria-label="Loading property-owner dashboard"
                />
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            </main>
        );
    }

    const summary =
        dashboardState?.propertyOwnerSummary;

    const summaryCards = [
        {
            label: "All properties",
            value: summary?.propertyCount ?? 0,
            href: "/dashboard/property-owner/properties",
        },
        {
            label: "Draft properties",
            value:
                summary?.draftPropertyCount ?? 0,
            href: "/dashboard/property-owner/properties?status=draft",
        },
        {
            label: "Under review",
            value:
                summary?.propertyUnderReviewCount ??
                0,
            href: "/dashboard/property-owner/properties?status=under_review",
        },
        {
            label: "Approved properties",
            value:
                summary?.approvedPropertyCount ??
                0,
            href: "/dashboard/property-owner/properties?status=approved",
        },
        {
            label: "Published listings",
            value:
                summary?.publishedListingCount ??
                0,
            href: "/dashboard/property-owner/listings?status=published",
        },
        {
            label: "Corrections required",
            value:
                summary
                    ?.correctionRequiredPropertyCount ??
                0,
            href: "/dashboard/property-owner/properties?status=correction_required",
        },
    ];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="rounded-[var(--asancha-radius-xl)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sm:p-8">
                <p className="text-sm font-semibold opacity-80">
                    Property Owner Workspace
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
                    Submit owned or controlled property,
                    track review, manage listings,
                    provide required documents, and
                    respond to correction requests.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/property-owner/properties/new"
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--card)] px-5 py-2 text-sm font-semibold text-[var(--card-foreground)]"
                    >
                        Add property
                    </Link>

                    <Link
                        href="/dashboard/property-owner/properties"
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-current px-5 py-2 text-sm font-semibold"
                    >
                        View properties
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

            <section
                className="mt-8"
                aria-labelledby="owner-summary-heading"
            >
                <h2
                    id="owner-summary-heading"
                    className="text-xl font-bold"
                >
                    Property summary
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
                <div className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Workspace activity
                    </h2>

                    <dl className="mt-5 grid gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Pending documents
                            </dt>

                            <dd className="font-semibold">
                                {summary?.pendingDocumentCount ??
                                    0}
                            </dd>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Upcoming bookings
                            </dt>

                            <dd className="font-semibold">
                                {summary?.upcomingBookingCount ??
                                    0}
                            </dd>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Unread conversations
                            </dt>

                            <dd className="font-semibold">
                                {summary?.unreadConversationCount ??
                                    0}
                            </dd>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Pending payments
                            </dt>

                            <dd className="font-semibold">
                                {summary?.pendingPaymentCount ??
                                    0}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
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
                            property-owner actions.
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
