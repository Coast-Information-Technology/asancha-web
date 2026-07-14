// File: app/dashboard/service-provider/profile/page.tsx

/**
 * Asancha Service Provider Profile Route
 *
 * Purpose:
 * Displays and updates the active provider's business and professional profile.
 */

import type { Metadata } from "next";

import { ServiceProviderProfilePage } from "../../_components/service-provider-profile-page";

export const metadata: Metadata = {
    title: "Service Profile",
};

export default function ProviderProfilePage() {
    return <ServiceProviderProfilePage />;
}