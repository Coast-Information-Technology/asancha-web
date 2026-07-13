// File: app/dashboard/investor/preferences/page.tsx

/**
 * Asancha Investor Preference Overview Page
 *
 * Purpose:
 * Displays and updates general investor matching preferences.
 */

import type { Metadata } from "next";

import { InvestorPreferencesPage } from "../../_components/investor-preferences-page";

export const metadata: Metadata = {
    title: "Investor Preferences",
};

export default function InvestorPreferencesOverviewPage() {
    return (
        <InvestorPreferencesPage
            section="overview"
        />
    );
}