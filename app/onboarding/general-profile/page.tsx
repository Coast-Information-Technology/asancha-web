// File: app/onboarding/general-profile/page.tsx

/**
 * Asancha General Profile Onboarding Page
 *
 * Purpose:
 * Collects non-role-specific identity and contact information.
 */

import type { Metadata } from "next";

import { OnboardingFormPage } from "../_components/onboarding-form-page";
import { GENERAL_PROFILE_ONBOARDING_CONFIG } from "../_config/onboarding-page-config";

export const metadata: Metadata = {
    title: "General Profile Setup",
    description:
        "Complete your general identity and contact information.",
};

export default function GeneralProfileOnboardingPage() {
    return (
        <OnboardingFormPage
            config={
                GENERAL_PROFILE_ONBOARDING_CONFIG
            }
        />
    );
}