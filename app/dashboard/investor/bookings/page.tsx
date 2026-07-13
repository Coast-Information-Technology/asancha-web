// File: app/dashboard/investor/bookings/page.tsx

/**
 * Asancha Investor Bookings Page
 *
 * Purpose:
 * Displays investor property viewings, consultations and booking invitations.
 *
 * Security notes:
 * - Meeting links remain backend-controlled.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Bookings",
};

export default function InvestorBookingsPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.bookings
            }
        />
    );
}