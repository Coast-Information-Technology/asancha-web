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

import { ServiceProviderOnboardingForm } from "./_components/service-provider-onboarding-form";

export const metadata: Metadata = {
    title: "Service Provider Onboarding",
    description:
        "Complete your Asancha professional service provider profile.",
};

export default function ServiceProviderOnboardingPage() {
    return <ServiceProviderOnboardingForm />;
}
