// File: src/features/verification/api/verification.api.ts

/**
 * Asancha Verification API
 *
 * Purpose:
 * Provides typed authenticated API functions for current-user verification
 * review list, detail, and response workflows.
 *
 * Responsibilities:
 * - Retrieve verification reviews for the current active profile.
 * - Retrieve one safe verification review by public ID.
 * - Submit a user response to an eligible verification review.
 * - Build safe verification list query strings.
 *
 * Security notes:
 * - All requests use authenticated API helpers.
 * - This module must never call staff verification-decision, risk, or internal
 *   note endpoints.
 * - Users cannot approve, reject, set risk, or directly update review status.
 * - Backend ownership, active-profile, company, document, policy, lifecycle,
 *   response eligibility, and permission checks remain final.
 */

import {
    authApiGet,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { VERIFICATION_API_ENDPOINTS } from "../constants/verification.constants";
import type {
    SubmitVerificationResponsePayload,
    SubmitVerificationResponseResult,
    VerificationCollection,
    VerificationFilters,
    VerificationQuery,
    VerificationReviewDetail,
} from "../types/verification.types";

function appendString(
    searchParams: URLSearchParams,
    key: string,
    value: string | undefined,
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
            searchParams.append(key, normalizedValue);
        }
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

function appendBoolean(
    searchParams: URLSearchParams,
    key: string,
    value: boolean | undefined,
): void {
    if (value !== undefined) {
        searchParams.set(key, String(value));
    }
}

function createVerificationQueryString(
    query:
        | VerificationQuery
        | Partial<VerificationFilters>,
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
        "verificationTypes",
        query.verificationTypes,
    );

    appendStringArray(
        searchParams,
        "subjectTypes",
        query.subjectTypes,
    );

    appendBoolean(
        searchParams,
        "correctionRequired",
        query.correctionRequired ?? undefined,
    );

    appendBoolean(
        searchParams,
        "canRespond",
        query.canRespond ?? undefined,
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

    return queryString ? `?${queryString}` : "";
}

async function getVerificationReviews(
    query:
        | VerificationQuery
        | Partial<VerificationFilters> = {},
): Promise<VerificationCollection> {
    const queryString =
        createVerificationQueryString(query);

    return authApiGet<VerificationCollection>(
        `${VERIFICATION_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getVerificationReview(
    verificationReviewPublicId: string,
): Promise<VerificationReviewDetail> {
    return authApiGet<VerificationReviewDetail>(
        VERIFICATION_API_ENDPOINTS.review(
            verificationReviewPublicId,
        ),
    );
}

async function submitVerificationResponse(
    verificationReviewPublicId: string,
    payload: SubmitVerificationResponsePayload,
): Promise<SubmitVerificationResponseResult> {
    return authApiPost<
        SubmitVerificationResponseResult,
        SubmitVerificationResponsePayload
    >(
        VERIFICATION_API_ENDPOINTS.respond(
            verificationReviewPublicId,
        ),
        payload,
    );
}

export const verificationApi = {
    getVerificationReviews,
    getVerificationReview,
    submitVerificationResponse,
} as const;