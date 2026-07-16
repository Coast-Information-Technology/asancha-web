// File: app/account/support/page.tsx

/**
 * Asancha Account Support Route
 *
 * Purpose:
 * Creates an authenticated support request.
 */

import type {
    Metadata,
} from "next";

import { AccountSupportPage } from "../_components/account-support-page";

export const metadata: Metadata = {
    title: "Support",
};

export default function SupportPage() {
    return <AccountSupportPage />;
}