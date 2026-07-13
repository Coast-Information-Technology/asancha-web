// File: app/dashboard/property-owner/bookings/page.tsx

/**
 * Asancha Property Owner Bookings Page
 *
 * Purpose:
 * Displays property viewings, inspections, support sessions, and related
 * appointments.
 *
 * Security notes:
 * - Meeting details and participant information remain backend-controlled.
 */

import type { Metadata } from "next";

import { PropertyOwnerCollectionPage } from "../../_components/property-owner-collection-page";
import { PROPERTY_OWNER_COLLECTION_CONFIG } from "../../_config/property-owner-dashboard.config";

export const metadata: Metadata = {
    title: "Property Owner Bookings",
};

export default function PropertyOwnerBookingsPage() {
    return (
        <PropertyOwnerCollectionPage
            config={
                PROPERTY_OWNER_COLLECTION_CONFIG.bookings
            }
        />
    );
}