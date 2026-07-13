// File: src/features/notifications/constants/notifications.constants.ts

/**
 * Asancha Notification Constants
 *
 * Purpose:
 * Defines current-user notification endpoints, frontend routes, options,
 * default preferences, default filters, and safe user-facing messages.
 *
 * Security notes:
 * - Staff notification routes must not appear here.
 * - Notification action paths must remain internal relative paths.
 * - Critical preference enforcement remains backend-controlled.
 */

import type {
    NotificationCategory,
    NotificationFilters,
    NotificationPreferenceValues,
    NotificationPriority,
} from "../types/notifications.types";

export const NOTIFICATIONS_API_ENDPOINTS = {
    mine: "/notifications/me",
    unreadCount: "/notifications/me/unread-count",

    read: (
        notificationPublicId: string,
    ): string =>
        `/notifications/${encodeURIComponent(
            notificationPublicId,
        )}/read`,

    unread: (
        notificationPublicId: string,
    ): string =>
        `/notifications/${encodeURIComponent(
            notificationPublicId,
        )}/unread`,

    dismiss: (
        notificationPublicId: string,
    ): string =>
        `/notifications/${encodeURIComponent(
            notificationPublicId,
        )}/dismiss`,

    readAll: "/notifications/read-all",

    preferences: "/notifications/preferences",
} as const;

export const NOTIFICATION_PAGE_ROUTES = {
    root: "/notifications",
    preferences: "/notifications/preferences",

    detail: (
        notificationPublicId: string,
    ): string =>
        `/notifications/${encodeURIComponent(
            notificationPublicId,
        )}`,
} as const;

export const NOTIFICATION_CATEGORY_OPTIONS = [
    { value: "account", label: "Account" },
    { value: "security", label: "Security" },
    { value: "profile", label: "Profile" },
    { value: "onboarding", label: "Onboarding" },
    { value: "policy", label: "Policies" },
    { value: "verification", label: "Verification" },
    { value: "document", label: "Documents" },
    { value: "listing", label: "Listings" },
    { value: "reservation", label: "Reservations" },
    { value: "payment", label: "Payments" },
    { value: "booking", label: "Bookings" },
    { value: "conversation", label: "Conversations" },
    { value: "ai", label: "Recommendations" },
    { value: "api_partner", label: "API partner" },
    { value: "system", label: "System" },
] as const satisfies ReadonlyArray<{
    value: NotificationCategory;
    label: string;
}>;

export const NOTIFICATION_PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const satisfies ReadonlyArray<{
    value: NotificationPriority;
    label: string;
}>;

export const NOTIFICATION_STATE_OPTIONS = [
    { value: "all", label: "All notifications" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
    { value: "dismissed", label: "Dismissed" },
] as const;

export const NOTIFICATION_SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "priority", label: "Priority" },
    { value: "unread_first", label: "Unread first" },
] as const;

export const NOTIFICATION_PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
    50,
] as const;

export const NOTIFICATION_MAX_PAGE_SIZE = 50;

export const DEFAULT_NOTIFICATION_FILTERS: NotificationFilters = {
    search: "",

    state: "all",
    categories: [],
    priorities: [],

    profilePublicId: null,
    relatedType: null,
    relatedPublicId: null,

    includeExpired: false,
    sort: "newest",

    page: 1,
    pageSize: 20,
};

export const DEFAULT_NOTIFICATION_PREFERENCE_VALUES:
    NotificationPreferenceValues = {
    inApp: {
        account: true,
        security: true,
        profile: true,
        onboarding: true,
        policy: true,
        verification: true,
        document: true,
        listing: true,
        reservation: true,
        payment: true,
        booking: true,
        conversation: true,
        ai: true,
        apiPartner: true,
        system: true,
    },

    email: {
        account: true,
        security: true,
        profile: true,
        onboarding: true,
        policy: true,
        verification: true,
        document: true,
        listing: true,
        reservation: true,
        payment: true,
        booking: true,
        conversation: true,
        ai: false,
        apiPartner: true,
        system: true,
    },

    timezone: "Europe/London",
    digestEnabled: false,
    digestFrequency: "never",
};

export const NOTIFICATION_SAFE_MESSAGES = {
    loadError:
        "We could not load your notifications. Please refresh the page.",

    unreadCountError:
        "We could not update the notification count.",

    markReadError:
        "We could not mark this notification as read.",

    markUnreadError:
        "We could not mark this notification as unread.",

    dismissError:
        "We could not dismiss this notification.",

    readAllError:
        "We could not mark all notifications as read.",

    preferencesLoadError:
        "We could not load your notification preferences.",

    preferencesSaveError:
        "We could not save your notification preferences.",

    markedRead:
        "The notification has been marked as read.",

    markedUnread:
        "The notification has been marked as unread.",

    dismissed:
        "The notification has been dismissed.",

    readAll:
        "All available notifications have been marked as read.",

    preferencesSaved:
        "Your notification preferences have been updated.",

    empty:
        "You do not have any notifications matching these filters.",

    noUnread:
        "You have no unread notifications.",

    criticalPreference:
        "Some critical security, account, payment, verification, policy, and API access notifications cannot be disabled.",

    operationalOnly:
        "Asancha notifications are operational and are not used as general marketing campaigns.",

    safeActionOnly:
        "Notification actions use safe Asancha routes and never expose private system references.",
} as const;

export function getNotificationCategoryLabel(
    category: NotificationCategory,
): string {
    return (
        NOTIFICATION_CATEGORY_OPTIONS.find(
            (option) => option.value === category,
        )?.label ?? category
    );
}

export function getNotificationPriorityLabel(
    priority: NotificationPriority,
): string {
    return (
        NOTIFICATION_PRIORITY_OPTIONS.find(
            (option) => option.value === priority,
        )?.label ?? priority
    );
}