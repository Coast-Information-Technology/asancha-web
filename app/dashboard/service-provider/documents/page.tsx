// File: app/dashboard/service-provider/documents/page.tsx

/**
 * Asancha Service Provider Documents Route
 *
 * Purpose:
 * Displays safe identity, business, professional, insurance, certification,
 * licence, and compliance document states.
 *
 * Security notes:
 * - Private document URLs and internal review notes must never be rendered.
 */

import type { Metadata } from "next";

import { ServiceProviderCollectionPage } from "../../_components/service-provider-collection-page";
import { SERVICE_PROVIDER_COLLECTION_CONFIG } from "../../_config/service-provider-dashboard.config";

export const metadata: Metadata = {
    title: "Service Provider Documents",
};

export default function ProviderDocumentsPage() {
    return (
        <ServiceProviderCollectionPage
            config={
                SERVICE_PROVIDER_COLLECTION_CONFIG.documents
            }
        />
    );
}