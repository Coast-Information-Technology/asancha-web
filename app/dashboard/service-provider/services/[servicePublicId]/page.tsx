// File: app/dashboard/service-provider/services/[servicePublicId]/page.tsx

/**
 * Asancha Provider Service Detail Route
 *
 * Purpose:
 * Displays one provider-owned service using its public identifier.
 *
 * Security notes:
 * - MongoDB ObjectIds must never appear in this route.
 * - Backend ownership and active-profile checks remain authoritative.
 */

import type { Metadata } from "next";

import { ServiceProviderServiceDetailPage } from "../../../_components/service-provider-service-detail-page";

export const metadata: Metadata = {
    title: "Service Details",
};

export interface ProviderServiceDetailRouteProps {
    params: Promise<{
        servicePublicId: string;
    }>;
}

export default async function ProviderServiceDetailRoute({
    params,
}: ProviderServiceDetailRouteProps) {
    const { servicePublicId } = await params;

    return (
        <ServiceProviderServiceDetailPage
            servicePublicId={servicePublicId}
        />
    );
}