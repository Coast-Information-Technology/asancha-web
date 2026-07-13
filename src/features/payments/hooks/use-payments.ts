"use client";

// File: src/features/payments/hooks/use-payments.ts

/**
 * Asancha Payments Hook
 *
 * Purpose:
 * Provides authenticated payment screens with payment list, detail, external
 * submission, Stripe Checkout, filtering, pagination, and request state.
 *
 * Responsibilities:
 * - Load current-user or active-profile-scoped payments.
 * - Load one safe payment detail record.
 * - Submit eligible external payment details.
 * - Start eligible Stripe Checkout sessions.
 * - Maintain filters and pagination.
 * - Expose safe success and error messages.
 *
 * Security notes:
 * - This hook stores safe current-user payment data in memory only.
 * - It must not store provider secrets, webhook secrets, raw provider payloads,
 *   internal notes, full bank details, token hashes, or ObjectIds.
 * - Checkout completion in the browser does not mark a payment paid.
 * - Backend settlement and webhook verification remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { paymentsApi } from "../api/payments.api";
import {
    DEFAULT_PAYMENT_FILTERS,
    PAYMENT_SAFE_MESSAGES,
} from "../constants/payments.constants";
import type {
    PaymentCollection,
    PaymentDetail,
    PaymentFilters,
    PaymentSummary,
    PaymentsHookState,
    StartStripeCheckoutPayload,
    StripeCheckoutResult,
    SubmitExternalPaymentPayload,
    SubmitExternalPaymentResult,
    UsePaymentsResult,
} from "../types/payments.types";

const INITIAL_PAYMENTS_STATE: PaymentsHookState = {
    requestState: "idle",

    payments: [],
    selectedPayment: null,
    statusSummary: null,

    filters: {
        ...DEFAULT_PAYMENT_FILTERS,
    },

    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isSubmittingExternalPayment: false,
    isStartingCheckout: false,
    isEmpty: false,
};

function replacePaymentSummary(
    payments: PaymentSummary[],
    payment: PaymentDetail,
): PaymentSummary[] {
    const exists = payments.some(
        (
            currentPayment: PaymentSummary,
        ): boolean =>
            currentPayment.paymentPublicId ===
            payment.paymentPublicId,
    );

    if (!exists) {
        return [payment, ...payments];
    }

    return payments.map(
        (
            currentPayment: PaymentSummary,
        ): PaymentSummary =>
            currentPayment.paymentPublicId ===
                payment.paymentPublicId
                ? payment
                : currentPayment,
    );
}

export function usePayments(): UsePaymentsResult {
    const [hookState, setHookState] =
        useState<PaymentsHookState>(
            INITIAL_PAYMENTS_STATE,
        );

    const filtersRef = useRef<PaymentFilters>({
        ...DEFAULT_PAYMENT_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: PaymentFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: PaymentsHookState,
                ): PaymentsHookState => ({
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
                    currentState: PaymentsHookState,
                ): PaymentsHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isSubmittingExternalPayment: false,
                    isStartingCheckout: false,
                }),
            );
        },
        [],
    );

    const loadPayments = useCallback(
        async (
            filters?: Partial<PaymentFilters>,
        ): Promise<PaymentCollection | null> => {
            const nextFilters: PaymentFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: PaymentsHookState,
                ): PaymentsHookState => ({
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
                const collection: PaymentCollection =
                    await paymentsApi.getPayments(
                        nextFilters,
                    );

                const noPayments: boolean =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: PaymentsHookState,
                    ): PaymentsHookState => ({
                        ...currentState,

                        requestState: noPayments
                            ? "empty"
                            : "success",

                        payments: collection.items,
                        statusSummary:
                            collection.statusSummary,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noPayments,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    PAYMENT_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshPayments =
        useCallback(
            async (): Promise<PaymentCollection | null> => {
                setHookState(
                    (
                        currentState: PaymentsHookState,
                    ): PaymentsHookState => ({
                        ...currentState,

                        requestState: "refreshing",

                        isLoading: false,
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection: PaymentCollection =
                        await paymentsApi.getPayments(
                            filtersRef.current,
                        );

                    const noPayments: boolean =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: PaymentsHookState,
                        ): PaymentsHookState => ({
                            ...currentState,

                            requestState: noPayments
                                ? "empty"
                                : "success",

                            payments: collection.items,
                            statusSummary:
                                collection.statusSummary,
                            pagination: collection.pagination,

                            isRefreshing: false,
                            isEmpty: noPayments,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        PAYMENT_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadPayment = useCallback(
        async (
            paymentPublicId: string,
        ): Promise<PaymentDetail | null> => {
            const normalizedPublicId: string =
                paymentPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    PAYMENT_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }

            setHookState(
                (
                    currentState: PaymentsHookState,
                ): PaymentsHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const payment: PaymentDetail =
                    await paymentsApi.getPayment(
                        normalizedPublicId,
                    );

                setHookState(
                    (
                        currentState: PaymentsHookState,
                    ): PaymentsHookState => ({
                        ...currentState,

                        requestState: "success",

                        selectedPayment: payment,

                        payments: replacePaymentSummary(
                            currentState.payments,
                            payment,
                        ),

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return payment;
            } catch {
                setError(
                    PAYMENT_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const submitExternalPayment =
        useCallback(
            async (
                paymentPublicId: string,
                payload: SubmitExternalPaymentPayload,
            ): Promise<SubmitExternalPaymentResult> => {
                const normalizedPublicId: string =
                    paymentPublicId.trim();

                if (!normalizedPublicId) {
                    setError(
                        PAYMENT_SAFE_MESSAGES
                            .externalSubmissionError,
                    );

                    throw new Error(
                        PAYMENT_SAFE_MESSAGES
                            .externalSubmissionError,
                    );
                }

                setHookState(
                    (
                        currentState: PaymentsHookState,
                    ): PaymentsHookState => ({
                        ...currentState,

                        requestState: "submitting_external",
                        isSubmittingExternalPayment: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const result: SubmitExternalPaymentResult =
                        await paymentsApi.submitExternalPayment(
                            normalizedPublicId,
                            payload,
                        );

                    setHookState(
                        (
                            currentState: PaymentsHookState,
                        ): PaymentsHookState => ({
                            ...currentState,

                            requestState: "success",

                            selectedPayment: result.payment,

                            payments: replacePaymentSummary(
                                currentState.payments,
                                result.payment,
                            ),

                            isSubmittingExternalPayment: false,
                            isEmpty: false,

                            errorMessage: null,

                            successMessage:
                                result.message ||
                                PAYMENT_SAFE_MESSAGES
                                    .externalSubmissionSuccess,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        PAYMENT_SAFE_MESSAGES
                            .externalSubmissionError,
                    );

                    throw new Error(
                        PAYMENT_SAFE_MESSAGES
                            .externalSubmissionError,
                    );
                }
            },
            [setError],
        );

    const startStripeCheckout =
        useCallback(
            async (
                paymentPublicId: string,
                payload: StartStripeCheckoutPayload = {
                    data: {
                        successPath: null,
                        cancelPath: null,
                    },
                },
            ): Promise<StripeCheckoutResult> => {
                const normalizedPublicId: string =
                    paymentPublicId.trim();

                if (!normalizedPublicId) {
                    setError(
                        PAYMENT_SAFE_MESSAGES.checkoutError,
                    );

                    throw new Error(
                        PAYMENT_SAFE_MESSAGES.checkoutError,
                    );
                }

                setHookState(
                    (
                        currentState: PaymentsHookState,
                    ): PaymentsHookState => ({
                        ...currentState,

                        requestState: "starting_checkout",
                        isStartingCheckout: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const result: StripeCheckoutResult =
                        await paymentsApi.startStripeCheckout(
                            normalizedPublicId,
                            payload,
                        );

                    setHookState(
                        (
                            currentState: PaymentsHookState,
                        ): PaymentsHookState => ({
                            ...currentState,

                            requestState: "success",
                            isStartingCheckout: false,

                            errorMessage: null,

                            successMessage:
                                result.message ||
                                PAYMENT_SAFE_MESSAGES
                                    .checkoutStarted,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        PAYMENT_SAFE_MESSAGES.checkoutError,
                    );

                    throw new Error(
                        PAYMENT_SAFE_MESSAGES.checkoutError,
                    );
                }
            },
            [setError],
        );

    const setFilters = useCallback(
        (
            filters: Partial<PaymentFilters>,
        ): void => {
            const filterKeys: string[] =
                Object.keys(filters);

            const changesSearchCriteria: boolean =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: PaymentFilters = {
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
        (filters: PaymentFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: PaymentFilters = {
            ...DEFAULT_PAYMENT_FILTERS,
        };

        applyFilters(nextFilters);

        setHookState(
            (
                currentState: PaymentsHookState,
            ): PaymentsHookState => ({
                ...currentState,

                requestState: "idle",

                payments: [],
                statusSummary: null,
                pagination: null,

                isEmpty: false,

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, [applyFilters]);

    const clearSelectedPayment =
        useCallback((): void => {
            setHookState(
                (
                    currentState: PaymentsHookState,
                ): PaymentsHookState => ({
                    ...currentState,
                    selectedPayment: null,
                }),
            );
        }, []);

    const clearMessages = useCallback((): void => {
        setHookState(
            (
                currentState: PaymentsHookState,
            ): PaymentsHookState => ({
                ...currentState,

                requestState:
                    currentState.payments.length > 0 ||
                        currentState.selectedPayment !== null
                        ? "success"
                        : "idle",

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_PAYMENT_FILTERS,
        };

        setHookState({
            ...INITIAL_PAYMENTS_STATE,

            filters: {
                ...DEFAULT_PAYMENT_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadPayments,
        refreshPayments,
        loadPayment,

        submitExternalPayment,
        startStripeCheckout,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedPayment,
        clearMessages,
        reset,
    };
}