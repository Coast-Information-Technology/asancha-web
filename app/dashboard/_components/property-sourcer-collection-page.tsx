"use client";

// File: app/dashboard/_components/property-sourcer-collection-page.tsx

/**
 * Asancha Property Sourcer Collection Page
 *
 * Purpose:
 * Provides reusable safe list rendering for deal packs, documents,
 * verification, bookings, conversations, and payments.
 *
 * Security notes:
 * - Backend results must be active-profile scoped.
 * - Raw payment, verification, document, and provider records must be mapped
 *   into this safe public contract before rendering.
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
    PropertySourcerCollectionPageConfig,
} from "../_config/property-sourcer-dashboard.config";
import type {
    PropertySourcerCollectionItem,
    PropertySourcerCollectionResponse,
} from "../_types/property-sourcer-dashboard.types";

export interface PropertySourcerCollectionPageProps {
    config: PropertySourcerCollectionPageConfig;
}

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string): string =>
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
        }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString(
            "en-GB",
        )}`;
    }
}

export function PropertySourcerCollectionPage({
    config,
}: PropertySourcerCollectionPageProps) {
    const [collection, setCollection] =
        useState<PropertySourcerCollectionResponse | null>(
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
                    await authApiGet<PropertySourcerCollectionResponse>(
                        config.endpoint,
                    );

                setCollection(result);
            } catch {
                setErrorMessage(
                    "We could not load this property-sourcer workspace.",
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

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        {config.eyebrow}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
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
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        {config.primaryActionLabel}
                    </Link>
                ) : null}
            </header>

            {config.disclaimer ? (
                <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    <strong className="text-[var(--foreground)]">
                        Important:
                    </strong>{" "}
                    {config.disclaimer}
                </div>
            ) : null}

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-6 rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    <p>{errorMessage}</p>

                    <button
                        type="button"
                        onClick={(): void => {
                            void loadCollection();
                        }}
                        className="mt-4 rounded-md border border-[var(--border)] px-4 py-2 font-semibold"
                    >
                        Try again
                    </button>
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
                                className="h-60 animate-pulse rounded-lg bg-[var(--muted)]"
                            />
                        ),
                    )}
                </div>
            ) : null}

            {!isLoading &&
            !errorMessage &&
            collectionItems.length === 0 ? (
                <section className="mt-8 rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
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
                            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
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
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {collectionItems.map(
                        (
                            item:
                                PropertySourcerCollectionItem,
                        ): ReactNode => (
                            <article
                                key={item.publicId}
                                className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {item.status ? (
                                        <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                            {formatValue(
                                                item.status,
                                            )}
                                        </span>
                                    ) : null}

                                    {item.secondaryStatus ? (
                                        <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                                            {formatValue(
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
                                        {item.description}
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
                                    <p className="mt-4 rounded-md bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {item.lockedReason}
                                    </p>
                                ) : null}

                                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                    {item.detailPath ? (
                                        <Link
                                            href={
                                                item.detailPath
                                            }
                                            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
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
                                            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                                        >
                                            {item.actionLabel}
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
