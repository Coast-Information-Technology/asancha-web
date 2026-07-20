"use client";

// File: app/dashboard/_components/property-sourcer-deals-page.tsx

/**
 * Asancha Property Sourcer Deals Page
 *
 * Purpose:
 * Displays deal drafts, submitted deals, review states, published deals,
 * corrections, and safe performance summaries.
 *
 * Security notes:
 * - Backend results must be scoped to the active sourcer profile.
 * - Publication status must never be inferred from deal submission.
 */

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

import { authApiGet } from "../../../src/lib/api/auth-fetch";
import type {
    SourcerDealCollection,
    SourcerDealSummary,
} from "../_types/property-sourcer-dashboard.types";

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
        maximumFractionDigits: 0,
    }).format(amount);
}

export function PropertySourcerDealsPage() {
    const searchParams = useSearchParams();

    const [collection, setCollection] =
        useState<SourcerDealCollection | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const status =
        searchParams.get("status")?.trim() ??
        "";

    const loadDeals =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            const query =
                new URLSearchParams();

            query.set(
                "profileType",
                "property_sourcer",
            );

            if (status) {
                query.set("status", status);
            }

            try {
                const result =
                    await authApiGet<SourcerDealCollection>(
                        `/listings/me?${query.toString()}`,
                    );

                setCollection(result);
            } catch {
                setErrorMessage(
                    "We could not load your submitted deals.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [status]);

    useEffect((): void => {
        void Promise.resolve().then(loadDeals);
    }, [loadDeals]);

    const collectionItems = Array.isArray(collection?.items)
        ? collection.items
        : [];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Investment deals
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Deals
                    </h1>

                    <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                        Track investment-focused
                        opportunities from draft through
                        review, correction, approval, and
                        publication.
                    </p>
                </div>

                <Link
                    href="/dashboard/property-sourcer/deals/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                    Submit deal
                </Link>
            </header>

            <nav
                aria-label="Deal status filters"
                className="mt-5 flex flex-wrap gap-2"
            >
                {[
                    {
                        label: "All",
                        value: "",
                        href: "/dashboard/property-sourcer/deals",
                    },
                    {
                        label: "Draft",
                        value: "draft",
                        href: "/dashboard/property-sourcer/deals?status=draft",
                    },
                    {
                        label: "Submitted",
                        value: "submitted",
                        href: "/dashboard/property-sourcer/deals?status=submitted",
                    },
                    {
                        label: "Under review",
                        value: "under_review",
                        href: "/dashboard/property-sourcer/deals?status=under_review",
                    },
                    {
                        label: "Published",
                        value: "published",
                        href: "/dashboard/property-sourcer/deals?status=published",
                    },
                    {
                        label: "Needs correction",
                        value:
                            "correction_required",
                        href: "/dashboard/property-sourcer/deals?status=correction_required",
                    },
                ].map((filter): ReactNode => (
                    <Link
                        key={filter.value}
                        href={filter.href}
                        aria-current={
                            status === filter.value
                                ? "page"
                                : undefined
                        }
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${
                            status === filter.value
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
                        }`}
                    >
                        {filter.label}
                    </Link>
                ))}
            </nav>

            <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                <strong className="text-[var(--foreground)]">
                    Deal submission is not publication.
                </strong>{" "}
                Every deal remains subject to policy,
                verification, document, data-quality,
                review, and publication rules.
            </div>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-6 rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {isLoading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({
                        length: 6,
                    }).map(
                        (
                            _value: unknown,
                            index: number,
                        ): ReactNode => (
                            <div
                                key={index}
                                className="h-72 animate-pulse rounded-lg bg-[var(--muted)]"
                            />
                        ),
                    )}
                </div>
            ) : null}

            {!isLoading &&
            collectionItems.length === 0 ? (
                <section className="mt-8 rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
                    <h2 className="text-xl font-bold">
                        You have not submitted any deals
                        yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                        Submit your first
                        investment-focused opportunity for
                        review.
                    </p>

                    <Link
                        href="/dashboard/property-sourcer/deals/new"
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Submit first deal
                    </Link>
                </section>
            ) : null}

            {!isLoading &&
            collectionItems.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {collectionItems.map(
                        (
                            deal:
                                SourcerDealSummary,
                        ): ReactNode => (
                            <article
                                key={
                                    deal.listingPublicId
                                }
                                className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                        {formatValue(
                                            deal.status,
                                        )}
                                    </span>

                                    {deal.dealPackStatus ? (
                                        <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold">
                                            Deal pack:{" "}
                                            {formatValue(
                                                deal.dealPackStatus,
                                            )}
                                        </span>
                                    ) : null}
                                </div>

                                <h2 className="mt-3 text-lg font-bold">
                                    {deal.title}
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                    {deal.locationSummary}
                                </p>

                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                    {deal.dealTypes
                                        .map(formatValue)
                                        .join(", ")}
                                </p>

                                {deal.askingPrice !==
                                null ? (
                                    <p className="mt-4 text-xl font-bold">
                                        {formatCurrency(
                                            deal.askingPrice,
                                            deal.currency,
                                        )}
                                    </p>
                                ) : null}

                                <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Views
                                        </dt>
                                        <dd className="mt-1 font-semibold">
                                            {deal.viewCount}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Enquiries
                                        </dt>
                                        <dd className="mt-1 font-semibold">
                                            {
                                                deal.enquiryCount
                                            }
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Conversions
                                        </dt>
                                        <dd className="mt-1 font-semibold">
                                            {
                                                deal.conversionCount
                                            }
                                        </dd>
                                    </div>
                                </dl>

                                {deal.safeUserMessage ? (
                                    <p className="mt-4 rounded-md bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {
                                            deal.safeUserMessage
                                        }
                                    </p>
                                ) : null}

                                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                    <Link
                                        href={
                                            deal.detailPath
                                        }
                                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                    >
                                        View deal
                                    </Link>

                                    {deal.editPath ? (
                                        <Link
                                            href={
                                                deal.editPath
                                            }
                                            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                                        >
                                            Edit
                                        </Link>
                                    ) : null}
                                </div>
                            </article>
                        ),
                    )}
                </div>
            ) : null}
        </main>
    );
}
