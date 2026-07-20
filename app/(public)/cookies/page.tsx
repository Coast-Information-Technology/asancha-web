// File: app/(public)/cookies/page.tsx

/**
 * Asancha Cookies Page
 *
 * Purpose:
 * Provides public cookie and browser storage guidance for Asancha Web Public.
 *
 * Security note:
 * This page must not expose actual cookie values, token values, session
 * secrets, API keys, or private browser-stored data.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";
import { PublicPageHero } from "../_components/public-page-hero";

export const metadata: Metadata = {
  title: "Cookies | Asancha",
  description:
    "Learn how Asancha may use cookies and browser storage for public experience, sessions, preferences, analytics, and security-supporting behaviour.",
  alternates: {
    canonical: "/cookies",
  },
};

const cookieItems = [
  {
    title: "Essential cookies",
    description:
      "Used where needed to support sign-in, session continuity, and safe platform behaviour.",
  },
  {
    title: "Preference storage",
    description:
      "May support browser-safe preferences such as interface choices or public user experience hints.",
  },
  {
    title: "Analytics",
    description:
      "Browser-safe analytics may be enabled to understand public page performance without exposing secrets.",
  },
  {
    title: "Security note",
    description:
      "Cookie values, tokens, and session secrets must never be displayed on public pages.",
  },
] as const;

/**
 * Renders the public cookies page.
 */
export default function CookiesPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/cookies",
    name: "Asancha Cookies",
    description:
      "Learn how Asancha may use cookies and browser storage for public experience, sessions, preferences, analytics, and security-supporting behaviour.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Cookies", path: "/cookies" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="cookies-json-ld" />

      <main>
        <PublicPageHero
          description="Asancha may use cookies and browser storage to support public browsing, sessions, preferences, security-supporting flows, and browser-safe analytics where enabled."
          eyebrow="Legal"
          secondaryAction={{ label: "View legal pages", href: "/legal" }}
          title="Cookies"
        />

        <article className="asancha-page-container py-16">
          <section className="mt-10 grid gap-5 md:grid-cols-2">
            {cookieItems.map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item.title}
              >
                <h2 className="text-lg font-bold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </section>
        </article>
      </main>
    </>
  );
}
