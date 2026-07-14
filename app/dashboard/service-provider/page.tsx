// File: app/dashboard/service-provider/page.tsx

/**
 * Asancha Service Provider Dashboard Route
 *
 * Purpose:
 * Displays the protected service-provider workspace overview.
 */

import type { Metadata } from "next";

import { ServiceProviderOverviewPage } from "../_components/service-provider-overview-page";

export const metadata: Metadata = {
    title: "Service Provider Dashboard",
};

export default function ServiceProviderDashboardPage() {
    return <ServiceProviderOverviewPage />;
}