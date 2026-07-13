"use client";

// File: src/features/conversations/hooks/use-conversations.ts

/**
 * Asancha Conversations Hook
 *
 * Purpose:
 * Provides conversation list, detail, message, creation, update, closure,
 * sending, read tracking, filtering, pagination, and request state.
 *
 * Security notes:
 * - Safe current-user conversation data only.
 * - Hidden/admin-only messages must not enter this state.
 * - Backend participant and lifecycle checks remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { conversationsApi } from "../api/conversations.api";
import {
    CONVERSATION_SAFE_MESSAGES,
    DEFAULT_CONVERSATION_FILTERS,
} from "../constants/conversations.constants";
import type {
    CloseConversationPayload,
    CloseConversationResult,
    ConversationCollection,
    ConversationDetail,
    ConversationFilters,
    ConversationMessage,
    ConversationSummary,
    ConversationsHookState,
    CreateConversationPayload,
    CreateConversationResult,
    MarkConversationReadResult,
    MarkMessageReadResult,
    MessageCollection,
    SendMessagePayload,
    SendMessageResult,
    UpdateConversationPayload,
    UpdateConversationResult,
    UseConversationsResult,
} from "../types/conversations.types";

const INITIAL_CONVERSATIONS_STATE: ConversationsHookState = {
    requestState: "idle",

    conversations: [],
    selectedConversation: null,
    messages: [],

    filters: {
        ...DEFAULT_CONVERSATION_FILTERS,
    },

    pagination: null,
    messagePagination: null,

    unreadConversationCount: 0,
    unreadMessageCount: 0,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isCreating: false,
    isUpdating: false,
    isSending: false,
    isClosing: false,
    isMarkingRead: false,
    isEmpty: false,
};

function replaceConversationSummary(
    conversations: ConversationSummary[],
    conversation: ConversationDetail,
): ConversationSummary[] {
    const exists = conversations.some(
        (
            currentConversation: ConversationSummary,
        ): boolean =>
            currentConversation.conversationPublicId ===
            conversation.conversationPublicId,
    );

    if (!exists) {
        return [
            conversation,
            ...conversations,
        ];
    }

    return conversations.map(
        (
            currentConversation: ConversationSummary,
        ): ConversationSummary =>
            currentConversation.conversationPublicId ===
                conversation.conversationPublicId
                ? conversation
                : currentConversation,
    );
}

function replaceMessage(
    messages: ConversationMessage[],
    message: ConversationMessage,
): ConversationMessage[] {
    const exists = messages.some(
        (
            currentMessage: ConversationMessage,
        ): boolean =>
            currentMessage.messagePublicId ===
            message.messagePublicId,
    );

    if (!exists) {
        return [...messages, message];
    }

    return messages.map(
        (
            currentMessage: ConversationMessage,
        ): ConversationMessage =>
            currentMessage.messagePublicId ===
                message.messagePublicId
                ? message
                : currentMessage,
    );
}

export function useConversations(): UseConversationsResult {
    const [hookState, setHookState] =
        useState<ConversationsHookState>(
            INITIAL_CONVERSATIONS_STATE,
        );

    const filtersRef = useRef<ConversationFilters>({
        ...DEFAULT_CONVERSATION_FILTERS,
    });

    const applyFilters = useCallback(
        (filters: ConversationFilters): void => {
            filtersRef.current = filters;

            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
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
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "error",
                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isCreating: false,
                    isUpdating: false,
                    isSending: false,
                    isClosing: false,
                    isMarkingRead: false,
                }),
            );
        },
        [],
    );

    const loadConversations = useCallback(
        async (
            filters?: Partial<ConversationFilters>,
        ): Promise<ConversationCollection | null> => {
            const nextFilters: ConversationFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
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
                const collection: ConversationCollection =
                    await conversationsApi.getConversations(
                        nextFilters,
                    );

                const noConversations =
                    collection.items.length === 0;

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: noConversations
                            ? "empty"
                            : "success",

                        conversations: collection.items,
                        pagination: collection.pagination,
                        filters: nextFilters,

                        unreadConversationCount:
                            collection.unreadConversationCount,

                        unreadMessageCount:
                            collection.unreadMessageCount,

                        isLoading: false,
                        isRefreshing: false,
                        isEmpty: noConversations,

                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshConversations =
        useCallback(
            async (): Promise<ConversationCollection | null> => {
                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "refreshing",
                        isRefreshing: true,

                        errorMessage: null,
                        successMessage: null,
                    }),
                );

                try {
                    const collection =
                        await conversationsApi.getConversations(
                            filtersRef.current,
                        );

                    const noConversations =
                        collection.items.length === 0;

                    setHookState(
                        (
                            currentState: ConversationsHookState,
                        ): ConversationsHookState => ({
                            ...currentState,

                            requestState: noConversations
                                ? "empty"
                                : "success",

                            conversations: collection.items,
                            pagination: collection.pagination,

                            unreadConversationCount:
                                collection.unreadConversationCount,

                            unreadMessageCount:
                                collection.unreadMessageCount,

                            isRefreshing: false,
                            isEmpty: noConversations,

                            errorMessage: null,
                        }),
                    );

                    return collection;
                } catch {
                    setError(
                        CONVERSATION_SAFE_MESSAGES.loadError,
                    );

                    return null;
                }
            },
            [setError],
        );

    const loadConversation = useCallback(
        async (
            conversationPublicId: string,
        ): Promise<ConversationDetail | null> => {
            const normalizedPublicId =
                conversationPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    CONVERSATION_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }

            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const conversation =
                    await conversationsApi.getConversation(
                        normalizedPublicId,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",
                        selectedConversation: conversation,

                        conversations:
                            replaceConversationSummary(
                                currentState.conversations,
                                conversation,
                            ),

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return conversation;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const loadMessages = useCallback(
        async (
            conversationPublicId: string,
            page = 1,
            pageSize = 50,
        ): Promise<MessageCollection | null> => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                }),
            );

            try {
                const collection =
                    await conversationsApi.getMessages(
                        conversationPublicId,
                        page,
                        pageSize,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",
                        messages: collection.items,
                        messagePagination:
                            collection.pagination,

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return collection;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.messageLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const createConversation = useCallback(
        async (
            payload: CreateConversationPayload,
        ): Promise<CreateConversationResult> => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "creating",
                    isCreating: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await conversationsApi.createConversation(
                        payload,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        conversations:
                            replaceConversationSummary(
                                currentState.conversations,
                                result.conversation,
                            ),

                        selectedConversation:
                            result.conversation,

                        messages: [
                            result.initialMessage,
                        ],

                        isCreating: false,
                        isEmpty: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            CONVERSATION_SAFE_MESSAGES.created,
                    }),
                );

                return result;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.createError,
                );

                throw new Error(
                    CONVERSATION_SAFE_MESSAGES.createError,
                );
            }
        },
        [setError],
    );

    const updateConversation = useCallback(
        async (
            conversationPublicId: string,
            payload: UpdateConversationPayload,
        ): Promise<UpdateConversationResult> => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "updating",
                    isUpdating: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await conversationsApi.updateConversation(
                        conversationPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        conversations:
                            replaceConversationSummary(
                                currentState.conversations,
                                result.conversation,
                            ),

                        selectedConversation:
                            result.conversation,

                        isUpdating: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            CONVERSATION_SAFE_MESSAGES.updated,
                    }),
                );

                return result;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.updateError,
                );

                throw new Error(
                    CONVERSATION_SAFE_MESSAGES.updateError,
                );
            }
        },
        [setError],
    );

    const closeConversation = useCallback(
        async (
            conversationPublicId: string,
            payload: CloseConversationPayload,
        ): Promise<CloseConversationResult> => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "closing",
                    isClosing: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await conversationsApi.closeConversation(
                        conversationPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        conversations:
                            replaceConversationSummary(
                                currentState.conversations,
                                result.conversation,
                            ),

                        selectedConversation:
                            result.conversation,

                        isClosing: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            CONVERSATION_SAFE_MESSAGES.closed,
                    }),
                );

                return result;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.closeError,
                );

                throw new Error(
                    CONVERSATION_SAFE_MESSAGES.closeError,
                );
            }
        },
        [setError],
    );

    const sendMessage = useCallback(
        async (
            conversationPublicId: string,
            payload: SendMessagePayload,
        ): Promise<SendMessageResult> => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "sending",
                    isSending: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await conversationsApi.sendMessage(
                        conversationPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        conversations:
                            replaceConversationSummary(
                                currentState.conversations,
                                result.conversation,
                            ),

                        selectedConversation:
                            result.conversation,

                        messages: replaceMessage(
                            currentState.messages,
                            result.message,
                        ),

                        isSending: false,

                        errorMessage: null,
                        successMessage:
                            CONVERSATION_SAFE_MESSAGES.sent,
                    }),
                );

                return result;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.sendError,
                );

                throw new Error(
                    CONVERSATION_SAFE_MESSAGES.sendError,
                );
            }
        },
        [setError],
    );

    const markConversationRead = useCallback(
        async (
            conversationPublicId: string,
        ): Promise<MarkConversationReadResult> => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    requestState: "marking_read",
                    isMarkingRead: true,

                    errorMessage: null,
                }),
            );

            try {
                const result =
                    await conversationsApi.markConversationRead(
                        conversationPublicId,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        requestState: "success",

                        conversations:
                            currentState.conversations.map(
                                (
                                    conversation: ConversationSummary,
                                ): ConversationSummary =>
                                    conversation.conversationPublicId ===
                                        result.conversationPublicId
                                        ? {
                                            ...conversation,
                                            unreadMessageCount:
                                                result.unreadMessageCount,
                                            hasUnreadMessages:
                                                result.unreadMessageCount > 0,
                                        }
                                        : conversation,
                            ),

                        unreadConversationCount:
                            Math.max(
                                0,
                                currentState
                                    .unreadConversationCount - 1,
                            ),

                        isMarkingRead: false,
                        errorMessage: null,
                    }),
                );

                return result;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.markReadError,
                );

                throw new Error(
                    CONVERSATION_SAFE_MESSAGES.markReadError,
                );
            }
        },
        [setError],
    );

    const markMessageRead = useCallback(
        async (
            messagePublicId: string,
        ): Promise<MarkMessageReadResult> => {
            try {
                const result =
                    await conversationsApi.markMessageRead(
                        messagePublicId,
                    );

                setHookState(
                    (
                        currentState: ConversationsHookState,
                    ): ConversationsHookState => ({
                        ...currentState,

                        messages: replaceMessage(
                            currentState.messages,
                            result.message,
                        ),

                        unreadMessageCount: Math.max(
                            0,
                            currentState.unreadMessageCount -
                            1,
                        ),
                    }),
                );

                return result;
            } catch {
                setError(
                    CONVERSATION_SAFE_MESSAGES.markReadError,
                );

                throw new Error(
                    CONVERSATION_SAFE_MESSAGES.markReadError,
                );
            }
        },
        [setError],
    );

    const setFilters = useCallback(
        (
            filters: Partial<ConversationFilters>,
        ): void => {
            const filterKeys: string[] =
                Object.keys(filters);

            const changesSearchCriteria =
                filterKeys.some(
                    (key: string): boolean =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: ConversationFilters = {
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
        (filters: ConversationFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters: ConversationFilters = {
            ...DEFAULT_CONVERSATION_FILTERS,
        };

        applyFilters(nextFilters);
    }, [applyFilters]);

    const clearSelectedConversation =
        useCallback((): void => {
            setHookState(
                (
                    currentState: ConversationsHookState,
                ): ConversationsHookState => ({
                    ...currentState,

                    selectedConversation: null,
                    messages: [],
                    messagePagination: null,
                }),
            );
        }, []);

    const clearMessages = useCallback((): void => {
        setHookState(
            (
                currentState: ConversationsHookState,
            ): ConversationsHookState => ({
                ...currentState,
                messages: [],
                messagePagination: null,
            }),
        );
    }, []);

    const clearFeedback = useCallback((): void => {
        setHookState(
            (
                currentState: ConversationsHookState,
            ): ConversationsHookState => ({
                ...currentState,
                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_CONVERSATION_FILTERS,
        };

        setHookState({
            ...INITIAL_CONVERSATIONS_STATE,

            filters: {
                ...DEFAULT_CONVERSATION_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadConversations,
        refreshConversations,
        loadConversation,
        loadMessages,

        createConversation,
        updateConversation,
        closeConversation,
        sendMessage,

        markConversationRead,
        markMessageRead,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedConversation,
        clearMessages,
        clearFeedback,
        reset,
    };
}