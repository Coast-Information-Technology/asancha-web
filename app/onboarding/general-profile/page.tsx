// File: app/onboarding/general-profile/page.tsx

/**
 * Asancha General Profile Onboarding Page
 *
 * Purpose:
 * Collects non-role-specific identity and contact information.
 */

import type { Metadata } from "next";

import { GeneralProfilePageClient } from "./_components/general-profile-page-client";

export const metadata: Metadata = {
    title: "General Profile Setup",
    description:
        "Complete your general identity and contact information.",
};

export default function GeneralProfileOnboardingPage() {
    return <GeneralProfilePageClient />;
}
