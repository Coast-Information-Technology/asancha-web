"use client";

// File: src/features/recommendations/hooks/use-recommendations.ts

/**
 * Asancha Recommendations Hook
 *
 * Purpose:
 * Provides recommendation list, detail, view tracking, saving, dismissal,
 * feedback, filtering, pagination, and request state.
 *
 * Security notes:
 * - Stores safe current-user recommendation data only.
 * - Internal AI prompts, scoring internals, private investor attributes, and
 *   restricted listing details must not enter this state.
 * - Backend access and action rules remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { recommendationsApi } from "../api/recommendations.api";
import {
    DEFAULT_RECOMMENDATION_FILTERS,
    RECOMMENDATION_SAFE_MESSAGES,
} from "../constants/recommendations.constants";
import type {
    DismissRecommendationPayload,
    DismissRecommendationResult,
    MarkRecommendationViewedResult,
    RecommendationCollection,
    RecommendationDetail,
    RecommendationFilters,
    RecommendationSummary,
    RecommendationsHookState,
    SaveRecommendationResult,
    SubmitRecommendationFeedbackPayload,
    SubmitRecommendationFeedbackResult,
    UnsaveRecommendationResult,
    UseRecommendationsResult,
} from "../types/recommendations.types";

const INITIAL_RECOMMENDATIONS_STATE:
    RecommendationsHookState = {
    requestState: "idle",

    recommendations: [],
    selectedRecommendation: null,
    statusSummary: null,

    filters: {
        ...DEFAULT_RECOMMENDATION_FILTERS,
    },

    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isMarkingViewed: false,
    isSaving: false,
    isUnsaving: false,
    isDismissing: false,
    isSubmittingFeedback: false,
    isEmpty: false,
};

function replaceRecommendationSummary(
    recommendations: RecommendationSummary[],
    recommendation: RecommendationDetail,
): RecommendationSummary[] {
    const exists = recommendations.some(
        (
            currentRecommendation: RecommendationSummary,
        ): boolean =>
            currentRecommendation.recommendationPublicId ===
            recommendation.recommendationPublicId,
    );

    if (!exists) {
        return [
            recommendation,
            ...recommendations,
        ];
    }

    return recommendations.map(
        (
            currentRecommendation: RecommendationSummary,
        ): RecommendationSummary =>
            currentRecommendation.recommendationPublicId ===
                recommendation.recommendationPublicId
                ? recommendation
                : currentRecommendation,
    );
}

export function useRecommendations():
    UseRecommendationsResult {
    const [hookState, setHookState] =
        useState<RecommendationsHookState>(
            INITIAL_RECOMMENDATIONS_STATE,
        );

    const filtersRef = useRef<RecommendationFilters>({
        ...DEFAULT_RECOMMENDATION_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: RecommendationFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
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
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isMarkingViewed: false,
                    isSaving: false,
                    isUnsaving: false,
                    isDismissing: false,
                    isSubmittingFeedback: false,
                }),
            );
        },
        [],
    );

    const loadRecommendations = useCallback(
        async (
            filters?: Partial<RecommendationFilters>,
        ): Promise<RecommendationCollection | null> => {
            const nextFilters: RecommendationFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
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
                const collection: RecommendationCollection =
                    await recommendationsApi.getRecommendations(
                        nextFilters,
                    );

                const noRecommendations: boolean =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState: noRecommendations
                            ? "empty"
                            : "success",

                        recommendations: collection.items,
                        statusSummary:
                            collection.statusSummary,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noRecommendations,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    RECOMMENDATION_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshRecommendations =
        useCallback(
            async (): Promise<RecommendationCollection | null> => {
                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState: "refreshing",
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection =
                        await recommendationsApi.getRecommendations(
                            filtersRef.current,
                        );

                    const noRecommendations: boolean =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: RecommendationsHookState,
                        ): RecommendationsHookState => ({
                            ...currentState,

                            requestState: noRecommendations
                                ? "empty"
                                : "success",

                            recommendations: collection.items,
                            statusSummary:
                                collection.statusSummary,
                            pagination: collection.pagination,

                            isRefreshing: false,
                            isEmpty: noRecommendations,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        RECOMMENDATION_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadRecommendation = useCallback(
        async (
            recommendationPublicId: string,
        ): Promise<RecommendationDetail | null> => {
            const normalizedPublicId: string =
                recommendationPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    RECOMMENDATION_SAFE_MESSAGES
                        .detailLoadError,
                );

                return null;
            }

            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const recommendation =
                    await recommendationsApi.getRecommendation(
                        normalizedPublicId,
                    );

                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        selectedRecommendation:
                            recommendation,

                        recommendations:
                            replaceRecommendationSummary(
                                currentState.recommendations,
                                recommendation,
                            ),

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return recommendation;
            } catch {
                setError(
                    RECOMMENDATION_SAFE_MESSAGES
                        .detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const markRecommendationViewed =
        useCallback(
            async (
                recommendationPublicId: string,
            ): Promise<MarkRecommendationViewedResult> => {
                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState: "marking_viewed",
                        isMarkingViewed: true,

                        errorMessage: null,
                    }),
                );

                try {
                    const result =
                        await recommendationsApi.markViewed(
                            recommendationPublicId,
                        );

                    setHookState(
                        (
                            currentState: RecommendationsHookState,
                        ): RecommendationsHookState => ({
                            ...currentState,

                            requestState: "success",

                            selectedRecommendation:
                                result.recommendation,

                            recommendations:
                                replaceRecommendationSummary(
                                    currentState.recommendations,
                                    result.recommendation,
                                ),

                            isMarkingViewed: false,
                            errorMessage: null,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        RECOMMENDATION_SAFE_MESSAGES
                            .markViewedError,
                    );

                    throw new Error(
                        RECOMMENDATION_SAFE_MESSAGES
                            .markViewedError,
                    );
                }
            },
            [setError],
        );

    const saveRecommendation = useCallback(
        async (
            recommendationPublicId: string,
        ): Promise<SaveRecommendationResult> => {
            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,

                    requestState: "saving",
                    isSaving: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await recommendationsApi.save(
                        recommendationPublicId,
                    );

                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        selectedRecommendation:
                            result.recommendation,

                        recommendations:
                            replaceRecommendationSummary(
                                currentState.recommendations,
                                result.recommendation,
                            ),

                        isSaving: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            RECOMMENDATION_SAFE_MESSAGES.saved,
                    }),
                );

                return result;
            } catch {
                setError(
                    RECOMMENDATION_SAFE_MESSAGES.saveError,
                );

                throw new Error(
                    RECOMMENDATION_SAFE_MESSAGES.saveError,
                );
            }
        },
        [setError],
    );

    const unsaveRecommendation = useCallback(
        async (
            recommendationPublicId: string,
        ): Promise<UnsaveRecommendationResult> => {
            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,

                    requestState: "unsaving",
                    isUnsaving: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await recommendationsApi.unsave(
                        recommendationPublicId,
                    );

                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        selectedRecommendation:
                            result.recommendation,

                        recommendations:
                            replaceRecommendationSummary(
                                currentState.recommendations,
                                result.recommendation,
                            ),

                        isUnsaving: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            RECOMMENDATION_SAFE_MESSAGES.unsaved,
                    }),
                );

                return result;
            } catch {
                setError(
                    RECOMMENDATION_SAFE_MESSAGES
                        .unsaveError,
                );

                throw new Error(
                    RECOMMENDATION_SAFE_MESSAGES
                        .unsaveError,
                );
            }
        },
        [setError],
    );

    const dismissRecommendation = useCallback(
        async (
            recommendationPublicId: string,
            payload: DismissRecommendationPayload,
        ): Promise<DismissRecommendationResult> => {
            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,

                    requestState: "dismissing",
                    isDismissing: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await recommendationsApi.dismiss(
                        recommendationPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => {
                        const updatedRecommendations =
                            replaceRecommendationSummary(
                                currentState.recommendations,
                                result.recommendation,
                            );

                        const visibleRecommendations =
                            currentState.filters.statuses.includes(
                                "dismissed",
                            )
                                ? updatedRecommendations
                                : updatedRecommendations.filter(
                                    (
                                        recommendation:
                                            RecommendationSummary,
                                    ): boolean =>
                                        !recommendation.isDismissed,
                                );

                        return {
                            ...currentState,

                            requestState: "success",

                            recommendations:
                                visibleRecommendations,

                            selectedRecommendation:
                                result.recommendation,

                            isDismissing: false,

                            isEmpty:
                                visibleRecommendations.length === 0,

                            errorMessage: null,
                            successMessage:
                                result.message ||
                                RECOMMENDATION_SAFE_MESSAGES
                                    .dismissed,
                        };
                    },
                );

                return result;
            } catch {
                setError(
                    RECOMMENDATION_SAFE_MESSAGES
                        .dismissError,
                );

                throw new Error(
                    RECOMMENDATION_SAFE_MESSAGES
                        .dismissError,
                );
            }
        },
        [setError],
    );

    const submitRecommendationFeedback =
        useCallback(
            async (
                recommendationPublicId: string,
                payload:
                    SubmitRecommendationFeedbackPayload,
            ): Promise<SubmitRecommendationFeedbackResult> => {
                setHookState(
                    (
                        currentState: RecommendationsHookState,
                    ): RecommendationsHookState => ({
                        ...currentState,

                        requestState:
                            "submitting_feedback",

                        isSubmittingFeedback: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const result =
                        await recommendationsApi.submitFeedback(
                            recommendationPublicId,
                            payload,
                        );

                    setHookState(
                        (
                            currentState: RecommendationsHookState,
                        ): RecommendationsHookState => ({
                            ...currentState,

                            requestState: "success",

                            selectedRecommendation:
                                result.recommendation,

                            recommendations:
                                replaceRecommendationSummary(
                                    currentState.recommendations,
                                    result.recommendation,
                                ),

                            isSubmittingFeedback: false,

                            errorMessage: null,
                            successMessage:
                                result.message ||
                                RECOMMENDATION_SAFE_MESSAGES
                                    .feedbackSubmitted,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        RECOMMENDATION_SAFE_MESSAGES
                            .feedbackError,
                    );

                    throw new Error(
                        RECOMMENDATION_SAFE_MESSAGES
                            .feedbackError,
                    );
                }
            },
            [setError],
        );

    const setFilters = useCallback(
        (
            filters: Partial<RecommendationFilters>,
        ): void => {
            const filterKeys: string[] =
                Object.keys(filters);

            const changesSearchCriteria: boolean =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: RecommendationFilters = {
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
        (filters: RecommendationFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: RecommendationFilters = {
            ...DEFAULT_RECOMMENDATION_FILTERS,
        };

        applyFilters(nextFilters);
    }, [applyFilters]);

    const clearSelectedRecommendation =
        useCallback((): void => {
            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,
                    selectedRecommendation: null,
                }),
            );
        }, []);

    const clearFeedbackMessages =
        useCallback((): void => {
            setHookState(
                (
                    currentState: RecommendationsHookState,
                ): RecommendationsHookState => ({
                    ...currentState,
                    errorMessage: null,
                    successMessage: null,
                }),
            );
        }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_RECOMMENDATION_FILTERS,
        };

        setHookState({
            ...INITIAL_RECOMMENDATIONS_STATE,

            filters: {
                ...DEFAULT_RECOMMENDATION_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadRecommendations,
        refreshRecommendations,
        loadRecommendation,

        markRecommendationViewed,
        saveRecommendation,
        unsaveRecommendation,
        dismissRecommendation,
        submitRecommendationFeedback,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedRecommendation,
        clearFeedbackMessages,
        reset,
    };
}