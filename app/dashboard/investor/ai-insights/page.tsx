// File: app/dashboard/investor/ai-insights/page.tsx

/**
 * Asancha Investor AI Insights Page
 *
 * Purpose:
 * Displays eligible safe property-intelligence insights.
 *
 * Security notes:
 * - AI insights are guidance only.
 * - Private prompts, provider payloads and hidden scoring data remain internal.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "AI Insights",
};

export default function InvestorAiInsightsPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.aiInsights
            }
        />
    );
}