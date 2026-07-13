// File: app/dashboard/investor/documents/page.tsx

/**
 * Asancha Investor Documents Page
 *
 * Purpose:
 * Displays safe investor document metadata and review states.
 *
 * Security notes:
 * - Private storage URLs and internal review notes remain hidden.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Documents",
};

export default function InvestorDocumentsPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.documents
            }
        />
    );
}