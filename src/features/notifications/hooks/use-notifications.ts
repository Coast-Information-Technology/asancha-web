"use client";

// File: src/features/notifications/hooks/use-notifications.ts

/**
 * Asancha Notifications Hook
 *
 * Purpose:
 * Provides notification inbox, unread count, read state, dismissal,
 * preferences, filtering, pagination, and request state.
 *
 * Security notes:
 * - Stores safe current-user notification data only.
 * - Backend ownership and critical preference rules remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { notificationsApi } from "../api/notifications.api";
import {
    DEFAULT_NOTIFICATION_FILTERS,
    NOTIFICATION_SAFE_MESSAGES,
} from "../constants/notifications.constants";
import type {
    DismissNotificationResult,
    MarkNotificationReadResult,
    MarkNotificationUnreadResult,
    NotificationCollection,
    NotificationDetail,
    NotificationFilters,
    NotificationPreferences,
    NotificationSummary,
    NotificationUnreadCount,
    NotificationsHookState,
    ReadAllNotificationsResult,
    UpdateNotificationPreferencesPayload,
    UpdateNotificationPreferencesResult,
    UseNotificationsResult,
} from "../types/notifications.types";

const INITIAL_NOTIFICATIONS_STATE: NotificationsHookState = {
    requestState: "idle",

    notifications: [],
    selectedNotification: null,

    unreadCount: 0,
    criticalUnreadCount: 0,
    highPriorityUnreadCount: 0,

    statusSummary: null,
    preferences: null,

    filters: {
        ...DEFAULT_NOTIFICATION_FILTERS,
    },

    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isMarkingRead: false,
    isMarkingUnread: false,
    isDismissing: false,
    isReadingAll: false,
    isLoadingPreferences: false,
    isSavingPreferences: false,
    isEmpty: false,
};

function replaceNotification(
    notifications: NotificationSummary[],
    notification: NotificationSummary,
): NotificationSummary[] {
    const exists = notifications.some(
        (
            currentNotification: NotificationSummary,
        ): boolean =>
            currentNotification.notificationPublicId ===
            notification.notificationPublicId,
    );

    if (!exists) {
        return [
            notification,
            ...notifications,
        ];
    }

    return notifications.map(
        (
            currentNotification: NotificationSummary,
        ): NotificationSummary =>
            currentNotification.notificationPublicId ===
                notification.notificationPublicId
                ? notification
                : currentNotification,
    );
}

function countUnreadNotifications(
    notifications: NotificationSummary[],
): number {
    return notifications.filter(
        (
            notification: NotificationSummary,
        ): boolean =>
            !notification.isRead &&
            !notification.isDismissed &&
            !notification.isExpired,
    ).length;
}

export function useNotifications(): UseNotificationsResult {
    const [hookState, setHookState] =
        useState<NotificationsHookState>(
            INITIAL_NOTIFICATIONS_STATE,
        );

    const filtersRef = useRef<NotificationFilters>({
        ...DEFAULT_NOTIFICATION_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: NotificationFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
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
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isMarkingRead: false,
                    isMarkingUnread: false,
                    isDismissing: false,
                    isReadingAll: false,
                    isLoadingPreferences: false,
                    isSavingPreferences: false,
                }),
            );
        },
        [],
    );

    const loadNotifications = useCallback(
        async (
            filters?: Partial<NotificationFilters>,
        ): Promise<NotificationCollection | null> => {
            const nextFilters: NotificationFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
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
                const collection: NotificationCollection =
                    await notificationsApi.getNotifications(
                        nextFilters,
                    );

                const noNotifications: boolean =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => ({
                        ...currentState,

                        requestState: noNotifications
                            ? "empty"
                            : "success",

                        notifications: collection.items,
                        statusSummary:
                            collection.statusSummary,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        unreadCount:
                            collection.statusSummary.unread,

                        criticalUnreadCount:
                            collection.statusSummary
                                .criticalUnread,

                        highPriorityUnreadCount:
                            collection.statusSummary
                                .highPriorityUnread,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noNotifications,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshNotifications =
        useCallback(
            async (): Promise<NotificationCollection | null> => {
                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => ({
                        ...currentState,

                        requestState: "refreshing",
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection =
                        await notificationsApi.getNotifications(
                            filtersRef.current,
                        );

                    const noNotifications: boolean =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: NotificationsHookState,
                        ): NotificationsHookState => ({
                            ...currentState,

                            requestState: noNotifications
                                ? "empty"
                                : "success",

                            notifications: collection.items,
                            statusSummary:
                                collection.statusSummary,
                            pagination: collection.pagination,

                            unreadCount:
                                collection.statusSummary.unread,

                            criticalUnreadCount:
                                collection.statusSummary
                                    .criticalUnread,

                            highPriorityUnreadCount:
                                collection.statusSummary
                                    .highPriorityUnread,

                            isRefreshing: false,
                            isEmpty: noNotifications,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        NOTIFICATION_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadUnreadCount = useCallback(
        async (): Promise<NotificationUnreadCount | null> => {
            try {
                const result =
                    await notificationsApi.getUnreadCount();

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => ({
                        ...currentState,

                        unreadCount: result.unreadCount,

                        criticalUnreadCount:
                            result.criticalUnreadCount,

                        highPriorityUnreadCount:
                            result.highPriorityUnreadCount,
                    }),
                );

                return result;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES
                        .unreadCountError,
                );

                return null;
            }
        },
        [setError],
    );

    const markNotificationRead = useCallback(
        async (
            notificationPublicId: string,
        ): Promise<MarkNotificationReadResult> => {
            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,

                    requestState: "marking_read",
                    isMarkingRead: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await notificationsApi.markRead(
                        notificationPublicId,
                    );

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => {
                        const updatedNotifications =
                            replaceNotification(
                                currentState.notifications,
                                result.notification,
                            );

                        return {
                            ...currentState,

                            requestState: "success",

                            notifications:
                                updatedNotifications,

                            unreadCount:
                                countUnreadNotifications(
                                    updatedNotifications,
                                ),

                            isMarkingRead: false,

                            errorMessage: null,
                            successMessage:
                                result.message ||
                                NOTIFICATION_SAFE_MESSAGES
                                    .markedRead,
                        };
                    },
                );

                return result;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES
                        .markReadError,
                );

                throw new Error(
                    NOTIFICATION_SAFE_MESSAGES
                        .markReadError,
                );
            }
        },
        [setError],
    );

    const markNotificationUnread = useCallback(
        async (
            notificationPublicId: string,
        ): Promise<MarkNotificationUnreadResult> => {
            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,

                    requestState: "marking_unread",
                    isMarkingUnread: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await notificationsApi.markUnread(
                        notificationPublicId,
                    );

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => {
                        const updatedNotifications =
                            replaceNotification(
                                currentState.notifications,
                                result.notification,
                            );

                        return {
                            ...currentState,

                            requestState: "success",

                            notifications:
                                updatedNotifications,

                            unreadCount:
                                countUnreadNotifications(
                                    updatedNotifications,
                                ),

                            isMarkingUnread: false,

                            errorMessage: null,
                            successMessage:
                                result.message ||
                                NOTIFICATION_SAFE_MESSAGES
                                    .markedUnread,
                        };
                    },
                );

                return result;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES
                        .markUnreadError,
                );

                throw new Error(
                    NOTIFICATION_SAFE_MESSAGES
                        .markUnreadError,
                );
            }
        },
        [setError],
    );

    const dismissNotification = useCallback(
        async (
            notificationPublicId: string,
        ): Promise<DismissNotificationResult> => {
            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,

                    requestState: "dismissing",
                    isDismissing: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await notificationsApi.dismiss(
                        notificationPublicId,
                    );

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => {
                        const updatedNotifications =
                            replaceNotification(
                                currentState.notifications,
                                result.notification,
                            );

                        const visibleNotifications =
                            currentState.filters.state ===
                                "dismissed"
                                ? updatedNotifications
                                : updatedNotifications.filter(
                                    (
                                        notification: NotificationSummary,
                                    ): boolean =>
                                        !notification.isDismissed,
                                );

                        return {
                            ...currentState,

                            requestState: "success",

                            notifications:
                                visibleNotifications,

                            unreadCount:
                                countUnreadNotifications(
                                    updatedNotifications,
                                ),

                            isDismissing: false,
                            isEmpty:
                                visibleNotifications.length === 0,

                            errorMessage: null,
                            successMessage:
                                result.message ||
                                NOTIFICATION_SAFE_MESSAGES
                                    .dismissed,
                        };
                    },
                );

                return result;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES.dismissError,
                );

                throw new Error(
                    NOTIFICATION_SAFE_MESSAGES.dismissError,
                );
            }
        },
        [setError],
    );

    const markAllNotificationsRead =
        useCallback(
            async (): Promise<ReadAllNotificationsResult> => {
                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => ({
                        ...currentState,

                        requestState: "reading_all",
                        isReadingAll: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const result =
                        await notificationsApi.markAllRead();

                    setHookState(
                        (
                            currentState: NotificationsHookState,
                        ): NotificationsHookState => ({
                            ...currentState,

                            requestState: "success",

                            notifications:
                                currentState.notifications.map(
                                    (
                                        notification: NotificationSummary,
                                    ): NotificationSummary => ({
                                        ...notification,

                                        isRead: true,

                                        readAt:
                                            notification.readAt ??
                                            new Date().toISOString(),

                                        deliveryStatus:
                                            notification.isDismissed
                                                ? notification.deliveryStatus
                                                : "read",
                                    }),
                                ),

                            unreadCount: result.unreadCount,
                            criticalUnreadCount: 0,
                            highPriorityUnreadCount: 0,

                            isReadingAll: false,

                            errorMessage: null,
                            successMessage:
                                result.message ||
                                NOTIFICATION_SAFE_MESSAGES.readAll,
                        }),
                    );

                    return result;
                } catch {
                    setError(
                        NOTIFICATION_SAFE_MESSAGES.readAllError,
                    );

                    throw new Error(
                        NOTIFICATION_SAFE_MESSAGES.readAllError,
                    );
                }
            },
            [setError],
        );

    const loadPreferences = useCallback(
        async (): Promise<NotificationPreferences | null> => {
            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,

                    requestState:
                        "loading_preferences",

                    isLoadingPreferences: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const preferences =
                    await notificationsApi.getPreferences();

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => ({
                        ...currentState,

                        requestState: "success",
                        preferences,

                        isLoadingPreferences: false,
                        errorMessage: null,
                    }),
                );

                return preferences;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES
                        .preferencesLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const updatePreferences = useCallback(
        async (
            payload: UpdateNotificationPreferencesPayload,
        ): Promise<UpdateNotificationPreferencesResult> => {
            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,

                    requestState:
                        "saving_preferences",

                    isSavingPreferences: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await notificationsApi.updatePreferences(
                        payload,
                    );

                setHookState(
                    (
                        currentState: NotificationsHookState,
                    ): NotificationsHookState => ({
                        ...currentState,

                        requestState: "success",
                        preferences: result.preferences,

                        isSavingPreferences: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            NOTIFICATION_SAFE_MESSAGES
                                .preferencesSaved,
                    }),
                );

                return result;
            } catch {
                setError(
                    NOTIFICATION_SAFE_MESSAGES
                        .preferencesSaveError,
                );

                throw new Error(
                    NOTIFICATION_SAFE_MESSAGES
                        .preferencesSaveError,
                );
            }
        },
        [setError],
    );

    const setFilters = useCallback(
        (
            filters: Partial<NotificationFilters>,
        ): void => {
            const filterKeys: string[] =
                Object.keys(filters);

            const changesSearchCriteria =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: NotificationFilters = {
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
        (filters: NotificationFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: NotificationFilters = {
            ...DEFAULT_NOTIFICATION_FILTERS,
        };

        applyFilters(nextFilters);
    }, [applyFilters]);

    const selectNotification = useCallback(
        (
            notification: NotificationDetail | null,
        ): void => {
            setHookState(
                (
                    currentState: NotificationsHookState,
                ): NotificationsHookState => ({
                    ...currentState,
                    selectedNotification: notification,
                }),
            );
        },
        [],
    );

    const clearFeedback = useCallback((): void => {
        setHookState(
            (
                currentState: NotificationsHookState,
            ): NotificationsHookState => ({
                ...currentState,
                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_NOTIFICATION_FILTERS,
        };

        setHookState({
            ...INITIAL_NOTIFICATIONS_STATE,

            filters: {
                ...DEFAULT_NOTIFICATION_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadNotifications,
        refreshNotifications,
        loadUnreadCount,

        markNotificationRead,
        markNotificationUnread,
        dismissNotification,
        markAllNotificationsRead,

        loadPreferences,
        updatePreferences,

        setFilters,
        replaceFilters,
        resetFilters,

        selectNotification,
        clearFeedback,
        reset,
    };
}