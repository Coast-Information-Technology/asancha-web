// File: app/dashboard/property-owner/listings/page.tsx

/**
 * Asancha Property Owner Listings Page
 *
 * Purpose:
 * Displays listings created from properties connected to the active owner
 * profile.
 *
 * Security notes:
 * - Property approval and listing publication are separate.
 */

import type { Metadata } from "next";

import { PropertyOwnerCollectionPage } from "../../_components/property-owner-collection-page";
import { PROPERTY_OWNER_COLLECTION_CONFIG } from "../../_config/property-owner-dashboard.config";

export const metadata: Metadata = {
    title: "My Listings",
};

export default function PropertyOwnerListingsPage() {
    return (
        <PropertyOwnerCollectionPage
            config={
                PROPERTY_OWNER_COLLECTION_CONFIG.listings
            }
        />
    );
}