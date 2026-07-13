// File: app/onboarding/correction-required/page.tsx

/**
 * Asancha Onboarding Correction Required Page
 *
 * Purpose:
 * Directs a user to review safe correction requests affecting onboarding or
 * verification.
 *
 * Security notes:
 * - Only safe user-facing correction reasons may be shown.
 * - Internal admin notes, risk ratings and private review data remain hidden.
 */

import type { Metadata } from "next";

import { OnboardingStatePage } from "../_components/onboarding-state-page";

export const metadata: Metadata = {
    title: "Correction Required",
    description:
        "Review an Asancha onboarding or verification correction request.",
};

export default function CorrectionRequiredPage() {
    return (
        <OnboardingStatePage
            eyebrow="Action required"
            title="Your profile needs attention"
            description="A correction or replacement has been requested. Review the safe message in your verification or document record and provide the requested update."
            tone="attention"
            items={[
                {
                    title: "Read the correction request",
                    description:
                        "Open the related verification review to see the safe explanation and required action.",
                },
                {
                    title: "Update profile information",
                    description:
                        "Correct incomplete or inaccurate onboarding information where requested.",
                },
                {
                    title: "Replace documents",
                    description:
                        "Upload a replacement where an existing document is unclear, expired or unsuitable.",
                },
                {
                    title: "Respond to the review",
                    description:
                        "Confirm the correction or provide additional information through the verification response flow.",
                },
            ]}
            actions={[
                {
                    label: "Review verification",
                    href: "/verification",
                    primary: true,
                },
                {
                    label: "Review documents",
                    href: "/documents",
                },
                {
                    label: "Update onboarding",
                    href: "/onboarding",
                },
            ]}
        />
    );
}