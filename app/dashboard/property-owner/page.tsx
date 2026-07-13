// File: app/dashboard/property-owner/page.tsx

/**
 * Asancha Property Owner Dashboard Page
 *
 * Purpose:
 * Displays the protected property-owner workspace overview.
 */

import type { Metadata } from "next";

import { PropertyOwnerOverviewPage } from "../_components/property-owner-overview-page";

export const metadata: Metadata = {
    title: "Property Owner Dashboard",
};

export default function PropertyOwnerDashboardPage() {
    return <PropertyOwnerOverviewPage />;
}