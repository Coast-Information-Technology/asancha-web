// File: app/(public)/solutions/service-providers/page.tsx

/**
 * Asancha Service Provider Solution Page
 *
 * Purpose:
 * Explains Asancha for property-related service providers.
 *
 * Security note:
 * This page must not expose private booking data, payment data,
 * internal notes, or restricted user information.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "For Service Providers | Asancha",
  description:
    "Learn how service providers can present property-related services, manage service areas, availability, bookings, documents, and payments on Asancha.",
  alternates: {
    canonical: "/solutions/service-providers",
  },
};

/**
 * Renders the service provider solution page.
 */
export default function ServiceProvidersSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/service-providers",
    name: "Asancha for Service Providers",
    description:
      "Learn how service providers can present property-related services, manage service areas, availability, bookings, documents, and payments on Asancha.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/service-providers" },
      { name: "Service Providers", path: "/solutions/service-providers" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="service-providers-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            For service providers
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Offer property-related services through a clearer platform workflow.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Asancha supports service providers with profile setup, service
            listings, service areas, availability, bookings, conversations,
            documents, verification, and payments.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Present your service profile",
              "Manage services and availability",
              "Track bookings, documents, and payments",
            ].map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-foreground">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Some service actions may require account setup, verification,
                  documents, payment review, or platform approval.
                </p>
              </article>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
            href="/auth/sign-up"
          >
            Start as a service provider
          </Link>
        </section>
      </main>
    </>
  );
}
