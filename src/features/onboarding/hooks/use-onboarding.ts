"use client";

// File: src/features/onboarding/hooks/use-onboarding.ts

/**
 * Asancha Onboarding Hook
 *
 * Purpose:
 * Provides client components with typed onboarding state and actions for
 * loading, starting, saving, submitting, and reviewing onboarding progress.
 *
 * Responsibilities:
 * - Load the current onboarding record.
 * - Load investor onboarding data.
 * - Start role-specific onboarding.
 * - Save investor onboarding progress.
 * - Submit completed investor onboarding.
 * - Retrieve role status and dashboard-state information.
 * - Expose safe loading, saving, submission, and error states.
 *
 * Important security notes:
 * - This hook stores only public-safe onboarding data in component memory.
 * - It must not store private documents, secrets, tokens, or internal notes.
 * - Client-side state does not grant access to protected actions.
 * - Backend enforcement remains final.
 */

import { useCallback, useState } from "react";

import { onboardingApi } from "../api/onboarding.api";
import { ONBOARDING_SAFE_MESSAGES } from "../constants/onboarding.constants";
import type {
  InvestorOnboardingProgressPayload,
  InvestorOnboardingRecord,
  InvestorOnboardingSubmitPayload,
  InvestorOnboardingSubmitResult,
  OnboardingDashboardState,
  OnboardingHookState,
  OnboardingRecord,
  OnboardingRoleStatus,
  OnboardingStartPayload,
  OnboardingStartResult,
  OnboardingTargetRole,
  UseOnboardingResult,
} from "../types/onboarding.types";

const INITIAL_HOOK_STATE: OnboardingHookState = {
  state: "idle",
  onboarding: null,
  investorOnboarding: null,
  roleStatus: null,
  dashboardState: null,
  errorMessage: null,
  isLoading: false,
  isSaving: false,
  isSubmitting: false,
  isCompleted: false,
};

/**
 * Narrows a generic onboarding record to the investor-specific record.
 *
 * The generic record uses unknown for role-specific data, allowing the
 * investor record to be assignable to the predicate parameter type.
 */
function isInvestorOnboardingRecord(
  onboarding: OnboardingRecord<unknown>,
): onboarding is InvestorOnboardingRecord {
  return onboarding.targetRole === "investor";
}

