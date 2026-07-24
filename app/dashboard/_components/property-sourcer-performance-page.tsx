"use client";

// File: app/dashboard/_components/property-sourcer-performance-page.tsx

/**
 * Asancha Property Sourcer Performance Page
 *
 * Purpose:
 * Displays safe performance totals, views, enquiries, reservations,
 * conversions, and conversion rates.
 *
 * Security notes:
 * - Performance data is informational and platform-calculated.
 * - Internal revenue, private investor identities, staff metrics, fraud data,
 *   and restricted commercial analytics must not be exposed.
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
    SourcerPerformanceSummary,
} from "../_types/property-sourcer-dashboard.types";

export type SourcerPerformanceView =
    | "overview"
    | "views"
    | "conversions";

export interface PropertySourcerPerformancePageProps {
    view: SourcerPerformanceView;
}

function formatRate(
    value: number | null,
): string {
    return value === null
        ? "Not available"
        : `${value.toFixed(2)}%`;
}

export function PropertySourcerPerformancePage({
    view,
}: PropertySourcerPerformancePageProps) {
    const [summary, setSummary] =
        useState<SourcerPerformanceSummary | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadPerformance =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<SourcerPerformanceSummary>(
                        `/profiles/property-sourcer/me/performance?view=${encodeURIComponent(
                            view,
                        )}`,
                    );

                setSummary(result);
            } catch {
                setErrorMessage(
                    "We could not load your performance summary.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [view]);

    useEffect((): void => {
        void loadPerformance();
    }, [loadPerformance]);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    if (!summary) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Performance information is unavailable."}
                </div>
            </main>
        );
    }

    const metrics =
        view === "views"
            ? [
                  {
                      label: "Total views",
                      value:
                          summary.totals.totalViews,
                  },
                  {
                      label: "Total enquiries",
                      value:
                          summary.totals
                              .totalEnquiries,
                  },
                  {
                      label: "View-to-enquiry rate",
                      value: formatRate(
                          summary.rates
                              .viewToEnquiryRate,
                      ),
                  },
              ]
            : view === "conversions"
              ? [
                    {
                        label: "Reservations",
                        value:
                            summary.totals
                                .totalReservations,
                    },
                    {
                        label: "Conversions",
                        value:
                            summary.totals
                                .totalConversions,
                    },
                    {
                        label:
                            "Reservation-to-conversion rate",
                        value: formatRate(
                            summary.rates
                                .reservationToConversionRate,
                        ),
                    },
                    {
                        label:
                            "Overall conversion rate",
                        value: formatRate(
                            summary.rates
                                .overallConversionRate,
                        ),
                    },
                ]
              : [
                    {
                        label: "Submitted deals",
                        value:
                            summary.totals
                                .submittedDeals,
                    },
                    {
                        label: "Published deals",
                        value:
                            summary.totals
                                .publishedDeals,
                    },
                    {
                        label: "Views",
                        value:
                            summary.totals.totalViews,
                    },
                    {
                        label: "Enquiries",
                        value:
                            summary.totals
                                .totalEnquiries,
                    },
                    {
                        label: "Reservations",
                        value:
                            summary.totals
                                .totalReservations,
                    },
                    {
                        label: "Conversions",
                        value:
                            summary.totals
                                .totalConversions,
                    },
                ];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Deal performance
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    {view === "views"
                        ? "Views and enquiries"
                        : view === "conversions"
                          ? "Conversions"
                          : "Performance"}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Review safe, platform-calculated
                    activity across your submitted and
                    published deals.
                </p>
            </header>

            <nav
                aria-label="Performance sections"
                className="mt-6 flex flex-wrap gap-2"
            >
                {[
                    {
                        label: "Overview",
                        value: "overview",
                        href: "/dashboard/property-sourcer/performance",
                    },
                    {
                        label: "Views",
                        value: "views",
                        href: "/dashboard/property-sourcer/performance/views",
                    },
                    {
                        label: "Conversions",
                        value: "conversions",
                        href: "/dashboard/property-sourcer/performance/conversions",
                    },
                ].map((item): ReactNode => (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={
                            view === item.value
                                ? "page"
                                : undefined
                        }
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${
                            view === item.value
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "border border-[var(--border)] bg-[var(--card)]"
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            {summary.safeUserMessage ? (
                <div className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                    {summary.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map(
                    (metric): ReactNode => (
                        <article
                            key={metric.label}
                            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
                        >
                            <p className="text-sm text-[var(--muted-foreground)]">
                                {metric.label}
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {metric.value}
                            </p>
                        </article>
                    ),
                )}
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Top deals
                </h2>

                {summary.topDeals.length ? (
                    <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
                        <table className="w-full min-w-[44rem] border-collapse text-sm">
                            <thead className="bg-[var(--muted)] text-left">
                                <tr>
                                    <th className="p-4">
                                        Deal
                                    </th>
                                    <th className="p-4">
                                        Views
                                    </th>
                                    <th className="p-4">
                                        Enquiries
                                    </th>
                                    <th className="p-4">
                                        Reservations
                                    </th>
                                    <th className="p-4">
                                        Conversions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {summary.topDeals.map(
                                    (deal): ReactNode => (
                                        <tr
                                            key={
                                                deal.listingPublicId
                                            }
                                            className="border-t border-[var(--border)]"
                                        >
                                            <td className="p-4 font-semibold">
                                                <Link
                                                    href={
                                                        deal.detailPath
                                                    }
                                                    className="text-[var(--primary)] hover:underline"
                                                >
                                                    {
                                                        deal.title
                                                    }
                                                </Link>
                                            </td>

                                            <td className="p-4">
                                                {
                                                    deal.views
                                                }
                                            </td>

                                            <td className="p-4">
                                                {
                                                    deal.enquiries
                                                }
                                            </td>

                                            <td className="p-4">
                                                {
                                                    deal.reservations
                                                }
                                            </td>

                                            <td className="p-4">
                                                {
                                                    deal.conversions
                                                }
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                        No deal-performance records are
                        available for this period.
                    </p>
                )}
            </section>
        </main>
    );
}