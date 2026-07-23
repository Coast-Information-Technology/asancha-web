// File: app/onboarding/_config/role-onboarding-flows.ts

/**
 * Role Onboarding Flow Configs
 *
 * Purpose:
 * Keeps role-specific onboarding flow metadata separate from individual page
 * components.
 */

import type {
    RoleOnboardingFlowConfig,
} from "../_lib/role-onboarding-flow";

export const PROPERTY_OWNER_ONBOARDING_FLOW = {
    profileType: "property_owner",
    profileSlug: "property-owner",
    dashboardPath: "/dashboard/property-owner",
    uploadFolder: "asancha/onboarding/property-owner",
    workspaceLabel: "Property owner onboarding",
    unavailableMessage:
        "Property owner onboarding is not available.",
    loadingMessage:
        "Loading property owner onboarding steps...",
    submitConfirmationTitle: "Submit for review?",
    submitConfirmationDescription:
        "Once submitted, your property owner profile will be sent for review. You can go back now if you need to change anything.",
    submitPayload: {
        confirmAccuracy: true,
        submitForReview: true,
    },
} as const satisfies RoleOnboardingFlowConfig;

export const PROPERTY_AGENT_ONBOARDING_FLOW = {
    profileType: "property_agent",
    profileSlug: "property-agent",
    dashboardPath: "/dashboard/property-agent",
    uploadFolder: "asancha/onboarding/property-agent",
    workspaceLabel: "Property agent onboarding",
    unavailableMessage:
        "Property agent onboarding is not available.",
    loadingMessage:
        "Loading property agent onboarding steps...",
    submitConfirmationTitle: "Submit for review?",
    submitConfirmationDescription:
        "Once submitted, your property agent profile will be sent for review. You can go back now if you need to change anything.",
    submitPayload: {
        confirmAccuracy: true,
        submitForReview: true,
    },
} as const satisfies RoleOnboardingFlowConfig;

export const INVESTOR_ONBOARDING_FLOW = {
    profileType: "investor",
    profileSlug: "investor",
    dashboardPath: "/dashboard/investor",
    uploadFolder: "asancha/onboarding/investor",
    workspaceLabel: "Investor onboarding",
    unavailableMessage:
        "Investor onboarding is not available.",
    loadingMessage:
        "Loading investor onboarding steps...",
    submitConfirmationTitle: "Submit for review?",
    submitConfirmationDescription:
        "Once submitted, your investor profile will be sent for review. You can go back now if you need to change anything.",
    submitPayload: {
        confirmAccuracy: true,
        submitForReview: true,
    },
} as const satisfies RoleOnboardingFlowConfig;

export const PROPERTY_SOURCER_ONBOARDING_FLOW = {
    profileType: "property_sourcer",
    profileSlug: "property-sourcer",
    dashboardPath: "/dashboard/property-sourcer",
    uploadFolder: "asancha/onboarding/property-sourcer",
    workspaceLabel: "Property sourcer onboarding",
    unavailableMessage:
        "Property sourcer onboarding is not available.",
    loadingMessage:
        "Loading property sourcer onboarding steps...",
    submitConfirmationTitle: "Submit for review?",
    submitConfirmationDescription:
        "Once submitted, your property sourcer profile will be sent for review. You can go back now if you need to change anything.",
    submitPayload: {
        confirmAccuracy: true,
        submitForReview: true,
    },
} as const satisfies RoleOnboardingFlowConfig;

export const SERVICE_PROVIDER_ONBOARDING_FLOW = {
    profileType: "service_provider",
    profileSlug: "service-provider",
    dashboardPath: "/dashboard/service-provider",
    uploadFolder: "asancha/onboarding/service-provider",
    workspaceLabel: "Service provider onboarding",
    unavailableMessage:
        "Service provider onboarding is not available.",
    loadingMessage:
        "Loading service provider onboarding steps...",
    submitConfirmationTitle: "Submit for review?",
    submitConfirmationDescription:
        "Once submitted, your service provider profile will be sent for review. You can go back now if you need to change anything.",
    submitPayload: {
        confirmAccuracy: true,
        submitForReview: true,
    },
} as const satisfies RoleOnboardingFlowConfig;
