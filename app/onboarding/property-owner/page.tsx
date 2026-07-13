// File: app/onboarding/property-owner/page.tsx

/**
 * Asancha Property Owner Onboarding Page
 *
 * Purpose:
 * Collects ownership capacity, property intent and authority declarations.
 *
 * Security notes:
 * - Completion does not prove ownership or authorise publication.
 * - Backend document and verification checks remain final.
 */

import type { Metadata } from "next";

import { OnboardingFormPage } from "../_components/onboarding-form-page";
import { PROPERTY_OWNER_ONBOARDING_CONFIG } from "../_config/onboarding-page-config";

export const metadata: Metadata = {
    title: "Property Owner Onboarding",
    description:
        "Complete your Asancha property owner profile.",
};

export default function PropertyOwnerOnboardingPage() {
    return (
        <OnboardingFormPage
            config={
                PROPERTY_OWNER_ONBOARDING_CONFIG
            }
        />
    );
}