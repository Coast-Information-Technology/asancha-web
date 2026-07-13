// File: src/features/api-partner/types/api-partner.types.ts

/**
 * Asancha API Partner Types
 *
 * Purpose:
 * Defines public API-partner application, dashboard, client, plan,
 * subscription, API-key, usage, webhook, billing, and support contracts.
 *
 * Responsibilities:
 * - Define controlled API-partner application values and states.
 * - Define safe API-client and scope metadata.
 * - Define API-key creation, listing, and revocation contracts.
 * - Define API usage summaries.
 * - Define webhook configuration contracts.
 * - Define API-partner dashboard state and actions.
 *
 * Security notes:
 * - API partners do not use ordinary public signup.
 * - Full API keys may be returned only once during creation.
 * - API-key hashes, webhook-secret hashes, internal infrastructure values,
 *   private Swagger routes, admin routes, internal notes, private risk data,
 *   provider secrets, and MongoDB ObjectIds must never be exposed.
 * - API access remains subject to backend approval, plan, subscription,
 *   payment, scope, verification, policy, status, and rate-limit checks.
 */

export type ApiPartnerApplicationStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "more_information_required"
    | "on_hold"
    | "approved"
    | "rejected"
    | "withdrawn"
    | "cancelled";

export type ApiClientStatus =
    | "pending"
    | "active"
    | "suspended"
    | "inactive"
    | "revoked";

export type ApiEnvironment =
    | "sandbox"
    | "production";

export type ApiSubscriptionStatus =
    | "not_started"
    | "pending_payment"
    | "active"
    | "past_due"
    | "suspended"
    | "cancelled"
    | "expired";

export type ApiKeyStatus =
    | "active"
    | "revoked"
    | "expired"
    | "suspended";

export type ApiWebhookStatus =
    | "active"
    | "inactive"
    | "disabled"
    | "failing";

export type ApiWebhookDeliveryStatus =
    | "pending"
    | "delivered"
    | "failed"
    | "retrying"
    | "cancelled";

export type ApiPartnerVerificationStatus =
    | "not_started"
    | "pending"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required";

export type ApiPartnerScope =
    | "listings:read"
    | "listings:write"
    | "properties:read"
    | "properties:write"
    | "valuations:read"
    | "bmv:analyze"
    | "reservations:read"
    | "reservations:write"
    | "webhooks:manage"
    | "ai:property-summary"
    | "ai:bmv-analysis"
    | "ai:deal-score"
    | "ai:valuation-summary"
    | "ai:matching"
    | "ai:refurb-estimate"
    | "ai:recommendations";

export type ApiWebhookEvent =
    | "listing.published"
    | "listing.updated"
    | "listing.withdrawn"
    | "reservation.confirmed"
    | "reservation.cancelled"
    | "reservation.expired"
    | "payment.approved"
    | "api_partner.usage_limit_warning";

export type ApiPartnerRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "submitting_application"
    | "updating_application"
    | "creating_key"
    | "revoking_key"
    | "creating_webhook"
    | "updating_webhook"
    | "deleting_webhook"
    | "success"
    | "empty"
    | "error";

export interface ApiPartnerCompanyDetails {
    companyName: string;
    companyRegistrationNumber: string;
    companyWebsite: string;
    country: string;
    registeredAddress: string;
}

export interface ApiPartnerContactDetails {
    businessContactName: string;
    businessContactEmail: string;
    businessContactPhone: string | null;

    technicalContactName: string;
    technicalContactEmail: string;
    technicalContactPhone: string | null;
}

export interface ApiPartnerApplicationValues {
    company: ApiPartnerCompanyDetails;
    contacts: ApiPartnerContactDetails;

    businessUseCase: string;
    integrationDescription: string;
    intendedUsers: string;
    estimatedMonthlyCalls: number;

    requestedScopes: ApiPartnerScope[];
    requestedPlanCode: string | null;

    sandboxRequired: boolean;
    productionAccessRequested: boolean;

    privacyPolicyUrl: string | null;
    termsUrl: string | null;

    dataProtectionConfirmed: true;
    securityResponsibilityConfirmed: true;
    partnerTermsAccepted: true;
    informationAccurateConfirmed: true;
}

export type SubmitApiPartnerApplicationPayload =
    Record<string, unknown> & {
        data: ApiPartnerApplicationValues;
    };

export type UpdateApiPartnerApplicationPayload =
    Record<string, unknown> & {
        data: Partial<ApiPartnerApplicationValues>;
    };

export interface ApiPartnerApplicationSummary {
    applicationPublicId: string;
    applicationReference: string;

    companyName: string;
    companyWebsite: string;
    country: string;

    status: ApiPartnerApplicationStatus;
    verificationStatus: ApiPartnerVerificationStatus;

