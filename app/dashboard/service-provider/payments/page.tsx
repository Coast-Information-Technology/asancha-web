// File: app/dashboard/service-provider/payments/page.tsx

/**
 * Asancha Service Provider Payments Route
 *
 * Purpose:
 * Displays safe service-provider payment references and payment states.
 *
 * Security notes:
 * - Payment proof does not equal payment approval.
 * - Provider secrets, webhook secrets, bank credentials, and raw provider
 *   payloads must never be rendered.
 */

import type { Metadata } from "next";

import { ServiceProviderCollectionPage } from "../../_components/service-provider-collection-page";
import { SERVICE_PROVIDER_COLLECTION_CONFIG } from "../../_config/service-provider-dashboard.config";

export const metadata: Metadata = {
    title: "Service Provider Payments",
};

export default function ProviderPaymentsPage() {
    return (
        <ServiceProviderCollectionPage
            config={
                SERVICE_PROVIDER_COLLECTION_CONFIG.payments
            }
        />
    );
}