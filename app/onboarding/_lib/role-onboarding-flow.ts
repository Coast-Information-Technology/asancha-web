// File: app/onboarding/_lib/role-onboarding-flow.ts

/**
 * Role Onboarding Flow Helpers
 *
 * Purpose:
 * Defines shared role-onboarding flow metadata and endpoint builders for
 * role onboarding pages.
 */

export type RoleOnboardingProfileType =
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider"
    | "api_partner";

export interface RoleOnboardingSubmitPayload
    extends Record<string, unknown> {
    confirmAccuracy: true;
    submitForReview: true;
}

export interface RoleOnboardingFlowConfig {
    profileType: RoleOnboardingProfileType;
    profileSlug: string;
    dashboardPath: string;
    uploadFolder: string;
    workspaceLabel: string;
    unavailableMessage: string;
    loadingMessage: string;
    submitConfirmationTitle: string;
    submitConfirmationDescription: string;
    submitPayload: RoleOnboardingSubmitPayload;
}

export function getRoleStepsEndpoint(
    config: RoleOnboardingFlowConfig,
): string {
    return `/onboarding/me/${config.profileType}/steps`;
}

export function getRoleStepSaveEndpoint(
    config: RoleOnboardingFlowConfig,
    stepKey: string,
): string {
    return `${getRoleStepsEndpoint(config)}/${stepKey}`;
}

export function getRoleSubmitEndpoint(
    config: RoleOnboardingFlowConfig,
): string {
    return `/onboarding/me/${config.profileType}/submit`;
}
