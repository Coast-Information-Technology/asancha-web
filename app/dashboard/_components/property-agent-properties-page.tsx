"use client";

// File: app/dashboard/_components/property-agent-properties-page.tsx

/**
 * Asancha Property Agent Properties Page
 *
 * Purpose:
 * Displays represented properties connected to the active agent profile.
 *
 * Security notes:
 * - Backend assignment and authority checks remain authoritative.
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
    AgentPropertyCollection,
    AgentPropertySummary,
} from "../_types/property-agent-dashboard.types";

function formatStatus(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string) =>
            character.toUpperCase(),
        );
}

export function PropertyAgentPropertiesPage() {
    const searchParams = useSearchParams();

    const [
        collection,
        setCollection,
    ] = useState<AgentPropertyCollection | null>(
        null,
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const status =
        searchParams.get("status")?.trim() ??
        "";

    const loadProperties =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            const query =
                new URLSearchParams();

            query.set(
                "profileType",
                "property_agent",
            );

            if (status) {
                query.set("status", status);
            }

            try {
                const result =
                    await authApiGet<AgentPropertyCollection>(
                        `/properties/me?${query.toString()}`,
                    );

                setCollection(result);
            } catch {
                setErrorMessage(
                    "We could not load your represented properties.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [status]);

    useEffect((): void => {
        void Promise.resolve().then(loadProperties);
    }, [loadProperties]);

    const collectionItems = Array.isArray(collection?.items)
        ? collection.items
        : [];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Agency portfolio
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Represented properties
                    </h1>

                    <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                        Track properties you are
                        authorised and assigned to
                        represent.
                    </p>
                </div>

                <Link
                    href="/dashboard/property-agent/properties/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                    Add property
                </Link>
            </header>

            <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Add a property only when you have the
                required authority to represent its owner,
                landlord, vendor, company, or developer.
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
                                className="h-64 animate-pulse rounded-lg bg-[var(--muted)]"
                            />
                        ),
                    )}
                </div>
            ) : null}

            {!isLoading &&
                collectionItems.length === 0 ? (
                <section className="mt-8 rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
                    <h2 className="text-xl font-bold">
                        You have not added any represented
                        properties yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                        Add a property when you have
                        authority to represent the owner.
                    </p>
                </section>
            ) : null}

            {!isLoading &&
                collectionItems.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {collectionItems.map(
                        (
                            property:
                                AgentPropertySummary,
                        ): ReactNode => (
                            <article
                                key={
                                    property.propertyPublicId
                                }
                                className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                        {formatStatus(
                                            property.status,
                                        )}
                                    </span>

                                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold">
                                        {formatStatus(
                                            property.authorityStatus,
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

                                <p className="mt-3 text-sm">
                                    Representing:{" "}
                                    <strong>
                                        {
                                            property.ownerDisplayName
                                        }
                                    </strong>
                                </p>

                                {property.companyName ? (
                                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                        {
                                            property.companyName
                                        }
                                    </p>
                                ) : null}

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
                                    <p className="mt-4 rounded-md bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {
                                            property.safeUserMessage
                                        }
                                    </p>
                                ) : null}

                                <div className="mt-auto flex gap-2 pt-5">
                                    <Link
                                        href={
                                            property.detailPath
                                        }
                                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                    >
                                        View property
                                    </Link>

                                    {property.editPath ? (
                                        <Link
                                            href={
                                                property.editPath
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
