// File: app/onboarding/property-agent/page.tsx

/**
 * Asancha Property Agent Onboarding Page
 *
 * Purpose:
 * Collects agency identity, company details, market coverage and authority to
 * represent owners or vendors.
 *
 * Security notes:
 * - Onboarding completion does not approve company or authority verification.
 * - Listing publication remains backend/admin-controlled.
 */

import type { Metadata } from "next";

import { PropertyAgentOnboardingForm } from "./_components/property-agent-onboarding-form";

export const metadata: Metadata = {
    title: "Property Agent Onboarding",
    description:
        "Complete your Asancha property agent and agency profile.",
};

export default function PropertyAgentOnboardingPage() {
    return <PropertyAgentOnboardingForm />;
}
