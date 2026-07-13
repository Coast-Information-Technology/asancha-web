// File: app/dashboard/property-agent/company/page.tsx

import type { Metadata } from "next";

import { PropertyAgentCompanyPage } from "../../_components/property-agent-company-page";

export const metadata: Metadata = {
    title: "Agency Company",
};

export default function AgentCompanyPage() {
    return <PropertyAgentCompanyPage />;
}