// File: app/(public)/legal/privacy/page.tsx

/**
 * Asancha Privacy Policy Page
 *
 * Purpose:
 * Provides public privacy-policy placeholder content for Asancha Web Public.
 *
 * Security note:
 * This page must not expose internal data handling systems, admin notes,
 * private user records, secret keys, provider payloads, or restricted URLs.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy | Asancha",
  description:
    "Read public privacy guidance for Asancha. Final privacy wording should be reviewed before production use.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

/**
 * Renders the public privacy policy page.
 */
export default function PrivacyPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/legal/privacy",
    name: "Asancha Privacy Policy",
    description:
      "Read public privacy guidance for Asancha. Final privacy wording should be reviewed before production use.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Legal", path: "/legal" },
      { name: "Privacy Policy", path: "/legal/privacy" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="privacy-json-ld" />

      <main>
        <article className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            This page explains public privacy principles for Asancha. Final
            production privacy wording should be reviewed by the appropriate
            legal adviser before launch.
          </p>

          <section className="mt-10 space-y-6 text-sm leading-7 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-950">
              Information users provide
            </h2>
            <p>
              Users may provide account, profile, property, document,
              verification, payment, booking, conversation, notification, or API
              partner information depending on the workflow they use.
            </p>

            <h2 className="text-2xl font-bold text-gray-950">
              Sensitive information
            </h2>
            <p>
              Sensitive user-facing information should be handled through
              protected workflows. Internal notes, secrets, and restricted
              records must not be exposed on public pages.
            </p>

            <h2 className="text-2xl font-bold text-gray-950">User choices</h2>
            <p>
              Users should be able to access relevant account settings,
              notification preferences, support routes, and policy pages where
              applicable.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
