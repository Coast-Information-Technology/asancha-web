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

import { PropertySourcerOnboardingForm } from "./_components/property-sourcer-onboarding-form";

export const metadata: Metadata = {
    title: "Property Sourcer Onboarding",
    description:
        "Complete your Asancha property sourcing profile.",
};

export default function PropertySourcerOnboardingPage() {
    return <PropertySourcerOnboardingForm />;
}
