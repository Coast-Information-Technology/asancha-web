// File: app/notifications/page.tsx

/**
 * Backward-compatible redirect for stale notification navigation links.
 * The current user-facing notification controls live in account settings.
 */

import { redirect } from "next/navigation";

export default function LegacyNotificationsPage(): never {
    redirect("/account/notifications");
}
