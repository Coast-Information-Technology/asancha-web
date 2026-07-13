// File: src/features/conversations/types/conversations.types.ts

/**
 * Asancha Conversation Types
 *
 * Purpose:
 * Defines authenticated public-user contracts for conversation threads,
 * participants, messages, read tracking, creation, updates, and closure.
 *
 * Security notes:
 * - Only public IDs may be exposed.
 * - Conversation access requires backend-confirmed participant membership.
 * - Internal admin notes, hidden messages, private contacts, secrets,
 *   provider payloads, token values, and MongoDB ObjectIds must never appear.
 * - Message bodies returned to users must be backend-sanitised safe text.
 */

export type ConversationType =
    | "support"
    | "listing_enquiry"
    | "reservation"
    | "booking"
    | "property"
    | "service"
    | "verification"
    | "payment"
    | "api_partner"
    | "general";

export type ConversationStatus =
    | "open"
    | "waiting_for_user"
    | "waiting_for_staff"
    | "resolved"
    | "closed"
    | "archived"
    | "blocked";

export type ConversationPriority =
    | "low"
    | "normal"
    | "high"
    | "urgent";

export type ConversationTargetType =
    | "listing"
    | "property"
    | "reservation"
    | "booking"
    | "payment"
    | "verification_review"
    | "service_provider"
    | "api_partner_application"
    | "support"
    | "other";

export type ConversationParticipantRole =
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider"
    | "api_partner"
    | "admin"
    | "customer_care_rep"
    | "super_admin";

export type MessageType =
    | "user_message"
    | "staff_reply"
    | "system_message";

export type MessageStatus =
    | "sent"
    | "delivered"
    | "read"
    | "failed";

export type ConversationSort =
    | "latest_message"
    | "oldest_message"
    | "created_newest"
    | "created_oldest"
    | "unread_first"
    | "priority";

export type ConversationRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "creating"
    | "updating"
    | "sending"
    | "closing"
    | "marking_read"
    | "success"
    | "empty"
    | "error";

export interface ConversationParticipant {
    participantPublicId: string;
    userPublicId: string | null;
    profilePublicId: string | null;
    companyPublicId: string | null;

    role: ConversationParticipantRole;
    displayName: string;
    companyName: string | null;

    isCurrentUser: boolean;
    joinedAt: string;
    leftAt: string | null;
}

export interface ConversationTarget {
    targetType: ConversationTargetType;
    targetPublicId: string | null;
    displayLabel: string;
    detailPath: string | null;
}

export interface ConversationLatestMessage {
    messagePublicId: string;
    messageType: MessageType;
    safePreview: string;
    senderDisplayName: string;
    sentAt: string;
    isReadByCurrentUser: boolean;
}

export interface ConversationActionState {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface ConversationSummary {
    conversationPublicId: string;
    conversationReference: string;

    conversationType: ConversationType;
    status: ConversationStatus;
    priority: ConversationPriority;

    subject: string;
    target: ConversationTarget | null;

    participantCount: number;
    participants: ConversationParticipant[];

    latestMessage: ConversationLatestMessage | null;

    unreadMessageCount: number;
    hasUnreadMessages: boolean;

    safeUserMessage: string | null;

    canSendMessage: boolean;
    canUpdate: boolean;
    canClose: boolean;
    canMarkRead: boolean;

    createdAt: string;
    updatedAt: string;
    lastMessageAt: string | null;
    closedAt: string | null;
}

export interface ConversationDetail
    extends ConversationSummary {
    description: string | null;

    actions: ConversationActionState[];

    currentUserLastReadAt: string | null;
    resolvedAt: string | null;
    archivedAt: string | null;
    blockedAt: string | null;
}

export interface ConversationMessage {
    messagePublicId: string;
    conversationPublicId: string;

    messageType: MessageType;
    status: MessageStatus;

    safeBody: string;

    senderParticipantPublicId: string;
    senderUserPublicId: string | null;
    senderRole: ConversationParticipantRole;
    senderDisplayName: string;

    isCurrentUserSender: boolean;
    isReadByCurrentUser: boolean;

    sentAt: string;
    deliveredAt: string | null;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationFilters {
    search: string;
    statuses: ConversationStatus[];
    conversationTypes: ConversationType[];
    priorities: ConversationPriority[];
    targetTypes: ConversationTargetType[];

    targetPublicId: string | null;
    unreadOnly: boolean | null;
    openOnly: boolean | null;

    sort: ConversationSort;
    page: number;
    pageSize: number;
}

export interface ConversationQuery {
    search?: string;
    statuses?: ConversationStatus[];
    conversationTypes?: ConversationType[];
    priorities?: ConversationPriority[];
    targetTypes?: ConversationTargetType[];

