// File: app/dashboard/property-owner/verification/page.tsx

/**
 * Asancha Property Owner Verification Page
 *
 * Purpose:
 * Displays safe property-owner verification and correction states.
 *
 * Security notes:
 * - Internal KYC notes and risk internals remain backend-only.
 */

import type { Metadata } from "next";

import { PropertyOwnerCollectionPage } from "../../_components/property-owner-collection-page";
import { PROPERTY_OWNER_COLLECTION_CONFIG } from "../../_config/property-owner-dashboard.config";

export const metadata: Metadata = {
    title: "Property Owner Verification",
};

export default function PropertyOwnerVerificationPage() {
    return (
        <PropertyOwnerCollectionPage
            config={
                PROPERTY_OWNER_COLLECTION_CONFIG.verification
            }
        />
    );
}