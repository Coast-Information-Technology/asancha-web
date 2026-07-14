// File: app/dashboard/service-provider/services/page.tsx

/**
 * Asancha Service Provider Services Route
 *
 * Purpose:
 * Displays services connected to the active service-provider profile.
 */

import type { Metadata } from "next";

import { ServiceProviderServicesPage } from "../../_components/service-provider-services-page";

export const metadata: Metadata = {
    title: "Provider Services",
};

export default function ProviderServicesPage() {
    return <ServiceProviderServicesPage />;
}