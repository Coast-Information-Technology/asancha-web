// File: app/dashboard/service-provider/profile/service-areas/page.tsx

/**
 * Asancha Service Provider Service Areas Route
 *
 * Purpose:
 * Displays and manages the geographic coverage of the active provider profile.
 */

import type { Metadata } from "next";

import { ServiceProviderServiceAreasPage } from "../../../_components/service-provider-service-areas-page";

export const metadata: Metadata = {
    title: "Service Areas",
};

export default function ProviderServiceAreasPage() {
    return (
        <ServiceProviderServiceAreasPage />
    );
}