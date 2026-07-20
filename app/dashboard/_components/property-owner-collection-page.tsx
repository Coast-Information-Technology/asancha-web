"use client";

// File: app/dashboard/_components/property-owner-collection-page.tsx

/**
 * Asancha Property Owner Collection Page
 *
 * Purpose:
 * Provides a reusable list screen for owner listings, documents, verification,
 * bookings, conversations, and payments.
 *
 * Security notes:
 * - Backend responses must be scoped to the active property-owner profile.
 * - Raw domain objects must be mapped to the safe collection contract before
 *   reaching this component.
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
    PropertyOwnerCollectionPageConfig,
} from "../_config/property-owner-dashboard.config";
import type {
    PropertyOwnerCollectionItem,
    PropertyOwnerCollectionResponse,
} from "../_types/property-owner-dashboard.types";

export interface PropertyOwnerCollectionPageProps {
    config: PropertyOwnerCollectionPageConfig;
}

function formatStatus(status: string): string {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string) =>
            character.toUpperCase(),
        );
}

function formatAmount(
    amount: number,
    currency: string,
): string {
    try {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString(
            "en-GB",
        )}`;
    }
}

export function PropertyOwnerCollectionPage({
    config,
}: PropertyOwnerCollectionPageProps) {
    const [collection, setCollection] =
        useState<PropertyOwnerCollectionResponse | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadCollection =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<PropertyOwnerCollectionResponse>(
                        config.endpoint,
                    );

                setCollection(result);
            } catch {
                setErrorMessage(
                    "We could not load this property-owner workspace. Refresh the page and try again.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [config.endpoint]);

    useEffect((): void => {
        void Promise.resolve().then(loadCollection);
    }, [loadCollection]);

    const collectionItems = Array.isArray(collection?.items)
        ? collection.items
        : [];
    const collectionPagination = collection?.pagination ?? {
        page: 1,
        pageSize: collectionItems.length,
        totalItems: collectionItems.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };
    const safeUserMessage =
        collection?.safeUserMessage ?? null;

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        {config.eyebrow}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        {config.title}
                    </h1>

                    <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                        {config.description}
                    </p>
                </div>

                {config.primaryActionLabel &&
                    config.primaryActionPath ? (
                    <Link
                        href={
                            config.primaryActionPath
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                    >
                        {config.primaryActionLabel}
                    </Link>
                ) : null}
            </header>

            {config.disclaimer ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    <strong className="text-[var(--foreground)]">
                        Important:
                    </strong>{" "}
                    {config.disclaimer}
                </div>
            ) : null}

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-6 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-5 text-sm text-[var(--destructive)]"
                >
                    <p>{errorMessage}</p>

                    <button
                        type="button"
                        onClick={(): void => {
                            void loadCollection();
                        }}
                        className="mt-4 rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 font-semibold"
                    >
                        Try again
                    </button>
                </div>
            ) : null}

            {isLoading ? (
                <div
                    className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                    aria-label="Loading records"
                >
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
                !errorMessage &&
                collectionItems.length === 0 ? (
                <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
                    <h2 className="text-xl font-bold">
                        {config.emptyTitle}
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                        {config.emptyDescription}
                    </p>

                    {config.primaryActionLabel &&
                        config.primaryActionPath ? (
                        <Link
                            href={
                                config.primaryActionPath
                            }
                            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                        >
                            {
                                config.primaryActionLabel
                            }
                        </Link>
                    ) : null}
                </section>
            ) : null}

            {!isLoading &&
                collectionItems.length > 0 ? (
                <>
                    {safeUserMessage ? (
                        <p
                            role="status"
                            className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]"
                        >
                            {
                                safeUserMessage
                            }
                        </p>
                    ) : null}

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {collectionItems.map(
                            (
                                item:
                                    PropertyOwnerCollectionItem,
                            ): ReactNode => (
                                <article
                                    key={item.publicId}
                                    className="flex min-w-0 flex-col rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {item.status ? (
                                            <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                                {formatStatus(
                                                    item.status,
                                                )}
                                            </span>
                                        ) : null}

                                        {item.secondaryStatus ? (
                                            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                                                {formatStatus(
                                                    item.secondaryStatus,
                                                )}
                                            </span>
                                        ) : null}
                                    </div>

                                    <h2 className="mt-3 text-lg font-bold">
                                        {item.title}
                                    </h2>

                                    {item.subtitle ? (
                                        <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
                                            {item.subtitle}
                                        </p>
                                    ) : null}

                                    {item.location ? (
                                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                            {item.location}
                                        </p>
                                    ) : null}

                                    {item.description ? (
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                            {
                                                item.description
                                            }
                                        </p>
                                    ) : null}

                                    {item.amount !== null &&
                                        item.currency ? (
                                        <p className="mt-4 text-xl font-bold">
                                            {formatAmount(
                                                item.amount,
                                                item.currency,
                                            )}
                                        </p>
                                    ) : null}

                                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        {item.primaryLabel &&
                                            item.primaryValue ? (
                                            <div>
                                                <dt className="text-[var(--muted-foreground)]">
                                                    {
                                                        item.primaryLabel
                                                    }
                                                </dt>

                                                <dd className="mt-1 font-semibold">
                                                    {
                                                        item.primaryValue
                                                    }
                                                </dd>
                                            </div>
                                        ) : null}

                                        {item.secondaryLabel &&
                                            item.secondaryValue ? (
                                            <div>
                                                <dt className="text-[var(--muted-foreground)]">
                                                    {
                                                        item.secondaryLabel
                                                    }
                                                </dt>

                                                <dd className="mt-1 font-semibold">
                                                    {
                                                        item.secondaryValue
                                                    }
                                                </dd>
                                            </div>
                                        ) : null}
                                    </dl>

                                    {item.lockedReason ? (
                                        <p className="mt-4 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                            {
                                                item.lockedReason
                                            }
                                        </p>
                                    ) : null}

                                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                        {item.detailPath ? (
                                            <Link
                                                href={
                                                    item.detailPath
                                                }
                                                className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                                            >
                                                View details
                                            </Link>
                                        ) : null}

                                        {item.actionLabel &&
                                            item.actionPath ? (
                                            <Link
                                                href={
                                                    item.actionPath
                                                }
                                                className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                                            >
                                                {
                                                    item.actionLabel
                                                }
                                            </Link>
                                        ) : null}
                                    </div>
                                </article>
                            ),
                        )}
                    </div>

                    <footer className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5 text-sm text-[var(--muted-foreground)]">
                        <span>
                            Page{" "}
                            {
                                collectionPagination.page
                            }{" "}
                            of{" "}
                            {
                                collectionPagination.totalPages
                            }
                        </span>

                        <span>
                            {
                                collectionPagination.totalItems
                            }{" "}
                            records
                        </span>
                    </footer>
                </>
            ) : null}
        </main>
    );
}
