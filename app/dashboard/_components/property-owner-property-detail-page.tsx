"use client";

// File: app/dashboard/_components/property-owner-property-detail-page.tsx

/**
 * Asancha Property Owner Property Detail Page
 *
 * Purpose:
 * Displays one owner-scoped property, its safe lifecycle state, documents,
 * listings, activity, and available actions.
 *
 * Security notes:
 * - Backend ownership and active-profile checks remain authoritative.
 * - Internal review notes and private documents must never appear.
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
    OwnerPropertyDetail,
    SubmitOwnerPropertyPayload,
    SubmitOwnerPropertyResult,
} from "../_types/property-owner-dashboard.types";

export interface PropertyOwnerPropertyDetailPageProps {
    propertyPublicId: string;
}

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string) =>
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

export function PropertyOwnerPropertyDetailPage({
    propertyPublicId,
}: PropertyOwnerPropertyDetailPageProps) {
    const [property, setProperty] =
        useState<OwnerPropertyDetail | null>(
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

    const loadProperty =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<OwnerPropertyDetail>(
                        `/properties/${encodeURIComponent(
                            propertyPublicId,
                        )}`,
                    );

                setProperty(result);
            } catch {
                setErrorMessage(
                    "We could not load this property. It may not exist or may not belong to your active profile.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [propertyPublicId]);

    useEffect((): void => {
        void loadProperty();
    }, [loadProperty]);

    const submitProperty =
        async (): Promise<void> => {
            if (!property?.canSubmit) {
                return;
            }

            setIsSubmitting(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            const payload:
                SubmitOwnerPropertyPayload = {
                data: {
                    informationAccurateConfirmed:
                        true,
                },
            };

            try {
                const result =
                    await authApiPost<SubmitOwnerPropertyResult>(
                        `/properties/${encodeURIComponent(
                            property.propertyPublicId,
                        )}/submit`,
                        payload,
                    );

                setProperty(result.property);
                setSuccessMessage(result.message);
            } catch {
                setErrorMessage(
                    "We could not submit this property for review. Complete the required information, policies, and documents before trying again.",
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

    if (!property) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "This property is unavailable."}
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
                                property.status,
                            )}
                        </span>

                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                            {formatValue(
                                property.verificationStatus,
                            )}
                        </span>
                    </div>

                    <h1 className="mt-3 text-3xl font-bold">
                        {property.title}
                    </h1>

                    <p className="mt-2 text-[var(--muted-foreground)]">
                        {
                            property.address
                                .addressLine1
                        }
                        ,{" "}
                        {property.address.townCity},{" "}
                        {property.address.postcode}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {property.canEdit &&
                        property.editPath ? (
                        <Link
                            href={property.editPath}
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Edit property
                        </Link>
                    ) : null}

                    {property.canSubmit ? (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(): void => {
                                void submitProperty();
                            }}
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
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

            {property.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {property.safeUserMessage}
                </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="grid gap-6">
                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Property information
                        </h2>

                        <p className="mt-4 whitespace-pre-line leading-7 text-[var(--muted-foreground)]">
                            {property.description}
                        </p>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    label:
                                        "Property type",
                                    value: formatValue(
                                        property.propertyType,
                                    ),
                                },
                                {
                                    label:
                                        "Ownership capacity",
                                    value: formatValue(
                                        property.ownershipCapacity,
                                    ),
                                },
                                {
                                    label:
                                        "Submission intent",
                                    value: formatValue(
                                        property.submissionIntent,
                                    ),
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
                                    label:
                                        "Occupancy status",
                                    value: property.occupancyStatus
                                        ? formatValue(
                                            property.occupancyStatus,
                                        )
                                        : "Not provided",
                                },
                            ].map(
                                (item): ReactNode => (
                                    <div
                                        key={item.label}
                                    >
                                        <dt className="text-sm text-[var(--muted-foreground)]">
                                            {
                                                item.label
                                            }
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {
                                                item.value
                                            }
                                        </dd>
                                    </div>
                                ),
                            )}
                        </dl>
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Listings
                        </h2>

                        {property.listings.length >
                            0 ? (
                            <ul className="mt-4 grid gap-3">
                                {property.listings.map(
                                    (
                                        listing,
                                    ): ReactNode => (
                                        <li
                                            key={
                                                listing.listingPublicId
                                            }
                                            className="flex flex-col gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {
                                                        listing.title
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                                    {formatValue(
                                                        listing.status,
                                                    )}
                                                    {" · "}
                                                    {formatValue(
                                                        listing.publicationStatus,
                                                    )}
                                                </p>
                                            </div>

                                            {listing.detailPath ? (
                                                <Link
                                                    href={
                                                        listing.detailPath
                                                    }
                                                    className="text-sm font-semibold text-[var(--primary)] hover:underline"
                                                >
                                                    View listing
                                                </Link>
                                            ) : null}
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
                                No listing has been
                                created from this property.
                            </p>
                        )}
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Recent activity
                        </h2>

                        {property.recentActivity
                            .length > 0 ? (
                            <ol className="mt-4 grid gap-4">
                                {property.recentActivity.map(
                                    (
                                        activity,
                                    ): ReactNode => (
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
                                No property activity is
                                available yet.
                            </p>
                        )}
                    </article>
                </div>

                <aside className="grid content-start gap-6">
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Financial information
                        </h2>

                        <dl className="mt-4 grid gap-4">
                            {[
                                {
                                    label:
                                        "Estimated value",
                                    value:
                                        property.estimatedValue !==
                                            null
                                            ? formatCurrency(
                                                property.estimatedValue,
                                                property.currency,
                                            )
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Expected sale price",
                                    value:
                                        property.expectedSalePrice !==
                                            null
                                            ? formatCurrency(
                                                property.expectedSalePrice,
                                                property.currency,
                                            )
                                            : "Not provided",
                                },
                                {
                                    label:
                                        "Expected monthly rent",
                                    value:
                                        property.expectedMonthlyRent !==
                                            null
                                            ? formatCurrency(
                                                property.expectedMonthlyRent,
                                                property.currency,
                                            )
                                            : "Not provided",
                                },
                            ].map(
                                (item): ReactNode => (
                                    <div
                                        key={item.label}
                                    >
                                        <dt className="text-sm text-[var(--muted-foreground)]">
                                            {
                                                item.label
                                            }
                                        </dt>

                                        <dd className="mt-1 font-semibold">
                                            {
                                                item.value
                                            }
                                        </dd>
                                    </div>
                                ),
                            )}
                        </dl>
                    </section>

                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Document requirements
                        </h2>

                        {property.requiredDocuments
                            .length > 0 ? (
                            <ul className="mt-4 grid gap-3">
                                {property.requiredDocuments.map(
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
                                                    className="mt-2 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                                >
                                                    Complete action
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
                            {property.actions.map(
                                (action): ReactNode =>
                                    action.allowed &&
                                        action.path ? (
                                        <Link
                                            key={
                                                action.actionKey
                                            }
                                            href={
                                                action.path
                                            }
                                            className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
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
                                                {
                                                    action.label
                                                }
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