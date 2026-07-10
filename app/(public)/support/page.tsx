// File: app/(public)/support/page.tsx

/**
 * Asancha Public Support Page
 *
 * Purpose:
 * Provides public support guidance for guests and public users.
 *
 * Security note:
 * Public support must not expose internal support queues, admin notes,
 * private verification notes, private payment data, API secrets, or internal routes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Support | Asancha",
  description:
    "Get public support guidance for Asancha marketplace browsing, signup, onboarding, verification, payments, bookings, and API partner applications.",
  alternates: {
    canonical: "/support",
  },
};

/**
 * Renders the public support page.
 */
export default function SupportPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/support",
    name: "Asancha Support",
    description:
      "Get public support guidance for Asancha marketplace browsing, signup, onboarding, verification, payments, bookings, and API partner applications.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Support", path: "/support" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="support-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Support
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Get help without exposing sensitive information.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Public support can guide you toward the right next step. For
            account-specific issues, sign in so Asancha can show safer,
            account-aware support options.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-950">
                Public support
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Use public support for general questions about marketplace
                browsing, public pages, signup, or API partner application
                entry.
              </p>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-950">
                Account-aware support
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Sign in for support related to documents, verification, payment
                references, reservations, bookings, conversations,
                notifications, or API partner workspace actions.
              </p>
            </article>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href="/auth/sign-in"
            >
              Sign in for account support
            </Link>

            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-950 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href="/contact"
            >
              Contact Asancha
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
