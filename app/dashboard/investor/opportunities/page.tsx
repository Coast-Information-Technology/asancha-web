// File: app/dashboard/investor/opportunities/page.tsx

/**
 * Asancha Investor Opportunities Page
 *
 * Purpose:
 * Displays public-safe property opportunities for the active investor profile.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Opportunities",
};

export default function InvestorOpportunitiesPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.opportunities
            }
        />
    );
}