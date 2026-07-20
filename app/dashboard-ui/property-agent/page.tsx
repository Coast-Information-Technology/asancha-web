// File: app/dashboard-ui/property-agent/page.tsx

import type { Metadata } from "next";

import { PropertyAgentOverviewPage } from "../../dashboard/_components/property-agent-overview-page";

export const metadata: Metadata = {
    title: "Property Agent Dashboard UI Preview",
};

export default function PropertyAgentDashboardUiPreviewPage() {
    return <PropertyAgentOverviewPage />;
}
