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
 * - Render FAQPage and BreadcrumbList JSON-LD
 *
 * Security note:
 * FAQs must not expose backend internals, admin/staff routes,
 * private documents, payment provider data, API secrets, or internal notes.
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
    "Read common questions about Asancha marketplace browsing, signup, onboarding, verification, payments, AI recommendations, and API partner access.",
  alternates: {
    canonical: "/faqs",
  },
};

const faqs = [
  {
    question: "Can guests browse Asancha?",
    answer:
      "Yes. Guests can browse public pages and safe marketplace previews. Sensitive actions may require an account, completed profile, verification, payment review, or approval.",
  },
  {
    question: "Is API partner access part of ordinary signup?",
    answer:
      "No. API partner access uses a controlled application path and is separate from ordinary public signup.",
  },
  {
    question: "Does payment proof mean payment approval?",
    answer:
      "No. Submitting payment proof means the proof has been submitted for review. Approval must be confirmed through the platform workflow.",
  },
  {
    question: "Are AI recommendations guaranteed?",
    answer:
      "No. AI recommendations are guidance only and do not guarantee financial, legal, investment, rental, resale, or completion outcomes.",
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
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            FAQs
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Common questions about using Asancha.
          </h1>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={faq.question}
              >
                <summary className="cursor-pointer text-lg font-bold text-foreground">
                  {faq.question}
                </summary>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
            href="/support"
          >
            Still need help?
          </Link>
        </section>
      </main>
    </>
  );
}
