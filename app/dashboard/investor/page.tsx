// File: app/dashboard/investor/page.tsx

/**
 * Asancha Investor Dashboard Overview
 *
 * Purpose:
 * Displays the protected investor dashboard overview.
 */

import type { Metadata } from "next";

import { InvestorOverviewPage } from "../_components/investor-overview-page";

export const metadata: Metadata = {
    title: "Investor Dashboard",
};

export default function InvestorDashboardPage() {
    return <InvestorOverviewPage />;
}