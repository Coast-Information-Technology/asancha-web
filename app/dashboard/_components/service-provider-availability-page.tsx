"use client";

// File: app/dashboard/_components/service-provider-availability-page.tsx

/**
 * Asancha Service Provider Availability Page
 *
 * Purpose:
 * Displays and updates weekly working hours, booking notice, booking window,
 * unavailable dates, and booking preferences.
 *
 * Security notes:
 * - Availability is a provider preference and not a guaranteed appointment.
 * - Backend booking collision, status, service-area, verification, payment,
 *   cancellation, and capacity checks remain authoritative.
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
    authApiGet,
    authApiPut,
} from "../../../src/lib/api/auth-fetch";
import {
    SERVICE_DELIVERY_MODE_OPTIONS,
    WEEKDAY_OPTIONS,
} from "../_config/service-provider-dashboard.config";
import type {
    AvailabilityTimeSlot,
    ProviderAvailabilityDay,
    ServiceProviderAvailability,
    ServiceProviderAvailabilityFormValues,
    UpdateProviderAvailabilityPayload,
} from "../_types/service-provider-dashboard.types";

function createDefaultSlot(
    day: ProviderAvailabilityDay,
): AvailabilityTimeSlot {
    return {
        availabilityPublicId: `local-${day}`,

        day,

        enabled: false,

        startTime: "09:00",
        endTime: "17:00",

        deliveryModes: ["on_site"],

        maximumBookings: null,
    };
}

const DEFAULT_WEEKLY_AVAILABILITY:
    AvailabilityTimeSlot[] =
    WEEKDAY_OPTIONS.map(
        (
            option,
        ): AvailabilityTimeSlot =>
            createDefaultSlot(option.value),
    );

function createInitialValues():
    ServiceProviderAvailabilityFormValues {
    return {
        timezone: "Europe/London",

        minimumBookingNoticeHours: 24,
        maximumBookingWindowDays: 90,

        defaultBookingDurationMinutes: 60,

        acceptsInstantBooking: false,
        acceptsEmergencyRequests: false,

        unavailableDates: [],

        weeklyAvailability:
            DEFAULT_WEEKLY_AVAILABILITY,
    };
}

function toFormValues(
    availability: ServiceProviderAvailability,
): ServiceProviderAvailabilityFormValues {
    const existingByDay =
        new Map<
            ProviderAvailabilityDay,
            AvailabilityTimeSlot
        >(
            availability.weeklyAvailability.map(
                (
                    slot: AvailabilityTimeSlot,
                ): [
                    ProviderAvailabilityDay,
                    AvailabilityTimeSlot,
                ] => [slot.day, slot],
            ),
        );

    return {
        timezone: availability.timezone,

        minimumBookingNoticeHours:
            availability.minimumBookingNoticeHours,

        maximumBookingWindowDays:
            availability.maximumBookingWindowDays,

        defaultBookingDurationMinutes:
            availability.defaultBookingDurationMinutes,

        acceptsInstantBooking:
            availability.acceptsInstantBooking,

        acceptsEmergencyRequests:
            availability.acceptsEmergencyRequests,

        unavailableDates:
            availability.unavailableDates,

        weeklyAvailability:
            WEEKDAY_OPTIONS.map(
                (
                    option,
                ): AvailabilityTimeSlot =>
                    existingByDay.get(
                        option.value,
                    ) ??
                    createDefaultSlot(
                        option.value,
                    ),
            ),
    };
}

export function ServiceProviderAvailabilityPage() {
    const [
        availability,
        setAvailability,
    ] =
        useState<ServiceProviderAvailability | null>(
            null,
        );

    const [values, setValues] =
        useState<ServiceProviderAvailabilityFormValues>(
            createInitialValues,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const loadAvailability =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<ServiceProviderAvailability>(
                        "/profiles/service-provider/me/availability",
                    );

                setAvailability(result);
                setValues(
                    toFormValues(result),
                );
            } catch {
                setErrorMessage(
                    "We could not load your availability settings.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadAvailability();
    }, [loadAvailability]);

    const updateRoot = <
        TKey extends keyof ServiceProviderAvailabilityFormValues,
    >(
        key: TKey,
        value: ServiceProviderAvailabilityFormValues[TKey],
    ): void => {
        setValues(
            (
                current:
                    ServiceProviderAvailabilityFormValues,
            ): ServiceProviderAvailabilityFormValues => ({
                ...current,
                [key]: value,
            }),
        );

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const updateSlot = <
        TKey extends keyof AvailabilityTimeSlot,
    >(
        day: ProviderAvailabilityDay,
        key: TKey,
        value: AvailabilityTimeSlot[TKey],
    ): void => {
        setValues(
            (
                current:
                    ServiceProviderAvailabilityFormValues,
            ): ServiceProviderAvailabilityFormValues => ({
                ...current,
                weeklyAvailability:
                    current.weeklyAvailability.map(
                        (
                            slot:
                                AvailabilityTimeSlot,
                        ): AvailabilityTimeSlot =>
                            slot.day === day
                                ? {
                                      ...slot,
                                      [key]: value,
                                  }
                                : slot,
                    ),
            }),
        );

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleDeliveryModeChange = (
        event: ChangeEvent<HTMLSelectElement>,
        day: ProviderAvailabilityDay,
    ): void => {
        const selectedValues: string[] =
            Array.from(
                event.target.selectedOptions,
            ).map(
                (
                    option: HTMLOptionElement,
                ): string => option.value,
            );

        updateSlot(
            day,
            "deliveryModes",
            selectedValues,
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!availability?.canManage) {
            return;
        }

        const invalidSlot =
            values.weeklyAvailability.find(
                (
                    slot: AvailabilityTimeSlot,
                ): boolean =>
                    slot.enabled &&
                    slot.startTime >= slot.endTime,
            );

        if (invalidSlot) {
            setErrorMessage(
                `The end time for ${invalidSlot.day} must be later than the start time.`,
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateProviderAvailabilityPayload = {
            data: values,
        };

        try {
            const result =
                await authApiPut<ServiceProviderAvailability>(
                    "/profiles/service-provider/me/availability",
                    payload,
                );

            setAvailability(result);
            setValues(
                toFormValues(result),
            );

            setSuccessMessage(
                "Your availability settings have been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update your availability settings.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "min-h-10 rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!availability) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Availability settings are unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Provider schedule
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Availability
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Define normal working hours and
                    booking preferences. Every booking
                    remains subject to platform capacity
                    and conflict checks.
                </p>
            </header>

            {availability.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {availability.safeUserMessage}
                </div>
            ) : null}

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

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Booking settings
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="timezone"
                                className="text-sm font-semibold"
                            >
                                Timezone
                            </label>

                            <input
                                id="timezone"
                                disabled={
                                    !availability.canManage
                                }
                                value={values.timezone}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "timezone",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`mt-2 w-full ${fieldClassName}`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="minimumBookingNoticeHours"
                                className="text-sm font-semibold"
                            >
                                Minimum booking notice
                                in hours
                            </label>

                            <input
                                id="minimumBookingNoticeHours"
                                type="number"
                                min={0}
                                max={8760}
                                disabled={
                                    !availability.canManage
                                }
                                value={
                                    values.minimumBookingNoticeHours
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "minimumBookingNoticeHours",
                                        Number(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={`mt-2 w-full ${fieldClassName}`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="maximumBookingWindowDays"
                                className="text-sm font-semibold"
                            >
                                Maximum booking window
                                in days
                            </label>

                            <input
                                id="maximumBookingWindowDays"
                                type="number"
                                min={1}
                                max={730}
                                disabled={
                                    !availability.canManage
                                }
                                value={
                                    values.maximumBookingWindowDays
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "maximumBookingWindowDays",
                                        Number(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={`mt-2 w-full ${fieldClassName}`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="defaultBookingDurationMinutes"
                                className="text-sm font-semibold"
                            >
                                Default booking duration
                                in minutes
                            </label>

                            <input
                                id="defaultBookingDurationMinutes"
                                type="number"
                                min={15}
                                max={1440}
                                step={15}
                                disabled={
                                    !availability.canManage
                                }
                                value={
                                    values.defaultBookingDurationMinutes
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "defaultBookingDurationMinutes",
                                        Number(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className={`mt-2 w-full ${fieldClassName}`}
                            />
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                disabled={
                                    !availability.canManage
                                }
                                checked={
                                    values.acceptsInstantBooking
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "acceptsInstantBooking",
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            />

                            <span className="text-sm leading-6">
                                Allow instant booking
                                where the service and
                                platform rules permit it.
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                disabled={
                                    !availability.canManage
                                }
                                checked={
                                    values.acceptsEmergencyRequests
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "acceptsEmergencyRequests",
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            />

                            <span className="text-sm leading-6">
                                Accept emergency booking
                                requests where eligible.
                            </span>
                        </label>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Weekly availability
                    </h2>

                    <div className="mt-5 grid gap-4">
                        {values.weeklyAvailability.map(
                            (
                                slot:
                                    AvailabilityTimeSlot,
                            ): ReactNode => (
                                <article
                                    key={slot.day}
                                    className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <label className="flex items-center gap-3 font-semibold">
                                            <input
                                                type="checkbox"
                                                disabled={
                                                    !availability.canManage
                                                }
                                                checked={
                                                    slot.enabled
                                                }
                                                onChange={(
                                                    event: ChangeEvent<HTMLInputElement>,
                                                ): void =>
                                                    updateSlot(
                                                        slot.day,
                                                        "enabled",
                                                        event
                                                            .target
                                                            .checked,
                                                    )
                                                }
                                            />

                                            {
                                                WEEKDAY_OPTIONS.find(
                                                    (
                                                        option,
                                                    ): boolean =>
                                                        option.value ===
                                                        slot.day,
                                                )
                                                    ?.label
                                            }
                                        </label>

                                        {slot.enabled ? (
                                            <div className="flex flex-wrap gap-3">
                                                <input
                                                    type="time"
                                                    aria-label={`${slot.day} start time`}
                                                    disabled={
                                                        !availability.canManage
                                                    }
                                                    value={
                                                        slot.startTime
                                                    }
                                                    onChange={(
                                                        event: ChangeEvent<HTMLInputElement>,
                                                    ): void =>
                                                        updateSlot(
                                                            slot.day,
                                                            "startTime",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    className={
                                                        fieldClassName
                                                    }
                                                />

                                                <input
                                                    type="time"
                                                    aria-label={`${slot.day} end time`}
                                                    disabled={
                                                        !availability.canManage
                                                    }
                                                    value={
                                                        slot.endTime
                                                    }
                                                    onChange={(
                                                        event: ChangeEvent<HTMLInputElement>,
                                                    ): void =>
                                                        updateSlot(
                                                            slot.day,
                                                            "endTime",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    className={
                                                        fieldClassName
                                                    }
                                                />

                                                <input
                                                    type="number"
                                                    min={1}
                                                    aria-label={`${slot.day} maximum bookings`}
                                                    placeholder="Max bookings"
                                                    disabled={
                                                        !availability.canManage
                                                    }
                                                    value={
                                                        slot.maximumBookings ??
                                                        ""
                                                    }
                                                    onChange={(
                                                        event: ChangeEvent<HTMLInputElement>,
                                                    ): void =>
                                                        updateSlot(
                                                            slot.day,
                                                            "maximumBookings",
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
                                                    className={`${fieldClassName} w-36`}
                                                />
                                            </div>
                                        ) : null}
                                    </div>

                                    {slot.enabled ? (
                                        <div className="mt-4">
                                            <label
                                                htmlFor={`${slot.day}-delivery-modes`}
                                                className="text-sm font-semibold"
                                            >
                                                Delivery modes
                                            </label>

                                            <select
                                                id={`${slot.day}-delivery-modes`}
                                                multiple
                                                disabled={
                                                    !availability.canManage
                                                }
                                                value={
                                                    slot.deliveryModes
                                                }
                                                onChange={(
                                                    event: ChangeEvent<HTMLSelectElement>,
                                                ): void =>
                                                    handleDeliveryModeChange(
                                                        event,
                                                        slot.day,
                                                    )
                                                }
                                                className="mt-2 min-h-28 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                                            >
                                                {SERVICE_DELIVERY_MODE_OPTIONS.map(
                                                    (
                                                        option,
                                                    ) => (
                                                        <option
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <label
                        htmlFor="unavailableDates"
                        className="text-sm font-semibold"
                    >
                        Unavailable dates
                    </label>

                    <textarea
                        id="unavailableDates"
                        rows={5}
                        disabled={
                            !availability.canManage
                        }
                        value={values.unavailableDates.join(
                            "\n",
                        )}
                        onChange={(
                            event: ChangeEvent<HTMLTextAreaElement>,
                        ): void =>
                            updateRoot(
                                "unavailableDates",
                                event.target.value
                                    .split(/\r?\n/)
                                    .map(
                                        (
                                            value: string,
                                        ): string =>
                                            value.trim(),
                                    )
                                    .filter(Boolean),
                            )
                        }
                        placeholder="Enter one date per line using YYYY-MM-DD"
                        className="mt-2 w-full resize-y rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                    />

                    {availability.canManage ? (
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isSaving
                                ? "Saving…"
                                : "Save availability"}
                        </button>
                    ) : null}
                </section>
            </form>
        </main>
    );
}