// File: app/api-partner/apply/page.tsx

import type { Metadata } from "next";

import { ApiPartnerApplyPageClient } from "./_components/api-partner-apply-page-client";

export const metadata: Metadata = {
  title: "API Partner Application | Asancha",
  description:
    "Complete the Asancha API partner application after registration and email verification.",
};

export default function ApiPartnerApplyPage() {
  return <ApiPartnerApplyPageClient mode="application" />;
}
