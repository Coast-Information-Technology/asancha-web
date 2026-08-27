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

import {
    RoleOnboardingPolicyGate,
} from "../_components/role-onboarding-policy-gate";
import {
    PropertyOwnerOnboardingForm,
} from "./_components/property-owner-onboarding-form";

export const metadata: Metadata = {
    title: "Property Owner Onboarding",
    description:
        "Complete your Asancha property owner profile.",
};

export default function PropertyOwnerOnboardingPage() {
    return (
        <RoleOnboardingPolicyGate profileType="property_owner">
            <PropertyOwnerOnboardingForm />
        </RoleOnboardingPolicyGate>
    );
}
