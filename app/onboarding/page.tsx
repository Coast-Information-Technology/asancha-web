// File: app/onboarding/page.tsx

/**
 * Asancha Onboarding Resolver Page
 *
 * Purpose:
 * Provides a safe entry point into general-profile, role-specific and API
 * partner onboarding.
 *
 * Security notes:
 * - Route links are guidance only.
 * - Backend active-profile and dashboard-state responses remain authoritative.
 * - API partners use a controlled application flow.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Continue Account Setup",
    description:
        "Continue your Asancha general profile or business-profile onboarding.",
};

const STANDARD_PROFILE_OPTIONS = [
    {
        title: "Investor",
        description:
            "Set your buying criteria, investment strategy, funding readiness and deal preferences.",
        href: "/onboarding/investor",
    },
    {
        title: "Property Owner",
        description:
            "Set up your ownership profile and prepare to submit property.",
        href: "/onboarding/property-owner",
    },
    {
        title: "Property Agent",
        description:
            "Set up your agency, company, coverage and authority details.",
        href: "/onboarding/property-agent",
    },
    {
        title: "Property Sourcer",
        description:
            "Set up your sourcing operation, deal focus and compliance readiness.",
        href: "/onboarding/property-sourcer",
    },
    {
        title: "Service Provider",
        description:
            "Set up your professional services, qualifications and availability.",
        href: "/onboarding/service-provider",
    },
] as const;

export default function OnboardingPage() {
    return (
        <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="mx-auto w-full max-w-6xl">
                <header className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Account setup
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Continue your Asancha onboarding
                    </h1>

                    <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
                        Complete your general profile first, then
                        continue with the business profile connected
                        to your account.
                    </p>
                </header>

                <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_5%,var(--card))] p-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]">
                        First step
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                        Complete your general profile
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                        Your general profile contains the identity
                        and contact information shared across your
                        business profiles.
                    </p>

                    <Link
                        href="/onboarding/general-profile"
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                    >
                        Complete general profile
                    </Link>
                </section>

                <section
                    className="mt-10"
                    aria-labelledby="business-profile-heading"
                >
                    <div>
                        <h2
                            id="business-profile-heading"
                            className="text-2xl font-bold"
                        >
                            Business-profile onboarding
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                            Select the profile type connected to your
                            account. Existing users do not need another
                            login to add an additional business profile.
                        </p>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {STANDARD_PROFILE_OPTIONS.map(
                            (option) => (
                                <article
                                    key={option.href}
                                    className="flex flex-col rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <h3 className="text-lg font-bold">
                                        {option.title}
                                    </h3>

                                    <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {option.description}
                                    </p>

                                    <Link
                                        href={option.href}
                                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:border-[var(--primary)] hover:bg-[var(--muted)]"
                                    >
                                        Continue setup
                                    </Link>
                                </article>
                            ),
                        )}
                    </div>
                </section>

                <section className="mt-10 rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--muted)] p-5">
                    <h2 className="font-bold">
                        Applying as an API partner?
                    </h2>

                    <Link
                        href="/api-partner/apply"
                        className="mt-4 inline-flex text-sm font-semibold !text-primary hover:underline"
                    >
                        Open API partner application
                    </Link>
                </section>
            </div>
        </main>
    );
}
