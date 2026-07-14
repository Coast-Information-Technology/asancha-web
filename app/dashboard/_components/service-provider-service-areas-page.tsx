"use client";

// File: app/dashboard/_components/service-provider-service-areas-page.tsx

/**
 * Asancha Service Provider Service Areas Page
 *
 * Purpose:
 * Displays and manages the geographic areas covered by the active
 * service-provider profile.
 *
 * Security notes:
 * - Service-area configuration does not guarantee service availability.
 * - Backend ownership, limits, duplicate, profile, verification, and lifecycle
 *   checks remain authoritative.
 */

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    authApiDelete,
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import type {
    CreateServiceAreaPayload,
    ServiceArea,
    ServiceAreaFormValues,
    ServiceAreasResponse,
} from "../_types/service-provider-dashboard.types";

const INITIAL_VALUES: ServiceAreaFormValues = {
    areaType: "postcode",

    label: "",

    postcode: null,
    townCity: null,
    county: null,
    region: null,

    radiusMiles: null,
    radiusOriginPostcode: null,
};

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function ServiceProviderServiceAreasPage() {
    const [response, setResponse] =
        useState<ServiceAreasResponse | null>(
            null,
        );

    const [values, setValues] =
        useState<ServiceAreaFormValues>(
            INITIAL_VALUES,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [
        deletingServiceAreaPublicId,
        setDeletingServiceAreaPublicId,
    ] = useState<string | null>(null);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadServiceAreas =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<ServiceAreasResponse>(
                        "/profiles/service-provider/me/service-areas",
                    );

                setResponse(result);
            } catch {
                setErrorMessage(
                    "We could not load your service areas.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadServiceAreas();
    }, [loadServiceAreas]);

    const updateValue = <
        TKey extends keyof ServiceAreaFormValues,
    >(
        key: TKey,
        value: ServiceAreaFormValues[TKey],
    ): void => {
        setValues(
            (
                current: ServiceAreaFormValues,
            ): ServiceAreaFormValues => ({
                ...current,
                [key]: value,
            }),
        );

        setErrorMessage(null);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!response?.canManage) {
            return;
        }

        if (!values.label.trim()) {
            setErrorMessage(
                "Enter a clear label for this service area.",
            );
            return;
        }

        if (
            values.areaType === "radius" &&
            (!values.radiusOriginPostcode ||
                values.radiusMiles === null)
        ) {
            setErrorMessage(
                "Enter an origin postcode and radius.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        const payload:
            CreateServiceAreaPayload = {
            data: values,
        };

        try {
            const created =
                await authApiPost<ServiceArea>(
                    "/profiles/service-provider/me/service-areas",
                    payload,
                );

            setResponse(
                (
                    current:
                        | ServiceAreasResponse
                        | null,
                ): ServiceAreasResponse | null =>
                    current
                        ? {
                              ...current,
                              items: [
                                  created,
                                  ...current.items,
                              ],
                          }
                        : current,
            );

            setValues(INITIAL_VALUES);
        } catch {
            setErrorMessage(
                "We could not add this service area.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const deleteServiceArea = async (
        serviceAreaPublicId: string,
    ): Promise<void> => {
        if (!response?.canManage) {
            return;
        }

        setDeletingServiceAreaPublicId(
            serviceAreaPublicId,
        );

        setErrorMessage(null);

        try {
            await authApiDelete(
                `/profiles/service-provider/me/service-areas/${encodeURIComponent(
                    serviceAreaPublicId,
                )}`,
            );

            setResponse(
                (
                    current:
                        | ServiceAreasResponse
                        | null,
                ): ServiceAreasResponse | null =>
                    current
                        ? {
                              ...current,
                              items:
                                  current.items.filter(
                                      (
                                          area: ServiceArea,
                                      ): boolean =>
                                          area.serviceAreaPublicId !==
                                          serviceAreaPublicId,
                                  ),
                          }
                        : current,
            );
        } catch {
            setErrorMessage(
                "We could not remove this service area.",
            );
        } finally {
            setDeletingServiceAreaPublicId(
                null,
            );
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Provider coverage
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Service areas
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Define the postcodes, towns, counties,
                    regions, or travel radius in which you
                    normally provide services.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                A listed service area does not guarantee
                that every booking request in that area
                will be accepted.
            </div>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {response?.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                    {response.safeUserMessage}
                </div>
            ) : null}

            {response?.canManage ? (
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-bold">
                        Add service area
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="areaType"
                                className="text-sm font-semibold"
                            >
                                Area type
                            </label>

                            <select
                                id="areaType"
                                value={values.areaType}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateValue(
                                        "areaType",
                                        event.target
                                            .value as ServiceAreaFormValues["areaType"],
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="postcode">
                                    Postcode
                                </option>
                                <option value="town_city">
                                    Town or city
                                </option>
                                <option value="county">
                                    County
                                </option>
                                <option value="region">
                                    Region
                                </option>
                                <option value="radius">
                                    Travel radius
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="label"
                                className="text-sm font-semibold"
                            >
                                Display label
                            </label>

                            <input
                                id="label"
                                required
                                value={values.label}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "label",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Manchester and surrounding areas"
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        {values.areaType ===
                        "postcode" ? (
                            <div>
                                <label
                                    htmlFor="postcode"
                                    className="text-sm font-semibold"
                                >
                                    Postcode
                                </label>

                                <input
                                    id="postcode"
                                    required
                                    value={
                                        values.postcode ??
                                        ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateValue(
                                            "postcode",
                                            event.target
                                                .value.toUpperCase() ||
                                                null,
                                        )
                                    }
                                    className={
                                        fieldClassName
                                    }
                                />
                            </div>
                        ) : null}

                        {values.areaType ===
                        "town_city" ? (
                            <div>
                                <label
                                    htmlFor="townCity"
                                    className="text-sm font-semibold"
                                >
                                    Town or city
                                </label>

                                <input
                                    id="townCity"
                                    required
                                    value={
                                        values.townCity ??
                                        ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateValue(
                                            "townCity",
                                            event.target
                                                .value || null,
                                        )
                                    }
                                    className={
                                        fieldClassName
                                    }
                                />
                            </div>
                        ) : null}

                        {values.areaType ===
                        "county" ? (
                            <div>
                                <label
                                    htmlFor="county"
                                    className="text-sm font-semibold"
                                >
                                    County
                                </label>

                                <input
                                    id="county"
                                    required
                                    value={
                                        values.county ??
                                        ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateValue(
                                            "county",
                                            event.target
                                                .value || null,
                                        )
                                    }
                                    className={
                                        fieldClassName
                                    }
                                />
                            </div>
                        ) : null}

                        {values.areaType ===
                        "region" ? (
                            <div>
                                <label
                                    htmlFor="region"
                                    className="text-sm font-semibold"
                                >
                                    Region
                                </label>

                                <input
                                    id="region"
                                    required
                                    value={
                                        values.region ??
                                        ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateValue(
                                            "region",
                                            event.target
                                                .value || null,
                                        )
                                    }
                                    className={
                                        fieldClassName
                                    }
                                />
                            </div>
                        ) : null}

                        {values.areaType ===
                        "radius" ? (
                            <>
                                <div>
                                    <label
                                        htmlFor="radiusOriginPostcode"
                                        className="text-sm font-semibold"
                                    >
                                        Origin postcode
                                    </label>

                                    <input
                                        id="radiusOriginPostcode"
                                        required
                                        value={
                                            values.radiusOriginPostcode ??
                                            ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateValue(
                                                "radiusOriginPostcode",
                                                event.target
                                                    .value.toUpperCase() ||
                                                    null,
                                            )
                                        }
                                        className={
                                            fieldClassName
                                        }
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="radiusMiles"
                                        className="text-sm font-semibold"
                                    >
                                        Radius in miles
                                    </label>

                                    <input
                                        id="radiusMiles"
                                        type="number"
                                        min={1}
                                        max={500}
                                        required
                                        value={
                                            values.radiusMiles ??
                                            ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateValue(
                                                "radiusMiles",
                                                event
                                                    .target
                                                    .value
                                                    ? Number(
                                                          event
                                                              .target
                                                              .value,
                                                      )
                                                    : null,
                                            )
                                        }
                                        className={
                                            fieldClassName
                                        }
                                    />
                                </div>
                            </>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {isSaving
                            ? "Adding…"
                            : "Add service area"}
                    </button>
                </form>
            ) : null}

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Current service areas
                </h2>

                {response?.items.length ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {response.items.map(
                            (
                                area: ServiceArea,
                            ): ReactNode => (
                                <article
                                    key={
                                        area.serviceAreaPublicId
                                    }
                                    className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                                                {formatValue(
                                                    area.areaType,
                                                )}
                                            </p>

                                            <h3 className="mt-1 font-bold">
                                                {
                                                    area.label
                                                }
                                            </h3>
                                        </div>

                                        <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                            {area.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    {area.areaType ===
                                        "radius" &&
                                    area.radiusMiles !==
                                        null ? (
                                        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                            {
                                                area.radiusMiles
                                            }{" "}
                                            miles from{" "}
                                            {
                                                area.radiusOriginPostcode
                                            }
                                        </p>
                                    ) : null}

                                    {response.canManage ? (
                                        <button
                                            type="button"
                                            disabled={
                                                deletingServiceAreaPublicId ===
                                                area.serviceAreaPublicId
                                            }
                                            onClick={(): void => {
                                                void deleteServiceArea(
                                                    area.serviceAreaPublicId,
                                                );
                                            }}
                                            className="mt-4 text-sm font-semibold text-[var(--destructive)] hover:underline disabled:opacity-60"
                                        >
                                            {deletingServiceAreaPublicId ===
                                            area.serviceAreaPublicId
                                                ? "Removing…"
                                                : "Remove"}
                                        </button>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                        No service areas have been added.
                    </p>
                )}
            </section>
        </main>
    );
}