// File: app/dashboard/page.tsx

/**
 * Asancha Dashboard Resolver
 *
 * Purpose:
 * Resolves the active business profile and redirects the authenticated user to
 * the correct protected dashboard.
 *
 * Security notes:
 * - This redirect is UX routing only.
 * - Backend profile and account validation remain authoritative.
 */

import { redirect } from "next/navigation";

import { authApiGet } from "../../src/lib/api/auth-fetch";
import type {
    DashboardState,
    PublicBusinessProfileType,
} from "./_types/dashboard.types";

const DASHBOARD_PATH_BY_PROFILE: Record<
    PublicBusinessProfileType,
    string
> = {
    investor: "/dashboard/investor",
    property_owner: "/dashboard/property-owner",
    property_agent: "/dashboard/property-agent",
    property_sourcer:
        "/dashboard/property-sourcer",
    service_provider:
        "/dashboard/service-provider",
    api_partner: "/api-partner/dashboard",
};

export default async function DashboardPage() {
    let state: DashboardState;

    try {
        state =
            await authApiGet<DashboardState>(
                "/me/dashboard-state",
            );
    } catch {
        redirect("/auth/sign-in?next=/dashboard");
    }

    if (!state.activeBusinessProfileType) {
        redirect("/onboarding");
    }

    redirect(
        DASHBOARD_PATH_BY_PROFILE[
        state.activeBusinessProfileType
        ],
    );
}
