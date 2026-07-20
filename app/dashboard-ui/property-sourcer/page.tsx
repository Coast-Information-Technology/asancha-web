// File: app/dashboard-ui/property-sourcer/page.tsx

import type { Metadata } from "next";

import { PropertySourcerOverviewPage } from "../../dashboard/_components/property-sourcer-overview-page";

export const metadata: Metadata = {
    title: "Property Sourcer Dashboard UI Preview",
};

export default function PropertySourcerDashboardUiPreviewPage() {
    return <PropertySourcerOverviewPage />;
}
