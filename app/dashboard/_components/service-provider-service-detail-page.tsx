"use client";

// File: app/dashboard/_components/service-provider-service-detail-page.tsx

/**
 * Asancha Service Provider Service Detail Page
 *
 * Purpose:
 * Displays a provider-owned service, pricing, delivery details, service areas,
 * document requirements, activity, and backend-controlled actions.
 *
 * Security notes:
 * - Service ownership and active-profile scope remain backend-controlled.
 * - Internal review notes and private booking or customer information must not
 *   be displayed.
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
    ProviderServiceAction,
    ProviderServiceDetail,
    SubmitProviderServicePayload,
} from "../_types/service-provider-dashboard.types";

export interface ServiceProviderServiceDetailPageProps {
    servicePublicId: string;
}

interface SubmitProviderServiceResult {
    service: ProviderServiceDetail;
    submitted: true;
    message: string;
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

export function ServiceProviderServiceDetailPage({
    servicePublicId,
}: ServiceProviderServiceDetailPageProps) {
    const [service, setService] =
        useState<ProviderServiceDetail | null>(
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

    const loadService =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<ProviderServiceDetail>(
                        `/services/${encodeURIComponent(
                            servicePublicId,
                        )}`,
                    );

                setService(result);
            } catch {
                setErrorMessage(
                    "We could not load this service.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [servicePublicId]);

    useEffect((): void => {
        void loadService();
    }, [loadService]);

    const submitService =
        async (): Promise<void> => {
            if (!service?.canSubmit) {
                return;
            }

            setIsSubmitting(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            const payload:
                SubmitProviderServicePayload = {
                data: {
                    informationAccurateConfirmed:
                        true,
                },
            };

            try {
                const result =
                    await authApiPost<SubmitProviderServiceResult>(
                        `/services/${encodeURIComponent(
                            service.servicePublicId,
                        )}/submit`,
                        payload,
                    );

                setService(result.service);
                setSuccessMessage(
                    result.message,
                );
            } catch {
                setErrorMessage(
                    "We could not submit this service. Complete the required profile, verification, document, pricing, and service information before trying again.",
                );
            } finally {
                setIsSubmitting(false);
            }
        };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!service) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "This service is unavailable."}
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
                                service.status,
                            )}
                        </span>

                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                            {formatValue(
                                service.visibilityStatus,
                            )}
                        </span>
                    </div>

                    <h1 className="mt-3 text-3xl font-bold">
                        {service.title}
                    </h1>

                    <p className="mt-2 text-[var(--muted-foreground)]">
                        {formatValue(
                            service.category,
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {service.editPath ? (
                        <Link
                            href={service.editPath}
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Edit service
                        </Link>
                    ) : null}

                    {service.canSubmit ? (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(): void => {
                                void submitService();
                            }}
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
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
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            {service.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {service.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="grid gap-6">
                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Service description
                        </h2>

                        <p className="mt-4 whitespace-pre-line leading-7 text-[var(--muted-foreground)]">
                            {service.fullDescription}
                        </p>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Pricing model
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {formatValue(
                                        service.pricingModel,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Delivery modes
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {service.deliveryModes
                                        .map(formatValue)
                                        .join(", ")}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Duration
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {service.estimatedDurationMinutes !==
                                    null
                                        ? `${service.estimatedDurationMinutes} minutes`
                                        : "Varies"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Booking required
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {service.bookingRequired
                                        ? "Yes"
                                        : "No"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Quote required
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {service.quoteRequired
                                        ? "Yes"
                                        : "No"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Emergency service
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {service.emergencyService
                                        ? "Available"
                                        : "Not available"}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Scope
                        </h2>

                        <div className="mt-5 grid gap-6 md:grid-cols-3">
                            <div>
                                <h3 className="font-semibold">
                                    Requirements
                                </h3>

                                <ul className="mt-3 grid gap-2 text-sm text-[var(--muted-foreground)]">
                                    {service.requirements.map(
                                        (
                                            item: string,
                                        ): ReactNode => (
                                            <li
                                                key={item}
                                                className="rounded-md bg-[var(--muted)] p-3"
                                            >
                                                {item}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Deliverables
                                </h3>

                                <ul className="mt-3 grid gap-2 text-sm text-[var(--muted-foreground)]">
                                    {service.deliverables.map(
                                        (
                                            item: string,
                                        ): ReactNode => (
                                            <li
                                                key={item}
                                                className="rounded-md bg-[var(--muted)] p-3"
                                            >
                                                {item}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Exclusions
                                </h3>

                                <ul className="mt-3 grid gap-2 text-sm text-[var(--muted-foreground)]">
                                    {service.exclusions.map(
                                        (
                                            item: string,
                                        ): ReactNode => (
                                            <li
                                                key={item}
                                                className="rounded-md bg-[var(--muted)] p-3"
                                            >
                                                {item}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="text-xl font-bold">
                            Service areas
                        </h2>

                        {service.serviceAreas.length ? (
                            <ul className="mt-4 grid gap-3 md:grid-cols-2">
                                {service.serviceAreas.map(
                                    (area): ReactNode => (
                                        <li
                                            key={
                                                area.serviceAreaPublicId
                                            }
                                            className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                                        >
                                            <p className="font-semibold">
                                                {area.label}
                                            </p>

                                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                                {formatValue(
                                                    area.areaType,
                                                )}
                                            </p>
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                                No service area has been
                                assigned.
                            </p>
                        )}
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="text-xl font-bold">
                            Recent activity
                        </h2>

                        {service.recentActivity.length ? (
                            <ol className="mt-4 grid gap-4">
                                {service.recentActivity.map(
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
                                No service activity is
                                available.
                            </p>
                        )}
                    </article>
                </div>

                <aside className="grid content-start gap-6">
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Pricing
                        </h2>

                        <dl className="mt-4 grid gap-4">
                            {service.displayPrice ? (
                                <div>
                                    <dt className="text-sm text-[var(--muted-foreground)]">
                                        Display price
                                    </dt>

                                    <dd className="mt-1 text-xl font-bold">
                                        {
                                            service.displayPrice
                                        }
                                    </dd>
                                </div>
                            ) : null}

                            {service.priceAmount !==
                            null ? (
                                <div>
                                    <dt className="text-sm text-[var(--muted-foreground)]">
                                        Price
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {formatCurrency(
                                            service.priceAmount,
                                            service.currency,
                                        )}
                                    </dd>
                                </div>
                            ) : null}

                            {service.minimumPriceAmount !==
                            null ? (
                                <div>
                                    <dt className="text-sm text-[var(--muted-foreground)]">
                                        Minimum
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {formatCurrency(
                                            service.minimumPriceAmount,
                                            service.currency,
                                        )}
                                    </dd>
                                </div>
                            ) : null}

                            {service.maximumPriceAmount !==
                            null ? (
                                <div>
                                    <dt className="text-sm text-[var(--muted-foreground)]">
                                        Maximum
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {formatCurrency(
                                            service.maximumPriceAmount,
                                            service.currency,
                                        )}
                                    </dd>
                                </div>
                            ) : null}

                            {service.percentageRate !==
                            null ? (
                                <div>
                                    <dt className="text-sm text-[var(--muted-foreground)]">
                                        Percentage
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                        {
                                            service.percentageRate
                                        }
                                        %
                                    </dd>
                                </div>
                            ) : null}
                        </dl>
                    </section>

                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Booking activity
                        </h2>

                        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Total
                                </dt>

                                <dd className="mt-1 text-xl font-bold">
                                    {
                                        service.bookingCount
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Completed
                                </dt>

                                <dd className="mt-1 text-xl font-bold">
                                    {
                                        service.completedBookingCount
                                    }
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Required documents
                        </h2>

                        {service.requiredDocuments
                            .length ? (
                            <ul className="mt-4 grid gap-3">
                                {service.requiredDocuments.map(
                                    (
                                        requirement,
                                    ): ReactNode => (
                                        <li
                                            key={
                                                requirement.requirementKey
                                            }
                                            className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3"
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
                                                    Complete
                                                    action
                                                </Link>
                                            ) : null}
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                                No outstanding document
                                requirements.
                            </p>
                        )}
                    </section>

                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Available actions
                        </h2>

                        <div className="mt-4 grid gap-2">
                            {service.actions.map(
                                (
                                    action:
                                        ProviderServiceAction,
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
                                                {action.label}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                                                {action.reason ??
                                                    "This action is currently unavailable."}
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