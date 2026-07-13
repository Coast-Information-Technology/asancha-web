// File: app/dashboard/investor/payments/page.tsx

/**
 * Asancha Investor Payments Page
 *
 * Purpose:
 * Displays active investor payment references and required actions.
 *
 * Security notes:
 * - User-submitted proof is not final approval.
 * - Provider secrets and private bank details must not appear.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Payments",
};

export default function InvestorPaymentsPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.payments
            }
        />
    );
}