    requestedScopes: ApiPartnerScope[];
    approvedScopes: ApiPartnerScope[];

    requestedPlanCode: string | null;
    approvedPlanCode: string | null;

    safeUserMessage: string | null;
    nextActionLabel: string | null;
    nextActionPath: string | null;

    canEdit: boolean;
    canSubmit: boolean;
    canWithdraw: boolean;

    submittedAt: string | null;
    reviewedAt: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface ApiPartnerApplicationDetail
    extends ApiPartnerApplicationSummary {
    company: ApiPartnerCompanyDetails;
    contacts: ApiPartnerContactDetails;

    businessUseCase: string;
    integrationDescription: string;
    intendedUsers: string;
    estimatedMonthlyCalls: number;

    sandboxRequired: boolean;
    productionAccessRequested: boolean;

    privacyPolicyUrl: string | null;
    termsUrl: string | null;

    requiredDocumentCount: number;
    submittedDocumentCount: number;
    approvedDocumentCount: number;

    correctionItems: Array<{
        correctionKey: string;
        title: string;
        message: string;
        actionLabel: string | null;
        actionPath: string | null;
        resolved: boolean;
    }>;
}

export interface SubmitApiPartnerApplicationResult {
    application: ApiPartnerApplicationDetail;
    submitted: true;
    nextPath: string;
    message: string;
}

export interface UpdateApiPartnerApplicationResult {
    application: ApiPartnerApplicationDetail;
    updated: true;
    message: string;
}

export interface ApiPlanSummary {
    apiPlanPublicId: string;
    code: string;
    name: string;
    description: string | null;

    monthlyPrice: number;
    currency: "GBP";

    monthlyRequestLimit: number | null;
    allowedScopes: ApiPartnerScope[];
    features: string[];

    active: boolean;
}

export interface ApiSubscriptionSummary {
    subscriptionPublicId: string | null;

    status: ApiSubscriptionStatus;
    plan: ApiPlanSummary | null;

    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;

    paymentPublicId: string | null;
    paymentReference: string | null;
    paymentStatus: string | null;

    nextActionLabel: string | null;
    nextActionPath: string | null;
}

export interface ApiClientSummary {
    apiClientPublicId: string;
    name: string;

    status: ApiClientStatus;
    verificationStatus: ApiPartnerVerificationStatus;

    requestedScopes: ApiPartnerScope[];
    approvedScopes: ApiPartnerScope[];

    sandboxEnabled: boolean;
    productionEnabled: boolean;

    subscription: ApiSubscriptionSummary | null;

    canCreateApiKey: boolean;
    canCreateWebhook: boolean;
    canUseSandbox: boolean;
    canUseProduction: boolean;