    targetPublicId?: string;
    unreadOnly?: boolean;
    openOnly?: boolean;

    sort?: ConversationSort;
    page?: number;
    pageSize?: number;
}

export interface ConversationPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ConversationCollection {
    items: ConversationSummary[];
    pagination: ConversationPagination;
    appliedFilters: Partial<ConversationFilters>;

    unreadConversationCount: number;
    unreadMessageCount: number;
}

export interface MessagePagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface MessageCollection {
    items: ConversationMessage[];
    pagination: MessagePagination;
}

export interface CreateConversationValues {
    conversationType: ConversationType;
    subject: string;
    description: string | null;

    targetType: ConversationTargetType;
    targetPublicId: string | null;

    initialMessage: string;

    informationAccurateConfirmed: true;
}

export type CreateConversationPayload =
    Record<string, unknown> & {
        data: CreateConversationValues;
    };

export interface CreateConversationResult {
    conversation: ConversationDetail;
    initialMessage: ConversationMessage;
    created: true;
    nextPath: string;
    message: string;
}

export interface UpdateConversationValues {
    subject?: string;
    description?: string | null;
    priority?: ConversationPriority;
}

export type UpdateConversationPayload =
    Record<string, unknown> & {
        data: UpdateConversationValues;
    };

export interface UpdateConversationResult {
    conversation: ConversationDetail;
    updated: true;
    message: string;
}

export interface CloseConversationValues {
    reason: string | null;
    closureConfirmed: true;
}

export type CloseConversationPayload =
    Record<string, unknown> & {
        data: CloseConversationValues;
    };

export interface CloseConversationResult {
    conversation: ConversationDetail;
    closed: true;
    message: string;
}

export interface SendMessageValues {
    body: string;
}

export type SendMessagePayload =
    Record<string, unknown> & {
        data: SendMessageValues;
    };

export interface SendMessageResult {
    conversation: ConversationDetail;
    message: ConversationMessage;
    sent: true;
}

export type MarkConversationReadPayload =
    Record<string, unknown> & {
        data: {
            readAt: string | null;
        };
    };

export interface MarkConversationReadResult {
    conversationPublicId: string;
    unreadMessageCount: number;
    markedRead: true;
}

export type MarkMessageReadPayload =
    Record<string, unknown> & {
        data: {
            readAt: string | null;
        };
    };

export interface MarkMessageReadResult {
    message: ConversationMessage;
    markedRead: true;
}

export interface ConversationsHookState {
    requestState: ConversationRequestState;

    conversations: ConversationSummary[];
    selectedConversation: ConversationDetail | null;
    messages: ConversationMessage[];

    filters: ConversationFilters;
    pagination: ConversationPagination | null;
    messagePagination: MessagePagination | null;

    unreadConversationCount: number;
    unreadMessageCount: number;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isSending: boolean;
    isClosing: boolean;
    isMarkingRead: boolean;
    isEmpty: boolean;
}

export interface ConversationsHookActions {
    loadConversations: (
        filters?: Partial<ConversationFilters>,
    ) => Promise<ConversationCollection | null>;

    refreshConversations: () => Promise<ConversationCollection | null>;

    loadConversation: (
        conversationPublicId: string,
    ) => Promise<ConversationDetail | null>;

    loadMessages: (
        conversationPublicId: string,
        page?: number,
        pageSize?: number,
    ) => Promise<MessageCollection | null>;

    createConversation: (
        payload: CreateConversationPayload,
    ) => Promise<CreateConversationResult>;

    updateConversation: (
        conversationPublicId: string,
        payload: UpdateConversationPayload,
    ) => Promise<UpdateConversationResult>;

    closeConversation: (
        conversationPublicId: string,
        payload: CloseConversationPayload,
    ) => Promise<CloseConversationResult>;

    sendMessage: (
        conversationPublicId: string,
        payload: SendMessagePayload,
    ) => Promise<SendMessageResult>;

    markConversationRead: (
        conversationPublicId: string,
    ) => Promise<MarkConversationReadResult>;

    markMessageRead: (
        messagePublicId: string,
    ) => Promise<MarkMessageReadResult>;

    setFilters: (
        filters: Partial<ConversationFilters>,
    ) => void;

    replaceFilters: (
        filters: ConversationFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedConversation: () => void;
    clearMessages: () => void;
    clearFeedback: () => void;
    reset: () => void;
}

export type UseConversationsResult =
    ConversationsHookState &
    ConversationsHookActions;