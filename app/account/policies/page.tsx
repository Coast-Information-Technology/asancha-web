// File: app/account/policies/page.tsx

/**
 * Asancha Account Policies Route
 *
 * Purpose:
 * Displays account and business-profile policy acceptance records.
 */

import type {
    Metadata,
} from "next";

import { AccountPoliciesPage } from "../_components/account-policies-page";

export const metadata: Metadata = {
    title: "Policies",
};

export default function PoliciesPage() {
    return <AccountPoliciesPage />;
}