    safeUserMessage: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface ApiKeySummary {
    apiKeyPublicId: string;
    apiClientPublicId: string;

    name: string;
    keyPrefix: string;

    environment: ApiEnvironment;
    scopes: ApiPartnerScope[];
    status: ApiKeyStatus;

    lastUsedAt: string | null;
    expiresAt: string | null;

    canRevoke: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface CreateApiKeyValues {
    name: string;
    environment: ApiEnvironment;
    scopes: ApiPartnerScope[];
    expiresAt: string | null;

    keySecurityAcknowledged: true;
}

export type CreateApiKeyPayload =
    Record<string, unknown> & {
        data: CreateApiKeyValues;
    };

export interface CreateApiKeyResult {
    apiKey: ApiKeySummary;

    fullKey: string;
    shownOnce: true;

    message: string;
}

export interface RevokeApiKeyValues {
    reason: string;
    revocationConfirmed: true;
}

export type RevokeApiKeyPayload =
    Record<string, unknown> & {
        data: RevokeApiKeyValues;
    };

export interface RevokeApiKeyResult {
    apiKey: ApiKeySummary;
    revoked: true;
    message: string;
}

export interface ApiUsagePeriod {
    period: string;

    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;

    requestLimit: number | null;
    remainingRequests: number | null;
    usagePercent: number | null;

    byScope: Partial<Record<ApiPartnerScope, number>>;
    byStatus: Record<string, number>;
}

export interface ApiUsageSummary {
    apiClientPublicId: string;

    currentPeriod: ApiUsagePeriod;
    previousPeriods: ApiUsagePeriod[];

    warningMessage: string | null;
    limitReached: boolean;
}

export interface ApiWebhookSummary {
    webhookPublicId: string;
    apiClientPublicId: string;

    url: string;
    events: ApiWebhookEvent[];

    environment: ApiEnvironment;
    status: ApiWebhookStatus;

    lastDeliveryAt: string | null;
    lastDeliveryStatus: ApiWebhookDeliveryStatus | null;

    failureCount: number;

    canEdit: boolean;
    canDelete: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface ApiWebhookDetail
    extends ApiWebhookSummary {
    safeUserMessage: string | null;

    recentDeliveries: Array<{
        deliveryPublicId: string;
        event: ApiWebhookEvent;
        status: ApiWebhookDeliveryStatus;
        responseStatusCode: number | null;
        attemptCount: number;
        deliveredAt: string | null;
        createdAt: string;
    }>;
}

export interface CreateApiWebhookValues {
    url: string;
    events: ApiWebhookEvent[];
    environment: ApiEnvironment;

    webhookSecurityAcknowledged: true;
}

export type CreateApiWebhookPayload =
    Record<string, unknown> & {
        data: CreateApiWebhookValues;
    };

export type UpdateApiWebhookPayload =
    Record<string, unknown> & {
        data: Partial<CreateApiWebhookValues>;
    };

export interface CreateApiWebhookResult {
    webhook: ApiWebhookDetail;

    webhookSigningSecret: string;
    shownOnce: true;

    message: string;
}

export interface UpdateApiWebhookResult {
    webhook: ApiWebhookDetail;
    updated: true;
    message: string;
}

export interface DeleteApiWebhookResult {
    webhookPublicId: string;
    deleted: true;
}

export interface ApiPartnerDashboard {
    application: ApiPartnerApplicationSummary | null;
    client: ApiClientSummary | null;

    availablePlans: ApiPlanSummary[];

    apiKeys: ApiKeySummary[];
    usage: ApiUsageSummary | null;
    webhooks: ApiWebhookSummary[];

    applicationRequired: boolean;
    applicationApproved: boolean;

    apiKeysLocked: boolean;
    webhooksLocked: boolean;
    productionLocked: boolean;

    pendingActionCount: number;

    safeUserMessage: string | null;

    nextActions: Array<{
        actionKey: string;
        title: string;
        description: string | null;
        path: string | null;
        allowed: boolean;
        lockedReason: string | null;
    }>;
}

export interface ApiPartnerHookState {
    requestState: ApiPartnerRequestState;

    dashboard: ApiPartnerDashboard | null;
    application: ApiPartnerApplicationDetail | null;
    client: ApiClientSummary | null;

    apiKeys: ApiKeySummary[];
    revealedApiKey: string | null;

    usage: ApiUsageSummary | null;

    webhooks: ApiWebhookSummary[];
    selectedWebhook: ApiWebhookDetail | null;
    revealedWebhookSecret: string | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isSubmittingApplication: boolean;
    isUpdatingApplication: boolean;
    isCreatingKey: boolean;
    isRevokingKey: boolean;
    isCreatingWebhook: boolean;
    isUpdatingWebhook: boolean;
    isDeletingWebhook: boolean;
}

export interface ApiPartnerHookActions {
    loadDashboard: () => Promise<ApiPartnerDashboard | null>;

    refreshDashboard: () => Promise<ApiPartnerDashboard | null>;

    loadApplication: () => Promise<ApiPartnerApplicationDetail | null>;

    submitApplication: (
        payload: SubmitApiPartnerApplicationPayload,
    ) => Promise<SubmitApiPartnerApplicationResult>;

    updateApplication: (
        payload: UpdateApiPartnerApplicationPayload,
    ) => Promise<UpdateApiPartnerApplicationResult>;

    loadClient: () => Promise<ApiClientSummary | null>;

    loadApiKeys: () => Promise<ApiKeySummary[]>;

    createApiKey: (
        payload: CreateApiKeyPayload,
    ) => Promise<CreateApiKeyResult>;

    revokeApiKey: (
        apiKeyPublicId: string,
        payload: RevokeApiKeyPayload,
    ) => Promise<RevokeApiKeyResult>;

    clearRevealedApiKey: () => void;

    loadUsage: () => Promise<ApiUsageSummary | null>;

    loadWebhooks: () => Promise<ApiWebhookSummary[]>;

    loadWebhook: (
        webhookPublicId: string,
    ) => Promise<ApiWebhookDetail | null>;

    createWebhook: (
        payload: CreateApiWebhookPayload,
    ) => Promise<CreateApiWebhookResult>;

    updateWebhook: (
        webhookPublicId: string,
        payload: UpdateApiWebhookPayload,
    ) => Promise<UpdateApiWebhookResult>;

    deleteWebhook: (
        webhookPublicId: string,
    ) => Promise<DeleteApiWebhookResult>;

    clearRevealedWebhookSecret: () => void;

    clearFeedback: () => void;
    reset: () => void;
}

export type UseApiPartnerResult =
    ApiPartnerHookState & ApiPartnerHookActions;