"use client";

// File: src/features/account/hooks/use-account.ts

/**
 * Asancha Account Hook
 *
 * Purpose:
 * Provides client components with typed account, general-profile,
 * business-profile, policy, security, and active-session state.
 *
 * Responsibilities:
 * - Load and update the current user's safe account data.
 * - Load, update, and complete the general profile.
 * - Load available and active business profiles.
 * - Load profile-specific policy requirements.
 * - Create additional business profiles.
 * - Switch active business-profile context.
 * - Load safe security and active-session summaries.
 * - Delete individual non-required sessions.
 * - Expose public-safe loading, success, and error states.
 *
 * Security notes:
 * - This hook stores public-safe response data in component memory only.
 * - It must not store passwords, tokens, secrets, private KYC details,
 *   internal notes, raw IP addresses, or restricted document URLs.
 * - Client-side profile switching is not an authorization mechanism.
 * - Backend enforcement remains final.
 */

import { useCallback, useState } from "react";

import { accountApi } from "../api/account.api";
import { ACCOUNT_SAFE_MESSAGES } from "../constants/account.constants";
import type {
  AccountHookState,
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
  PolicyAcceptanceRecord,
  RequiredPolicy,
  SwitchBusinessProfilePayload,
  SwitchBusinessProfileResult,
  UpdateGeneralProfilePayload,
  UseAccountResult,
} from "../types/account.types";

const INITIAL_ACCOUNT_STATE: AccountHookState = {
  requestState: "idle",
  account: null,
  generalProfile: null,
  businessProfiles: [],
  activeBusinessProfile: null,
  requiredPolicies: [],
  policyAcceptances: [],
  securitySummary: null,
  sessions: [],
  errorMessage: null,
  successMessage: null,
  isLoading: false,
  isSaving: false,
  isSwitching: false,
  isCreatingProfile: false,
  isDeletingSession: false,
};

function replaceBusinessProfile(
  profiles: BusinessProfileSummary[],
  nextProfile: BusinessProfileSummary,
): BusinessProfileSummary[] {
  const exists = profiles.some(
    (profile) => profile.profilePublicId === nextProfile.profilePublicId,
  );

  if (!exists) {
    return [...profiles, nextProfile];
  }

  return profiles.map((profile) =>
    profile.profilePublicId === nextProfile.profilePublicId
      ? nextProfile
      : profile,
  );
}

function markActiveBusinessProfile(
  profiles: BusinessProfileSummary[],
  activeProfilePublicId: string,
): BusinessProfileSummary[] {
  return profiles.map((profile) => ({
    ...profile,
    isActive: profile.profilePublicId === activeProfilePublicId,
  }));
}

