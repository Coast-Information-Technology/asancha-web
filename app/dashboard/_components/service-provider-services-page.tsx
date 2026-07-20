"use client";

// File: app/dashboard/_components/service-provider-services-page.tsx

/**
 * Asancha Service Provider Services Page
 *
 * Purpose:
 * Displays draft, submitted, reviewed, active, paused, correction-required,
 * rejected, and archived services.
 *
 * Security notes:
 * - Backend active-profile and service ownership checks remain authoritative.
 * - Creating or submitting a service does not make it publicly visible.
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
    ProviderServiceCollection,
    ProviderServiceSummary,
} from "../_types/service-provider-dashboard.types";

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function ServiceProviderServicesPage() {
    const searchParams = useSearchParams();

    const [collection, setCollection] =
        useState<ProviderServiceCollection | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const status =
        searchParams.get("status")?.trim() ??
        "";

    const loadServices =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            const query =
                new URLSearchParams();

            query.set(
                "profileType",
                "service_provider",
            );

            if (status) {
                query.set("status", status);
            }

            try {
                const result =
                    await authApiGet<ProviderServiceCollection>(
                        `/services/me?${query.toString()}`,
                    );

                setCollection(result);
            } catch {
                setErrorMessage(
                    "We could not load your services.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [status]);

    useEffect((): void => {
        void Promise.resolve().then(loadServices);
    }, [loadServices]);

    const collectionItems = Array.isArray(collection?.items)
        ? collection.items
        : [];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Service catalogue
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Services
                    </h1>

                    <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                        Manage the services offered by
                        your active service-provider
                        profile.
                    </p>
                </div>

                <Link
                    href="/dashboard/service-provider/services/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                    Add service
                </Link>
            </header>

            <nav
                aria-label="Service status filters"
                className="mt-5 flex flex-wrap gap-2"
            >
                {[
                    {
                        label: "All",
                        value: "",
                        href: "/dashboard/service-provider/services",
                    },
                    {
                        label: "Draft",
                        value: "draft",
                        href: "/dashboard/service-provider/services?status=draft",
                    },
                    {
                        label: "Under review",
                        value: "under_review",
                        href: "/dashboard/service-provider/services?status=under_review",
                    },
                    {
                        label: "Active",
                        value: "active",
                        href: "/dashboard/service-provider/services?status=active",
                    },
                    {
                        label: "Paused",
                        value: "paused",
                        href: "/dashboard/service-provider/services?status=paused",
                    },
                    {
                        label: "Needs correction",
                        value:
                            "correction_required",
                        href: "/dashboard/service-provider/services?status=correction_required",
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
                        className={`rounded-[var(--asancha-radius-md)] px-4 py-2 text-sm font-semibold ${
                            status === filter.value
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
                    Saving or submitting a service does
                    not make it publicly visible.
                </strong>{" "}
                Service visibility remains subject to
                profile, verification, document, review,
                status, and backend publication rules.
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
            collectionItems.length === 0 ? (
                <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-dashed border-[var(--border)] p-8 text-center">
                    <h2 className="text-xl font-bold">
                        You have not added any services
                        yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                        Create your first service to begin
                        building your service catalogue.
                    </p>

                    <Link
                        href="/dashboard/service-provider/services/new"
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Add first service
                    </Link>
                </section>
            ) : null}

            {!isLoading &&
            collectionItems.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {collectionItems.map(
                        (
                            service:
                                ProviderServiceSummary,
                        ): ReactNode => (
                            <article
                                key={
                                    service.servicePublicId
                                }
                                className="flex flex-col rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                        {formatValue(
                                            service.status,
                                        )}
                                    </span>

                                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                                        {formatValue(
                                            service.visibilityStatus,
                                        )}
                                    </span>
                                </div>

                                <h2 className="mt-3 text-lg font-bold">
                                    {service.title}
                                </h2>

                                <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
                                    {formatValue(
                                        service.category,
                                    )}
                                </p>

                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {
                                        service.shortDescription
                                    }
                                </p>

                                {service.displayPrice ? (
                                    <p className="mt-4 text-xl font-bold">
                                        {
                                            service.displayPrice
                                        }
                                    </p>
                                ) : null}

                                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Bookings
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {
                                                service.bookingCount
                                            }
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">
                                            Completed
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {
                                                service.completedBookingCount
                                            }
                                        </dd>
                                    </div>
                                </dl>

                                {service.safeUserMessage ? (
                                    <p className="mt-4 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {
                                            service.safeUserMessage
                                        }
                                    </p>
                                ) : null}

                                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                    <Link
                                        href={
                                            service.detailPath
                                        }
                                        className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                    >
                                        View service
                                    </Link>

                                    {service.editPath ? (
                                        <Link
                                            href={
                                                service.editPath
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
