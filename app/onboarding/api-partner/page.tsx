// File: app/onboarding/api-partner/page.tsx

/**
 * Asancha API Partner Onboarding Guidance Page
 *
 * Purpose:
 * Redirects API partner applicants to the controlled application workflow.
 *
 * Security notes:
 * - API partners must not use ordinary role-specific onboarding.
 * - Application approval does not automatically create API keys.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "API Partner Application",
    description:
        "Apply for controlled Asancha API partner access.",
};

export default function ApiPartnerOnboardingPage() {
    return (
        <main className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Controlled access
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Apply to become an API partner
                    </h1>

                    <p className="mt-4 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                        API partner access is reviewed separately
                        from ordinary public-user signup. Your
                        company, use case, integration plans,
                        requested scopes and security readiness will
                        be assessed before API access can be enabled.
                    </p>

                    <div className="mt-8 grid gap-4">
                        {[
                            {
                                title: "1. Submit company details",
                                description:
                                    "Provide your registered organisation, business contacts and technical contacts.",
                            },
                            {
                                title: "2. Explain your integration",
                                description:
                                    "Describe the intended product, users, data usage and estimated request volume.",
                            },
                            {
                                title: "3. Request scopes",
                                description:
                                    "Choose only the API capabilities required for your approved integration.",
                            },
                            {
                                title: "4. Complete review",
                                description:
                                    "Asancha reviews the application, verification, policies, plan and payment requirements.",
                            },
                            {
                                title: "5. Create credentials",
                                description:
                                    "Approved clients may create scoped API keys. Full keys are displayed once only.",
                            },
                        ].map((item) => (
                            <article
                                key={item.title}
                                className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                            >
                                <h2 className="font-bold">
                                    {item.title}
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/api-partner/apply"
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                        >
                            Start API partner application
                        </Link>

                        <Link
                            href="/api-partners"
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                        >
                            Learn about API partnerships
                        </Link>
                    </div>
                </div>

                <aside className="self-start rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--muted)] p-5">
                    <h2 className="font-bold">
                        Important
                    </h2>

                    <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        <li>
                            API partner is not an ordinary public
                            signup role.
                        </li>
                        <li>
                            Application approval does not automatically
                            enable production access.
                        </li>
                        <li>
                            Scopes, subscriptions and payment
                            requirements are backend-controlled.
                        </li>
                        <li>
                            Full API keys are shown once and must be
                            stored securely.
                        </li>
                    </ul>
                </aside>
            </section>
        </main>
    );
}