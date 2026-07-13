// File: app/dashboard/property-owner/conversations/page.tsx

/**
 * Asancha Property Owner Conversations Page
 *
 * Purpose:
 * Displays owner-scoped property, listing, document, verification, booking,
 * payment, and support conversations.
 *
 * Security notes:
 * - Internal notes and hidden messages must not appear.
 */

import type { Metadata } from "next";

import { PropertyOwnerCollectionPage } from "../../_components/property-owner-collection-page";
import { PROPERTY_OWNER_COLLECTION_CONFIG } from "../../_config/property-owner-dashboard.config";

export const metadata: Metadata = {
    title: "Property Owner Conversations",
};

export default function PropertyOwnerConversationsPage() {
    return (
        <PropertyOwnerCollectionPage
            config={
                PROPERTY_OWNER_COLLECTION_CONFIG.conversations
            }
        />
    );
}