export function useAccount(): UseAccountResult {
  const [accountState, setAccountState] = useState<AccountHookState>(
    INITIAL_ACCOUNT_STATE,
  );

  const setError = useCallback((message: string): void => {
    setAccountState((currentState) => ({
      ...currentState,
      requestState: "error",
      errorMessage: message,
      successMessage: null,
      isLoading: false,
      isSaving: false,
      isSwitching: false,
      isCreatingProfile: false,
      isDeletingSession: false,
    }));
  }, []);

  const loadAccount = useCallback(async (): Promise<AccountSummary | null> => {
    setAccountState((currentState) => ({
      ...currentState,
      requestState: "loading",
      isLoading: true,
      errorMessage: null,
      successMessage: null,
    }));

    try {
      const account = await accountApi.getAccount();

      setAccountState((currentState) => ({
        ...currentState,
        requestState: "idle",
        account,
        generalProfile: account.generalProfile,
        businessProfiles: account.availableBusinessProfiles,
        activeBusinessProfile: account.activeBusinessProfile,
        isLoading: false,
        errorMessage: null,
      }));

      return account;
    } catch {
      setError(ACCOUNT_SAFE_MESSAGES.loadError);
      return null;
    }
  }, [setError]);

  const loadGeneralProfile =
    useCallback(async (): Promise<GeneralProfile | null> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const generalProfile = await accountApi.getGeneralProfile();

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "idle",
          generalProfile,
          account: currentState.account
            ? {
                ...currentState.account,
                generalProfile,
                generalProfileStatus: generalProfile.status,
              }
            : null,
          isLoading: false,
          errorMessage: null,
        }));

        return generalProfile;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.loadError);
        return null;
      }
    }, [setError]);

  const updateGeneralProfile = useCallback(
    async (payload: UpdateGeneralProfilePayload): Promise<GeneralProfile> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "saving",
        isSaving: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const generalProfile = await accountApi.updateGeneralProfile(payload);

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "success",
          generalProfile,
          account: currentState.account
            ? {
                ...currentState.account,
                generalProfile,
                generalProfileStatus: generalProfile.status,
                phoneNumber:
                  generalProfile.phoneNumber ??
                  currentState.account.phoneNumber,
              }
            : null,
          isSaving: false,
          errorMessage: null,
          successMessage: ACCOUNT_SAFE_MESSAGES.profileSaved,
        }));

        return generalProfile;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.profileSaveError);
        throw new Error(ACCOUNT_SAFE_MESSAGES.profileSaveError);
      }
    },
    [setError],
  );

  const completeGeneralProfile =
    useCallback(async (): Promise<CompleteGeneralProfileResult> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "saving",
        isSaving: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await accountApi.completeGeneralProfile();

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "success",
          generalProfile: result.profile,
          account: currentState.account
            ? {
                ...currentState.account,
                generalProfile: result.profile,
                generalProfileStatus: "completed",
              }
            : null,
          isSaving: false,
          errorMessage: null,
          successMessage: ACCOUNT_SAFE_MESSAGES.profileCompleted,
        }));

        return result;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.profileSaveError);
        throw new Error(ACCOUNT_SAFE_MESSAGES.profileSaveError);
      }
    }, [setError]);

  const loadBusinessProfiles = useCallback(async (): Promise<
    BusinessProfileSummary[]
  > => {
    setAccountState((currentState) => ({
      ...currentState,
      requestState: "loading",
      isLoading: true,
      errorMessage: null,
      successMessage: null,
    }));

    try {
      const businessProfiles = await accountApi.getBusinessProfiles();

      const activeBusinessProfile =
        businessProfiles.find((profile) => profile.isActive) ?? null;

      setAccountState((currentState) => ({
        ...currentState,
        requestState: "idle",
        businessProfiles,
        activeBusinessProfile,
        account: currentState.account
          ? {
              ...currentState.account,
              availableBusinessProfiles: businessProfiles,
              activeBusinessProfile,
            }
          : null,
        isLoading: false,
        errorMessage: null,
      }));

      return businessProfiles;
    } catch {
      setError(ACCOUNT_SAFE_MESSAGES.loadError);
      return [];
    }
  }, [setError]);

  const loadActiveBusinessProfile =
    useCallback(async (): Promise<BusinessProfileSummary | null> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const activeBusinessProfile =
          await accountApi.getActiveBusinessProfile();

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "idle",
          activeBusinessProfile,
          businessProfiles: activeBusinessProfile
            ? markActiveBusinessProfile(
                currentState.businessProfiles,
                activeBusinessProfile.profilePublicId,
              )
            : currentState.businessProfiles,
          account: currentState.account
            ? {
                ...currentState.account,
                activeBusinessProfile,
              }
            : null,
          isLoading: false,
          errorMessage: null,
        }));

        return activeBusinessProfile;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.loadError);
        return null;
      }
    }, [setError]);

  const loadRequiredPolicies = useCallback(
    async (profileType: BusinessProfileType): Promise<RequiredPolicy[]> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        requiredPolicies: [],
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const requiredPolicies =
          await accountApi.getRequiredPolicies(profileType);

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "idle",
          requiredPolicies,
          isLoading: false,
          errorMessage: null,
        }));

        return requiredPolicies;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.policiesLoadError);
        return [];
      }
    },
    [setError],
  );

  const loadPolicyAcceptances = useCallback(async (): Promise<
    PolicyAcceptanceRecord[]
  > => {
    setAccountState((currentState) => ({
      ...currentState,
      requestState: "loading",
      isLoading: true,
      errorMessage: null,
      successMessage: null,
    }));

    try {
      const policyAcceptances = await accountApi.getPolicyAcceptances();

      setAccountState((currentState) => ({
        ...currentState,
        requestState: "idle",
        policyAcceptances,
        isLoading: false,
        errorMessage: null,
      }));

      return policyAcceptances;
    } catch {
      setError(ACCOUNT_SAFE_MESSAGES.loadError);
      return [];
    }
  }, [setError]);

  const addBusinessProfile = useCallback(
    async (
      payload: AddBusinessProfilePayload,
    ): Promise<AddBusinessProfileResult> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "creating",
        isCreatingProfile: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await accountApi.addBusinessProfile(payload);

        setAccountState((currentState) => {
          const businessProfiles = replaceBusinessProfile(
            currentState.businessProfiles,
            result.profile,
          );

          return {
            ...currentState,
            requestState: "success",
            businessProfiles,
            activeBusinessProfile: result.profile.isActive
              ? result.profile
              : currentState.activeBusinessProfile,
            account: currentState.account
              ? {
                  ...currentState.account,
                  availableBusinessProfiles: businessProfiles,
                  activeBusinessProfile: result.profile.isActive
                    ? result.profile
                    : currentState.account.activeBusinessProfile,
                }
              : null,
            isCreatingProfile: false,
            errorMessage: null,
            successMessage:
              result.message || ACCOUNT_SAFE_MESSAGES.profileCreated,
          };
        });

        return result;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.profileCreationError);
        throw new Error(ACCOUNT_SAFE_MESSAGES.profileCreationError);
      }
    },
    [setError],
  );

  const switchBusinessProfile = useCallback(
    async (
      payload: SwitchBusinessProfilePayload,
    ): Promise<SwitchBusinessProfileResult> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "switching",
        isSwitching: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await accountApi.switchBusinessProfile(payload);

        setAccountState((currentState) => {
          const updatedProfiles = replaceBusinessProfile(
            markActiveBusinessProfile(
              currentState.businessProfiles,
              result.activeProfile.profilePublicId,
            ),
            {
              ...result.activeProfile,
              isActive: true,
            },
          );

          return {
            ...currentState,
            requestState: "success",
            businessProfiles: updatedProfiles,
            activeBusinessProfile: {
              ...result.activeProfile,
              isActive: true,
            },
            account: currentState.account
              ? {
                  ...currentState.account,
                  activeBusinessProfile: {
                    ...result.activeProfile,
                    isActive: true,
                  },
                  availableBusinessProfiles: updatedProfiles,
                }
              : null,
            isSwitching: false,
            errorMessage: null,
            successMessage:
              result.message || ACCOUNT_SAFE_MESSAGES.profileSwitched,
          };
        });

        return result;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.profileSwitchError);
        throw new Error(ACCOUNT_SAFE_MESSAGES.profileSwitchError);
      }
    },
    [setError],
  );

  const loadSecuritySummary =
    useCallback(async (): Promise<AccountSecuritySummary | null> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const securitySummary = await accountApi.getSecuritySummary();

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "idle",
          securitySummary,
          isLoading: false,
          errorMessage: null,
        }));

        return securitySummary;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.loadError);
        return null;
      }
    }, [setError]);

  const loadSessions = useCallback(async (): Promise<AccountSession[]> => {
    setAccountState((currentState) => ({
      ...currentState,
      requestState: "loading",
      isLoading: true,
      errorMessage: null,
      successMessage: null,
    }));

    try {
      const sessions = await accountApi.getSessions();

      setAccountState((currentState) => ({
        ...currentState,
        requestState: "idle",
        sessions,
        isLoading: false,
        errorMessage: null,
      }));

      return sessions;
    } catch {
      setError(ACCOUNT_SAFE_MESSAGES.loadError);
      return [];
    }
  }, [setError]);

  const deleteSession = useCallback(
    async (sessionPublicId: string): Promise<DeleteSessionResult> => {
      setAccountState((currentState) => ({
        ...currentState,
        requestState: "deleting_session",
        isDeletingSession: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await accountApi.deleteSession(sessionPublicId);

        setAccountState((currentState) => ({
          ...currentState,
          requestState: "success",
          sessions: currentState.sessions.filter(
            (session) => session.sessionPublicId !== result.sessionPublicId,
          ),
          securitySummary: currentState.securitySummary
            ? {
                ...currentState.securitySummary,
                activeSessionCount: Math.max(
                  0,
                  currentState.securitySummary.activeSessionCount - 1,
                ),
              }
            : null,
          isDeletingSession: false,
          errorMessage: null,
          successMessage: ACCOUNT_SAFE_MESSAGES.sessionDeleted,
        }));

        return result;
      } catch {
        setError(ACCOUNT_SAFE_MESSAGES.sessionDeleteError);
        throw new Error(ACCOUNT_SAFE_MESSAGES.sessionDeleteError);
      }
    },
    [setError],
  );

  const clearMessages = useCallback((): void => {
    setAccountState((currentState) => ({
      ...currentState,
      requestState: "idle",
      errorMessage: null,
      successMessage: null,
    }));
  }, []);

  const reset = useCallback((): void => {
    setAccountState(INITIAL_ACCOUNT_STATE);
  }, []);

  return {
    ...accountState,
    loadAccount,
    loadGeneralProfile,
    updateGeneralProfile,
    completeGeneralProfile,
    loadBusinessProfiles,
    loadActiveBusinessProfile,
    loadRequiredPolicies,
    loadPolicyAcceptances,
    addBusinessProfile,
    switchBusinessProfile,
    loadSecuritySummary,
    loadSessions,
    deleteSession,
    clearMessages,
    reset,
  };
}
