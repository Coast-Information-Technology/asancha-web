// File: app/onboarding/property-sourcer/page.tsx

/**
 * Asancha Property Sourcer Onboarding Page
 *
 * Purpose:
 * Collects property-sourcing identity, market focus, experience and compliance
 * readiness.
 *
 * Security notes:
 * - Completion does not authorise deal publication.
 * - Compliance documents and deal information remain subject to review.
 */

import type { Metadata } from "next";

import { OnboardingFormPage } from "../_components/onboarding-form-page";
import { PROPERTY_SOURCER_ONBOARDING_CONFIG } from "../_config/onboarding-page-config";

export const metadata: Metadata = {
    title: "Property Sourcer Onboarding",
    description:
        "Complete your Asancha property sourcing profile.",
};

export default function PropertySourcerOnboardingPage() {
    return (
        <OnboardingFormPage
            config={
                PROPERTY_SOURCER_ONBOARDING_CONFIG
            }
        />
    );
}