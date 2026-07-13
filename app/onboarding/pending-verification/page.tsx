// File: app/onboarding/pending-verification/page.tsx

/**
 * Asancha Pending Verification Page
 *
 * Purpose:
 * Confirms that onboarding is complete while verification continues.
 *
 * Security notes:
 * - This page must not imply verification approval.
 * - Sensitive actions remain controlled by backend dashboard state.
 */

import type { Metadata } from "next";

import { OnboardingStatePage } from "../_components/onboarding-state-page";

export const metadata: Metadata = {
    title: "Verification Pending",
    description:
        "Your Asancha onboarding has been submitted and verification is pending.",
};

export default function PendingVerificationPage() {
    return (
        <OnboardingStatePage
            eyebrow="Onboarding submitted"
            title="Your verification is pending"
            description="Your profile setup has been submitted. You can access your dashboard while verification and document review continue, but some sensitive actions may remain unavailable."
            tone="pending"
            items={[
                {
                    title: "Dashboard access",
                    description:
                        "You may continue into your dashboard and review your available actions.",
                },
                {
                    title: "Verification review",
                    description:
                        "Asancha may review your identity, company, authority, qualifications or funding information where applicable.",
                },
                {
                    title: "Document requests",
                    description:
                        "You will be notified if a supporting document or replacement is required.",
                },
                {
                    title: "Sensitive actions",
                    description:
                        "Listing publication, reservations, paid access, API keys and other sensitive actions remain subject to their own requirements.",
                },
            ]}
            actions={[
                {
                    label: "Continue to dashboard",
                    href: "/dashboard",
                    primary: true,
                },
                {
                    label: "View verification",
                    href: "/verification",
                },
                {
                    label: "View documents",
                    href: "/documents",
                },
            ]}
        />
    );
}