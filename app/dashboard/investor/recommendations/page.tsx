// File: app/dashboard/investor/recommendations/page.tsx

/**
 * Asancha Investor Recommendations Page
 *
 * Purpose:
 * Displays AI recommendations, safe explanations and available actions.
 *
 * Security notes:
 * - Internal prompts and scoring internals must not appear.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "AI Recommendations",
};

export default function InvestorRecommendationsPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.recommendations
            }
        />
    );
}