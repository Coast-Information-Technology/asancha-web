"use client";

// File: src/features/bookings/hooks/use-bookings.ts

/**
 * Asancha Bookings Hook
 *
 * Purpose:
 * Provides booking list, detail, creation, cancellation, reschedule, filtering,
 * pagination, and request state.
 *
 * Security notes:
 * - Safe current-user booking data only.
 * - Client-side action states do not grant permission.
 * - Backend enforcement remains final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { bookingsApi } from "../api/bookings.api";
import {
    BOOKING_SAFE_MESSAGES,
    DEFAULT_BOOKING_FILTERS,
} from "../constants/bookings.constants";
import type {
    BookingCollection,
    BookingDetail,
    BookingFilters,
    BookingSummary,
    BookingsHookState,
    CancelBookingPayload,
    CancelBookingResult,
    CreateBookingPayload,
    CreateBookingResult,
    RequestBookingReschedulePayload,
    RequestBookingRescheduleResult,
    UseBookingsResult,
} from "../types/bookings.types";

const INITIAL_BOOKINGS_STATE: BookingsHookState = {
    requestState: "idle",

    bookings: [],
    selectedBooking: null,
    statusSummary: null,

    filters: {
        ...DEFAULT_BOOKING_FILTERS,
    },

    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isCreating: false,
    isCancelling: false,
    isRequestingReschedule: false,
    isEmpty: false,
};

function replaceBookingSummary(
    bookings: BookingSummary[],
    booking: BookingDetail,
): BookingSummary[] {
    const exists = bookings.some(
        (
            currentBooking: BookingSummary,
        ): boolean =>
            currentBooking.bookingPublicId ===
            booking.bookingPublicId,
    );

    if (!exists) {
        return [booking, ...bookings];
    }

    return bookings.map(
        (
            currentBooking: BookingSummary,
        ): BookingSummary =>
            currentBooking.bookingPublicId ===
                booking.bookingPublicId
                ? booking
                : currentBooking,
    );
}

export function useBookings(): UseBookingsResult {
    const [hookState, setHookState] =
        useState<BookingsHookState>(
            INITIAL_BOOKINGS_STATE,
        );

    const filtersRef = useRef<BookingFilters>({
        ...DEFAULT_BOOKING_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: BookingFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,
                    filters,
                }),
            );
        },
        [],
    );

    const setError = useCallback(
        (message: string): void => {
            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isCreating: false,
                    isCancelling: false,
                    isRequestingReschedule: false,
                }),
            );
        },
        [],
    );

    const loadBookings = useCallback(
        async (
            filters?: Partial<BookingFilters>,
        ): Promise<BookingCollection | null> => {
            const nextFilters: BookingFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,
                    isRefreshing: false,
                    isEmpty: false,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const collection: BookingCollection =
                    await bookingsApi.getBookings(
                        nextFilters,
                    );

                const noBookings: boolean =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: BookingsHookState,
                    ): BookingsHookState => ({
                        ...currentState,

                        requestState: noBookings
                            ? "empty"
                            : "success",

                        bookings: collection.items,
                        statusSummary:
                            collection.statusSummary,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noBookings,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    BOOKING_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshBookings =
        useCallback(
            async (): Promise<BookingCollection | null> => {
                setHookState(
                    (
                        currentState: BookingsHookState,
                    ): BookingsHookState => ({
                        ...currentState,

                        requestState: "refreshing",
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection: BookingCollection =
                        await bookingsApi.getBookings(
                            filtersRef.current,
                        );

                    const noBookings: boolean =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: BookingsHookState,
                        ): BookingsHookState => ({
                            ...currentState,

                            requestState: noBookings
                                ? "empty"
                                : "success",

                            bookings: collection.items,
                            statusSummary:
                                collection.statusSummary,
                            pagination: collection.pagination,

                            isRefreshing: false,
                            isEmpty: noBookings,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        BOOKING_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadBooking = useCallback(
        async (
            bookingPublicId: string,
        ): Promise<BookingDetail | null> => {
            const normalizedPublicId =
                bookingPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    BOOKING_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }

            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,
                    requestState: "loading",
                    isLoading: true,
                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const booking: BookingDetail =
                    await bookingsApi.getBooking(
                        normalizedPublicId,
                    );

                setHookState(
                    (
                        currentState: BookingsHookState,
                    ): BookingsHookState => ({
                        ...currentState,

                        requestState: "success",
                        selectedBooking: booking,

                        bookings: replaceBookingSummary(
                            currentState.bookings,
                            booking,
                        ),

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return booking;
            } catch {
                setError(
                    BOOKING_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const createBooking = useCallback(
        async (
            payload: CreateBookingPayload,
        ): Promise<CreateBookingResult> => {
            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,
                    requestState: "creating",
                    isCreating: true,
                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await bookingsApi.createBooking(
                        payload,
                    );

                setHookState(
                    (
                        currentState: BookingsHookState,
                    ): BookingsHookState => ({
                        ...currentState,

                        requestState: "success",

                        bookings: replaceBookingSummary(
                            currentState.bookings,
                            result.booking,
                        ),

                        selectedBooking: result.booking,

                        isCreating: false,
                        isEmpty: false,
                        errorMessage: null,

                        successMessage:
                            result.message ||
                            (result.paymentGenerated
                                ? BOOKING_SAFE_MESSAGES
                                    .paymentGenerated
                                : BOOKING_SAFE_MESSAGES.created),
                    }),
                );

                return result;
            } catch {
                setError(
                    BOOKING_SAFE_MESSAGES.createError,
                );

                throw new Error(
                    BOOKING_SAFE_MESSAGES.createError,
                );
            }
        },
        [setError],
    );

    const cancelBooking = useCallback(
        async (
            bookingPublicId: string,
            payload: CancelBookingPayload,
        ): Promise<CancelBookingResult> => {
            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,
                    requestState: "cancelling",
                    isCancelling: true,
                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await bookingsApi.cancelBooking(
                        bookingPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: BookingsHookState,
                    ): BookingsHookState => ({
                        ...currentState,

                        requestState: "success",

                        bookings: replaceBookingSummary(
                            currentState.bookings,
                            result.booking,
                        ),

                        selectedBooking: result.booking,

                        isCancelling: false,
                        errorMessage: null,

                        successMessage:
                            result.message ||
                            BOOKING_SAFE_MESSAGES.cancelled,
                    }),
                );

                return result;
            } catch {
                setError(
                    BOOKING_SAFE_MESSAGES
                        .cancellationError,
                );

                throw new Error(
                    BOOKING_SAFE_MESSAGES
                        .cancellationError,
                );
            }
        },
        [setError],
    );

    const requestBookingReschedule =
        useCallback(
            async (
                bookingPublicId: string,
                payload: RequestBookingReschedulePayload,
            ): Promise<RequestBookingRescheduleResult> => {
                setHookState(
                    (
                        currentState: BookingsHookState,
                    ): BookingsHookState => ({
                        ...currentState,

                        requestState:
                            "requesting_reschedule",

                        isRequestingReschedule: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const result =
                        await bookingsApi.requestBookingReschedule(
                            bookingPublicId,
                            payload,
                        );

                    setHookState(
                        (
                            currentState: BookingsHookState,
                        ): BookingsHookState => ({
                            ...currentState,

                            requestState: "success",

                            bookings: replaceBookingSummary(
                                currentState.bookings,
                                result.booking,
                            ),

                            selectedBooking: result.booking,

                            isRequestingReschedule: false,
                            errorMessage: null,

                            successMessage:
                                result.message ||
                                BOOKING_SAFE_MESSAGES
                                    .rescheduleRequested,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        BOOKING_SAFE_MESSAGES
                            .rescheduleError,
                    );

                    throw new Error(
                        BOOKING_SAFE_MESSAGES
                            .rescheduleError,
                    );
                }
            },
            [setError],
        );

    const setFilters = useCallback(
        (
            filters: Partial<BookingFilters>,
        ): void => {
            const filterKeys = Object.keys(filters);

            const changesSearchCriteria =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: BookingFilters = {
                ...filtersRef.current,
                ...filters,

                page:
                    filters.page ??
                    (changesSearchCriteria
                        ? 1
                        : filtersRef.current.page),
            };

            applyFilters(nextFilters);
        },
        [applyFilters],
    );

    const replaceFilters = useCallback(
        (filters: BookingFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: BookingFilters = {
            ...DEFAULT_BOOKING_FILTERS,
        };

        applyFilters(nextFilters);

        setHookState(
            (
                currentState: BookingsHookState,
            ): BookingsHookState => ({
                ...currentState,

                requestState: "idle",
                bookings: [],
                statusSummary: null,
                pagination: null,

                isEmpty: false,
                errorMessage: null,
                successMessage: null,
            }),
        );
    }, [applyFilters]);

    const clearSelectedBooking =
        useCallback((): void => {
            setHookState(
                (
                    currentState: BookingsHookState,
                ): BookingsHookState => ({
                    ...currentState,
                    selectedBooking: null,
                }),
            );
        }, []);

    const clearMessages = useCallback((): void => {
        setHookState(
            (
                currentState: BookingsHookState,
            ): BookingsHookState => ({
                ...currentState,

                requestState:
                    currentState.bookings.length > 0 ||
                        currentState.selectedBooking !== null
                        ? "success"
                        : "idle",

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_BOOKING_FILTERS,
        };

        setHookState({
            ...INITIAL_BOOKINGS_STATE,

            filters: {
                ...DEFAULT_BOOKING_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadBookings,
        refreshBookings,
        loadBooking,

        createBooking,
        cancelBooking,
        requestBookingReschedule,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedBooking,
        clearMessages,
        reset,
    };
}