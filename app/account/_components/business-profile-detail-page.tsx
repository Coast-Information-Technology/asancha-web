"use client";

// File: app/account/_components/business-profile-detail-page.tsx

/**
 * Asancha Business Profile Detail Page
 *
 * Purpose:
 * Displays one authenticated user's business profile by its public ID.
 *
 * Security notes:
 * - Backend ownership and profile access checks remain authoritative.
 * - Internal ObjectIds and staff-only review information must not appear.
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
    BusinessProfileDetail,
} from "../_types/account.types";

export interface BusinessProfileDetailPageProps {
    profilePublicId: string;
}

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function BusinessProfileDetailPage({
    profilePublicId,
}: BusinessProfileDetailPageProps) {
    const [detail, setDetail] =
        useState<BusinessProfileDetail | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadProfile =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<BusinessProfileDetail>(
                        `/profiles/me/business-profiles/${encodeURIComponent(
                            profilePublicId,
                        )}`,
                    );

                setDetail(result);
            } catch {
                setErrorMessage(
                    "We could not load this business profile.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [profilePublicId]);

    useEffect((): void => {
        void loadProfile();
    }, [loadProfile]);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!detail) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "This business profile is unavailable."}
                </div>
            </main>
        );
    }

    const { profile } = detail;

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
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

                    <h1 className="mt-3 text-3xl font-bold">
                        {profile.displayName}
                    </h1>

                    <p className="mt-2 text-[var(--muted-foreground)]">
                        Business profile details and
                        current action readiness.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {profile.dashboardPath ? (
                        <Link
                            href={
                                profile.dashboardPath
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                        >
                            Open dashboard
                        </Link>
                    ) : null}

                    {profile.continueSetupPath ? (
                        <Link
                            href={
                                profile.continueSetupPath
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Continue setup
                        </Link>
                    ) : null}
                </div>
            </header>

            {detail.safeUserMessage ||
            profile.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {detail.safeUserMessage ??
                        profile.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="grid gap-6">
                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Status
                        </h2>

                        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                            {Object.entries(
                                detail.statusSummary,
                            ).map(
                                ([key, value]) => (
                                    <div key={key}>
                                        <dt className="text-sm text-[var(--muted-foreground)]">
                                            {formatValue(
                                                key,
                                            )}
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {formatValue(
                                                value,
                                            )}
                                        </dd>
                                    </div>
                                ),
                            )}
                        </dl>
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="text-xl font-bold">
                            Recent activity
                        </h2>

                        {detail.recentActivity
                            .length ? (
                            <ol className="mt-4 grid gap-4">
                                {detail.recentActivity.map(
                                    (
                                        activity,
                                    ): ReactNode => (
                                        <li
                                            key={
                                                activity.activityPublicId
                                            }
                                            className="border-l-2 border-[var(--primary)] pl-4"
                                        >
                                            <p className="font-semibold">
                                                {
                                                    activity.title
                                                }
                                            </p>

                                            {activity.description ? (
                                                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                                    {
                                                        activity.description
                                                    }
                                                </p>
                                            ) : null}

                                            <time className="mt-1 block text-xs text-[var(--muted-foreground)]">
                                                {new Date(
                                                    activity.occurredAt,
                                                ).toLocaleString(
                                                    "en-GB",
                                                )}
                                            </time>
                                        </li>
                                    ),
                                )}
                            </ol>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                                No recent activity is
                                available.
                            </p>
                        )}
                    </article>
                </div>

                <aside className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <h2 className="font-bold">
                        Available actions
                    </h2>

                    <div className="mt-4 grid gap-3">
                        {detail.actions.map(
                            (
                                action,
                            ): ReactNode =>
                                action.allowed &&
                                action.path ? (
                                    <Link
                                        key={
                                            action.actionKey
                                        }
                                        href={
                                            action.path
                                        }
                                        className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                    >
                                        {action.label}
                                    </Link>
                                ) : (
                                    <div
                                        key={
                                            action.actionKey
                                        }
                                        className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3"
                                    >
                                        <p className="text-sm font-semibold">
                                            {
                                                action.label
                                            }
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                                            {action.lockedReason ??
                                                "This action is currently unavailable."}
                                        </p>
                                    </div>
                                ),
                        )}
                    </div>
                </aside>
            </section>
        </main>
    );
}