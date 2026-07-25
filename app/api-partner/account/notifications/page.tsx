// File: app/api-partner/account/notifications/page.tsx

import type { Metadata } from "next";

import { AccountNotificationsPage } from "../../../account/_components/account-notifications-page";

export const metadata: Metadata = {
  title: "API Partner Notifications",
};

export default function ApiPartnerAccountNotificationsPage() {
  return <AccountNotificationsPage />;
}
