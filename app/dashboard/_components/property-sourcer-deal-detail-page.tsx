"use client";

// File: app/dashboard/_components/property-sourcer-deal-detail-page.tsx

/**
 * Asancha Property Sourcer Deal Detail Page
 *
 * Purpose:
 * Displays one sourcer-owned deal, deal-pack state, document requirements,
 * safe performance data, activity, and backend-controlled actions.
 *
 * Security notes:
 * - Internal review notes and private seller or investor information must not
 *   appear.
 * - Submit and publication permissions remain backend-controlled.
 */

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import type {
    SourcerDealAction,
    SourcerDealDetail,
    SubmitSourcerDealPayload,
} from "../_types/property-sourcer-dashboard.types";

export interface PropertySourcerDealDetailPageProps {
    listingPublicId: string;
}

interface SubmitSourcerDealResult {
    deal: SourcerDealDetail;
    submitted: true;
    message: string;
}

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string): string =>
            character.toUpperCase(),
        );
}

function formatCurrency(
    amount: number,
    currency: string,
): string {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function PropertySourcerDealDetailPage({
    listingPublicId,
}: PropertySourcerDealDetailPageProps) {
    const [deal, setDeal] =
        useState<SourcerDealDetail | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const loadDeal =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<SourcerDealDetail>(
                        `/listings/${encodeURIComponent(
                            listingPublicId,
                        )}`,
                    );

                setDeal(result);
            } catch {
                setErrorMessage(
                    "We could not load this deal.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [listingPublicId]);

    useEffect((): void => {
        void loadDeal();
    }, [loadDeal]);

    const submitDeal =
        async (): Promise<void> => {
            if (!deal?.canSubmit) {
                return;
            }

            setIsSubmitting(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            const payload:
                SubmitSourcerDealPayload = {
                data: {
                    informationAccurateConfirmed:
                        true,

                    noGuaranteedOutcomeConfirmed:
                        true,
                },
            };

            try {
                const result =
                    await authApiPost<SubmitSourcerDealResult>(
                        `/listings/${encodeURIComponent(
                            deal.listingPublicId,
                        )}/submit`,
                        payload,
                    );

                setDeal(result.deal);
                setSuccessMessage(
                    result.message,
                );
            } catch {
                setErrorMessage(
                    "We could not submit this deal. Complete all required policies, verification, documents, declarations, and deal information before trying again.",
                );
            } finally {
                setIsSubmitting(false);
            }
        };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    if (!deal) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "This deal is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold">
                            {formatValue(
                                deal.status,
                            )}
                        </span>

                        {deal.dealPackStatus ? (
                            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                                Deal pack:{" "}
                                {formatValue(
                                    deal.dealPackStatus,
                                )}
                            </span>
                        ) : null}
                    </div>

                    <h1 className="mt-3 text-3xl font-bold">
                        {deal.title}
                    </h1>

                    <p className="mt-2 text-[var(--muted-foreground)]">
                        {deal.locationSummary}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {deal.editPath ? (
                        <Link
                            href={deal.editPath}
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Edit deal
                        </Link>
                    ) : null}

                    {deal.canSubmit ? (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(): void => {
                                void submitDeal();
                            }}
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Submitting…"
                                : "Submit for review"}
                        </button>
                    ) : null}
                </div>
            </header>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-md border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-md border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            {deal.safeUserMessage ? (
                <div className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {deal.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="grid gap-6">
                    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Opportunity summary
                        </h2>

                        <p className="mt-4 whitespace-pre-line leading-7 text-[var(--muted-foreground)]">
                            {deal.opportunitySummary}
                        </p>

                        <h3 className="mt-6 font-bold">
                            Property description
                        </h3>

                        <p className="mt-2 whitespace-pre-line leading-7 text-[var(--muted-foreground)]">
                            {deal.description}
                        </p>

                        <h3 className="mt-6 font-bold">
                            Intended investor outcome
                        </h3>

                        <p className="mt-2 whitespace-pre-line leading-7 text-[var(--muted-foreground)]">
                            {
                                deal.investorOutcomeSummary
                            }
                        </p>
                    </article>

                    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="text-xl font-bold">
                            Estimates
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                            These figures are estimates,
                            not guaranteed outcomes.
                        </p>

                        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    label:
                                        "Asking price",
                                    value:
                                        deal.askingPrice !==
                                        null
                                            ? formatCurrency(
                                                  deal.askingPrice,
                                                  deal.currency,
                                              )
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Estimated market value",
                                    value:
                                        deal.estimatedMarketValue !==
                                        null
                                            ? formatCurrency(
                                                  deal.estimatedMarketValue,
                                                  deal.currency,
                                              )
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Estimated refurbishment",
                                    value:
                                        deal.estimatedRefurbishmentCost !==
                                        null
                                            ? formatCurrency(
                                                  deal.estimatedRefurbishmentCost,
                                                  deal.currency,
                                              )
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Estimated rent",
                                    value:
                                        deal.estimatedMonthlyRent !==
                                        null
                                            ? formatCurrency(
                                                  deal.estimatedMonthlyRent,
                                                  deal.currency,
                                              )
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Estimated gross yield",
                                    value:
                                        deal.estimatedGrossYield !==
                                        null
                                            ? `${deal.estimatedGrossYield}%`
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Estimated ROI",
                                    value:
                                        deal.estimatedRoi !==
                                        null
                                            ? `${deal.estimatedRoi}%`
                                            : "Not provided",
                                },
                            ].map(
                                (item): ReactNode => (
                                    <div
                                        key={item.label}
                                    >
                                        <dt className="text-sm text-[var(--muted-foreground)]">
                                            {item.label}
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {item.value}
                                        </dd>
                                    </div>
                                ),
                            )}
                        </dl>
                    </article>

                    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="text-xl font-bold">
                            Assumptions and warnings
                        </h2>

                        <div className="mt-5 grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="font-semibold">
                                    Assumptions
                                </h3>

                                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {deal.assumptions.map(
                                        (
                                            assumption: string,
                                        ): ReactNode => (
                                            <li
                                                key={
                                                    assumption
                                                }
                                                className="rounded-md bg-[var(--muted)] p-3"
                                            >
                                                {
                                                    assumption
                                                }
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Risks and warnings
                                </h3>

                                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {deal.risksAndWarnings.map(
                                        (
                                            warning: string,
                                        ): ReactNode => (
                                            <li
                                                key={
                                                    warning
                                                }
                                                className="rounded-md bg-[var(--muted)] p-3"
                                            >
                                                {
                                                    warning
                                                }
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="text-xl font-bold">
                            Deal activity
                        </h2>

                        {deal.recentActivity.length >
                        0 ? (
                            <ol className="mt-4 grid gap-4">
                                {deal.recentActivity.map(
                                    (activity): ReactNode => (
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
                                No deal activity is
                                available yet.
                            </p>
                        )}
                    </article>
                </div>

                <aside className="grid content-start gap-6">
                    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Performance
                        </h2>

                        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Views
                                </dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {deal.viewCount}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Enquiries
                                </dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {deal.enquiryCount}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Reservations
                                </dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {
                                        deal.reservationCount
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Conversions
                                </dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {
                                        deal.conversionCount
                                    }
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Deal pack
                        </h2>

                        {deal.dealPack ? (
                            <>
                                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                    Status:{" "}
                                    {formatValue(
                                        deal.dealPack
                                            .status,
                                    )}
                                </p>

                                {deal.dealPack
                                    .detailPath ? (
                                    <Link
                                        href={
                                            deal.dealPack
                                                .detailPath
                                        }
                                        className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)]"
                                    >
                                        View deal pack
                                    </Link>
                                ) : null}
                            </>
                        ) : deal.canCreateDealPack ? (
                            <Link
                                href={`/dashboard/property-sourcer/deal-packs/new?listingPublicId=${encodeURIComponent(
                                    deal.listingPublicId,
                                )}`}
                                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                            >
                                Create deal pack
                            </Link>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                Deal-pack creation is
                                currently unavailable.
                            </p>
                        )}
                    </section>

                    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Required documents
                        </h2>

                        <ul className="mt-4 grid gap-3">
                            {deal.requiredDocuments.map(
                                (requirement): ReactNode => (
                                    <li
                                        key={
                                            requirement.requirementKey
                                        }
                                        className="rounded-md bg-[var(--muted)] p-3"
                                    >
                                        <p className="text-sm font-semibold">
                                            {
                                                requirement.label
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                            {formatValue(
                                                requirement.status,
                                            )}
                                        </p>

                                        {requirement.safeUserMessage ? (
                                            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                                {
                                                    requirement.safeUserMessage
                                                }
                                            </p>
                                        ) : null}

                                        {requirement.actionPath ? (
                                            <Link
                                                href={
                                                    requirement.actionPath
                                                }
                                                className="mt-2 inline-flex text-sm font-semibold text-[var(--primary)]"
                                            >
                                                Complete action
                                            </Link>
                                        ) : null}
                                    </li>
                                ),
                            )}
                        </ul>
                    </section>

                    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Available actions
                        </h2>

                        <div className="mt-4 grid gap-2">
                            {deal.actions.map(
                                (
                                    action:
                                        SourcerDealAction,
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
                                            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                        >
                                            {action.label}
                                        </Link>
                                    ) : (
                                        <div
                                            key={
                                                action.actionKey
                                            }
                                            className="rounded-md bg-[var(--muted)] p-3"
                                        >
                                            <p className="text-sm font-semibold">
                                                {action.label}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                                                {action.reason ??
                                                    "This action is unavailable."}
                                            </p>
                                        </div>
                                    ),
                            )}
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    );
}