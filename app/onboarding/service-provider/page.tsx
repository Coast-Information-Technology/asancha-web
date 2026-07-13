// File: app/onboarding/service-provider/page.tsx

/**
 * Asancha Service Provider Onboarding Page
 *
 * Purpose:
 * Collects service-provider identity, services, qualifications, coverage and
 * availability.
 *
 * Security notes:
 * - Completion does not automatically verify professional claims.
 * - Backend document, policy and verification requirements remain final.
 */

import type { Metadata } from "next";

import { OnboardingFormPage } from "../_components/onboarding-form-page";
import { SERVICE_PROVIDER_ONBOARDING_CONFIG } from "../_config/onboarding-page-config";

export const metadata: Metadata = {
    title: "Service Provider Onboarding",
    description:
        "Complete your Asancha professional service provider profile.",
};

export default function ServiceProviderOnboardingPage() {
    return (
        <OnboardingFormPage
            config={
                SERVICE_PROVIDER_ONBOARDING_CONFIG
            }
        />
    );
}