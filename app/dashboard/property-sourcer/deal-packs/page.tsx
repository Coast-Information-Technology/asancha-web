// File: app/dashboard/property-sourcer/deal-packs/page.tsx

/**
 * Asancha Sourcer Deal Packs Route
 *
 * Purpose:
 * Displays deal packs connected to the active property-sourcer profile.
 */

import type { Metadata } from "next";

import { PropertySourcerCollectionPage } from "../../_components/property-sourcer-collection-page";
import { PROPERTY_SOURCER_COLLECTION_CONFIG } from "../../_config/property-sourcer-dashboard.config";

export const metadata: Metadata = {
    title: "Deal Packs",
};

export default function SourcerDealPacksPage() {
    return (
        <PropertySourcerCollectionPage
            config={
                PROPERTY_SOURCER_COLLECTION_CONFIG.dealPacks
            }
        />
    );
}