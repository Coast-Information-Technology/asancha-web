// File: app/dashboard/property-owner/documents/page.tsx

/**
 * Asancha Property Owner Documents Page
 *
 * Purpose:
 * Displays property-owner, ownership, authority, identity, and property
 * document states.
 *
 * Security notes:
 * - Private document URLs and internal review notes must never be rendered.
 */

import type { Metadata } from "next";

import { PropertyOwnerCollectionPage } from "../../_components/property-owner-collection-page";
import { PROPERTY_OWNER_COLLECTION_CONFIG } from "../../_config/property-owner-dashboard.config";

export const metadata: Metadata = {
    title: "Property Owner Documents",
};

export default function PropertyOwnerDocumentsPage() {
    return (
        <PropertyOwnerCollectionPage
            config={
                PROPERTY_OWNER_COLLECTION_CONFIG.documents
            }
        />
    );
}