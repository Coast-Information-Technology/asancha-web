"use client";

// File: src/features/dashboard/hooks/use-dashboard.ts

/**
 * Asancha Dashboard Hook
 *
 * Purpose:
 * Provides client components with the current backend-controlled dashboard
 * state, active business-profile context, role-specific navigation, and
 * action-availability helpers.
 *
 * Responsibilities:
 * - Load and refresh dashboard state.
 * - Resolve role-specific dashboard navigation.
 * - Filter restricted navigation using backend action state.
 * - Expose active business-profile information.
 * - Expose helpers for checking action availability.
 * - Maintain safe loading and error states.
 *
 * Security notes:
 * - Navigation filtering and action helpers are UX guidance only.
 * - A client-side "unlocked" result does not authorize an API request.
 * - Backend checks remain final for every protected resource and action.
 * - This hook stores public-safe dashboard data in component memory only.
 */

import { useCallback, useMemo, useState } from "react";

import { dashboardApi } from "../api/dashboard.api";
import {
  DASHBOARD_SAFE_MESSAGES,
  filterDashboardNavigation,
  getDashboardNavigation,
} from "../constants/dashboard-navigation.constants";
import type {
  DashboardActionState,
  DashboardHookState,
  DashboardState,
  UseDashboardResult,
} from "../types/dashboard.types";

const INITIAL_DASHBOARD_STATE: DashboardHookState = {
  requestState: "idle",
  dashboardState: null,
  activeProfile: null,
  navigation: [],
  errorMessage: null,
  isLoading: false,
  isRefreshing: false,
  lastLoadedAt: null,
};

function combineDashboardActions(
  dashboardState: DashboardState,
): DashboardActionState[] {
  return [
    ...dashboardState.unlockedActions,
    ...dashboardState.lockedActions,
    ...dashboardState.pendingActions,
  ];
}

export function useDashboard(): UseDashboardResult {
  const [hookState, setHookState] = useState<DashboardHookState>(
    INITIAL_DASHBOARD_STATE,
  );

  const loadDashboard =
    useCallback(async (): Promise<DashboardState | null> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        isRefreshing: false,
        errorMessage: null,
      }));

      try {
        const dashboardState = await dashboardApi.getDashboardState();

        const allActions = combineDashboardActions(dashboardState);

        const baseNavigation = getDashboardNavigation(
          dashboardState.activeBusinessProfileType,
        );

        const navigation = filterDashboardNavigation(
          baseNavigation,
          allActions,
        );

        setHookState({
          requestState: "success",
          dashboardState,
          activeProfile: dashboardState.activeBusinessProfile,
          navigation,
          errorMessage: null,
          isLoading: false,
          isRefreshing: false,
          lastLoadedAt: Date.now(),
        });

        return dashboardState;
      } catch {
        setHookState((currentState) => ({
          ...currentState,
          requestState: "error",
          errorMessage: DASHBOARD_SAFE_MESSAGES.loadError,
          isLoading: false,
          isRefreshing: false,
        }));

        return null;
      }
    }, []);

  const refreshDashboard =
    useCallback(async (): Promise<DashboardState | null> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "refreshing",
        isLoading: false,
        isRefreshing: true,
        errorMessage: null,
      }));

      try {
        const dashboardState = await dashboardApi.getDashboardState();

        const allActions = combineDashboardActions(dashboardState);

        const baseNavigation = getDashboardNavigation(
          dashboardState.activeBusinessProfileType,
        );

        const navigation = filterDashboardNavigation(
          baseNavigation,
          allActions,
        );

        setHookState({
          requestState: "success",
          dashboardState,
          activeProfile: dashboardState.activeBusinessProfile,
          navigation,
          errorMessage: null,
          isLoading: false,
          isRefreshing: false,
          lastLoadedAt: Date.now(),
        });

        return dashboardState;
      } catch {
        setHookState((currentState) => ({
          ...currentState,
          requestState: "error",
          errorMessage: DASHBOARD_SAFE_MESSAGES.loadError,
          isLoading: false,
          isRefreshing: false,
        }));

        return null;
      }
    }, []);

  const actionMap = useMemo(() => {
    if (!hookState.dashboardState) {
      return new Map<string, DashboardActionState>();
    }

    return new Map(
      combineDashboardActions(hookState.dashboardState).map((action) => [
        action.action,
        action,
      ]),
    );
  }, [hookState.dashboardState]);

  const isActionUnlocked = useCallback(
    (action: string): boolean => {
      return actionMap.get(action)?.availability === "unlocked";
    },
    [actionMap],
  );

  const getActionState = useCallback(
    (action: string): DashboardActionState | null => {
      return actionMap.get(action) ?? null;
    },
    [actionMap],
  );

  const clearError = useCallback((): void => {
    setHookState((currentState) => ({
      ...currentState,
      requestState: currentState.dashboardState ? "success" : "idle",
      errorMessage: null,
    }));
  }, []);

  const reset = useCallback((): void => {
    setHookState(INITIAL_DASHBOARD_STATE);
  }, []);

  return {
    ...hookState,
    loadDashboard,
    refreshDashboard,
    clearError,
    reset,
    isActionUnlocked,
    getActionState,
  };
}
