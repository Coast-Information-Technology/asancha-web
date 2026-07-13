"use client";

// File: src/features/verification/hooks/use-verification.ts

/**
 * Asancha Verification Hook
 *
 * Purpose:
 * Provides authenticated verification screens with review list, detail,
 * correction, response, filter, pagination, and request state.
 *
 * Responsibilities:
 * - Load active-profile-scoped verification reviews.
 * - Load one safe verification review by public ID.
 * - Submit eligible verification responses.
 * - Maintain filters and pagination.
 * - Expose safe loading, success, empty, and error states.
 *
 * Security notes:
 * - This hook stores safe current-user verification data in memory only.
 * - It must not store internal notes, private KYC notes, risk ratings, risk
 *   flags, raw provider results, secrets, private documents, or ObjectIds.
 * - Client-side response availability does not grant permission.
 * - Backend checks remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { verificationApi } from "../api/verification.api";
import {
    DEFAULT_VERIFICATION_FILTERS,
    VERIFICATION_SAFE_MESSAGES,
} from "../constants/verification.constants";
import type {
    SubmitVerificationResponsePayload,
    SubmitVerificationResponseResult,
    UseVerificationResult,
    VerificationCollection,
    VerificationFilters,
    VerificationHookState,
    VerificationReviewDetail,
    VerificationReviewSummary,
} from "../types/verification.types";

const INITIAL_VERIFICATION_STATE: VerificationHookState = {
    requestState: "idle",

    reviews: [],
    selectedReview: null,

    filters: {
        ...DEFAULT_VERIFICATION_FILTERS,
    },

    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isResponding: false,
    isEmpty: false,
};

function replaceVerificationReview(
    reviews: VerificationReviewSummary[],
    review: VerificationReviewDetail,
): VerificationReviewSummary[] {
    const exists = reviews.some(
        (
            currentReview: VerificationReviewSummary,
        ): boolean =>
            currentReview.verificationReviewPublicId ===
            review.verificationReviewPublicId,
    );

    if (!exists) {
        return [review, ...reviews];
    }

    return reviews.map(
        (
            currentReview: VerificationReviewSummary,
        ): VerificationReviewSummary =>
            currentReview.verificationReviewPublicId ===
                review.verificationReviewPublicId
                ? review
                : currentReview,
    );
}

export function useVerification(): UseVerificationResult {
    const [hookState, setHookState] =
        useState<VerificationHookState>(
            INITIAL_VERIFICATION_STATE,
        );

    const filtersRef = useRef<VerificationFilters>({
        ...DEFAULT_VERIFICATION_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: VerificationFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: VerificationHookState,
                ): VerificationHookState => ({
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
                    currentState: VerificationHookState,
                ): VerificationHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isResponding: false,
                }),
            );
        },
        [],
    );

    const loadVerificationReviews = useCallback(
        async (
            filters?: Partial<VerificationFilters>,
        ): Promise<VerificationCollection | null> => {
            const nextFilters: VerificationFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: VerificationHookState,
                ): VerificationHookState => ({
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
                const collection: VerificationCollection =
                    await verificationApi.getVerificationReviews(
                        nextFilters,
                    );

                const noReviews: boolean =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: VerificationHookState,
                    ): VerificationHookState => ({
                        ...currentState,

                        requestState: noReviews
                            ? "empty"
                            : "success",

                        reviews: collection.items,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noReviews,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    VERIFICATION_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshVerificationReviews =
        useCallback(
            async (): Promise<VerificationCollection | null> => {
                setHookState(
                    (
                        currentState: VerificationHookState,
                    ): VerificationHookState => ({
                        ...currentState,

                        requestState: "refreshing",

                        isLoading: false,
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection: VerificationCollection =
                        await verificationApi.getVerificationReviews(
                            filtersRef.current,
                        );

                    const noReviews: boolean =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: VerificationHookState,
                        ): VerificationHookState => ({
                            ...currentState,

                            requestState: noReviews
                                ? "empty"
                                : "success",

                            reviews: collection.items,
                            pagination: collection.pagination,

                            isRefreshing: false,
                            isEmpty: noReviews,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        VERIFICATION_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadVerificationReview = useCallback(
        async (
            verificationReviewPublicId: string,
        ): Promise<VerificationReviewDetail | null> => {
            const normalizedPublicId: string =
                verificationReviewPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    VERIFICATION_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }

            setHookState(
                (
                    currentState: VerificationHookState,
                ): VerificationHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const review: VerificationReviewDetail =
                    await verificationApi.getVerificationReview(
                        normalizedPublicId,
                    );

                setHookState(
                    (
                        currentState: VerificationHookState,
                    ): VerificationHookState => ({
                        ...currentState,

                        requestState: "success",

                        selectedReview: review,

                        reviews: replaceVerificationReview(
                            currentState.reviews,
                            review,
                        ),

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return review;
            } catch {
                setError(
                    VERIFICATION_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const submitVerificationResponse =
        useCallback(
            async (
                verificationReviewPublicId: string,
                payload: SubmitVerificationResponsePayload,
            ): Promise<SubmitVerificationResponseResult> => {
                const normalizedPublicId: string =
                    verificationReviewPublicId.trim();

                if (!normalizedPublicId) {
                    setError(
                        VERIFICATION_SAFE_MESSAGES.respondError,
                    );

                    throw new Error(
                        VERIFICATION_SAFE_MESSAGES.respondError,
                    );
                }

                setHookState(
                    (
                        currentState: VerificationHookState,
                    ): VerificationHookState => ({
                        ...currentState,

                        requestState: "responding",
                        isResponding: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const result: SubmitVerificationResponseResult =
                        await verificationApi.submitVerificationResponse(
                            normalizedPublicId,
                            payload,
                        );

                    setHookState(
                        (
                            currentState: VerificationHookState,
                        ): VerificationHookState => ({
                            ...currentState,

                            requestState: "success",

                            selectedReview:
                                result.verificationReview,

                            reviews: replaceVerificationReview(
                                currentState.reviews,
                                result.verificationReview,
                            ),

                            isResponding: false,
                            isEmpty: false,

                            errorMessage: null,

                            successMessage:
                                result.message ||
                                VERIFICATION_SAFE_MESSAGES
                                    .responseSubmitted,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        VERIFICATION_SAFE_MESSAGES.respondError,
                    );

                    throw new Error(
                        VERIFICATION_SAFE_MESSAGES.respondError,
                    );
                }
            },
            [setError],
        );

    const setFilters = useCallback(
        (
            filters: Partial<VerificationFilters>,
        ): void => {
            const filterKeys: string[] =
                Object.keys(filters);

            const changesSearchCriteria: boolean =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: VerificationFilters = {
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
        (filters: VerificationFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: VerificationFilters = {
            ...DEFAULT_VERIFICATION_FILTERS,
        };

        applyFilters(nextFilters);

        setHookState(
            (
                currentState: VerificationHookState,
            ): VerificationHookState => ({
                ...currentState,

                requestState: "idle",

                reviews: [],
                pagination: null,

                isEmpty: false,

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, [applyFilters]);

    const clearSelectedReview =
        useCallback((): void => {
            setHookState(
                (
                    currentState: VerificationHookState,
                ): VerificationHookState => ({
                    ...currentState,
                    selectedReview: null,
                }),
            );
        }, []);

    const clearMessages = useCallback((): void => {
        setHookState(
            (
                currentState: VerificationHookState,
            ): VerificationHookState => ({
                ...currentState,

                requestState:
                    currentState.reviews.length > 0 ||
                        currentState.selectedReview !== null
                        ? "success"
                        : "idle",

                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_VERIFICATION_FILTERS,
        };

        setHookState({
            ...INITIAL_VERIFICATION_STATE,

            filters: {
                ...DEFAULT_VERIFICATION_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadVerificationReviews,
        refreshVerificationReviews,
        loadVerificationReview,
        submitVerificationResponse,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedReview,
        clearMessages,
        reset,
    };
}