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
import { PublicPageHero } from "../../_components/public-page-hero";

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
        <PublicPageHero
          description="This page explains public privacy principles for Asancha. Final production privacy wording should be reviewed by the appropriate legal adviser before launch."
          eyebrow="Legal"
          secondaryAction={{ label: "Back to legal", href: "/legal" }}
          title="Privacy Policy"
        />

        <article className="asancha-page-container py-16">
          <section className="space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              Information users provide
            </h2>
            <p>
              Users may provide account, profile, property, document,
              verification, payment, booking, conversation, notification, or API
              partner information depending on the workflow they use.
            </p>

            <h2 className="text-2xl font-bold text-foreground">
              Sensitive information
            </h2>
            <p>
              Sensitive user-facing information should be handled through
              protected workflows. Internal notes, secrets, and restricted
              records must not be exposed on public pages.
            </p>

            <h2 className="text-2xl font-bold text-foreground">User choices</h2>
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
