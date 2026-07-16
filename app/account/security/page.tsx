// File: app/account/security/page.tsx

/**
 * Asancha Account Security Route
 *
 * Purpose:
 * Displays password, email, sessions, login activity, and security alerts.
 */

import type {
    Metadata,
} from "next";

import { AccountSecurityPage } from "../_components/account-security-page";

export const metadata: Metadata = {
    title: "Account Security",
};

export default function SecurityPage() {
    return <AccountSecurityPage />;
}