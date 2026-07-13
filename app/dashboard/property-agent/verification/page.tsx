// File: app/dashboard/property-agent/verification/page.tsx

import type { Metadata } from "next";

import { PropertyAgentCollectionPage } from "../../_components/property-agent-collection-page";
import { PROPERTY_AGENT_COLLECTION_CONFIG } from "../../_config/property-agent-dashboard.config";

export const metadata: Metadata = {
    title: "Property Agent Verification",
};

export default function AgentVerificationPage() {
    return (
        <PropertyAgentCollectionPage
            config={
                PROPERTY_AGENT_COLLECTION_CONFIG.verification
            }
        />
    );
}