// File: src/features/notifications/types/notifications.types.ts

/**
 * Asancha Notification Types
 *
 * Purpose:
 * Defines authenticated public-user contracts for the notification inbox,
 * unread counts, read state, dismissal, notification preferences, filters,
 * pagination, and related-resource actions.
 *
 * Responsibilities:
 * - Define notification categories, priorities, and delivery states.
 * - Define public-safe notification list and detail records.
 * - Define notification preference channels and category controls.
 * - Define list, unread-count, mutation, and hook contracts.
 *
 * Security notes:
 * - Notifications must use public IDs and safe application paths.
 * - MongoDB ObjectIds must never appear.
 * - Notifications must not expose passwords, tokens, API keys, webhook
 *   secrets, private document URLs, raw provider payloads, internal staff
 *   notes, private KYC notes, risk internals, or private AI prompts.
 * - Critical notification preference enforcement remains backend-controlled.
 */

export type NotificationCategory =
    | "account"
    | "security"
    | "profile"
    | "onboarding"
    | "policy"
    | "verification"
    | "document"
    | "listing"
    | "reservation"
    | "payment"
    | "booking"
    | "conversation"
    | "ai"
    | "api_partner"
    | "system";

export type NotificationPriority =
    | "low"
    | "normal"
    | "high"
    | "critical";

export type NotificationDeliveryStatus =
    | "created"
    | "queued"
    | "sent"
    | "delivered"
    | "failed"
    | "read"
    | "dismissed"
    | "expired"
    | "cancelled";

export type NotificationRecipientType =
    | "user"
    | "profile"
    | "company"
    | "api_partner";

export type NotificationChannel =
    | "in_app"
    | "email";

export type NotificationFilterState =
    | "all"
    | "unread"
    | "read"
    | "dismissed";

export type NotificationSort =
    | "newest"
    | "oldest"
    | "priority"
    | "unread_first";

export type NotificationRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "marking_read"
    | "marking_unread"
    | "dismissing"
    | "reading_all"
    | "loading_preferences"
    | "saving_preferences"
    | "success"
    | "empty"
    | "error";

export interface NotificationRelatedResource {
    relatedType: string | null;
    relatedPublicId: string | null;
    displayLabel: string | null;
}

export interface NotificationAction {
    label: string;
    path: string;
}

export interface NotificationSummary {
    notificationPublicId: string;

    notificationType: string;
    sourceEvent: string | null;

    category: NotificationCategory;
    priority: NotificationPriority;
    deliveryStatus: NotificationDeliveryStatus;

    title: string;
    message: string;

    action: NotificationAction | null;
    relatedResource: NotificationRelatedResource | null;

    recipientType: NotificationRecipientType;
    profileType: string | null;
    profilePublicId: string | null;
    companyPublicId: string | null;

    isRead: boolean;
    isDismissed: boolean;
    isExpired: boolean;

    canMarkRead: boolean;
    canMarkUnread: boolean;
    canDismiss: boolean;
    canOpenAction: boolean;

    readAt: string | null;
    dismissedAt: string | null;
    expiresAt: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface NotificationDetail
    extends NotificationSummary {
    safeMetadata: Record<string, string | number | boolean | null>;
}

export interface NotificationFilters {
    search: string;

    state: NotificationFilterState;
    categories: NotificationCategory[];
    priorities: NotificationPriority[];

    profilePublicId: string | null;
    relatedType: string | null;
    relatedPublicId: string | null;

    includeExpired: boolean;
    sort: NotificationSort;

    page: number;
    pageSize: number;
}

export interface NotificationQuery {
    search?: string;

    state?: NotificationFilterState;
    categories?: NotificationCategory[];
    priorities?: NotificationPriority[];

    profilePublicId?: string;
    relatedType?: string;
    relatedPublicId?: string;

    includeExpired?: boolean;
    sort?: NotificationSort;

