// File: app/dashboard-ui/investor/page.tsx

import type { Metadata } from "next";

import { InvestorOverviewPage } from "../../dashboard/_components/investor-overview-page";

export const metadata: Metadata = {
    title: "Investor Dashboard UI Preview",
};

export default function InvestorDashboardUiPreviewPage() {
    return <InvestorOverviewPage />;
}
