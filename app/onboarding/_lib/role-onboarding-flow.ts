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

interface RoleOnboardingStepRecord {
    stepKey: string;
}

interface RoleOnboardingStepsShape {
    currentStep: string;
    nextStep?: string;
    completedSteps: string[];
    lockedSteps: string[];
    steps: RoleOnboardingStepRecord[];
    reviewSummary?: RoleOnboardingStepRecord[];
}

const LEGACY_ROLE_ONBOARDING_STEP_KEYS: Readonly<
    Record<string, string>
> = {
    documents_and_proof: "verification_documents",
    verification: "verification_documents",
};

function normalizeRoleOnboardingStepKey(
    stepKey: string,
): string {
    return (
        LEGACY_ROLE_ONBOARDING_STEP_KEYS[stepKey] ??
        stepKey
    );
}

export function normalizeRoleOnboardingStepsResponse<
    TResponse extends RoleOnboardingStepsShape,
>(response: TResponse): TResponse {
    return {
        ...response,
        currentStep: normalizeRoleOnboardingStepKey(
            response.currentStep,
        ),
        nextStep: response.nextStep
            ? normalizeRoleOnboardingStepKey(
                  response.nextStep,
              )
            : undefined,
        completedSteps: response.completedSteps.map(
            normalizeRoleOnboardingStepKey,
        ),
        lockedSteps: response.lockedSteps.map(
            normalizeRoleOnboardingStepKey,
        ),
        steps: response.steps.map((step) => ({
            ...step,
            stepKey: normalizeRoleOnboardingStepKey(
                step.stepKey,
            ),
        })),
        reviewSummary: response.reviewSummary?.map(
            (item) => ({
                ...item,
                stepKey: normalizeRoleOnboardingStepKey(
                    item.stepKey,
                ),
            }),
        ),
    } as TResponse;
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
