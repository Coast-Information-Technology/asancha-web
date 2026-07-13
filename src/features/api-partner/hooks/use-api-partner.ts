"use client";

// File: src/features/api-partner/hooks/use-api-partner.ts

/**
 * Asancha API Partner Hook
 *
 * Purpose:
 * Provides API-partner application, dashboard, API-key, usage, webhook, and
 * request state for the public partner workspace.
 *
 * Security notes:
 * - Full API keys and webhook secrets are stored only in temporary component
 *   memory after creation.
 * - Call clearRevealedApiKey and clearRevealedWebhookSecret when leaving their
 *   reveal screens.
 * - Never persist full keys or webhook secrets in localStorage, sessionStorage,
 *   cookies, URLs, analytics, logs, or global stores.
 */

import {
    useCallback,
    useState,
} from "react";

import { apiPartnerApi } from "../api/api-partner.api";
import { API_PARTNER_SAFE_MESSAGES } from "../constants/api-partner.constants";
import type {
    ApiClientSummary,
    ApiKeySummary,
    ApiPartnerApplicationDetail,
    ApiPartnerDashboard,
    ApiPartnerHookState,
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
    UseApiPartnerResult,
} from "../types/api-partner.types";

const INITIAL_API_PARTNER_STATE: ApiPartnerHookState = {
    requestState: "idle",

    dashboard: null,
    application: null,
    client: null,

    apiKeys: [],
    revealedApiKey: null,

    usage: null,

    webhooks: [],
    selectedWebhook: null,
    revealedWebhookSecret: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isSubmittingApplication: false,
    isUpdatingApplication: false,
    isCreatingKey: false,
    isRevokingKey: false,
    isCreatingWebhook: false,
    isUpdatingWebhook: false,
    isDeletingWebhook: false,
};

function replaceApiKey(
    apiKeys: ApiKeySummary[],
    apiKey: ApiKeySummary,
): ApiKeySummary[] {
    const exists = apiKeys.some(
        (currentApiKey: ApiKeySummary): boolean =>
            currentApiKey.apiKeyPublicId ===
            apiKey.apiKeyPublicId,
    );

    if (!exists) {
        return [apiKey, ...apiKeys];
    }

    return apiKeys.map(
        (currentApiKey: ApiKeySummary): ApiKeySummary =>
            currentApiKey.apiKeyPublicId ===
                apiKey.apiKeyPublicId
                ? apiKey
                : currentApiKey,
    );
}

function replaceWebhook(
    webhooks: ApiWebhookSummary[],
    webhook: ApiWebhookSummary,
): ApiWebhookSummary[] {
    const exists = webhooks.some(
        (currentWebhook: ApiWebhookSummary): boolean =>
            currentWebhook.webhookPublicId ===
            webhook.webhookPublicId,
    );

    if (!exists) {
        return [webhook, ...webhooks];
    }

    return webhooks.map(
        (currentWebhook: ApiWebhookSummary): ApiWebhookSummary =>
            currentWebhook.webhookPublicId ===
                webhook.webhookPublicId
                ? webhook
                : currentWebhook,
    );
}

