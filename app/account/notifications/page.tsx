// File: app/account/notifications/page.tsx

/**
 * Asancha Account Notification Preferences Route
 *
 * Purpose:
 * Displays and updates account notification preferences.
 */

import type {
    Metadata,
} from "next";

import { AccountNotificationsPage } from "../_components/account-notifications-page";

export const metadata: Metadata = {
    title: "Notification Preferences",
};

export default function NotificationsPage() {
    return <AccountNotificationsPage />;
}