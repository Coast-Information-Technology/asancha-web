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
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    authApiPost,
} from "@/src/lib/api/auth-fetch";

import type {
    PropertyOwnerDashboardState,
} from "../_types/property-owner-dashboard.types";

interface PropertyOwnerOnboardingStartResponse {
    verificationStatus: string;
}

function formatStatusLabel(status: string): string {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

function getVerificationStatusBadgeClassName(
    status: string,
): string {
    switch (status) {
        case "approved":
        case "verified":
            return "border-emerald-200 bg-emerald-50 text-emerald-800";

        case "rejected":
        case "declined":
            return "border-red-200 bg-red-50 text-red-800";

        case "correction_required":
        case "replacement_required":
            return "border-amber-200 bg-amber-50 text-amber-900";

        case "on_hold":
        case "suspended":
            return "border-slate-300 bg-slate-100 text-slate-800";

        case "in_review":
        case "pending":
        default:
            return "border-orange-200 bg-orange-50 text-orange-800";
    }
}

function getVerificationStatusDescription(
    status: string,
): string {
    switch (status) {
        case "approved":
        case "verified":
            return "Your property-owner verification has been approved.";

        case "rejected":
        case "declined":
            return "Your property-owner verification was not approved.";

        case "correction_required":
        case "replacement_required":
            return "Your verification needs updates before review can continue.";

        case "on_hold":
        case "suspended":
            return "Your verification is currently on hold.";

        case "in_review":
            return "Your verification is being reviewed.";

        case "pending":
        default:
            return "Your verification is pending review.";
    }
}

export function PropertyOwnerOverviewPage() {
    const [dashboardState] =
        useState<PropertyOwnerDashboardState | null>(
            null,
        );

    const [isLoading] = useState(false);

    const [errorMessage] =
        useState<string | null>(null);
    const [
        verificationStatus,
        setVerificationStatus,
    ] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        authApiPost<
            PropertyOwnerOnboardingStartResponse,
            {
                profileType: "property_owner";
            }
        >("/onboarding/start", {
            profileType: "property_owner",
        })
            .then((response) => {
                if (isMounted) {
                    setVerificationStatus(
                        response.verificationStatus,
                    );
                }
            })
            .catch(() => {
                if (isMounted) {
                    setVerificationStatus(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

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
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-foreground px-5 py-2 text-sm font-semibold text-background hover:bg-foreground/80"
                    >
                        Add property
                    </Link>

                    <Link
                        href="/dashboard/property-owner/properties"
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-current px-5 py-2 text-sm font-semibold"
                    >
                        View properties
                    </Link>

                    {verificationStatus ? (
                        <span
                            className="group relative inline-flex items-center"
                        >
                            <span
                                aria-describedby="property-owner-verification-status-tooltip"
                                className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-bold shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] ${getVerificationStatusBadgeClassName(
                                    verificationStatus,
                                )}`}
                                tabIndex={0}
                            >
                                <span className="mr-1.5 size-1.5 rounded-full bg-current" />
                                {formatStatusLabel(
                                    verificationStatus,
                                )}
                            </span>

                            <span
                                id="property-owner-verification-status-tooltip"
                                role="tooltip"
                                className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-64 -translate-x-1/2 rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-3 py-2 text-xs font-medium leading-5 text-[var(--background)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                            >
                                {getVerificationStatusDescription(
                                    verificationStatus,
                                )}
                            </span>
                        </span>
                    ) : null}
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
