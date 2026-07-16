// File: app/account/business-profiles/add/page.tsx

/**
 * Asancha Add Business Profile Route
 *
 * Purpose:
 * Allows an existing user to add another approved public business profile
 * without creating another account.
 */

import type {
    Metadata,
} from "next";

import { AddBusinessProfilePage } from "../../_components/add-business-profile-page";

export const metadata: Metadata = {
    title: "Add Business Profile",
};

export default function AddProfilePage() {
    return <AddBusinessProfilePage />;
}