// File: src/features/conversations/api/conversations.api.ts

/**
 * Asancha Conversations API
 *
 * Purpose:
 * Provides typed authenticated API functions for current-user conversations
 * and messages.
 *
 * Security notes:
 * - This module must not call staff/admin conversation endpoints.
 * - Participant checks, message sanitisation, visibility, and lifecycle
 *   enforcement remain backend-controlled.
 */

import {
    authApiGet,
    authApiPatch,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { CONVERSATIONS_API_ENDPOINTS } from "../constants/conversations.constants";
import type {
    CloseConversationPayload,
    CloseConversationResult,
    ConversationCollection,
    ConversationDetail,
    ConversationFilters,
    ConversationQuery,
    CreateConversationPayload,
    CreateConversationResult,
    MarkConversationReadPayload,
    MarkConversationReadResult,
    MarkMessageReadPayload,
    MarkMessageReadResult,
    MessageCollection,
    SendMessagePayload,
    SendMessageResult,
    UpdateConversationPayload,
    UpdateConversationResult,
} from "../types/conversations.types";

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

function createConversationQueryString(
    query:
        | ConversationQuery
        | Partial<ConversationFilters>,
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
        "conversationTypes",
        query.conversationTypes,
    );

    appendStringArray(
        searchParams,
        "priorities",
        query.priorities,
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

    appendBoolean(
        searchParams,
        "unreadOnly",
        query.unreadOnly ?? undefined,
    );

    appendBoolean(
        searchParams,
        "openOnly",
        query.openOnly ?? undefined,
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

async function getConversations(
    query:
        | ConversationQuery
        | Partial<ConversationFilters> = {},
): Promise<ConversationCollection> {
    const queryString =
        createConversationQueryString(query);

    return authApiGet<ConversationCollection>(
        `${CONVERSATIONS_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getConversation(
    conversationPublicId: string,
): Promise<ConversationDetail> {
    return authApiGet<ConversationDetail>(
        CONVERSATIONS_API_ENDPOINTS.conversation(
            conversationPublicId,
        ),
    );
}

async function getMessages(
    conversationPublicId: string,
    page = 1,
    pageSize = 50,
): Promise<MessageCollection> {
    const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    return authApiGet<MessageCollection>(
        `${CONVERSATIONS_API_ENDPOINTS.messages(
            conversationPublicId,
        )}?${searchParams.toString()}`,
    );
}

async function createConversation(
    payload: CreateConversationPayload,
): Promise<CreateConversationResult> {
    return authApiPost<CreateConversationResult>(
        CONVERSATIONS_API_ENDPOINTS.create,
        payload,
    );
}

async function updateConversation(
    conversationPublicId: string,
    payload: UpdateConversationPayload,
): Promise<UpdateConversationResult> {
    return authApiPatch<UpdateConversationResult>(
        CONVERSATIONS_API_ENDPOINTS.conversation(
            conversationPublicId,
        ),
        payload,
    );
}

async function closeConversation(
    conversationPublicId: string,
    payload: CloseConversationPayload,
): Promise<CloseConversationResult> {
    return authApiPost<CloseConversationResult>(
        CONVERSATIONS_API_ENDPOINTS.close(
            conversationPublicId,
        ),
        payload,
    );
}

async function sendMessage(
    conversationPublicId: string,
    payload: SendMessagePayload,
): Promise<SendMessageResult> {
    return authApiPost<SendMessageResult>(
        CONVERSATIONS_API_ENDPOINTS.messages(
            conversationPublicId,
        ),
        payload,
    );
}

async function markConversationRead(
    conversationPublicId: string,
): Promise<MarkConversationReadResult> {
    const payload: MarkConversationReadPayload = {
        data: {
            readAt: null,
        },
    };

    return authApiPost<MarkConversationReadResult>(
        CONVERSATIONS_API_ENDPOINTS.markRead(
            conversationPublicId,
        ),
        payload,
    );
}

async function markMessageRead(
    messagePublicId: string,
): Promise<MarkMessageReadResult> {
    const payload: MarkMessageReadPayload = {
        data: {
            readAt: null,
        },
    };

    return authApiPost<MarkMessageReadResult>(
        CONVERSATIONS_API_ENDPOINTS.messageRead(
            messagePublicId,
        ),
        payload,
    );
}

export const conversationsApi = {
    getConversations,
    getConversation,
    getMessages,
    createConversation,
    updateConversation,
    closeConversation,
    sendMessage,
    markConversationRead,
    markMessageRead,
} as const;