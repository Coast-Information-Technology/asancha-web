"use client";

// File: app/dashboard/_components/property-owner-properties-page.tsx

/**
 * Asancha Property Owner Properties Page
 *
 * Purpose:
 * Displays property-owner properties with owner-specific statuses and actions.
 *
 * Security notes:
 * - The backend must scope results to the active property-owner profile.
 * - Edit, submit, listing, and document actions remain backend-controlled.
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
    OwnerPropertyCollection,
    OwnerPropertySummary,
} from "../_types/property-owner-dashboard.types";

function formatStatus(status: string): string {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string) =>
            character.toUpperCase(),
        );
}

export function PropertyOwnerPropertiesPage() {
    const searchParams = useSearchParams();

    const [collection, setCollection] =
        useState<OwnerPropertyCollection | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const status =
        searchParams.get("status")?.trim() ?? "";

    const loadProperties =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            const query = new URLSearchParams();

            if (status) {
                query.set("status", status);
            }

            try {
                const result =
                    await authApiGet<OwnerPropertyCollection>(
                        `/properties/me${query.size > 0
                            ? `?${query.toString()}`
                            : ""
                        }`,
                    );

                setCollection(result);
            } catch {
                setErrorMessage(
                    "We could not load your properties.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [status]);

    useEffect((): void => {
        void loadProperties();
    }, [loadProperties]);

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Property portfolio
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        My properties
                    </h1>

                    <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                        Track each property from draft
                        through submission, review,
                        approval, correction, and
                        listing eligibility.
                    </p>
                </div>

                <Link
                    href="/dashboard/property-owner/properties/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                    Add property
                </Link>
            </header>

            <nav
                aria-label="Property status filters"
                className="mt-5 flex flex-wrap gap-2"
            >
                {[
                    {
                        label: "All",
                        href: "/dashboard/property-owner/properties",
                        value: "",
                    },
                    {
                        label: "Draft",
                        href: "/dashboard/property-owner/properties?status=draft",
                        value: "draft",
                    },
                    {
                        label: "Submitted",
                        href: "/dashboard/property-owner/properties?status=submitted",
                        value: "submitted",
                    },
                    {
                        label: "Under review",
                        href: "/dashboard/property-owner/properties?status=under_review",
                        value: "under_review",
                    },
                    {
                        label: "Approved",
                        href: "/dashboard/property-owner/properties?status=approved",
                        value: "approved",
                    },
                    {
                        label: "Needs correction",
                        href: "/dashboard/property-owner/properties?status=correction_required",
                        value: "correction_required",
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
                        className={`rounded-[var(--asancha-radius-md)] px-4 py-2 text-sm font-semibold ${status === filter.value
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
                            }`}
                    >
                        {filter.label}
                    </Link>
                ))}
            </nav>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                <strong className="text-[var(--foreground)]">
                    Property submission is not listing
                    publication.
                </strong>{" "}
                An approved property may still require a
                separate listing, review, and publication
                process.
            </div>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-6 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
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
                                className="h-64 animate-pulse rounded-[var(--asancha-radius-lg)] bg-[var(--muted)]"
                            />
                        ),
                    )}
                </div>
            ) : null}

            {!isLoading &&
                collection?.items.length === 0 ? (
                <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-dashed border-[var(--border)] p-8 text-center">
                    <h2 className="text-xl font-bold">
                        You have not submitted any
                        properties yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                        Submit your first property to
                        begin the Asancha property review
                        process.
                    </p>

                    <Link
                        href="/dashboard/property-owner/properties/new"
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Add property
                    </Link>
                </section>
            ) : null}

            {!isLoading &&
                collection &&
                collection.items.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {collection.items.map(
                        (
                            property:
                                OwnerPropertySummary,
                        ): ReactNode => (
                            <article
                                key={
                                    property.propertyPublicId
                                }
                                className="flex flex-col rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                        {formatStatus(
                                            property.status,
                                        )}
                                    </span>

                                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                                        {formatStatus(
                                            property.verificationStatus,
                                        )}
                                    </span>
                                </div>

                                <h2 className="mt-3 text-lg font-bold">
                                    {property.title}
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                    {
                                        property.address
                                            .townCity
                                    }
                                    ,{" "}
                                    {
                                        property.address
                                            .postcode
                                    }
                                </p>

                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                    {formatStatus(
                                        property.propertyType,
                                    )}
                                </p>

                                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Listings
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {
                                                property.listingCount
                                            }
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Published
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {
                                                property.publishedListingCount
                                            }
                                        </dd>
                                    </div>
                                </dl>

                                {property.safeUserMessage ? (
                                    <p className="mt-4 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {
                                            property.safeUserMessage
                                        }
                                    </p>
                                ) : null}

                                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                    <Link
                                        href={
                                            property.detailPath
                                        }
                                        className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                                    >
                                        View property
                                    </Link>

                                    {property.editPath ? (
                                        <Link
                                            href={
                                                property.editPath
                                            }
                                            className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
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