"use client";

// File: src/features/reservations/hooks/use-reservations.ts

/**
 * Asancha Reservations Hook
 *
 * Purpose:
 * Provides authenticated investor screens with reservation list, detail,
 * creation, cancellation, filtering, pagination, and request state.
 *
 * Responsibilities:
 * - Load active-investor-profile reservations.
 * - Load one safe reservation detail record.
 * - Create eligible reservation requests.
 * - Cancel eligible reservations.
 * - Maintain filters and pagination.
 * - Expose safe success and error messages.
 *
 * Security notes:
 * - This hook stores safe current-user reservation data in memory only.
 * - It must not store private seller information, internal notes, provider
 *   payloads, deal-pack contents, secrets, token hashes, or ObjectIds.
 * - Client-side action states do not grant reservation permission.
 * - Backend reservation and payment rules remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { reservationsApi } from "../api/reservations.api";
import {
    DEFAULT_RESERVATION_FILTERS,
    RESERVATION_SAFE_MESSAGES,
} from "../constants/reservations.constants";
import type {
    CancelReservationPayload,
    CancelReservationResult,
    CreateReservationPayload,
    CreateReservationResult,
    ReservationCollection,
    ReservationDetail,
    ReservationFilters,
    ReservationSummary,
    ReservationsHookState,
    UseReservationsResult,
} from "../types/reservations.types";

const INITIAL_RESERVATIONS_STATE: ReservationsHookState = {
    requestState: "idle",

    reservations: [],
    selectedReservation: null,
    statusSummary: null,

    filters: {
        ...DEFAULT_RESERVATION_FILTERS,
    },

    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isCreating: false,
    isCancelling: false,
    isEmpty: false,
};

function replaceReservationSummary(
    reservations: ReservationSummary[],
    reservation: ReservationDetail,
): ReservationSummary[] {
    const exists = reservations.some(
        (
            currentReservation: ReservationSummary,
        ): boolean =>
            currentReservation.reservationPublicId ===
            reservation.reservationPublicId,
    );

    if (!exists) {
        return [reservation, ...reservations];
    }

    return reservations.map(
        (
            currentReservation: ReservationSummary,
        ): ReservationSummary =>
            currentReservation.reservationPublicId ===
                reservation.reservationPublicId
                ? reservation
                : currentReservation,
    );
}

export function useReservations(): UseReservationsResult {
    const [hookState, setHookState] =
        useState<ReservationsHookState>(
            INITIAL_RESERVATIONS_STATE,
        );

    const filtersRef = useRef<ReservationFilters>({
        ...DEFAULT_RESERVATION_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: ReservationFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
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
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isCreating: false,
                    isCancelling: false,
                }),
            );
        },
        [],
    );

    const loadReservations = useCallback(
        async (
            filters?: Partial<ReservationFilters>,
        ): Promise<ReservationCollection | null> => {
            const nextFilters: ReservationFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
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
                const collection: ReservationCollection =
                    await reservationsApi.getReservations(
                        nextFilters,
                    );

                const noReservations: boolean =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: ReservationsHookState,
                    ): ReservationsHookState => ({
                        ...currentState,

                        requestState: noReservations
                            ? "empty"
                            : "success",

                        reservations: collection.items,
                        statusSummary:
                            collection.statusSummary,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noReservations,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    RESERVATION_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshReservations =
        useCallback(
            async (): Promise<ReservationCollection | null> => {
                setHookState(
                    (
                        currentState: ReservationsHookState,
                    ): ReservationsHookState => ({
                        ...currentState,

                        requestState: "refreshing",

                        isLoading: false,
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection: ReservationCollection =
                        await reservationsApi.getReservations(
                            filtersRef.current,
                        );

                    const noReservations: boolean =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: ReservationsHookState,
                        ): ReservationsHookState => ({
                            ...currentState,

                            requestState: noReservations
                                ? "empty"
                                : "success",

                            reservations: collection.items,
                            statusSummary:
                                collection.statusSummary,
                            pagination: collection.pagination,

                            isRefreshing: false,
                            isEmpty: noReservations,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        RESERVATION_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadReservation = useCallback(
        async (
            reservationPublicId: string,
        ): Promise<ReservationDetail | null> => {
            const normalizedPublicId: string =
                reservationPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    RESERVATION_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }

            setHookState(
                (
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const reservation: ReservationDetail =
                    await reservationsApi.getReservation(
                        normalizedPublicId,
                    );

                setHookState(
                    (
                        currentState: ReservationsHookState,
                    ): ReservationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        selectedReservation: reservation,

                        reservations: replaceReservationSummary(
                            currentState.reservations,
                            reservation,
                        ),

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return reservation;
            } catch {
                setError(
                    RESERVATION_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const createReservation = useCallback(
        async (
            payload: CreateReservationPayload,
        ): Promise<CreateReservationResult> => {
            setHookState(
                (
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
                    ...currentState,

                    requestState: "creating",
                    isCreating: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result: CreateReservationResult =
                    await reservationsApi.createReservation(
                        payload,
                    );

                setHookState(
                    (
                        currentState: ReservationsHookState,
                    ): ReservationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        reservations: replaceReservationSummary(
                            currentState.reservations,
                            result.reservation,
                        ),

                        selectedReservation:
                            result.reservation,

                        isCreating: false,
                        isEmpty: false,

                        errorMessage: null,

                        successMessage:
                            result.message ||
                            (result.paymentGenerated
                                ? RESERVATION_SAFE_MESSAGES
                                    .paymentGenerated
                                : RESERVATION_SAFE_MESSAGES.created),
                    }),
                );

                return result;
            } catch {
                setError(
                    RESERVATION_SAFE_MESSAGES.createError,
                );

                throw new Error(
                    RESERVATION_SAFE_MESSAGES.createError,
                );
            }
        },
        [setError],
    );

    const cancelReservation = useCallback(
        async (
            reservationPublicId: string,
            payload: CancelReservationPayload,
        ): Promise<CancelReservationResult> => {
            const normalizedPublicId: string =
                reservationPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    RESERVATION_SAFE_MESSAGES
                        .cancellationError,
                );

                throw new Error(
                    RESERVATION_SAFE_MESSAGES
                        .cancellationError,
                );
            }

            setHookState(
                (
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
                    ...currentState,

                    requestState: "cancelling",
                    isCancelling: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result: CancelReservationResult =
                    await reservationsApi.cancelReservation(
                        normalizedPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: ReservationsHookState,
                    ): ReservationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        reservations: replaceReservationSummary(
                            currentState.reservations,
                            result.reservation,
                        ),

                        selectedReservation:
                            result.reservation,

                        isCancelling: false,

                        errorMessage: null,

                        successMessage:
                            result.message ||
                            RESERVATION_SAFE_MESSAGES.cancelled,
                    }),
                );

                return result;
            } catch {
                setError(
                    RESERVATION_SAFE_MESSAGES
                        .cancellationError,
                );

                throw new Error(
                    RESERVATION_SAFE_MESSAGES
                        .cancellationError,
                );
            }
        },
        [setError],
    );

    const setFilters = useCallback(
        (
            filters: Partial<ReservationFilters>,
        ): void => {
            const filterKeys: string[] =
                Object.keys(filters);

            const changesSearchCriteria: boolean =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: ReservationFilters = {
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
        (filters: ReservationFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: ReservationFilters = {
            ...DEFAULT_RESERVATION_FILTERS,
        };

        applyFilters(nextFilters);

        setHookState(
            (
                currentState: ReservationsHookState,
            ): ReservationsHookState => ({
                ...currentState,

                requestState: "idle",

                reservations: [],
                statusSummary: null,
                pagination: null,

                isEmpty: false,

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, [applyFilters]);

    const clearSelectedReservation =
        useCallback((): void => {
            setHookState(
                (
                    currentState: ReservationsHookState,
                ): ReservationsHookState => ({
                    ...currentState,
                    selectedReservation: null,
                }),
            );
        }, []);

    const clearMessages = useCallback((): void => {
        setHookState(
            (
                currentState: ReservationsHookState,
            ): ReservationsHookState => ({
                ...currentState,

                requestState:
                    currentState.reservations.length > 0 ||
                        currentState.selectedReservation !== null
                        ? "success"
                        : "idle",

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_RESERVATION_FILTERS,
        };

        setHookState({
            ...INITIAL_RESERVATIONS_STATE,

            filters: {
                ...DEFAULT_RESERVATION_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadReservations,
        refreshReservations,
        loadReservation,

        createReservation,
        cancelReservation,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedReservation,
        clearMessages,
        reset,
    };
}
