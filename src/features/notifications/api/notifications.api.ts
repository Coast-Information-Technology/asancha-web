// File: src/features/notifications/api/notifications.api.ts

/**
 * Asancha Notifications API
 *
 * Purpose:
 * Provides typed authenticated functions for the current-user notification
 * inbox, unread count, read state, dismissal, read-all, and preferences.
 *
 * Security notes:
 * - This module must not call admin notification creation endpoints.
 * - Backend recipient ownership and preference enforcement remain final.
 * - Notification action URLs must be supplied by the safe backend mapper.
 */

import {
    authApiGet,
    authApiPatch,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { NOTIFICATIONS_API_ENDPOINTS } from "../constants/notifications.constants";
import type {
    DismissNotificationResult,
    MarkNotificationReadResult,
    MarkNotificationUnreadResult,
    NotificationCollection,
    NotificationDismissPayload,
    NotificationFilters,
    NotificationPreferences,
    NotificationQuery,
    NotificationReadAllPayload,
    NotificationReadPayload,
    NotificationUnreadCount,
    ReadAllNotificationsResult,
    UpdateNotificationPreferencesPayload,
    UpdateNotificationPreferencesResult,
} from "../types/notifications.types";

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

function createNotificationQueryString(
    query:
        | NotificationQuery
        | Partial<NotificationFilters>,
): string {
    const searchParams = new URLSearchParams();

    appendString(
        searchParams,
        "search",
        query.search,
    );

    appendString(
        searchParams,
        "state",
        query.state,
    );

    appendStringArray(
        searchParams,
        "categories",
        query.categories,
    );

    appendStringArray(
        searchParams,
        "priorities",
        query.priorities,
    );

    appendString(
        searchParams,
        "profilePublicId",
        query.profilePublicId,
    );

    appendString(
        searchParams,
        "relatedType",
        query.relatedType,
    );

    appendString(
        searchParams,
        "relatedPublicId",
        query.relatedPublicId,
    );

    appendBoolean(
        searchParams,
        "includeExpired",
        query.includeExpired,
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

async function getNotifications(
    query:
        | NotificationQuery
        | Partial<NotificationFilters> = {},
): Promise<NotificationCollection> {
    const queryString =
        createNotificationQueryString(query);

    return authApiGet<NotificationCollection>(
        `${NOTIFICATIONS_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getUnreadCount(): Promise<NotificationUnreadCount> {
    return authApiGet<NotificationUnreadCount>(
        NOTIFICATIONS_API_ENDPOINTS.unreadCount,
    );
}

async function markRead(
    notificationPublicId: string,
): Promise<MarkNotificationReadResult> {
    const payload: NotificationReadPayload = {
        data: {
            readAt: null,
        },
    };

    return authApiPost<MarkNotificationReadResult>(
        NOTIFICATIONS_API_ENDPOINTS.read(
            notificationPublicId,
        ),
        payload,
    );
}

async function markUnread(
    notificationPublicId: string,
): Promise<MarkNotificationUnreadResult> {
    const payload: NotificationReadPayload = {
        data: {
            readAt: null,
        },
    };

    return authApiPost<MarkNotificationUnreadResult>(
        NOTIFICATIONS_API_ENDPOINTS.unread(
            notificationPublicId,
        ),
        payload,
    );
}

async function dismiss(
    notificationPublicId: string,
): Promise<DismissNotificationResult> {
    const payload: NotificationDismissPayload = {
        data: {
            dismissedAt: null,
        },
    };

    return authApiPost<DismissNotificationResult>(
        NOTIFICATIONS_API_ENDPOINTS.dismiss(
            notificationPublicId,
        ),
        payload,
    );
}

async function markAllRead(): Promise<ReadAllNotificationsResult> {
    const payload: NotificationReadAllPayload = {
        data: {
            readAt: null,
        },
    };

    return authApiPost<ReadAllNotificationsResult>(
        NOTIFICATIONS_API_ENDPOINTS.readAll,
        payload,
    );
}

async function getPreferences(): Promise<NotificationPreferences> {
    return authApiGet<NotificationPreferences>(
        NOTIFICATIONS_API_ENDPOINTS.preferences,
    );
}

async function updatePreferences(
    payload: UpdateNotificationPreferencesPayload,
): Promise<UpdateNotificationPreferencesResult> {
    return authApiPatch<UpdateNotificationPreferencesResult>(
        NOTIFICATIONS_API_ENDPOINTS.preferences,
        payload,
    );
}

export const notificationsApi = {
    getNotifications,
    getUnreadCount,
    markRead,
    markUnread,
    dismiss,
    markAllRead,
    getPreferences,
    updatePreferences,
} as const;