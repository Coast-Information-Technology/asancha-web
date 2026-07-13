// File: app/dashboard/investor/payments/history/page.tsx

/**
 * Asancha Investor Payment History Page
 *
 * Purpose:
 * Displays safe historical investor payment records.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Payment History",
};

export default function InvestorPaymentHistoryPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.paymentHistory
            }
        />
    );
}