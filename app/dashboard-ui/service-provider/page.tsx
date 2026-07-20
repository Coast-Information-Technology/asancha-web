// File: app/dashboard-ui/service-provider/page.tsx

import type { Metadata } from "next";

import { ServiceProviderOverviewPage } from "../../dashboard/_components/service-provider-overview-page";

export const metadata: Metadata = {
    title: "Service Provider Dashboard UI Preview",
};

export default function ServiceProviderDashboardUiPreviewPage() {
    return <ServiceProviderOverviewPage />;
}
