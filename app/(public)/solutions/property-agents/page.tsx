// File: app/(public)/solutions/property-agents/page.tsx

/**
 * Asancha Property Agent Solution Page
 *
 * Purpose:
 * Explains Asancha for property agents.
 *
 * Security note:
 * This page must not use broad deprecated agent wording or expose internal
 * authority-review details.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "For Property Agents | Asancha",
  description:
    "Learn how property agents can manage represented properties, listings, authority documents, bookings, and conversations on Asancha.",
  alternates: {
    canonical: "/solutions/property-agents",
  },
};

/**
 * Renders the property agent solution page.
 */
export default function PropertyAgentsSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/property-agents",
    name: "Asancha for Property Agents",
    description:
      "Learn how property agents can manage represented properties, listings, authority documents, bookings, and conversations on Asancha.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/property-agents" },
      { name: "Property Agents", path: "/solutions/property-agents" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="property-agents-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            For property agents
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Represent properties with clearer authority and listing context.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Asancha supports property agents with company context, represented
            properties, listings, authority documents, bookings, and
            conversations.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Manage represented properties",
              "Track authority documents",
              "Handle bookings and conversations",
            ].map((item) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-gray-950">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Agent workflows may require verification, authority evidence,
                  and backend-approved access before sensitive actions are
                  available.
                </p>
              </article>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/auth/sign-up"
          >
            Start as a property agent
          </Link>
        </section>
      </main>
    </>
  );
}
