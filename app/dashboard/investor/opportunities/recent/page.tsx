// File: app/dashboard/investor/opportunities/recent/page.tsx

/**
 * Asancha Recently Viewed Opportunities Page
 *
 * Purpose:
 * Displays recently viewed investor opportunities where tracking is enabled.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Recently Viewed Opportunities",
};

export default function RecentOpportunitiesPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.recentOpportunities
            }
        />
    );
}