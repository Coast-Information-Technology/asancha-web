// File: app/dashboard/investor/verification/page.tsx

/**
 * Asancha Investor Verification Page
 *
 * Purpose:
 * Displays safe investor verification states and correction actions.
 *
 * Security notes:
 * - Internal KYC notes and raw risk internals must never appear.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Verification",
};

export default function InvestorVerificationPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.verification
            }
        />
    );
}