// File: src/features/api-partner/constants/api-partner.constants.ts

/**
 * Asancha API Partner Constants
 *
 * Purpose:
 * Defines API-partner endpoints, routes, scope options, webhook events,
 * application states, defaults, and safe messages.
 *
 * Security notes:
 * - Partner documentation must remain separate from admin/internal Swagger.
 * - Full API keys and webhook secrets are displayed only once.
 * - API-key hashes and webhook-secret hashes are never exposed.
 */

import type {
    ApiEnvironment,
    ApiPartnerApplicationValues,
    ApiPartnerScope,
    ApiWebhookEvent,
} from "../types/api-partner.types";

export const API_PARTNER_API_ENDPOINTS = {
    applicationSteps: "/api-partner/onboarding/steps",

    dashboard: "/api-partner/dashboard",

    applications: "/api-partner/applications",
    application: "/api-partner/applications/me",
    applicationContacts: "/api-partner/applications/me/contacts",
    applicationComplianceVerification:
        "/api-partner/applications/me/compliance-verification",
    applicationCommercialSetup:
        "/api-partner/applications/me/commercial-setup",
    submitApplication: "/api-partner/applications/me/submit",

    client: "/api-partner/client",

    plans: "/api-partner/plans",

    keys: "/api-partner/keys",

    revokeKey: (apiKeyPublicId: string): string =>
        `/api-partner/keys/${encodeURIComponent(
            apiKeyPublicId,
        )}/revoke`,

    usage: "/api-partner/usage",

    webhooks: "/api-partner/webhooks",

    webhook: (webhookPublicId: string): string =>
        `/api-partner/webhooks/${encodeURIComponent(
            webhookPublicId,
        )}`,
} as const;

export const API_PARTNER_PAGE_ROUTES = {
    root: "/api-partner",
    apply: "/api-partner/apply",
    applicationStatus:
        "/api-partner/application-status",
    dashboard: "/api-partner/dashboard",
    client: "/api-partner/client",
    keys: "/api-partner/keys",
    usage: "/api-partner/usage",
    webhooks: "/api-partner/webhooks",
    newWebhook: "/api-partner/webhooks/new",

    webhook: (webhookPublicId: string): string =>
        `/api-partner/webhooks/${encodeURIComponent(
            webhookPublicId,
        )}`,

    docs: "/api-partner/docs",
    billing: "/api-partner/billing",
    payments: "/api-partner/payments",
    support: "/api-partner/support",
} as const;

export const API_PARTNER_SCOPE_OPTIONS = [
    {
        value: "listings:read",
        label: "Read listings",
    },
    {
        value: "listings:write",
        label: "Create listings",
    },
    {
        value: "properties:read",
        label: "Read properties",
    },
    {
        value: "properties:write",
        label: "Create properties",
    },
    {
        value: "valuations:read",
        label: "Read valuations",
    },
    {
        value: "bmv:analyze",
        label: "Analyse BMV opportunities",
    },
    {
        value: "reservations:read",
        label: "Read reservations",
    },
    {
        value: "reservations:write",
        label: "Create reservations",
    },
    {
        value: "webhooks:manage",
        label: "Manage webhooks",
    },
    {
        value: "ai:property-summary",
        label: "AI property summaries",
    },
    {
        value: "ai:bmv-analysis",
        label: "AI BMV analysis",
    },
    {
        value: "ai:deal-score",
        label: "AI deal scoring",
    },
    {
        value: "ai:valuation-summary",
        label: "AI valuation summaries",
    },
    {
        value: "ai:matching",
        label: "AI matching",
    },
    {
        value: "ai:refurb-estimate",
        label: "AI refurbishment estimates",
    },
    {
        value: "ai:recommendations",
        label: "AI recommendations",
    },
] as const satisfies ReadonlyArray<{
    value: ApiPartnerScope;
    label: string;
}>;

