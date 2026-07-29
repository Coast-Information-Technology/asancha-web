// File: src/features/account/api/account.api.ts

/**
 * Asancha Account API
 *
 * Purpose:
 * Provides typed authenticated API functions for account identity,
 * general-profile management, business-profile management, policy acceptance,
 * profile switching, and account security summaries.
 *
 * Responsibilities:
 * - Read and update the current user's safe account data.
 * - Read, update, and complete the general profile.
 * - Read and create role-specific business profiles.
 * - Read and switch the active business profile.
 * - Read required profile-specific policies.
 * - Read and create policy acceptance records.
 * - Read safe account-security and active-session summaries.
 *
 * Security notes:
 * - All requests use credentialed authenticated API helpers.
 * - No token, secret, ObjectId, raw IP address, internal note, or restricted
 *   document URL is handled by this feature.
 * - Raw backend errors are normalised by the shared API client.
 * - Profile switching does not bypass policy, account, verification,
 *   onboarding, document, company, payment, or permission checks.
 */

import {
  authApiDelete,
  authApiGet,
  authApiPatch,
  authApiPost,
} from "../../../lib/api/auth-fetch";

import {
  ACCOUNT_API_ENDPOINTS,
  getProfilePolicyContext,
} from "../constants/account.constants";
import type {
  AccountSecuritySummary,
  AccountSession,
  AccountSummary,
  AddBusinessProfilePayload,
  AddBusinessProfileResult,
  BusinessProfileSummary,
  BusinessProfileType,
  CompleteGeneralProfileResult,
  DeleteSessionResult,
  GeneralProfile,
  PolicyAcceptanceInput,
  PolicyAcceptanceRecord,
  RequiredPolicy,
  SwitchBusinessProfilePayload,
  SwitchBusinessProfileResult,
  UpdateGeneralProfilePayload,
} from "../types/account.types";

interface CreatePolicyAcceptancePayload extends PolicyAcceptanceInput {
  profileType?: BusinessProfileType;
  profilePublicId?: string;
  companyPublicId?: string;
  relatedType?: string;
  relatedPublicId?: string;
}

async function getAccount(): Promise<AccountSummary> {
  return authApiGet<AccountSummary>(ACCOUNT_API_ENDPOINTS.account);
}

async function updateAccount(
  payload: Pick<AccountSummary, "phoneNumber">,
): Promise<AccountSummary> {
  return authApiPatch<AccountSummary, Pick<AccountSummary, "phoneNumber">>(
    ACCOUNT_API_ENDPOINTS.account,
    payload,
  );
}

async function getGeneralProfile(): Promise<GeneralProfile> {
  return authApiGet<GeneralProfile>(ACCOUNT_API_ENDPOINTS.generalProfile);
}

async function updateGeneralProfile(
  payload: UpdateGeneralProfilePayload,
): Promise<GeneralProfile> {
  return authApiPatch<GeneralProfile, UpdateGeneralProfilePayload>(
    ACCOUNT_API_ENDPOINTS.generalProfile,
    payload,
  );
}

async function completeGeneralProfile(): Promise<CompleteGeneralProfileResult> {
  return authApiPost<CompleteGeneralProfileResult>(
    ACCOUNT_API_ENDPOINTS.completeGeneralProfile,
  );
}

async function getBusinessProfiles(): Promise<BusinessProfileSummary[]> {
  return authApiGet<BusinessProfileSummary[]>(
    ACCOUNT_API_ENDPOINTS.businessProfiles,
  );
}

async function getActiveBusinessProfile(): Promise<BusinessProfileSummary | null> {
  return authApiGet<BusinessProfileSummary | null>(
    ACCOUNT_API_ENDPOINTS.activeBusinessProfile,
  );
}

async function getRequiredPolicies(
  profileType: BusinessProfileType,
): Promise<RequiredPolicy[]> {
  const context = getProfilePolicyContext(profileType);

  return authApiGet<RequiredPolicy[]>(
    ACCOUNT_API_ENDPOINTS.requiredPolicies(context),
  );
}

async function getPolicyAcceptances(): Promise<PolicyAcceptanceRecord[]> {
  return authApiGet<PolicyAcceptanceRecord[]>(
    ACCOUNT_API_ENDPOINTS.policyAcceptances,
  );
}

async function acceptPolicy(
  payload: CreatePolicyAcceptancePayload,
): Promise<PolicyAcceptanceRecord> {
  return authApiPost<PolicyAcceptanceRecord, CreatePolicyAcceptancePayload>(
    ACCOUNT_API_ENDPOINTS.acceptPolicy,
    payload,
  );
}

/**
 * Creates an additional role-specific business profile.
 *
 * The business-profile endpoint receives the selected profile type and its
 * versioned policy acceptances together so the backend can enforce creation
 * atomically where supported.
 */
async function addBusinessProfile(
  payload: AddBusinessProfilePayload,
): Promise<AddBusinessProfileResult> {
  return authApiPost<AddBusinessProfileResult, AddBusinessProfilePayload>(
    ACCOUNT_API_ENDPOINTS.businessProfiles,
    payload,
  );
}

async function switchBusinessProfile(
  payload: SwitchBusinessProfilePayload,
): Promise<SwitchBusinessProfileResult> {
  return authApiPatch<SwitchBusinessProfileResult, SwitchBusinessProfilePayload>(
    ACCOUNT_API_ENDPOINTS.switchBusinessProfile,
    payload,
  );
}

async function getSecuritySummary(): Promise<AccountSecuritySummary> {
  return authApiGet<AccountSecuritySummary>(ACCOUNT_API_ENDPOINTS.security);
}

async function getSessions(): Promise<AccountSession[]> {
  return authApiGet<AccountSession[]>(ACCOUNT_API_ENDPOINTS.sessions);
}

async function deleteSession(
  sessionPublicId: string,
): Promise<DeleteSessionResult> {
  return authApiDelete<DeleteSessionResult>(
    ACCOUNT_API_ENDPOINTS.session(sessionPublicId),
  );
}

export const accountApi = {
  getAccount,
  updateAccount,
  getGeneralProfile,
  updateGeneralProfile,
  completeGeneralProfile,
  getBusinessProfiles,
  getActiveBusinessProfile,
  getRequiredPolicies,
  getPolicyAcceptances,
  acceptPolicy,
  addBusinessProfile,
  switchBusinessProfile,
  getSecuritySummary,
  getSessions,
  deleteSession,
} as const;
