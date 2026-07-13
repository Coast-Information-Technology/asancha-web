// File: app/onboarding/investor/page.tsx

/**
 * Asancha Investor Onboarding Page
 *
 * Purpose:
 * Collects investor criteria, strategy preferences, deal preferences and
 * funding readiness for marketplace matching and recommendations.
 *
 * Security notes:
 * - AI recommendations remain guidance only.
 * - Submission does not approve proof of funds or verification.
 */

import type { Metadata } from "next";

import { OnboardingFormPage } from "../_components/onboarding-form-page";
import { INVESTOR_ONBOARDING_CONFIG } from "../_config/onboarding-page-config";

export const metadata: Metadata = {
    title: "Investor Onboarding",
    description:
        "Complete your Asancha investor profile and property investment preferences.",
};

export default function InvestorOnboardingPage() {
    return (
        <OnboardingFormPage
            config={INVESTOR_ONBOARDING_CONFIG}
        />
    );
}