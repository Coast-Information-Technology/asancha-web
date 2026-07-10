// File: src/features/onboarding/api/onboarding.api.ts

/**
 * Asancha Onboarding API
 *
 * Purpose:
 * Provides typed authenticated API functions for role-aware onboarding in
 * the Asancha public/user frontend.
 *
 * Responsibilities:
 * - Read the current user's onboarding state.
 * - Start onboarding for an approved business profile type.
 * - Read and save investor onboarding progress.
 * - Submit investor onboarding.
 * - Read role-specific onboarding status.
 * - Read backend-driven dashboard access state.
 *
 * Important security notes:
 * - All requests use credentialed authenticated API helpers.
 * - Public IDs remain opaque frontend values.
 * - Raw backend errors must be handled by the shared API client.
 * - Onboarding completion does not grant verification approval.
 * - Backend permission, policy, profile, document, verification, company,
 *   payment, and resource-state checks remain final.
 */

import {
  authApiGet,
  authApiPatch,
  authApiPost,
} from "../../../lib/api/auth-fetch";

import { ONBOARDING_API_ENDPOINTS } from "../constants/onboarding.constants";
import type {
  InvestorOnboardingProgressPayload,
  InvestorOnboardingRecord,
  InvestorOnboardingSubmitPayload,
  InvestorOnboardingSubmitResult,
  OnboardingDashboardState,
  OnboardingRecord,
  OnboardingRoleStatus,
  OnboardingStartPayload,
  OnboardingStartResult,
  OnboardingTargetRole,
} from "../types/onboarding.types";

async function getCurrentOnboarding(): Promise<OnboardingRecord> {
  return authApiGet<OnboardingRecord>(ONBOARDING_API_ENDPOINTS.current);
}

async function startOnboarding(
  payload: OnboardingStartPayload,
): Promise<OnboardingStartResult> {
  return authApiPost<OnboardingStartResult, OnboardingStartPayload>(
    ONBOARDING_API_ENDPOINTS.start,
    payload,
  );
}

async function getInvestorOnboarding(): Promise<InvestorOnboardingRecord> {
  return authApiGet<InvestorOnboardingRecord>(
    ONBOARDING_API_ENDPOINTS.role("investor"),
  );
}

async function saveInvestorProgress(
  payload: InvestorOnboardingProgressPayload,
): Promise<InvestorOnboardingRecord> {
  return authApiPatch<
    InvestorOnboardingRecord,
    InvestorOnboardingProgressPayload
  >(ONBOARDING_API_ENDPOINTS.role("investor"), payload);
}

async function submitInvestorOnboarding(
  payload: InvestorOnboardingSubmitPayload,
): Promise<InvestorOnboardingSubmitResult> {
  return authApiPost<
    InvestorOnboardingSubmitResult,
    InvestorOnboardingSubmitPayload
  >(ONBOARDING_API_ENDPOINTS.submitRole("investor"), payload);
}

async function getRoleStatus(
  targetRole: OnboardingTargetRole,
): Promise<OnboardingRoleStatus> {
  return authApiGet<OnboardingRoleStatus>(
    ONBOARDING_API_ENDPOINTS.roleStatus(targetRole),
  );
}

async function getDashboardState(): Promise<OnboardingDashboardState> {
  return authApiGet<OnboardingDashboardState>(
    ONBOARDING_API_ENDPOINTS.dashboardState,
  );
}

export const onboardingApi = {
  getCurrentOnboarding,
  startOnboarding,
  getInvestorOnboarding,
  saveInvestorProgress,
  submitInvestorOnboarding,
  getRoleStatus,
  getDashboardState,
} as const;