export function useApiPartner(): UseApiPartnerResult {
    const [hookState, setHookState] =
        useState<ApiPartnerHookState>(
            INITIAL_API_PARTNER_STATE,
        );

    const setError = useCallback(
        (message: string): void => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "error",

                    errorMessage: message,
                    successMessage: null,

                    isLoading: false,
                    isRefreshing: false,
                    isSubmittingApplication: false,
                    isUpdatingApplication: false,
                    isCreatingKey: false,
                    isRevokingKey: false,
                    isCreatingWebhook: false,
                    isUpdatingWebhook: false,
                    isDeletingWebhook: false,
                }),
            );
        },
        [],
    );

    const loadDashboard = useCallback(
        async (): Promise<ApiPartnerDashboard | null> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "loading",
                    isLoading: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const dashboard =
                    await apiPartnerApi.getDashboard();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        dashboard,
                        client: dashboard.client,
                        apiKeys: dashboard.apiKeys,
                        usage: dashboard.usage,
                        webhooks: dashboard.webhooks,

                        isLoading: false,
                        errorMessage: null,
                    }),
                );

                return dashboard;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .dashboardLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const refreshDashboard = useCallback(
        async (): Promise<ApiPartnerDashboard | null> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "refreshing",
                    isRefreshing: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const dashboard =
                    await apiPartnerApi.getDashboard();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        dashboard,
                        client: dashboard.client,
                        apiKeys: dashboard.apiKeys,
                        usage: dashboard.usage,
                        webhooks: dashboard.webhooks,

                        isRefreshing: false,
                        errorMessage: null,
                    }),
                );

                return dashboard;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .dashboardLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const loadApplication = useCallback(
        async (): Promise<ApiPartnerApplicationDetail | null> => {
            try {
                const application =
                    await apiPartnerApi.getApplication();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,
                        application,
                        errorMessage: null,
                    }),
                );

                return application;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .applicationLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const submitApplication = useCallback(
        async (
            payload: SubmitApiPartnerApplicationPayload,
        ): Promise<SubmitApiPartnerApplicationResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState:
                        "submitting_application",

                    isSubmittingApplication: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.submitApplication(
                        payload,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        application: result.application,

                        isSubmittingApplication: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            API_PARTNER_SAFE_MESSAGES
                                .applicationSubmitted,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .applicationSubmitError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .applicationSubmitError,
                );
            }
        },
        [setError],
    );

    const updateApplication = useCallback(
        async (
            payload: UpdateApiPartnerApplicationPayload,
        ): Promise<UpdateApiPartnerApplicationResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState:
                        "updating_application",

                    isUpdatingApplication: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.updateApplication(
                        payload,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        application: result.application,

                        isUpdatingApplication: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            API_PARTNER_SAFE_MESSAGES
                                .applicationUpdated,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .applicationUpdateError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .applicationUpdateError,
                );
            }
        },
        [setError],
    );

    const loadClient = useCallback(
        async (): Promise<ApiClientSummary | null> => {
            try {
                const client =
                    await apiPartnerApi.getClient();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,
                        client,
                        errorMessage: null,
                    }),
                );

                return client;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .dashboardLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const loadApiKeys = useCallback(
        async (): Promise<ApiKeySummary[]> => {
            try {
                const apiKeys =
                    await apiPartnerApi.getApiKeys();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,
                        apiKeys,
                        errorMessage: null,
                    }),
                );

                return apiKeys;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES.keyLoadError,
                );

                return [];
            }
        },
        [setError],
    );

    const createApiKey = useCallback(
        async (
            payload: CreateApiKeyPayload,
        ): Promise<CreateApiKeyResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "creating_key",
                    isCreatingKey: true,

                    revealedApiKey: null,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.createApiKey(
                        payload,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        apiKeys: replaceApiKey(
                            currentState.apiKeys,
                            result.apiKey,
                        ),

                        revealedApiKey: result.fullKey,

                        isCreatingKey: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            API_PARTNER_SAFE_MESSAGES
                                .keyCreated,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .keyCreateError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .keyCreateError,
                );
            }
        },
        [setError],
    );

    const revokeApiKey = useCallback(
        async (
            apiKeyPublicId: string,
            payload: RevokeApiKeyPayload,
        ): Promise<RevokeApiKeyResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "revoking_key",
                    isRevokingKey: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.revokeApiKey(
                        apiKeyPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        apiKeys: replaceApiKey(
                            currentState.apiKeys,
                            result.apiKey,
                        ),

                        isRevokingKey: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            API_PARTNER_SAFE_MESSAGES
                                .keyRevoked,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .keyRevokeError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .keyRevokeError,
                );
            }
        },
        [setError],
    );

    const clearRevealedApiKey =
        useCallback((): void => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,
                    revealedApiKey: null,
                }),
            );
        }, []);

    const loadUsage = useCallback(
        async (): Promise<ApiUsageSummary | null> => {
            try {
                const usage =
                    await apiPartnerApi.getUsage();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,
                        usage,
                        errorMessage: null,
                    }),
                );

                return usage;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .usageLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const loadWebhooks = useCallback(
        async (): Promise<ApiWebhookSummary[]> => {
            try {
                const webhooks =
                    await apiPartnerApi.getWebhooks();

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,
                        webhooks,
                        errorMessage: null,
                    }),
                );

                return webhooks;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookLoadError,
                );

                return [];
            }
        },
        [setError],
    );

    const loadWebhook = useCallback(
        async (
            webhookPublicId: string,
        ): Promise<ApiWebhookDetail | null> => {
            try {
                const webhook =
                    await apiPartnerApi.getWebhook(
                        webhookPublicId,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,
                        selectedWebhook: webhook,
                        errorMessage: null,
                    }),
                );

                return webhook;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const createWebhook = useCallback(
        async (
            payload: CreateApiWebhookPayload,
        ): Promise<CreateApiWebhookResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "creating_webhook",
                    isCreatingWebhook: true,

                    revealedWebhookSecret: null,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.createWebhook(
                        payload,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        webhooks: replaceWebhook(
                            currentState.webhooks,
                            result.webhook,
                        ),

                        selectedWebhook: result.webhook,

                        revealedWebhookSecret:
                            result.webhookSigningSecret,

                        isCreatingWebhook: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            API_PARTNER_SAFE_MESSAGES
                                .webhookCreated,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookCreateError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookCreateError,
                );
            }
        },
        [setError],
    );

    const updateWebhook = useCallback(
        async (
            webhookPublicId: string,
            payload: UpdateApiWebhookPayload,
        ): Promise<UpdateApiWebhookResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "updating_webhook",
                    isUpdatingWebhook: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.updateWebhook(
                        webhookPublicId,
                        payload,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        webhooks: replaceWebhook(
                            currentState.webhooks,
                            result.webhook,
                        ),

                        selectedWebhook: result.webhook,

                        isUpdatingWebhook: false,

                        errorMessage: null,
                        successMessage:
                            result.message ||
                            API_PARTNER_SAFE_MESSAGES
                                .webhookUpdated,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookUpdateError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookUpdateError,
                );
            }
        },
        [setError],
    );

    const deleteWebhook = useCallback(
        async (
            webhookPublicId: string,
        ): Promise<DeleteApiWebhookResult> => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,

                    requestState: "deleting_webhook",
                    isDeletingWebhook: true,

                    errorMessage: null,
                    successMessage: null,
                }),
            );

            try {
                const result =
                    await apiPartnerApi.deleteWebhook(
                        webhookPublicId,
                    );

                setHookState(
                    (
                        currentState: ApiPartnerHookState,
                    ): ApiPartnerHookState => ({
                        ...currentState,

                        requestState: "success",

                        webhooks:
                            currentState.webhooks.filter(
                                (
                                    webhook: ApiWebhookSummary,
                                ): boolean =>
                                    webhook.webhookPublicId !==
                                    result.webhookPublicId,
                            ),

                        selectedWebhook:
                            currentState.selectedWebhook
                                ?.webhookPublicId ===
                                result.webhookPublicId
                                ? null
                                : currentState.selectedWebhook,

                        isDeletingWebhook: false,

                        errorMessage: null,
                        successMessage:
                            API_PARTNER_SAFE_MESSAGES
                                .webhookDeleted,
                    }),
                );

                return result;
            } catch {
                setError(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookDeleteError,
                );

                throw new Error(
                    API_PARTNER_SAFE_MESSAGES
                        .webhookDeleteError,
                );
            }
        },
        [setError],
    );

    const clearRevealedWebhookSecret =
        useCallback((): void => {
            setHookState(
                (
                    currentState: ApiPartnerHookState,
                ): ApiPartnerHookState => ({
                    ...currentState,
                    revealedWebhookSecret: null,
                }),
            );
        }, []);

    const clearFeedback = useCallback((): void => {
        setHookState(
            (
                currentState: ApiPartnerHookState,
            ): ApiPartnerHookState => ({
                ...currentState,
                errorMessage: null,
                successMessage: null,
            }),
        );
    }, []);

    const reset = useCallback((): void => {
        setHookState(INITIAL_API_PARTNER_STATE);
    }, []);

    return {
        ...hookState,

        loadDashboard,
        refreshDashboard,

        loadApplication,
        submitApplication,
        updateApplication,

        loadClient,

        loadApiKeys,
        createApiKey,
        revokeApiKey,
        clearRevealedApiKey,

        loadUsage,

        loadWebhooks,
        loadWebhook,
        createWebhook,
        updateWebhook,
        deleteWebhook,
        clearRevealedWebhookSecret,

        clearFeedback,
        reset,
    };
}