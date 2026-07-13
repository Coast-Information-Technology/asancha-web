// File: app/onboarding/status/page.tsx

/**
 * Asancha Onboarding Status Page
 *
 * Purpose:
 * Provides a safe summary route after onboarding save or submission.
 *
 * Security notes:
 * - The dashboard should ultimately populate this view from backend-authored
 *   dashboard state.
 */

import type { Metadata } from "next";

import { OnboardingStatePage } from "../_components/onboarding-state-page";

export const metadata: Metadata = {
    title: "Onboarding Status",
    description:
        "Review your Asancha onboarding and next steps.",
};

export default function OnboardingStatusPage() {
    return (
        <OnboardingStatePage
            eyebrow="Onboarding status"
            title="Your account setup is progressing"
            description="Review your profile, verification and any remaining actions from your dashboard."
            tone="neutral"
            items={[
                {
                    title: "General profile",
                    description:
                        "Your shared identity and contact information should be completed first.",
                },
                {
                    title: "Business profile",
                    description:
                        "Each business profile has its own onboarding, policies and verification requirements.",
                },
                {
                    title: "Verification",
                    description:
                        "Verification continues separately after onboarding submission.",
                },
                {
                    title: "Dashboard access",
                    description:
                        "Minimum setup may allow dashboard access while sensitive actions remain locked.",
                },
            ]}
            actions={[
                {
                    label: "Open dashboard",
                    href: "/dashboard",
                    primary: true,
                },
                {
                    label: "Review verification",
                    href: "/verification",
                },
                {
                    label: "Return to onboarding",
                    href: "/onboarding",
                },
            ]}
        />
    );
}