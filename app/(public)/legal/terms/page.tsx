// File: app/(public)/legal/terms/page.tsx

/**
 * Asancha Terms Page
 *
 * Purpose:
 * Provides public terms-of-use placeholder content for Asancha Web Public.
 *
 * Security note:
 * This page must not expose private legal workflows, audit internals,
 * admin notes, private user records, or restricted platform data.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Terms of Use | Asancha",
  description:
    "Read public terms of use guidance for Asancha. Final legal text should be reviewed and approved before production use.",
  alternates: {
    canonical: "/legal/terms",
  },
};

/**
 * Renders the public terms page.
 */
export default function TermsPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/legal/terms",
    name: "Asancha Terms of Use",
    description:
      "Read public terms of use guidance for Asancha. Final legal text should be reviewed and approved before production use.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Legal", path: "/legal" },
      { name: "Terms of Use", path: "/legal/terms" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="terms-json-ld" />

      <main>
        <article className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Terms of Use
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            These terms explain expected use of Asancha public pages, accounts,
            role-specific workflows, marketplace previews, and partner access.
            Final production legal wording should be reviewed by the appropriate
            legal adviser before launch.
          </p>

          <section className="mt-10 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              Use of the platform
            </h2>
            <p>
              Users should provide accurate information, respect platform rules,
              and avoid submitting misleading property, identity, document,
              payment, or partner information.
            </p>

            <h2 className="text-2xl font-bold text-foreground">
              Restricted actions
            </h2>
            <p>
              Some actions may require account setup, profile completion,
              verification, payment review, approval, or API partner access.
              Frontend access does not replace backend enforcement.
            </p>

            <h2 className="text-2xl font-bold text-foreground">No guarantees</h2>
            <p>
              Marketplace previews and AI-assisted guidance do not guarantee
              financial, legal, investment, rental, resale, or completion
              outcomes.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