export function useOnboarding(): UseOnboardingResult {
  const [hookState, setHookState] =
    useState<OnboardingHookState>(INITIAL_HOOK_STATE);

  /**
   * Applies a safe public-facing error state.
   */
  const setError = useCallback((message: string): void => {
    setHookState((currentState) => ({
      ...currentState,
      state: "error",
      isLoading: false,
      isSaving: false,
      isSubmitting: false,
      errorMessage: message,
    }));
  }, []);

  /**
   * Loads the active onboarding record for the current user and active
   * business-profile context.
   */
  const loadOnboarding =
    useCallback(async (): Promise<OnboardingRecord<unknown> | null> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "loading",
        isLoading: true,
        errorMessage: null,
      }));

      try {
        const onboarding = await onboardingApi.getCurrentOnboarding();

        setHookState((currentState) => ({
          ...currentState,
          state: onboarding.status === "completed" ? "submitted" : "idle",
          onboarding,
          investorOnboarding: isInvestorOnboardingRecord(onboarding)
            ? onboarding
            : currentState.investorOnboarding,
          isLoading: false,
          isCompleted: onboarding.status === "completed",
          errorMessage: null,
        }));

        return onboarding;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.loadError);

        return null;
      }
    }, [setError]);

  /**
   * Loads the current investor onboarding record.
   */
  const loadInvestorOnboarding =
    useCallback(async (): Promise<InvestorOnboardingRecord | null> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "loading",
        isLoading: true,
        errorMessage: null,
      }));

      try {
        const onboarding = await onboardingApi.getInvestorOnboarding();

        setHookState((currentState) => ({
          ...currentState,
          state: onboarding.status === "completed" ? "submitted" : "idle",
          onboarding,
          investorOnboarding: onboarding,
          isLoading: false,
          isCompleted: onboarding.status === "completed",
          errorMessage: null,
        }));

        return onboarding;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.loadError);

        return null;
      }
    }, [setError]);

  /**
   * Starts onboarding for the requested role-specific business profile.
   */
  const startOnboarding = useCallback(
    async (payload: OnboardingStartPayload): Promise<OnboardingStartResult> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "loading",
        isLoading: true,
        errorMessage: null,
      }));

      try {
        const result = await onboardingApi.startOnboarding(payload);

        setHookState((currentState) => ({
          ...currentState,
          state:
            result.onboarding.status === "completed" ? "submitted" : "idle",
          onboarding: result.onboarding,
          investorOnboarding: isInvestorOnboardingRecord(result.onboarding)
            ? result.onboarding
            : currentState.investorOnboarding,
          isLoading: false,
          isCompleted: result.onboarding.status === "completed",
          errorMessage: null,
        }));

        return result;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.genericError);

        throw new Error(ONBOARDING_SAFE_MESSAGES.genericError);
      }
    },
    [setError],
  );

  /**
   * Saves partial investor onboarding progress.
   */
  const saveInvestorProgress = useCallback(
    async (
      payload: InvestorOnboardingProgressPayload,
    ): Promise<InvestorOnboardingRecord> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "saving",
        isSaving: true,
        errorMessage: null,
      }));

      try {
        const onboarding = await onboardingApi.saveInvestorProgress(payload);

        setHookState((currentState) => ({
          ...currentState,
          state: "saved",
          onboarding,
          investorOnboarding: onboarding,
          isSaving: false,
          isCompleted: onboarding.status === "completed",
          errorMessage: null,
        }));

        return onboarding;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.saveError);

        throw new Error(ONBOARDING_SAFE_MESSAGES.saveError);
      }
    },
    [setError],
  );

  /**
   * Submits the completed investor onboarding flow.
   *
   * Successful onboarding submission does not mean verification approval.
   */
  const submitInvestorOnboarding = useCallback(
    async (
      payload: InvestorOnboardingSubmitPayload,
    ): Promise<InvestorOnboardingSubmitResult> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "submitting",
        isSubmitting: true,
        errorMessage: null,
      }));

      try {
        const result = await onboardingApi.submitInvestorOnboarding(payload);

        setHookState((currentState) => ({
          ...currentState,
          state: "submitted",
          onboarding: result.onboarding,
          investorOnboarding: result.onboarding,
          isSubmitting: false,
          isCompleted: true,
          errorMessage: null,
        }));

        return result;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.submitError);

        throw new Error(ONBOARDING_SAFE_MESSAGES.submitError);
      }
    },
    [setError],
  );

  /**
   * Loads onboarding and verification status for a role-specific profile.
   */
  const loadRoleStatus = useCallback(
    async (targetRole: OnboardingTargetRole): Promise<OnboardingRoleStatus> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "loading",
        isLoading: true,
        errorMessage: null,
      }));

      try {
        const roleStatus = await onboardingApi.getRoleStatus(targetRole);

        setHookState((currentState) => ({
          ...currentState,
          state: roleStatus.status === "completed" ? "submitted" : "idle",
          roleStatus,
          isLoading: false,
          isCompleted: roleStatus.status === "completed",
          errorMessage: null,
        }));

        return roleStatus;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.loadError);

        throw new Error(ONBOARDING_SAFE_MESSAGES.loadError);
      }
    },
    [setError],
  );

  /**
   * Loads backend-controlled dashboard access and action states.
   */
  const loadDashboardState =
    useCallback(async (): Promise<OnboardingDashboardState> => {
      setHookState((currentState) => ({
        ...currentState,
        state: "loading",
        isLoading: true,
        errorMessage: null,
      }));

      try {
        const dashboardState = await onboardingApi.getDashboardState();

        setHookState((currentState) => ({
          ...currentState,
          state: "idle",
          dashboardState,
          isLoading: false,
          isCompleted: dashboardState.onboardingStatus === "completed",
          errorMessage: null,
        }));

        return dashboardState;
      } catch {
        setError(ONBOARDING_SAFE_MESSAGES.loadError);

        throw new Error(ONBOARDING_SAFE_MESSAGES.loadError);
      }
    }, [setError]);

  /**
   * Clears the current safe UI error without removing loaded onboarding data.
   */
  const clearError = useCallback((): void => {
    setHookState((currentState) => ({
      ...currentState,
      state:
        currentState.isCompleted ||
        currentState.onboarding?.status === "completed"
          ? "submitted"
          : "idle",
      errorMessage: null,
    }));
  }, []);

  /**
   * Clears all locally held onboarding state.
   */
  const reset = useCallback((): void => {
    setHookState(INITIAL_HOOK_STATE);
  }, []);

  return {
    ...hookState,
    loadOnboarding,
    loadInvestorOnboarding,
    startOnboarding,
    saveInvestorProgress,
    submitInvestorOnboarding,
    loadRoleStatus,
    loadDashboardState,
    clearError,
    reset,
  };
}
