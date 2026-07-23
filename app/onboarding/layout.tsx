// File: app/onboarding/layout.tsx

/**
 * Asancha Onboarding Layout
 *
 * Purpose:
 * Applies the shared onboarding shell to all authenticated onboarding routes.
 *
 * Security notes:
 * - This layout is presentation only.
 * - Middleware and backend onboarding guards remain authoritative.
 */

import type {
    Metadata,
} from "next";
import {
    cookies,
} from "next/headers";
import {
    redirect,
} from "next/navigation";
import type {
    ReactNode,
} from "react";

import {
    OnboardingShell,
} from "./_components/onboarding-shell";

const ACCESS_TOKEN_COOKIE_NAME = "asancha_access_token";
const REFRESH_TOKEN_COOKIE_NAME = "asancha_refresh_token";

export const metadata: Metadata = {
    title: {
        default: "Onboarding | Asancha",
        template: "%s | Asancha",
    },
    description:
        "Complete your Asancha account and business-profile onboarding.",
    robots: {
        index: false,
        follow: false,
    },
};

export interface OnboardingLayoutProps {
    children: ReactNode;
}

export default async function OnboardingLayout({
    children,
}: OnboardingLayoutProps) {
    const cookieStore = await cookies();
    const hasAccessToken = Boolean(
        cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)
            ?.value,
    );
    const hasRefreshToken = Boolean(
        cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)
            ?.value,
    );

    if (!hasAccessToken && !hasRefreshToken) {
        redirect("/auth/sign-in?redirect=/onboarding");
    }

    return (
        <OnboardingShell>
            {children}
        </OnboardingShell>
    );
}
