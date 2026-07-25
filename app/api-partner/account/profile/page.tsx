// File: app/api-partner/account/profile/page.tsx

import type { Metadata } from "next";

import { ClientView } from "../../_components/api-partner-views";

export const metadata: Metadata = {
  title: "API Partner Profile",
};

export default function ApiPartnerAccountProfilePage() {
  return <ClientView />;
}
