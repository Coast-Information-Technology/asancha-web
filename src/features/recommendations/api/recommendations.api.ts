// File: src/features/recommendations/api/recommendations.api.ts

/**
 * Asancha Recommendations API
 *
 * Purpose:
 * Provides typed authenticated functions for current-user recommendation
 * lists, detail, view tracking, saving, dismissal, and feedback.
 *
 * Responsibilities:
 * - Retrieve recommendations for the active investor profile.
 * - Retrieve one safe recommendation by public ID.
 * - Track recommendation views.
 * - Save and unsave recommendations.
 * - Dismiss eligible recommendations.
 * - Submit recommendation feedback.
 *
 * Security notes:
 * - This module must not call admin AI-generation or matching-snapshot routes.
 * - Internal prompts, model metadata, hidden scoring data, investor private
 *   data, and restricted listing fields must remain backend-only.
 * - Backend ownership, visibility, action eligibility, and lifecycle rules
 *   remain final.
 */

import {
    authApiDelete,
    authApiGet,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { RECOMMENDATIONS_API_ENDPOINTS } from "../constants/recommendations.constants";
import type {
    DismissRecommendationPayload,
    DismissRecommendationResult,
    MarkRecommendationViewedPayload,
    MarkRecommendationViewedResult,
    RecommendationCollection,
    RecommendationDetail,
    RecommendationFilters,
    RecommendationQuery,
    SaveRecommendationPayload,
    SaveRecommendationResult,
    SubmitRecommendationFeedbackPayload,
    SubmitRecommendationFeedbackResult,
    UnsaveRecommendationPayload,
    UnsaveRecommendationResult,
} from "../types/recommendations.types";

function appendString(
    searchParams: URLSearchParams,
    key: string,
    value: string | null | undefined,
): void {
    const normalizedValue = value?.trim();

    if (normalizedValue) {
        searchParams.set(key, normalizedValue);
    }
}

function appendStringArray(
    searchParams: URLSearchParams,
    key: string,
    values: readonly string[] | undefined,
): void {
    if (!values?.length) {
        return;
    }

    for (const value of values) {
        const normalizedValue = value.trim();

        if (normalizedValue) {
            searchParams.append(
                key,
                normalizedValue,
            );
        }
    }
}

function appendBoolean(
    searchParams: URLSearchParams,
    key: string,
    value: boolean | undefined,
): void {
    if (value !== undefined) {
        searchParams.set(key, String(value));
    }
}

function appendNumber(
    searchParams: URLSearchParams,
    key: string,
    value: number | undefined,
): void {
    if (
        value !== undefined &&
        Number.isFinite(value)
    ) {
        searchParams.set(key, String(value));
    }
}

function createRecommendationQueryString(
    query:
        | RecommendationQuery
        | Partial<RecommendationFilters>,
): string {
    const searchParams = new URLSearchParams();

    appendString(
        searchParams,
        "search",
        query.search,
    );

    appendStringArray(
        searchParams,
        "statuses",
        query.statuses,
    );

    appendStringArray(
        searchParams,
        "recommendationTypes",
        query.recommendationTypes,
    );

    appendStringArray(
        searchParams,
        "confidenceLevels",
        query.confidenceLevels,
    );

    appendBoolean(
        searchParams,
        "savedOnly",
        query.savedOnly ?? undefined,
    );

    appendBoolean(
        searchParams,
        "unviewedOnly",
        query.unviewedOnly ?? undefined,
    );

    appendBoolean(
        searchParams,
        "feedbackMissingOnly",
        query.feedbackMissingOnly ?? undefined,
    );

    appendNumber(
        searchParams,
        "minimumMatchScore",
        query.minimumMatchScore ?? undefined,
    );

    appendNumber(
        searchParams,
        "maximumPrice",
        query.maximumPrice ?? undefined,
    );

    appendString(
        searchParams,
        "sort",
        query.sort,
    );

    appendNumber(
        searchParams,
        "page",
        query.page,
    );

    appendNumber(
        searchParams,
        "pageSize",
        query.pageSize,
    );

    const queryString = searchParams.toString();

    return queryString
        ? `?${queryString}`
        : "";
}

async function getRecommendations(
    query:
        | RecommendationQuery
        | Partial<RecommendationFilters> = {},
): Promise<RecommendationCollection> {
    const queryString =
        createRecommendationQueryString(query);

    return authApiGet<RecommendationCollection>(
        `${RECOMMENDATIONS_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getRecommendation(
    recommendationPublicId: string,
): Promise<RecommendationDetail> {
    return authApiGet<RecommendationDetail>(
        RECOMMENDATIONS_API_ENDPOINTS.recommendation(
            recommendationPublicId,
        ),
    );
}

async function markViewed(
    recommendationPublicId: string,
): Promise<MarkRecommendationViewedResult> {
    const payload: MarkRecommendationViewedPayload = {
        data: {
            viewedAt: null,
        },
    };

    return authApiPost<MarkRecommendationViewedResult>(
        RECOMMENDATIONS_API_ENDPOINTS.view(
            recommendationPublicId,
        ),
        payload,
    );
}

async function save(
    recommendationPublicId: string,
): Promise<SaveRecommendationResult> {
    const payload: SaveRecommendationPayload = {
        data: {
            savedAt: null,
        },
    };

    return authApiPost<SaveRecommendationResult>(
        RECOMMENDATIONS_API_ENDPOINTS.save(
            recommendationPublicId,
        ),
        payload,
    );
}

async function unsave(
    recommendationPublicId: string,
): Promise<UnsaveRecommendationResult> {
    const payload: UnsaveRecommendationPayload = {
        data: {
            unsavedAt: null,
        },
    };

    try {
        return await authApiPost<UnsaveRecommendationResult>(
            RECOMMENDATIONS_API_ENDPOINTS.unsave(
                recommendationPublicId,
            ),
            payload,
        );
    } catch {
        return authApiDelete<UnsaveRecommendationResult>(
            RECOMMENDATIONS_API_ENDPOINTS.save(
                recommendationPublicId,
            ),
        );
    }
}

async function dismiss(
    recommendationPublicId: string,
    payload: DismissRecommendationPayload,
): Promise<DismissRecommendationResult> {
    return authApiPost<DismissRecommendationResult>(
        RECOMMENDATIONS_API_ENDPOINTS.dismiss(
            recommendationPublicId,
        ),
        payload,
    );
}

async function submitFeedback(
    recommendationPublicId: string,
    payload: SubmitRecommendationFeedbackPayload,
): Promise<SubmitRecommendationFeedbackResult> {
    return authApiPost<SubmitRecommendationFeedbackResult>(
        RECOMMENDATIONS_API_ENDPOINTS.feedback(
            recommendationPublicId,
        ),
        payload,
    );
}

export const recommendationsApi = {
    getRecommendations,
    getRecommendation,
    markViewed,
    save,
    unsave,
    dismiss,
    submitFeedback,
} as const;