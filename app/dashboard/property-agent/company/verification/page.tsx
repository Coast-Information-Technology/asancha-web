// File: app/dashboard/property-agent/company/verification/page.tsx

import type { Metadata } from "next";

import { PropertyAgentCollectionPage } from "../../../_components/property-agent-collection-page";
import { PROPERTY_AGENT_COLLECTION_CONFIG } from "../../../_config/property-agent-dashboard.config";

export const metadata: Metadata = {
    title: "Company Verification",
};

export default function AgentCompanyVerificationPage() {
    return (
        <PropertyAgentCollectionPage
            config={
                PROPERTY_AGENT_COLLECTION_CONFIG.companyVerification
            }
        />
    );
}