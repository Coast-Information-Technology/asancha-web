// File: app/page.tsx

/**
 * Asancha Public Home Page
 *
 * Purpose:
 * Provides the main public homepage for Asancha Web Public.
 *
 * Main responsibilities:
 * - Introduce Asancha clearly as a UK-focused property platform
 * - Explain who the platform serves
 * - Drive users toward marketplace browsing, signup, and API partner application
 * - Build trust without exposing restricted/private platform data
 * - Render homepage JSON-LD for SEO
 *
 * Accessibility note:
 * This page uses semantic sections, one H1, descriptive links, clear CTAs,
 * readable heading hierarchy, and public-safe copy.
 *
 * SEO note:
 * This page renders Organization, WebSite, and WebPage JSON-LD through the
 * reusable Asancha JSON-LD component and builders.
 *
 * Security note:
 * This public page must not expose backend URLs, admin/staff URLs,
 * private deal packs, private documents, payment data, API keys,
 * MongoDB ObjectIds, private KYC notes, or internal admin notes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createHomePageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Asancha | UK Property Platform for Public Users and Partners",
  description:
    "Asancha is a UK-focused property platform for investors, property owners, property agents, property sourcers, service providers, and approved API partners.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Asancha | UK Property Platform",
    description:
      "Discover a structured property platform for marketplace discovery, role-based onboarding, trusted workflows, and controlled API partner access.",
    url: "/",
    type: "website",
  },
};

const audienceCards = [
  {
    title: "Investors",
    description:
      "Explore property opportunities, save listings, manage preferences, and continue into verified workflows when required.",
    href: "/solutions/investors",
  },
  {
    title: "Property Owners",
    description:
      "Prepare property information, create listings, manage documents, and connect with suitable platform users.",
    href: "/solutions/property-owners",
  },
  {
    title: "Property Agents",
    description:
      "Represent properties with clearer agency context, authority documents, and structured listing workflows.",
    href: "/solutions/property-agents",
  },
  {
    title: "Property Sourcers",
    description:
      "Submit sourced opportunities, prepare deal packs, and work through compliance-aware platform flows.",
    href: "/solutions/property-sourcers",
  },
  {
    title: "Service Providers",
    description:
      "Present property-related services, manage bookings, and support platform users through structured workflows.",
    href: "/solutions/service-providers",
  },
  {
    title: "API Partners",
    description:
      "Apply for controlled API access and connect approved property workflows through partner-safe integration.",
    href: "/api-partners",
  },
] as const;

const trustItems = [
  "Role-specific onboarding",
  "Verification-aware workflows",
  "Safe public marketplace previews",
  "Payment proof review without false approval",
  "AI guidance with clear disclaimers",
  "Controlled API partner access",
] as const;

/**
 * Renders the Asancha public homepage.
 */
export default function HomePage() {
  const homepageJsonLd = createHomePageJsonLdBundle();

  return (
    <>
      <JsonLd data={homepageJsonLd} id="homepage-json-ld" />

      <main>
        <section className="relative isolate overflow-hidden bg-foreground text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/35"
          />
          <div className="asancha-page-container py-20 sm:py-28 lg:py-32">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                Asancha Web Public
              </p>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                A structured UK property platform for serious users and approved
                partners.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
                Asancha helps public users discover property opportunities,
                understand the right next step, complete role-specific setup,
                and move through trusted property workflows with clearer
                guidance.
              </p>

              <div
                aria-label="Homepage primary actions"
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-white/30"
                  href="/marketplace"
                >
                  Browse Marketplace
                </Link>

                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/30"
                  href="/auth/sign-up"
                >
                  Get Started
                </Link>

                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/30"
                  href="/api-partner/apply"
                >
                  Apply for API Access
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="homepage-audience-heading"
          className="bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <h2
                className="text-3xl font-extrabold tracking-tight text-foreground"
                id="homepage-audience-heading"
              >
                Built around the way different property users actually work.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Asancha separates account identity from role-specific business
                profiles, so users can operate with clearer context and fewer
                confusing workflows.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {audienceCards.map((card) => (
                <article
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  key={card.href}
                >
                  <h3 className="text-lg font-bold text-foreground">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {card.description}
                  </p>

                  <Link
                    className="mt-5 inline-flex text-sm font-bold !text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                    href={card.href}
                  >
                    Learn more about {card.title}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="homepage-trust-heading" className="bg-card">
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Trust and clarity
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="homepage-trust-heading"
                >
                  Public discovery first. Sensitive actions only when the user
                  is ready.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Guests can browse public-safe pages and listing previews.
                  Higher-trust actions may require account setup, profile
                  completion, verification, payment review, approval, or API
                  partner access.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <li
                    className="rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="homepage-final-cta-heading"
          className="bg-primary"
        >
          <div className="asancha-page-container py-16 text-primary-foreground">
            <h2
              className="max-w-3xl text-3xl font-extrabold tracking-tight"
              id="homepage-final-cta-heading"
            >
              Start with public discovery, then continue into the right
              role-specific flow.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/75">
              Browse the marketplace, understand how Asancha works, or create a
              public account when you are ready to continue.
            </p>

            <div
              aria-label="Homepage final actions"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-foreground hover:bg-foreground-accent focus:outline-none focus:ring-4 focus:ring-ring/40"
                href="/marketplace"
              >
                Browse Marketplace
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-card/10 focus:outline-none focus:ring-4 focus:ring-ring/40"
                href="/how-it-works"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
