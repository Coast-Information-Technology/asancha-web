// File: app/dashboard/service-provider/profile/availability/page.tsx

/**
 * Asancha Service Provider Availability Route
 *
 * Purpose:
 * Displays and updates weekly availability and booking preferences.
 */

import type { Metadata } from "next";

import { ServiceProviderAvailabilityPage } from "../../../_components/service-provider-availability-page";

export const metadata: Metadata = {
    title: "Provider Availability",
};

export default function ProviderAvailabilityPage() {
    return (
        <ServiceProviderAvailabilityPage />
    );
}