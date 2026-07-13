// File: app/dashboard/investor/preferences/locations/page.tsx

/**
 * Asancha Investor Location Preferences Page
 *
 * Purpose:
 * Updates preferred and excluded property-investment locations.
 */

import type { Metadata } from "next";

import { InvestorPreferencesPage } from "../../../_components/investor-preferences-page";

export const metadata: Metadata = {
    title: "Location Preferences",
};

export default function InvestorLocationPreferencesPage() {
    return (
        <InvestorPreferencesPage
            section="locations"
        />
    );
}