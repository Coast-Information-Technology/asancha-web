// File: app/api-partner/account/support/page.tsx

import type { Metadata } from "next";

import { AccountSupportPage } from "../../../account/_components/account-support-page";

export const metadata: Metadata = {
  title: "API Partner Support",
};

export default function ApiPartnerAccountSupportPage() {
  return <AccountSupportPage />;
}
