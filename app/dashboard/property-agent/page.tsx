// File: app/dashboard/property-agent/page.tsx

/**
 * Asancha Property Agent Dashboard Route
 *
 * Purpose:
 * Displays the property-agent workspace overview.
 */

import type { Metadata } from "next";

import { PropertyAgentOverviewPage } from "../_components/property-agent-overview-page";

export const metadata: Metadata = {
    title: "Property Agent Dashboard",
};

export default function PropertyAgentDashboardPage() {
    return <PropertyAgentOverviewPage />;
}