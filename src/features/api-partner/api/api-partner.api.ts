// File: src/features/api-partner/api/api-partner.api.ts

/**
 * Asancha API Partner API
 *
 * Purpose:
 * Provides authenticated API functions for the API-partner application and
 * approved partner workspace.
 *
 * Security notes:
 * - This module must not call admin API-access endpoints.
 * - Full keys and webhook secrets must only be handled from one-time creation
 *   responses.
 * - Backend approval, scope, plan, payment, client, environment, and
 *   subscription enforcement remains final.
 */

import {
    authApiDelete,
    authApiGet,
    authApiPatch,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { API_PARTNER_API_ENDPOINTS } from "../constants/api-partner.constants";
import type {
    ApiClientSummary,
    ApiKeySummary,
    ApiPartnerApplicationDetail,
    ApiPartnerDashboard,
    ApiUsageSummary,
    ApiWebhookDetail,
    ApiWebhookSummary,
    CreateApiKeyPayload,
    CreateApiKeyResult,
    CreateApiWebhookPayload,
    CreateApiWebhookResult,
    DeleteApiWebhookResult,
    RevokeApiKeyPayload,
    RevokeApiKeyResult,
    SubmitApiPartnerApplicationPayload,
    SubmitApiPartnerApplicationResult,
    UpdateApiPartnerApplicationPayload,
    UpdateApiPartnerApplicationResult,
    UpdateApiWebhookPayload,
    UpdateApiWebhookResult,
} from "../types/api-partner.types";

async function getDashboard(): Promise<ApiPartnerDashboard> {
    return authApiGet<ApiPartnerDashboard>(
        API_PARTNER_API_ENDPOINTS.dashboard,
    );
}

async function getApplication(): Promise<ApiPartnerApplicationDetail> {
    return authApiGet<ApiPartnerApplicationDetail>(
        API_PARTNER_API_ENDPOINTS.application,
    );
}

async function submitApplication(
    payload: SubmitApiPartnerApplicationPayload,
): Promise<SubmitApiPartnerApplicationResult> {
    return authApiPost<SubmitApiPartnerApplicationResult>(
        API_PARTNER_API_ENDPOINTS.submitApplication,
        payload,
    );
}

async function updateApplication(
    payload: UpdateApiPartnerApplicationPayload,
): Promise<UpdateApiPartnerApplicationResult> {
    return authApiPatch<UpdateApiPartnerApplicationResult>(
        API_PARTNER_API_ENDPOINTS.application,
        payload,
    );
}

async function getClient(): Promise<ApiClientSummary> {
    return authApiGet<ApiClientSummary>(
        API_PARTNER_API_ENDPOINTS.client,
    );
}

async function getApiKeys(): Promise<ApiKeySummary[]> {
    return authApiGet<ApiKeySummary[]>(
        API_PARTNER_API_ENDPOINTS.keys,
    );
}

async function createApiKey(
    payload: CreateApiKeyPayload,
): Promise<CreateApiKeyResult> {
    return authApiPost<CreateApiKeyResult>(
        API_PARTNER_API_ENDPOINTS.apiClients,
        payload,
    );
}

async function revokeApiKey(
    apiKeyPublicId: string,
    payload: RevokeApiKeyPayload,
): Promise<RevokeApiKeyResult> {
    return authApiPost<RevokeApiKeyResult>(
        API_PARTNER_API_ENDPOINTS.revokeKey(
            apiKeyPublicId,
        ),
        payload,
    );
}

async function getUsage(): Promise<ApiUsageSummary> {
    return authApiGet<ApiUsageSummary>(
        API_PARTNER_API_ENDPOINTS.usage,
    );
}

async function getWebhooks(): Promise<ApiWebhookSummary[]> {
    return authApiGet<ApiWebhookSummary[]>(
        API_PARTNER_API_ENDPOINTS.webhooks,
    );
}

async function getWebhook(
    webhookPublicId: string,
): Promise<ApiWebhookDetail> {
    return authApiGet<ApiWebhookDetail>(
        API_PARTNER_API_ENDPOINTS.webhook(
            webhookPublicId,
        ),
    );
}

async function createWebhook(
    payload: CreateApiWebhookPayload,
): Promise<CreateApiWebhookResult> {
    return authApiPost<CreateApiWebhookResult>(
        API_PARTNER_API_ENDPOINTS.webhooks,
        payload,
    );
}

async function updateWebhook(
    webhookPublicId: string,
    payload: UpdateApiWebhookPayload,
): Promise<UpdateApiWebhookResult> {
    return authApiPatch<UpdateApiWebhookResult>(
        API_PARTNER_API_ENDPOINTS.webhook(
            webhookPublicId,
        ),
        payload,
    );
}

async function deleteWebhook(
    webhookPublicId: string,
): Promise<DeleteApiWebhookResult> {
    return authApiDelete<DeleteApiWebhookResult>(
        API_PARTNER_API_ENDPOINTS.webhook(
            webhookPublicId,
        ),
    );
}

export const apiPartnerApi = {
    getDashboard,

    getApplication,
    submitApplication,
    updateApplication,

    getClient,

    getApiKeys,
    createApiKey,
    revokeApiKey,

    getUsage,

    getWebhooks,
    getWebhook,
    createWebhook,
    updateWebhook,
    deleteWebhook,
} as const;
