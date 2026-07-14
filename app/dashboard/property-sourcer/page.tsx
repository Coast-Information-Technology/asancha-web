// File: app/dashboard/property-sourcer/page.tsx

/**
 * Asancha Property Sourcer Dashboard Route
 *
 * Purpose:
 * Displays the property-sourcer workspace overview.
 */

import type { Metadata } from "next";

import { PropertySourcerOverviewPage } from "../_components/property-sourcer-overview-page";

export const metadata: Metadata = {
    title: "Property Sourcer Dashboard",
};

export default function PropertySourcerDashboardPage() {
    return <PropertySourcerOverviewPage />;
}