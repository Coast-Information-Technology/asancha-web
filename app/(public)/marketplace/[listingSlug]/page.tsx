// File: app/(public)/marketplace/[listingSlug]/page.tsx

/**
 * Asancha Public Listing Preview Page
 *
 * Purpose:
 * Shows a safe public listing preview using a public listing slug.
 *
 * Main responsibilities:
 * - Render public-safe listing preview content
 * - Avoid exposing private deal or user data
 * - Render safe public listing preview and breadcrumb JSON-LD
 *
 * Security note:
 * This page must not expose private deal packs, private seller details,
 * investor private data, sensitive documents, internal notes, restricted AI
 * analysis, private payment data, or MongoDB ObjectIds.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createPublicListingPreviewJsonLd,
} from "@/src/lib/seo/json-ld";

interface ListingPreviewPageProps {
  params: Promise<{
    listingSlug: string;
  }>;
}

const listingPreviews = {
  "sample-investment-opportunity-manchester": {
    title: "Investment Opportunity • Manchester",
    location: "Manchester, UK",
    category: "Investor suitable",
    description:
      "A public-safe sample listing preview. Full details may require account setup and approval.",
  },
  "family-home-birmingham-preview": {
    title: "Family Home • Birmingham",
    location: "Birmingham, UK",
    category: "Residential",
    description:
      "Preview public listing information before continuing into protected workflows.",
  },
  "service-ready-property-leeds": {
    title: "Service-Ready Property • Leeds",
    location: "Leeds, UK",
    category: "Property services",
    description:
      "A safe public preview for marketplace discovery and role education.",
  },
} as const;

/**
 * Creates metadata for a safe public listing preview page.
 */
export async function generateMetadata({
  params,
}: ListingPreviewPageProps): Promise<Metadata> {
  const { listingSlug } = await params;
  const listing = listingPreviews[listingSlug as keyof typeof listingPreviews];

  if (!listing) {
    return {
      title: "Listing Not Found | Asancha Marketplace",
      description:
        "The requested public listing preview could not be found on Asancha.",
    };
  }

  return {
    title: `${listing.title} | Asancha Marketplace`,
    description: listing.description,
    alternates: {
      canonical: `/marketplace/${listingSlug}`,
    },
  };
}

/**
 * Renders a safe public listing preview page.
 */
export default async function ListingPreviewPage({
  params,
}: ListingPreviewPageProps) {
  const { listingSlug } = await params;
  const listing = listingPreviews[listingSlug as keyof typeof listingPreviews];

  if (!listing) {
    notFound();
  }

  const jsonLd = [
    createPublicListingPreviewJsonLd({
      slug: listingSlug,
      name: listing.title,
      description: listing.description,
      location: listing.location,
      category: listing.category,
    }),
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: listing.title, path: `/marketplace/${listingSlug}` },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="listing-preview-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              className="text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
              href="/marketplace"
            >
              Back to marketplace
            </Link>
          </nav>

          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Public listing preview
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {listing.title}
            </h1>

            <p className="mt-3 text-base font-semibold text-muted-foreground">
              {listing.location}
            </p>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {listing.description}
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">
                What public visitors can see
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                <li>General title and location summary.</li>
                <li>Basic listing category and safe public description.</li>
                <li>
                  Clear guidance on what may require signup or verification.
                </li>
                <li>
                  No private deal pack, internal notes, or sensitive documents.
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                href="/auth/sign-up"
              >
                Create account to continue
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
                href="/support"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
