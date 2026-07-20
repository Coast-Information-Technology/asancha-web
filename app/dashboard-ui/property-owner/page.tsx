// File: app/dashboard-ui/property-owner/page.tsx

import type { Metadata } from "next";

import { PropertyOwnerOverviewPage } from "../../dashboard/_components/property-owner-overview-page";

export const metadata: Metadata = {
    title: "Property Owner Dashboard UI Preview",
};

export default function PropertyOwnerDashboardUiPreviewPage() {
    return <PropertyOwnerOverviewPage />;
}
