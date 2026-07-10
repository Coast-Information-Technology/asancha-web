// File: app/(public)/about/page.tsx

/**
 * Asancha About Page
 *
 * Purpose:
 * Explains what Asancha is and who the public platform serves.
 *
 * Main responsibilities:
 * - Explain Asancha as a UK-focused property technology platform
 * - Build trust with public users
 * - Guide visitors to marketplace discovery and how-it-works
 * - Render safe public WebPage and BreadcrumbList JSON-LD
 *
 * Accessibility note:
 * Uses semantic sections, one H1, descriptive links, and clear heading order.
 *
 * Security note:
 * This public page must not expose backend URLs, admin/staff routes,
 * private documents, API keys, ObjectIds, payment data, or internal notes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "About Asancha",
  description:
    "Learn about Asancha, a UK-focused property technology platform for marketplace discovery, role-based workflows, and approved API partner access.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Asancha",
    description:
      "A UK-focused property technology platform for investors, owners, agents, sourcers, service providers, and API partners.",
    url: "/about",
    type: "website",
  },
};

const principles = [
  "Clear public marketplace discovery",
  "Role-specific onboarding and dashboards",
  "Verification-aware property workflows",
  "Safe AI-assisted guidance without guarantees",
  "Controlled API partner access",
  "Public, admin, and partner experiences kept separate",
] as const;

/**
 * Renders the public About page.
 */
export default function AboutPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/about",
    name: "About Asancha",
    description:
      "Learn about Asancha, a UK-focused property technology platform for marketplace discovery, role-based workflows, and approved API partner access.",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="about-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
              About Asancha
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              A property platform built for clarity, structure, and trust.
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Asancha is a UK-focused property technology platform designed for
              public users who need a clearer way to discover opportunities,
              submit property information, manage service workflows, and connect
              through approved platform processes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                href="/marketplace"
              >
                Browse Marketplace
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-950 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                href="/how-it-works"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="about-principles-heading"
          className="bg-gray-50"
        >
          <div className="asancha-page-container py-16">
            <h2
              className="text-3xl font-extrabold tracking-tight text-gray-950"
              id="about-principles-heading"
            >
              What guides the platform
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
              Asancha keeps public discovery simple while sensitive actions
              remain controlled by account, profile, verification, payment,
              approval, or partner access requirements.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <article
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  key={principle}
                >
                  <h3 className="text-base font-bold text-gray-950">
                    {principle}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    The public app explains what users can do, what may be
                    locked, and what needs verification or approval before
                    sensitive actions continue.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
