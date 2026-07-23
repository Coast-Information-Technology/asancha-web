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
