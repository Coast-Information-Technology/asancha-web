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

import { RoleOnboardingPolicyGate } from "../_components/role-onboarding-policy-gate";
import { ServiceProviderOnboardingForm } from "./_components/service-provider-onboarding-form";

export const metadata: Metadata = {
    title: "Service Provider Onboarding",
    description:
        "Complete your Asancha professional service provider profile.",
};

export default function ServiceProviderOnboardingPage() {
    return (
        <RoleOnboardingPolicyGate profileType="service_provider">
            <ServiceProviderOnboardingForm />
        </RoleOnboardingPolicyGate>
    );
}
