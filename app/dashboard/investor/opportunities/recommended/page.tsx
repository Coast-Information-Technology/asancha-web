// File: app/dashboard/investor/opportunities/recommended/page.tsx

/**
 * Asancha Recommended Investor Opportunities Page
 *
 * Purpose:
 * Displays opportunities recommended for the active investor profile.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Recommended Opportunities",
};

export default function RecommendedOpportunitiesPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.recommendedOpportunities
            }
        />
    );
}