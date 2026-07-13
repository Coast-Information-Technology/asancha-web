// File: app/dashboard/investor/saved/page.tsx

/**
 * Asancha Saved Investor Opportunities Page
 *
 * Purpose:
 * Displays opportunities saved by the active investor profile.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Saved Properties",
};

export default function SavedInvestorPropertiesPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.saved
            }
        />
    );
}