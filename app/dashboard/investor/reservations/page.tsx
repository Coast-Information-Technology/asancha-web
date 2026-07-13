// File: app/dashboard/investor/reservations/page.tsx

/**
 * Asancha Investor Reservations Page
 *
 * Purpose:
 * Displays reservation requests and backend-controlled reservation states.
 *
 * Security notes:
 * - Payment submission does not confirm a reservation.
 */

import type { Metadata } from "next";

import { InvestorCollectionPage } from "../../_components/investor-collection-page";
import { INVESTOR_COLLECTION_CONFIG } from "../../_config/investor-dashboard.config";

export const metadata: Metadata = {
    title: "Investor Reservations",
};

export default function InvestorReservationsPage() {
    return (
        <InvestorCollectionPage
            config={
                INVESTOR_COLLECTION_CONFIG.reservations
            }
        />
    );
}