// File: app/api-partner/dashboard/page.tsx

import type { Metadata } from "next";

import { ApiPartnerDashboardPageClient } from "./_components/api-partner-dashboard-page-client";

export const metadata: Metadata = {
  title: "API Partner Dashboard | Asancha",
  description:
    "Review API partner application status and approved API access.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiPartnerDashboardPage() {
  return <ApiPartnerDashboardPageClient />;
}
