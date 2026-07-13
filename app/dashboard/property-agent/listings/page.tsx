// File: app/dashboard/property-agent/listings/page.tsx

import type { Metadata } from "next";

import { PropertyAgentCollectionPage } from "../../_components/property-agent-collection-page";
import { PROPERTY_AGENT_COLLECTION_CONFIG } from "../../_config/property-agent-dashboard.config";

export const metadata: Metadata = {
    title: "Agency Listings",
};

export default function AgentListingsPage() {
    return (
        <PropertyAgentCollectionPage
            config={
                PROPERTY_AGENT_COLLECTION_CONFIG.listings
            }
        />
    );
}