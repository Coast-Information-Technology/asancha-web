// File: app/api-partner/account/security/page.tsx

import type { Metadata } from "next";

import { AccountSecurityPage } from "../../../account/_components/account-security-page";

export const metadata: Metadata = {
  title: "API Partner Security",
};

export default function ApiPartnerAccountSecurityPage() {
  return <AccountSecurityPage />;
}
