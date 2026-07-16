// File: app/account/page.tsx

/**
 * Asancha Account Overview Route
 *
 * Purpose:
 * Displays the authenticated account overview.
 */

import type {
    Metadata,
} from "next";

import { AccountOverviewPage } from "./_components/account-overview-page";

export const metadata: Metadata = {
    title: "Account",
};

export default function AccountPage() {
    return <AccountOverviewPage />;
}