// File: app/dashboard/service-provider/bookings/page.tsx

/**
 * Asancha Service Provider Bookings Route
 *
 * Purpose:
 * Displays booking requests, upcoming work, completed jobs, cancellations,
 * and reschedule activity.
 *
 * Security notes:
 * - Booking acceptance and completion remain backend-controlled.
 */

import type { Metadata } from "next";

import { ServiceProviderCollectionPage } from "../../_components/service-provider-collection-page";
import { SERVICE_PROVIDER_COLLECTION_CONFIG } from "../../_config/service-provider-dashboard.config";

export const metadata: Metadata = {
    title: "Service Provider Bookings",
};

export default function ProviderBookingsPage() {
    return (
        <ServiceProviderCollectionPage
            config={
                SERVICE_PROVIDER_COLLECTION_CONFIG.bookings
            }
        />
    );
}