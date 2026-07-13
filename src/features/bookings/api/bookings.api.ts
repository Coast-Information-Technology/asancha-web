// File: src/features/bookings/api/bookings.api.ts

/**
 * Asancha Bookings API
 *
 * Purpose:
 * Provides authenticated API functions for current-user booking workflows.
 *
 * Responsibilities:
 * - Retrieve bookings for the current user or active profile.
 * - Retrieve one booking by public ID.
 * - Create eligible booking requests.
 * - Cancel eligible current-user bookings.
 * - Submit eligible booking reschedule requests.
 * - Build safe booking query strings.
 *
 * Security notes:
 * - This module must not call staff confirmation or review endpoints.
 * - Meeting URLs must only be read from safe backend responses.
 * - Frontend requests must use public IDs only.
 * - Backend access, payment, schedule, target, and lifecycle rules remain final.
 */

import {
    authApiGet,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { BOOKINGS_API_ENDPOINTS } from "../constants/bookings.constants";
import type {
    BookingCollection,
    BookingDetail,
    BookingFilters,
    BookingQuery,
    CancelBookingPayload,
    CancelBookingResult,
    CreateBookingPayload,
    CreateBookingResult,
    RequestBookingReschedulePayload,
    RequestBookingRescheduleResult,
} from "../types/bookings.types";

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

function createBookingQueryString(
    query:
        | BookingQuery
        | Partial<BookingFilters>,
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
        "bookingTypes",
        query.bookingTypes,
    );

    appendStringArray(
        searchParams,
        "channels",
        query.channels,
    );

    appendStringArray(
        searchParams,
        "targetTypes",
        query.targetTypes,
    );

    appendString(
        searchParams,
        "targetPublicId",
        query.targetPublicId,
    );

    appendString(
        searchParams,
        "listingPublicId",
        query.listingPublicId,
    );

    appendString(
        searchParams,
        "reservationPublicId",
        query.reservationPublicId,
    );

    appendBoolean(
        searchParams,
        "upcoming",
        query.upcoming ?? undefined,
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

async function getBookings(
    query:
        | BookingQuery
        | Partial<BookingFilters> = {},
): Promise<BookingCollection> {
    const queryString =
        createBookingQueryString(query);

    return authApiGet<BookingCollection>(
        `${BOOKINGS_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getBooking(
    bookingPublicId: string,
): Promise<BookingDetail> {
    return authApiGet<BookingDetail>(
        BOOKINGS_API_ENDPOINTS.booking(
            bookingPublicId,
        ),
    );
}

async function createBooking(
    payload: CreateBookingPayload,
): Promise<CreateBookingResult> {
    return authApiPost<CreateBookingResult>(
        BOOKINGS_API_ENDPOINTS.create,
        payload,
    );
}

async function cancelBooking(
    bookingPublicId: string,
    payload: CancelBookingPayload,
): Promise<CancelBookingResult> {
    return authApiPost<CancelBookingResult>(
        BOOKINGS_API_ENDPOINTS.cancel(
            bookingPublicId,
        ),
        payload,
    );
}

async function requestBookingReschedule(
    bookingPublicId: string,
    payload: RequestBookingReschedulePayload,
): Promise<RequestBookingRescheduleResult> {
    return authApiPost<RequestBookingRescheduleResult>(
        BOOKINGS_API_ENDPOINTS.requestReschedule(
            bookingPublicId,
        ),
        payload,
    );
}

export const bookingsApi = {
    getBookings,
    getBooking,
    createBooking,
    cancelBooking,
    requestBookingReschedule,
} as const;
