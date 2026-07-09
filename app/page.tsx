// File: app/page.tsx

/**
 * Asancha Public Home Page
 *
 * Purpose:
 * Provides the root public landing page for Asancha Web Public.
 *
 * Main responsibilities:
 * - Introduce Asancha to guests and public users
 * - Link users to marketplace, how-it-works, signup, and API partner entry
 * - Keep the page safe and free of restricted/internal platform data
 *
 * Important Asancha Web Public rule:
 * The homepage is public.
 * It must not expose dashboard data, account data, private documents,
 * API keys, internal notes, payment review data, or admin/staff links.
 *
 * Security note:
 * Public page content is marketing/product guidance only.
 * Backend-controlled account, profile, onboarding, verification, payment,
 * reservation, booking, conversation, notification, AI recommendation,
 * and API partner access states remain protected behind authenticated routes.
 */

import Link from "next/link";

const primaryActions = [
  {
    label: "Browse Marketplace",
    href: "/marketplace",
    description: "View safe public listing previews.",
  },
  {
    label: "Get Started",
    href: "/auth/sign-up",
    description: "Create a public Asancha account.",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Understand the Asancha flow.",
  },
] as const;

const publicUserGroups = [
  "Investors",
  "Property Owners",
  "Property Agents",
  "Property Sourcers",
  "Service Providers",
  "API Partners",
] as const;

/**
 * Renders the public homepage.
 */
export default function HomePage() {
  return (
    <section className="asancha-page-container py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Asancha Web Public
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-6xl">
          A focused property platform for serious public users and partners.
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Asancha connects investors, property owners, property agents, property
          sourcers, service providers, and approved API partners through a
          structured property marketplace and role-specific dashboard
          experience.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {primaryActions.map((action) => (
            <Link
              className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:border-gray-400 hover:bg-gray-50"
              href={action.href}
              key={action.href}
            >
              <span className="block">{action.label}</span>
              <span className="mt-1 block text-xs font-normal text-gray-500">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publicUserGroups.map((group) => (
          <article
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            key={group}
          >
            <h2 className="text-base font-semibold text-gray-950">{group}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Access public-safe pages first, then continue into the correct
              authenticated workflow when required.
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-base font-semibold text-amber-950">
          Important platform note
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          Marketplace previews, AI recommendations, payment proof submission,
          onboarding progress, and dashboard access are guidance only where
          shown in the frontend. Final approval and enforcement always remain
          with the backend.
        </p>
      </div>
    </section>
  );
}
