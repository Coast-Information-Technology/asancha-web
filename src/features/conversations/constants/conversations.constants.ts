// File: src/features/conversations/constants/conversations.constants.ts

/**
 * Asancha Conversation Constants
 *
 * Purpose:
 * Defines current-user conversation endpoints, routes, options, defaults, and
 * safe user-facing messages.
 *
 * Security notes:
 * - Staff/admin conversation routes must not appear here.
 * - Public users cannot send admin notes.
 * - Hidden messages and internal notes are backend-filtered.
 */

import type {
    ConversationFilters,
    ConversationPriority,
    ConversationStatus,
    ConversationTargetType,
    ConversationType,
} from "../types/conversations.types";

export const CONVERSATIONS_API_ENDPOINTS = {
    mine: "/conversations/me",
    create: "/conversations",

    conversation: (
        conversationPublicId: string,
    ): string =>
        `/conversations/${encodeURIComponent(
            conversationPublicId,
        )}`,

    close: (
        conversationPublicId: string,
    ): string =>
        `/conversations/${encodeURIComponent(
            conversationPublicId,
        )}/close`,

    markRead: (
        conversationPublicId: string,
    ): string =>
        `/conversations/${encodeURIComponent(
            conversationPublicId,
        )}/read`,

    messages: (
        conversationPublicId: string,
    ): string =>
        `/conversations/${encodeURIComponent(
            conversationPublicId,
        )}/messages`,

    messageRead: (
        messagePublicId: string,
    ): string =>
        `/messages/${encodeURIComponent(
            messagePublicId,
        )}/read`,
} as const;

export const CONVERSATION_PAGE_ROUTES = {
    root: "/conversations",
    create: "/conversations/new",

    detail: (
        conversationPublicId: string,
    ): string =>
        `/conversations/${encodeURIComponent(
            conversationPublicId,
        )}`,

    support: "/account/support",
} as const;

export const CONVERSATION_TYPE_OPTIONS = [
    {
        value: "support",
        label: "Support",
    },
    {
        value: "listing_enquiry",
        label: "Listing enquiry",
    },
    {
        value: "reservation",
        label: "Reservation",
    },
    {
        value: "booking",
        label: "Booking",
    },
    {
        value: "property",
        label: "Property",
    },
    {
        value: "service",
        label: "Service",
    },
    {
        value: "verification",
        label: "Verification",
    },
    {
        value: "payment",
        label: "Payment",
    },
    {
        value: "api_partner",
        label: "API partner",
    },
    {
        value: "general",
        label: "General enquiry",
    },
] as const satisfies ReadonlyArray<{
    value: ConversationType;
    label: string;
}>;

export const CONVERSATION_STATUS_OPTIONS = [
    {
        value: "open",
        label: "Open",
    },
    {
        value: "waiting_for_user",
        label: "Waiting for you",
    },
    {
        value: "waiting_for_staff",
        label: "Waiting for Asancha",
    },
    {
        value: "resolved",
        label: "Resolved",
    },
    {
        value: "closed",
        label: "Closed",
    },
    {
        value: "archived",
        label: "Archived",
    },
    {
        value: "blocked",
        label: "Blocked",
    },
] as const satisfies ReadonlyArray<{
    value: ConversationStatus;
    label: string;
}>;

export const CONVERSATION_PRIORITY_OPTIONS = [
    {
        value: "low",
        label: "Low",
    },
    {
        value: "normal",
        label: "Normal",
    },
    {
        value: "high",
        label: "High",
    },
    {
        value: "urgent",
        label: "Urgent",
    },
] as const satisfies ReadonlyArray<{
    value: ConversationPriority;
    label: string;
}>;

export const CONVERSATION_TARGET_TYPE_OPTIONS = [
    {
        value: "listing",
        label: "Listing",
    },
    {
        value: "property",
        label: "Property",
    },
    {
        value: "reservation",
        label: "Reservation",
    },
    {
        value: "booking",
        label: "Booking",
    },
    {
        value: "payment",
        label: "Payment",
    },
    {
        value: "verification_review",
        label: "Verification review",
    },
    {
        value: "service_provider",
        label: "Service provider",
    },
    {
        value: "api_partner_application",
        label: "API partner application",
    },
    {
        value: "support",
        label: "Support",
    },
    {
        value: "other",
        label: "Other",
    },
] as const satisfies ReadonlyArray<{
    value: ConversationTargetType;
    label: string;
}>;

export const CONVERSATION_SORT_OPTIONS = [
    {
        value: "latest_message",
        label: "Latest message",
    },
    {
        value: "oldest_message",
        label: "Oldest message",
    },
    {
        value: "created_newest",
        label: "Newest conversations",
    },
    {
        value: "created_oldest",
        label: "Oldest conversations",
    },
    {
        value: "unread_first",
        label: "Unread first",
    },
    {
        value: "priority",
        label: "Priority",
    },
] as const;

export const DEFAULT_CONVERSATION_FILTERS: ConversationFilters = {
    search: "",
    statuses: [],
    conversationTypes: [],
    priorities: [],
    targetTypes: [],

    targetPublicId: null,
    unreadOnly: null,
    openOnly: null,

    sort: "latest_message",
    page: 1,
    pageSize: 20,
};

export const CONVERSATION_MAX_MESSAGE_LENGTH = 5_000;
export const CONVERSATION_MAX_SUBJECT_LENGTH = 160;
export const CONVERSATION_MAX_DESCRIPTION_LENGTH = 1_000;

export const CONVERSATION_SAFE_MESSAGES = {
    loadError:
        "We could not load your conversations. Please refresh the page.",

    detailLoadError:
        "We could not load this conversation. It may not exist or you may not be a participant.",

    messageLoadError:
        "We could not load the conversation messages.",

    createError:
        "We could not start the conversation. Review the subject, message, and related item.",

    created:
        "The conversation has been started.",

    updateError:
        "We could not update the conversation.",

    updated:
        "The conversation has been updated.",

    sendError:
        "We could not send your message. Confirm that the conversation is still open.",

    sent:
        "Your message has been sent.",

    closeError:
        "We could not close this conversation.",

    closed:
        "The conversation has been closed.",

    markReadError:
        "We could not update the read status.",

    closedConversation:
        "This conversation is closed and no longer accepts new messages.",

    blockedConversation:
        "This conversation is currently unavailable.",

    noConversations:
        "You do not have any conversations yet.",

    plainTextOnly:
        "Messages support plain text only.",

    realtimeUnavailable:
        "Messages do not update in real time. Refresh the conversation to check for new replies.",
} as const;

export function getConversationStatusLabel(
    status: ConversationStatus,
): string {
    return (
        CONVERSATION_STATUS_OPTIONS.find(
            (option) => option.value === status,
        )?.label ?? status
    );
}