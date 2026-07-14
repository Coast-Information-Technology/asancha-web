// File: app/dashboard/property-sourcer/compliance/listing-standards/page.tsx

/**
 * Asancha Sourcer Listing Standards Route
 *
 * Purpose:
 * Displays and accepts the current property-listing standards.
 */

import type { Metadata } from "next";

import { PropertySourcerPolicyPage } from "../../../_components/property-sourcer-policy-page";

export const metadata: Metadata = {
    title: "Listing Standards",
};

export default function SourcerListingStandardsPage() {
    return (
        <PropertySourcerPolicyPage
            policyKey="listing_standards"
        />
    );
}