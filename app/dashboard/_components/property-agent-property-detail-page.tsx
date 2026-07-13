"use client";

// File: app/dashboard/_components/property-agent-property-detail-page.tsx

/**
 * Asancha Property Agent Property Detail Page
 *
 * Purpose:
 * Displays a represented property, authority state, listings, document
 * requirements, activity, and backend-controlled actions.
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
    AgentPropertyDetail,
} from "../_types/property-agent-dashboard.types";

export interface PropertyAgentPropertyDetailPageProps {
    propertyPublicId: string;
}

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string) =>
            character.toUpperCase(),
        );
}

export function PropertyAgentPropertyDetailPage({
    propertyPublicId,
}: PropertyAgentPropertyDetailPageProps) {
    const [
        property,
        setProperty,
    ] = useState<AgentPropertyDetail | null>(
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

    const loadProperty =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AgentPropertyDetail>(
                        `/properties/${encodeURIComponent(
                            propertyPublicId,
                        )}`,
                    );

                setProperty(result);
            } catch {
                setErrorMessage(
                    "We could not load this represented property.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [propertyPublicId]);

    useEffect((): void => {
        void loadProperty();
    }, [loadProperty]);

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    if (!property) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "This property is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="border-b border-[var(--border)] pb-6">
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold">
                        {formatValue(
                            property.status,
                        )}
                    </span>

                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                        Authority:{" "}
                        {formatValue(
                            property.authorityStatus,
                        )}
                    </span>
                </div>

                <h1 className="mt-3 text-3xl font-bold">
                    {property.title}
                </h1>

                <p className="mt-2 text-[var(--muted-foreground)]">
                    {property.address.addressLine1},{" "}
                    {property.address.townCity},{" "}
                    {property.address.postcode}
                </p>

                <p className="mt-3 text-sm">
                    Representing{" "}
                    <strong>
                        {property.ownerDisplayName}
                    </strong>
                </p>
            </header>

            {property.safeUserMessage ? (
                <div className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {property.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="grid gap-6">
                    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Property information
                        </h2>

                        <p className="mt-4 whitespace-pre-line leading-7 text-[var(--muted-foreground)]">
                            {property.description}
                        </p>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    label: "Property type",
                                    value: formatValue(
                                        property.propertyType,
                                    ),
                                },
                                {
                                    label:
                                        "Representation type",
                                    value: formatValue(
                                        property.representationType,
                                    ),
                                },
                                {
                                    label: "Company",
                                    value:
                                        property.companyName ??
                                        "Individual agent profile",
                                },
                                {
                                    label: "Bedrooms",
                                    value:
                                        property.bedrooms?.toString() ??
                                        "Not provided",
                                },
                                {
                                    label: "Bathrooms",
                                    value:
                                        property.bathrooms?.toString() ??
                                        "Not provided",
                                },
                                {
                                    label: "Condition",
                                    value:
                                        property.condition
                                            ? formatValue(
                                                property.condition,
                                            )
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
                            Listings
                        </h2>

                        {property.listings.length ? (
                            <ul className="mt-4 grid gap-3">
                                {property.listings.map(
                                    (listing) => (
                                        <li
                                            key={
                                                listing.listingPublicId
                                            }
                                            className="flex items-center justify-between gap-4 rounded-md border border-[var(--border)] p-4"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {
                                                        listing.title
                                                    }
                                                </p>
                                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                                    {
                                                        listing.status
                                                    }
                                                    {" · "}
                                                    {
                                                        listing.publicationStatus
                                                    }
                                                </p>
                                            </div>

                                            {listing.detailPath ? (
                                                <Link
                                                    href={
                                                        listing.detailPath
                                                    }
                                                    className="text-sm font-semibold text-[var(--primary)]"
                                                >
                                                    View
                                                </Link>
                                            ) : null}
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                                No listing has been created
                                for this property.
                            </p>
                        )}
                    </article>
                </div>

                <aside className="grid content-start gap-6">
                    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Required documents
                        </h2>

                        <ul className="mt-4 grid gap-3">
                            {property.requiredDocuments.map(
                                (requirement) => (
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
                                            {
                                                requirement.status
                                            }
                                        </p>

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
                            {property.actions.map(
                                (action) =>
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