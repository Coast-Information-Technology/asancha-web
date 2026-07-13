// File: app/dashboard/property-agent/properties/page.tsx

import type { Metadata } from "next";

import { PropertyAgentPropertiesPage } from "../../_components/property-agent-properties-page";

export const metadata: Metadata = {
    title: "Represented Properties",
};

export default function AgentPropertiesPage() {
    return <PropertyAgentPropertiesPage />;
}