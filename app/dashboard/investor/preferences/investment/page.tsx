// File: app/dashboard/investor/preferences/investment/page.tsx

/**
 * Asancha Investor Investment Preferences Page
 *
 * Purpose:
 * Updates budgets, strategies, property types and target-return preferences.
 */

import type { Metadata } from "next";

import { InvestorPreferencesPage } from "../../../_components/investor-preferences-page";

export const metadata: Metadata = {
    title: "Investment Preferences",
};

export default function InvestmentPreferencesPage() {
    return (
        <InvestorPreferencesPage
            section="investment"
        />
    );
}