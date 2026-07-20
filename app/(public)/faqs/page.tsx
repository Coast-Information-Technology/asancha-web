// File: app/(public)/faqs/page.tsx

/**
 * Asancha FAQs Page
 *
 * Purpose:
 * Answers common public questions about Asancha Web Public.
 *
 * Main responsibilities:
 * - Answer common public-user questions
 * - Reinforce safe public browsing and gated sensitive actions
 * - Explain ordinary public signup separately from API partner access
 * - Clarify verification, payment, AI, support, and marketplace expectations
 * - Render FAQPage and BreadcrumbList JSON-LD
 *
 * Accessibility note:
 * Uses one H1, semantic sections, native details/summary disclosure controls,
 * descriptive links, and clear public-safe answers.
 *
 * Security note:
 * FAQs must not expose backend internals, admin/staff routes,
 * private documents, payment provider data, API secrets, webhook secrets,
 * backend URLs, ObjectIds, private customer records, or internal notes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createFaqPageJsonLd,
} from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQs | Asancha",
  description:
    "Read common questions about Asancha marketplace browsing, signup, onboarding, verification, payments, AI recommendations, support, and API partner access.",
  alternates: {
    canonical: "/faqs",
  },
  openGraph: {
    title: "FAQs | Asancha",
    description:
      "Common answers about using Asancha for marketplace discovery, public signup, onboarding, verification, payments, AI guidance, and API partner access.",
    url: "/faqs",
    type: "website",
  },
};

const faqs = [
  {
    question: "Can guests browse Asancha?",
    answer:
      "Yes. Guests can browse public pages and public-safe marketplace previews. Sensitive actions may require sign-in, completed profile setup, verification, payment review, or platform approval.",
  },
  {
    question: "What can I see on public marketplace previews?",
    answer:
      "Public marketplace previews can show safe listing information for discovery. They should not expose private deal packs, sensitive documents, private contact details, payment information, internal notes, or restricted analysis.",
  },
  {
    question: "Who can create an ordinary public account?",
    answer:
      "Ordinary public signup is for investors, property owners, property agents, property sourcers, and service providers. API partner access uses a separate controlled application route.",
  },
  {
    question: "Is API partner access part of ordinary signup?",
    answer:
      "No. API partner access is separate from ordinary public signup. Partners must apply through a controlled process and receive approval before accessing partner-safe tools.",
  },
  {
    question: "Why are some actions locked after I sign in?",
    answer:
      "Signing in does not automatically approve every action. Some actions may remain locked until the correct profile, document, verification, payment, approval, or access state is complete.",
  },
  {
    question: "Does submitting a document mean it has been approved?",
    answer:
      "No. Submitting a document means it has been provided for review or workflow processing. The platform must confirm whether it has been accepted, rejected, corrected, or still pending.",
  },
  {
    question: "Does payment proof mean payment approval?",
    answer:
      "No. Submitting payment proof means the proof has been submitted for review. Payment status must be confirmed through the relevant Asancha-controlled workflow.",
  },
  {
    question: "Are AI recommendations guaranteed?",
    answer:
      "No. AI recommendations are guidance only. They do not guarantee financial, legal, investment, rental, resale, funding, completion, or platform approval outcomes.",
  },
  {
    question: "Should I share private information through public contact forms?",
    answer:
      "No. Do not share passwords, payment card details, full identity documents, API keys, webhook secrets, private deal packs, or confidential documents through public forms.",
  },
  {
    question: "Where should I go for account-specific support?",
    answer:
      "For private documents, verification, bookings, payment references, conversations, notifications, or API partner workspace issues, sign in and use account-aware support when available.",
  },
] as const;

const faqGroups = [
  {
    title: "Public discovery",
    description:
      "Browse public pages and marketplace previews safely before creating an account.",
  },
  {
    title: "Public account setup",
    description:
      "Create the right public account role and continue through onboarding when needed.",
  },
  {
    title: "Protected workflows",
    description:
      "Verification, documents, payments, bookings, conversations, and partner access may require backend-approved states.",
  },
] as const;

/**
 * Renders the public FAQs page.
 */
export default function FaqsPage() {
  const jsonLd = [
    createFaqPageJsonLd(faqs),
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "FAQs", path: "/faqs" },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="faqs-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              FAQs
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Common questions about using Asancha.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Find clear answers about public marketplace browsing, signup,
              onboarding, verification, payment-sensitive actions, AI guidance,
              support, and API partner access.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              These answers are public guidance only. Account-specific details,
              private documents, payment records, booking data, and partner
              configuration should be handled through protected workflows.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                href="/support"
              >
                Visit Support
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-secondary bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-ring/20"
                href="/contact"
              >
                Contact Asancha
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faq-overview-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Quick guide
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="faq-overview-heading"
              >
                Most Asancha questions fall into three areas.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                The platform keeps public discovery simple while protecting
                sensitive actions behind the right account, profile,
                verification, payment, approval, or partner access checks.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {faqGroups.map((group) => (
                <article
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  key={group.title}
                >
                  <h3 className="text-lg font-bold text-card-foreground">
                    {group.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {group.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faq-list-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Questions and answers
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="faq-list-heading"
              >
                Public Asancha FAQs.
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  key={faq.question}
                >
                  <summary className="cursor-pointer text-lg font-bold text-card-foreground">
                    {faq.question}
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faq-safety-heading"
          className="bg-card"
        >
          <div className="asancha-page-container py-16">
            <div className="rounded-3xl border border-accent bg-accent p-6 shadow-sm lg:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Public safety reminder
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-accent-foreground"
                  id="faq-safety-heading"
                >
                  Do not use public pages to share sensitive account or payment
                  information.
                </h2>

                <p className="mt-4 text-base leading-7 text-accent-foreground">
                  For private documents, verification issues, payment
                  references, bookings, conversations, notifications, or API
                  partner workspace support, sign in and use the protected
                  account-aware support route when available.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faq-final-cta-heading"
          className="bg-primary"
        >
          <div className="asancha-page-container py-16 text-primary-foreground">
            <h2
              className="max-w-3xl text-3xl font-extrabold tracking-tight"
              id="faq-final-cta-heading"
            >
              Still need help with Asancha?
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
              Visit support for general guidance, contact Asancha for public
              enquiries, or sign in for account-aware help.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/support"
              >
                Visit Support
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/auth/sign-in?next=/account/support"
              >
                Sign in for Account Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}