    page?: number;
    pageSize?: number;
}

export interface NotificationPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface NotificationStatusSummary {
    total: number;
    unread: number;
    read: number;
    dismissed: number;
    criticalUnread: number;
    highPriorityUnread: number;
}

export interface NotificationCollection {
    items: NotificationSummary[];
    statusSummary: NotificationStatusSummary;
    pagination: NotificationPagination;
    appliedFilters: Partial<NotificationFilters>;
}

export interface NotificationUnreadCount {
    unreadCount: number;
    criticalUnreadCount: number;
    highPriorityUnreadCount: number;
}

export interface NotificationMutationResult {
    notification: NotificationSummary;
    message: string;
}

export interface MarkNotificationReadResult
    extends NotificationMutationResult {
    markedRead: true;
}

export interface MarkNotificationUnreadResult
    extends NotificationMutationResult {
    markedUnread: true;
}

export interface DismissNotificationResult
    extends NotificationMutationResult {
    dismissed: true;
}

export interface ReadAllNotificationsResult {
    markedReadCount: number;
    unreadCount: number;
    completed: true;
    message: string;
}

export interface NotificationCategoryPreference {
    enabled: boolean;
    canDisable: boolean;
    lockedReason: string | null;
}

export interface NotificationChannelPreferences {
    account: NotificationCategoryPreference;
    security: NotificationCategoryPreference;
    profile: NotificationCategoryPreference;
    onboarding: NotificationCategoryPreference;
    policy: NotificationCategoryPreference;
    verification: NotificationCategoryPreference;
    document: NotificationCategoryPreference;
    listing: NotificationCategoryPreference;
    reservation: NotificationCategoryPreference;
    payment: NotificationCategoryPreference;
    booking: NotificationCategoryPreference;
    conversation: NotificationCategoryPreference;
    ai: NotificationCategoryPreference;
    apiPartner: NotificationCategoryPreference;
    system: NotificationCategoryPreference;
}

export interface NotificationPreferences {
    preferencePublicId: string | null;

    inApp: NotificationChannelPreferences;
    email: NotificationChannelPreferences;

    timezone: string;
    digestEnabled: boolean;
    digestFrequency: "daily" | "weekly" | "never";

    updatedAt: string | null;
}

export interface NotificationPreferenceValues {
    inApp: {
        account: boolean;
        security: boolean;
        profile: boolean;
        onboarding: boolean;
        policy: boolean;
        verification: boolean;
        document: boolean;
        listing: boolean;
        reservation: boolean;
        payment: boolean;
        booking: boolean;
        conversation: boolean;
        ai: boolean;
        apiPartner: boolean;
        system: boolean;
    };

    email: {
        account: boolean;
        security: boolean;
        profile: boolean;
        onboarding: boolean;
        policy: boolean;
        verification: boolean;
        document: boolean;
        listing: boolean;
        reservation: boolean;
        payment: boolean;
        booking: boolean;
        conversation: boolean;
        ai: boolean;
        apiPartner: boolean;
        system: boolean;
    };

    timezone: string;
    digestEnabled: boolean;
    digestFrequency: "daily" | "weekly" | "never";
}

export type UpdateNotificationPreferencesPayload =
    Record<string, unknown> & {
        data: NotificationPreferenceValues;
    };

export interface UpdateNotificationPreferencesResult {
    preferences: NotificationPreferences;
    updated: true;
    message: string;
}

export type NotificationReadPayload =
    Record<string, unknown> & {
        data: {
            readAt: string | null;
        };
    };

export type NotificationDismissPayload =
    Record<string, unknown> & {
        data: {
            dismissedAt: string | null;
        };
    };

export type NotificationReadAllPayload =
    Record<string, unknown> & {
        data: {
            readAt: string | null;
        };
    };

export interface NotificationsHookState {
    requestState: NotificationRequestState;

    notifications: NotificationSummary[];
    selectedNotification: NotificationDetail | null;

    unreadCount: number;
    criticalUnreadCount: number;
    highPriorityUnreadCount: number;

    statusSummary: NotificationStatusSummary | null;

    preferences: NotificationPreferences | null;

    filters: NotificationFilters;
    pagination: NotificationPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isMarkingRead: boolean;
    isMarkingUnread: boolean;
    isDismissing: boolean;
    isReadingAll: boolean;
    isLoadingPreferences: boolean;
    isSavingPreferences: boolean;
    isEmpty: boolean;
}

export interface NotificationsHookActions {
    loadNotifications: (
        filters?: Partial<NotificationFilters>,
    ) => Promise<NotificationCollection | null>;

    refreshNotifications: () => Promise<NotificationCollection | null>;

    loadUnreadCount: () => Promise<NotificationUnreadCount | null>;

    markNotificationRead: (
        notificationPublicId: string,
    ) => Promise<MarkNotificationReadResult>;

    markNotificationUnread: (
        notificationPublicId: string,
    ) => Promise<MarkNotificationUnreadResult>;

    dismissNotification: (
        notificationPublicId: string,
    ) => Promise<DismissNotificationResult>;

    markAllNotificationsRead: () => Promise<ReadAllNotificationsResult>;

    loadPreferences: () => Promise<NotificationPreferences | null>;

    updatePreferences: (
        payload: UpdateNotificationPreferencesPayload,
    ) => Promise<UpdateNotificationPreferencesResult>;

    setFilters: (
        filters: Partial<NotificationFilters>,
    ) => void;

    replaceFilters: (
        filters: NotificationFilters,
    ) => void;

    resetFilters: () => void;

    selectNotification: (
        notification: NotificationDetail | null,
    ) => void;

    clearFeedback: () => void;
    reset: () => void;
}

export type UseNotificationsResult =
    NotificationsHookState &
    NotificationsHookActions;