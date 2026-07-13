// File: src/features/payments/api/payments.api.ts

/**
 * Asancha Payments API
 *
 * Purpose:
 * Provides typed authenticated API functions for current-user payment list,
 * detail, external submission, and Stripe Checkout initiation workflows.
 *
 * Responsibilities:
 * - Retrieve payments belonging to the current user or active profile.
 * - Retrieve one safe payment by public ID.
 * - Submit external payment information for review.
 * - Start an eligible Stripe Checkout session.
 * - Build safe payment query strings.
 *
 * Security notes:
 * - All requests use authenticated API helpers.
 * - This module does not create payment references.
 * - This module does not call staff approval, rejection, cancellation, expiry,
 *   or refund endpoints.
 * - Stripe secret keys and webhook details remain backend-only.
 * - Checkout URLs must come from the backend and must not be constructed from
 *   provider IDs in the frontend.
 * - Backend payment ownership, amount, reference, narration, provider,
 *   lifecycle, expiry, reservation, and permission checks remain final.
 */

import {
    authApiGet,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { PAYMENTS_API_ENDPOINTS } from "../constants/payments.constants";
import type {
    PaymentCollection,
    PaymentDetail,
    PaymentFilters,
    PaymentQuery,
    StartStripeCheckoutPayload,
    StripeCheckoutResult,
    SubmitExternalPaymentPayload,
    SubmitExternalPaymentResult,
} from "../types/payments.types";

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

function createPaymentQueryString(
    query: PaymentQuery | Partial<PaymentFilters>,
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
        "purposes",
        query.purposes,
    );

    appendStringArray(
        searchParams,
        "paymentMethods",
        query.paymentMethods,
    );

    appendStringArray(
        searchParams,
        "relatedTypes",
        query.relatedTypes,
    );

    appendString(
        searchParams,
        "paymentReference",
        query.paymentReference,
    );

    appendBoolean(
        searchParams,
        "expiringSoon",
        query.expiringSoon ?? undefined,
    );

    appendBoolean(
        searchParams,
        "requiresAction",
        query.requiresAction ?? undefined,
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

async function getPayments(
    query: PaymentQuery | Partial<PaymentFilters> = {},
): Promise<PaymentCollection> {
    const queryString =
        createPaymentQueryString(query);

    return authApiGet<PaymentCollection>(
        `${PAYMENTS_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getPayment(
    paymentPublicId: string,
): Promise<PaymentDetail> {
    return authApiGet<PaymentDetail>(
        PAYMENTS_API_ENDPOINTS.payment(
            paymentPublicId,
        ),
    );
}

async function submitExternalPayment(
    paymentPublicId: string,
    payload: SubmitExternalPaymentPayload,
): Promise<SubmitExternalPaymentResult> {
    return authApiPost<
        SubmitExternalPaymentResult,
        SubmitExternalPaymentPayload
    >(
        PAYMENTS_API_ENDPOINTS.submitExternal(
            paymentPublicId,
        ),
        payload,
    );
}

async function startStripeCheckout(
    paymentPublicId: string,
    payload: StartStripeCheckoutPayload = {
        data: {
            successPath: null,
            cancelPath: null,
        },
    },
): Promise<StripeCheckoutResult> {
    return authApiPost<
        StripeCheckoutResult,
        StartStripeCheckoutPayload
    >(
        PAYMENTS_API_ENDPOINTS.startStripeCheckout(
            paymentPublicId,
        ),
        payload,
    );
}

export const paymentsApi = {
    getPayments,
    getPayment,
    submitExternalPayment,
    startStripeCheckout,
} as const;