// File: app/dashboard/property-owner/payments/page.tsx

/**
 * Asancha Property Owner Payments Page
 *
 * Purpose:
 * Displays safe payment references and payment states connected to the active
 * property-owner profile.
 *
 * Security notes:
 * - Payment proof does not equal payment approval.
 * - Provider secrets and private banking data must never be rendered.
 */

import type { Metadata } from "next";

import { PropertyOwnerCollectionPage } from "../../_components/property-owner-collection-page";
import { PROPERTY_OWNER_COLLECTION_CONFIG } from "../../_config/property-owner-dashboard.config";

export const metadata: Metadata = {
    title: "Property Owner Payments",
};

export default function PropertyOwnerPaymentsPage() {
    return (
        <PropertyOwnerCollectionPage
            config={
                PROPERTY_OWNER_COLLECTION_CONFIG.payments
            }
        />
    );
}