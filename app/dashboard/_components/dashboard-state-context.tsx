"use client";

// File: app/dashboard/_components/dashboard-state-context.tsx

import {
    createContext,
    useContext,
} from "react";

import type {
    DashboardState,
} from "../_types/dashboard.types";

interface DashboardStateContextValue {
    dashboardState: DashboardState | null;
    isLoading: boolean;
    errorMessage: string | null;
}

const DashboardStateContext =
    createContext<DashboardStateContextValue>({
        dashboardState: null,
        isLoading: true,
        errorMessage: null,
    });

export const DashboardStateProvider =
    DashboardStateContext.Provider;

export function useDashboardState(): DashboardStateContextValue {
    return useContext(DashboardStateContext);
}
