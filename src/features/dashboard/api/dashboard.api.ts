// File: src/features/dashboard/api/dashboard.api.ts

/**
 * Asancha Dashboard API
 *
 * Purpose:
 * Provides the authenticated API function used to retrieve the current
 * public user's backend-controlled dashboard state.
 *
 * Responsibilities:
 * - Retrieve the active-profile-aware dashboard state.
 * - Validate the response at runtime using Zod.
 * - Return only a trusted public-safe dashboard contract.
 *
 * Security notes:
 * - The backend determines authentication, active profile, action availability,
 *   account restrictions, policy requirements, verification requirements,
 *   document requirements, payment requirements, and resource permissions.
 * - Runtime frontend validation does not replace backend authorization.
 * - No ObjectIds, secrets, private KYC notes, internal admin notes, or
 *   restricted document URLs are accepted by the dashboard contract.
 */

import { authApiGet } from "../../../lib/api/auth-fetch";

import { DASHBOARD_API_ENDPOINTS } from "../constants/dashboard-navigation.constants";
import { dashboardStateSchema } from "../schemas/dashboard.schema";
import type { DashboardState } from "../types/dashboard.types";

async function getDashboardState(): Promise<DashboardState> {
  const response = await authApiGet<unknown>(DASHBOARD_API_ENDPOINTS.state);

  return dashboardStateSchema.parse(response);
}

export const dashboardApi = {
  getDashboardState,
} as const;
