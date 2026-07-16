// File: app/account/status/page.tsx

/**
 * Asancha Account Status Route
 *
 * Purpose:
 * Displays account, onboarding, verification, policy, document, payment, and
 * locked-action status.
 */

import type {
    Metadata,
} from "next";

import { AccountStatusPage } from "../_components/account-status-page";

export const metadata: Metadata = {
    title: "Account Status",
};

export default function StatusPage() {
    return <AccountStatusPage />;
}