export const API_WEBHOOK_EVENT_OPTIONS = [
    {
        value: "listing.published",
        label: "Listing published",
    },
    {
        value: "listing.updated",
        label: "Listing updated",
    },
    {
        value: "listing.withdrawn",
        label: "Listing withdrawn",
    },
    {
        value: "reservation.confirmed",
        label: "Reservation confirmed",
    },
    {
        value: "reservation.cancelled",
        label: "Reservation cancelled",
    },
    {
        value: "reservation.expired",
        label: "Reservation expired",
    },
    {
        value: "payment.approved",
        label: "Payment approved",
    },
    {
        value: "api_partner.usage_limit_warning",
        label: "Usage limit warning",
    },
] as const satisfies ReadonlyArray<{
    value: ApiWebhookEvent;
    label: string;
}>;

export const API_ENVIRONMENT_OPTIONS = [
    {
        value: "sandbox",
        label: "Sandbox",
    },
    {
        value: "production",
        label: "Production",
    },
] as const satisfies ReadonlyArray<{
    value: ApiEnvironment;
    label: string;
}>;

export const INITIAL_API_PARTNER_APPLICATION_VALUES:
    ApiPartnerApplicationValues = {
    company: {
        companyName: "",
        companyRegistrationNumber: "",
        companyWebsite: "",
        country: "United Kingdom",
        registeredAddress: "",
    },

    contacts: {
        businessContactName: "",
        businessContactEmail: "",
        businessContactPhone: null,

        technicalContactName: "",
        technicalContactEmail: "",
        technicalContactPhone: null,
    },

    businessUseCase: "",
    integrationDescription: "",
    intendedUsers: "",
    estimatedMonthlyCalls: 1_000,

    requestedScopes: [],
    requestedPlanCode: null,

    sandboxRequired: true,
    productionAccessRequested: false,

    privacyPolicyUrl: null,
    termsUrl: null,

    dataProtectionConfirmed: false as never,
    securityResponsibilityConfirmed: false as never,
    partnerTermsAccepted: false as never,
    informationAccurateConfirmed: false as never,
};

export const API_PARTNER_SAFE_MESSAGES = {
    dashboardLoadError:
        "We could not load your API partner dashboard.",

    applicationLoadError:
        "We could not load your API partner application.",

    applicationSubmitError:
        "We could not submit your API partner application. Review the company, contact, use-case, scope, policy, and security information.",

    applicationSubmitted:
        "Your API partner application has been submitted for review.",

    applicationUpdateError:
        "We could not update your API partner application.",

    applicationUpdated:
        "Your API partner application has been updated.",

    pendingApproval:
        "Your API partner application is under review. API keys will be available after approval.",

    moreInformationRequired:
        "Your application needs additional information. Review the safe request and update your application.",

    rejected:
        "Your API partner application could not be approved. Review the safe message and available next action.",

    approved:
        "Your API partner application has been approved.",

    keyLoadError:
        "We could not load your API keys.",

    keyCreateError:
        "We could not create the API key. Confirm that API access, scopes, subscription, payment, and environment access are active.",

    keyCreated:
        "Your API key has been created.",

    keyShownOnce:
        "Copy this key now. For security reasons, it will not be shown again.",

    keyRevokeError:
        "We could not revoke this API key.",

    keyRevoked:
        "The API key has been revoked.",

    noKeys:
        "No API keys have been created yet. Create a key after your API access is approved.",

    usageLoadError:
        "We could not load your API usage.",

    webhookLoadError:
        "We could not load your webhook endpoints.",

    webhookCreateError:
        "We could not create the webhook endpoint. Review the URL, environment, events, and approved scopes.",

    webhookCreated:
        "Your webhook endpoint has been created.",

    webhookSecretShownOnce:
        "Copy this webhook signing secret now. It will not be shown again.",

    webhookUpdateError:
        "We could not update this webhook endpoint.",

    webhookUpdated:
        "The webhook endpoint has been updated.",

    webhookDeleteError:
        "We could not delete this webhook endpoint.",

    webhookDeleted:
        "The webhook endpoint has been deleted.",

    noWebhooks:
        "No webhook endpoints yet. Add a webhook to receive approved event updates.",

    productionLocked:
        "Production API access is not enabled for this client.",

    partnerDocsOnly:
        "Partner documentation contains only approved partner-safe endpoints. Internal and administrative API documentation is not available.",

    accessControlled:
        "API access depends on application approval, approved scopes, client status, subscription, payment, verification, and environment access.",
} as const;
