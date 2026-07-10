// File: app/(public)/contact/page.tsx

/**
 * Asancha Contact Page
 *
 * Purpose:
 * Provides a public contact entry point for Asancha Web Public.
 *
 * Security note:
 * This page must not expose internal support queues, staff routes,
 * private contact channels, backend URLs, or sensitive operational details.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createContactPageJsonLd,
} from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact Asancha",
  description:
    "Contact Asancha for public marketplace, role setup, property workflow, service provider, or API partner enquiries.",
  alternates: {
    canonical: "/contact",
  },
};

/**
 * Renders the public contact page.
 */
export default function ContactPage() {
  const jsonLd = [
    createContactPageJsonLd(),
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="contact-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Contact
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Need help choosing the right Asancha route?
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Use this public contact entry point for general questions about
            marketplace discovery, role setup, property workflows, service
            provider access, or API partner applications.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Marketplace enquiry",
              "Role setup question",
              "API partner enquiry",
            ].map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-foreground">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Public contact should not include passwords, API keys, private
                  document links, payment secrets, or sensitive identity
                  details.
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
              href="/support"
            >
              Open support
            </Link>

            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
              href="/faqs"
            >
              Read FAQs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
