// File: app/dashboard/property-sourcer/deals/page.tsx

/**
 * Asancha Property Sourcer Deals Route
 *
 * Purpose:
 * Displays deals submitted by the active property-sourcer profile.
 */

import type { Metadata } from "next";

import { PropertySourcerDealsPage } from "../../_components/property-sourcer-deals-page";

export const metadata: Metadata = {
    title: "Sourcer Deals",
};

export default function SourcerDealsPage() {
    return <PropertySourcerDealsPage />;
}