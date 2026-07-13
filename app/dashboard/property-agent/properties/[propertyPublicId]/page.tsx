// File: app/dashboard/property-agent/properties/[propertyPublicId]/page.tsx

import type { Metadata } from "next";

import { PropertyAgentPropertyDetailPage } from "../../../_components/property-agent-property-detail-page";

export const metadata: Metadata = {
    title: "Represented Property",
};

export interface AgentPropertyDetailRouteProps {
    params: Promise<{
        propertyPublicId: string;
    }>;
}

export default async function AgentPropertyDetailRoute({
    params,
}: AgentPropertyDetailRouteProps) {
    const { propertyPublicId } = await params;

    return (
        <PropertyAgentPropertyDetailPage
            propertyPublicId={propertyPublicId}
        />
    );
}