// File: app/dashboard/service-provider/conversations/page.tsx

/**
 * Asancha Service Provider Conversations Route
 *
 * Purpose:
 * Displays provider-scoped service, booking, verification, document, payment,
 * and support conversations.
 *
 * Security notes:
 * - Internal staff notes and unauthorised conversation messages remain hidden.
 */

import type { Metadata } from "next";

import { ServiceProviderCollectionPage } from "../../_components/service-provider-collection-page";
import { SERVICE_PROVIDER_COLLECTION_CONFIG } from "../../_config/service-provider-dashboard.config";

export const metadata: Metadata = {
    title: "Service Provider Conversations",
};

export default function ProviderConversationsPage() {
    return (
        <ServiceProviderCollectionPage
            config={
                SERVICE_PROVIDER_COLLECTION_CONFIG.conversations
            }
        />
    );
}