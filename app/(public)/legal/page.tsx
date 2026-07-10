// File: app/(public)/legal/page.tsx

/**
 * Asancha Legal Overview Page
 *
 * Purpose:
 * Provides public access to legal and policy pages.
 *
 * Security note:
 * Legal pages must not expose internal policy tooling, admin notes,
 * private audit records, private documents, or restricted platform internals.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Legal | Asancha",
  description:
    "Access Asancha legal pages including terms, privacy policy, platform rules, data processing, and cookie information.",
  alternates: {
    canonical: "/legal",
  },
};

const legalLinks = [
  {
    label: "Terms of Use",
    href: "/legal/terms",
    description: "Read the terms that govern use of Asancha.",
  },
  {
    label: "Privacy Policy",
    href: "/legal/privacy",
    description: "Understand how public and account data is handled.",
  },
  {
    label: "Platform Rules",
    href: "/legal/platform-rules",
    description: "Review expected platform behaviour and restrictions.",
  },
  {
    label: "Data Processing",
    href: "/legal/data-processing",
    description: "Understand data processing information.",
  },
  {
    label: "Cookies",
    href: "/cookies",
    description: "Review cookie and browser storage information.",
  },
] as const;

/**
 * Renders the legal overview page.
 */
export default function LegalPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/legal",
    name: "Asancha Legal",
    description:
      "Access Asancha legal pages including terms, privacy policy, platform rules, data processing, and cookie information.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Legal", path: "/legal" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="legal-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Legal
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Legal and policy information.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            These public legal pages support transparency around Asancha terms,
            privacy, platform rules, data processing, and cookies.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {legalLinks.map((item) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                key={item.href}
              >
                <h2 className="text-lg font-bold text-gray-950">
                  {item.label}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
                <Link
                  className="mt-5 inline-flex text-sm font-bold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  href={item.href}
                >
                  Open {item.label}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
