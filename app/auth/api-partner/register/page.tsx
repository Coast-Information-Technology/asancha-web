// File: app/auth/api-partner/register/page.tsx

import type { Metadata } from "next";

import { ApiPartnerApplyPageClient } from "../../../api-partner/apply/_components/api-partner-apply-page-client";

export const metadata: Metadata = {
  title: "API Partner Registration | Asancha",
  description:
    "Register an Asancha API partner account before email verification and application.",
};

export default function ApiPartnerRegisterPage() {
  return <ApiPartnerApplyPageClient mode="registration" />;
}
