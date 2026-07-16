// File: app/account/profile/page.tsx

/**
 * Asancha Account Profile Route
 *
 * Purpose:
 * Displays and updates the authenticated user's general profile.
 */

import type {
    Metadata,
} from "next";

import { AccountProfilePage } from "../_components/account-profile-page";

export const metadata: Metadata = {
    title: "Account Profile",
};

export default function ProfilePage() {
    return <AccountProfilePage />;
}