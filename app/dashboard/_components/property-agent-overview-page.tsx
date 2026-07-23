"use client";

// File: app/dashboard/_components/property-agent-overview-page.tsx

/**
 * Asancha Property Agent Overview Page
 *
 * Purpose:
 * Displays property-agent dashboard metrics, pending actions, locked actions,
 * and quick links.
 *
 * Security notes:
 * - Backend dashboard state is authoritative.
 * - Dashboard access does not approve company, authority, property, listing,
 *   document, booking, or payment actions.
 */

import Link from "next/link";
import {
    useState,
    type ReactNode,
} from "react";

import type {
    PropertyAgentDashboardState,
} from "../_types/property-agent-dashboard.types";

export function PropertyAgentOverviewPage() {
    const [
        dashboardState,
    ] = useState<PropertyAgentDashboardState | null>(
        null,
    );

    const [
        isLoading,
    ] = useState(false);

    const [
        errorMessage,
    ] = useState<string | null>(null);

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
        dashboardState?.propertyAgentSummary;

    const summaryCards = [
        {
            label: "Represented properties",
            value:
                summary?.representedPropertyCount ??
                0,
            href: "/dashboard/property-agent/properties",
        },
        {
            label: "Properties under review",
            value:
                summary?.propertyUnderReviewCount ??
                0,
            href: "/dashboard/property-agent/properties?status=under_review",
        },
        {
            label: "Listing drafts",
            value:
                summary?.listingDraftCount ?? 0,
            href: "/dashboard/property-agent/listings?status=draft",
        },
        {
            label: "Listings under review",
            value:
                summary?.listingUnderReviewCount ??
                0,
            href: "/dashboard/property-agent/listings?status=under_review",
        },
        {
            label: "Published listings",
            value:
                summary?.publishedListingCount ??
                0,
            href: "/dashboard/property-agent/listings?status=published",
        },
        {
            label: "Authority documents pending",
            value:
                summary?.pendingAuthorityDocumentCount ??
                0,
            href: "/dashboard/property-agent/authority-documents",
        },
    ];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="rounded-[var(--asancha-radius-xl)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sm:p-8">
                <p className="text-sm font-semibold opacity-80">
                    Property Agent Workspace
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
                    Manage represented properties,
                    authority evidence, agency listings,
                    verification, viewings, and client
                    communication.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/property-agent/properties/new"
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground hover:bg-foreground/80  px-5 py-2 text-sm font-semibold text-[var(--card-foreground)]"
                    >
                        Add represented property
                    </Link>

                    <Link
                        href="/dashboard/property-agent/authority-documents"
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-current px-5 py-2 text-sm font-semibold"
                    >
                        Upload authority document
                    </Link>
                </div>
            </header>

            {dashboardState?.safeUserMessage ? (
                <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {dashboardState.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Agency summary
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
                <article className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="text-xl font-bold">
                        Workspace activity
                    </h2>

                    <dl className="mt-5 grid gap-4">
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Company verification
                            </dt>
                            <dd className="font-semibold">
                                {summary
                                    ?.companyVerificationStatus ??
                                    "Not started"}
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
                                Upcoming bookings
                            </dt>
                            <dd className="font-semibold">
                                {summary?.upcomingBookingCount ??
                                    0}
                            </dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-[var(--muted-foreground)]">
                                Unread conversations
                            </dt>
                            <dd className="font-semibold">
                                {summary?.unreadConversationCount ??
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
                            property-agent actions.
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
