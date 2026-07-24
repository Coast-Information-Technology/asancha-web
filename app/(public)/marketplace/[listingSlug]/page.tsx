// File: app/(public)/marketplace/[listingSlug]/page.tsx

/**
 * Asancha Public Listing Preview Page
 *
 * Purpose:
 * Displays a public-safe marketplace listing using its public slug.
 *
 * Responsibilities:
 * - Retrieve the published listing from the marketplace API.
 * - Generate listing-specific metadata and canonical information.
 * - Render public property, pricing, media, and investment information.
 * - Explain sections restricted by authentication, profile, verification,
 *   payment, reservation, or permission requirements.
 * - Render safe listing-preview and breadcrumb JSON-LD.
 *
 * Security notes:
 * - The route uses a public listing slug, never a MongoDB ObjectId.
 * - The page must not expose private deal packs, seller contact details,
 *   investor data, sensitive documents, internal notes, payment information,
 *   private storage keys, or restricted AI analysis.
 * - Backend publication and field-visibility rules remain final.
 * - Frontend calls to action do not grant access to protected workflows.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { JsonLd } from "@/src/components/seo/json-ld";
import { marketplaceApi } from "@/src/features/marketplace/api/marketplace.api";
import {
  MARKETPLACE_PAGE_ROUTES,
  MARKETPLACE_SAFE_MESSAGES,
} from "@/src/features/marketplace/constants/marketplace.constants";
import type {
  MarketplaceListingDetail,
  MarketplacePublicMedia,
  MarketplaceRestrictedSection,
} from "@/src/features/marketplace/types/marketplace.types";
import {
  createBreadcrumbJsonLd,
  createPublicListingPreviewJsonLd,
} from "@/src/lib/seo/json-ld";

interface ListingPreviewPageProps {
  params: Promise<{
    listingSlug: string;
  }>;
}

/**
 * Retrieves one public listing while allowing React to reuse the request
 * between metadata generation and page rendering.
 */
const getPublicListing = cache(
  async (listingSlug: string): Promise<MarketplaceListingDetail | null> => {
    const normalizedSlug = listingSlug.trim();

    if (!normalizedSlug) {
      return null;
    }

    try {
      return await marketplaceApi.getListing(normalizedSlug);
    } catch {
      return null;
    }
  },
);

/**
 * Converts an API enum value to a human-readable label.
 */
function formatEnumLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Formats a marketplace monetary value.
 */
function formatCurrency(value: number | null, currency: string): string {
  if (value === null) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats an ISO date for public display.
 */
function formatDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(parsedDate);
}

/**
 * Returns the listing's safest public location label.
 */
function getLocationLabel(listing: MarketplaceListingDetail): string {
  if (listing.location.displayName.trim()) {
    return listing.location.displayName;
  }

  const locationParts = [
    listing.location.townOrCity,
    listing.location.county,
    listing.location.postcodeDistrict,
  ].filter(
    (part): part is string =>
      typeof part === "string" && part.trim().length > 0,
  );

  return locationParts.length > 0 ? locationParts.join(", ") : "United Kingdom";
}

/**
 * Returns public image media in their approved display order.
 */
function getPublicImages(
  media: MarketplacePublicMedia[],
): MarketplacePublicMedia[] {
  return media
    .filter((item) => item.mediaType === "image")
    .sort((firstItem, secondItem) => {
      if (firstItem.isCover && !secondItem.isCover) {
        return -1;
      }

      if (!firstItem.isCover && secondItem.isCover) {
        return 1;
      }

      return firstItem.sortOrder - secondItem.sortOrder;
    });
}

/**
 * Returns the appropriate public route for a restricted section.
 */
function getRestrictionActionPath(
  section: MarketplaceRestrictedSection,
  listingSlug: string,
): string {
  if (section.actionPath) {
    return section.actionPath;
  }

  const returnTo = encodeURIComponent(
    MARKETPLACE_PAGE_ROUTES.listing(listingSlug),
  );

  switch (section.reason) {
    case "authentication_required":
      return `/auth/sign-in?returnTo=${returnTo}`;

    case "profile_required":
      return "/account/business-profiles/add";

    case "verification_required":
      return "/verification";

    case "payment_required":
    case "reservation_required":
    case "permission_required":
    default:
      return `/auth/sign-in?returnTo=${returnTo}`;
  }
}

/**
 * Creates metadata for a public marketplace listing.
 */
export async function generateMetadata({
  params,
}: ListingPreviewPageProps): Promise<Metadata> {
  const { listingSlug } = await params;
  const listing = await getPublicListing(listingSlug);

  if (!listing) {
    return {
      title: "Listing Not Found | Asancha Marketplace",
      description:
        "The requested public property opportunity could not be found on Asancha.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    listing.shortDescription?.trim() || listing.description.trim();

  const publicImages = getPublicImages(listing.publicMedia);

  const coverImage = publicImages[0] ?? null;

  return {
    title: `${listing.title} | Asancha Marketplace`,
    description,
    alternates: {
      canonical: MARKETPLACE_PAGE_ROUTES.listing(listing.slug),
    },
    openGraph: {
      title: `${listing.title} | Asancha Marketplace`,
      description,
      url: MARKETPLACE_PAGE_ROUTES.listing(listing.slug),
      type: "website",
      images: coverImage
        ? [
            {
              url: coverImage.url,
              alt: coverImage.altText,
              width: coverImage.width ?? undefined,
              height: coverImage.height ?? undefined,
            },
          ]
        : undefined,
    },
  };
}

/**
 * Renders one safe public marketplace listing.
 */
export default async function ListingPreviewPage({
  params,
}: ListingPreviewPageProps) {
  const { listingSlug } = await params;
  const listing = await getPublicListing(listingSlug);

  if (!listing) {
    notFound();
  }

  const locationLabel = getLocationLabel(listing);
  const publicImages = getPublicImages(listing.publicMedia);

  const coverImage = publicImages[0] ?? null;
  const galleryImages = publicImages.slice(1, 5);

  const description =
    listing.shortDescription?.trim() || listing.description.trim();

  const jsonLd = [
    createPublicListingPreviewJsonLd({
      slug: listing.slug,
      name: listing.title,
      description,
      location: locationLabel,
      category: formatEnumLabel(listing.listingCategory),
    }),

    createBreadcrumbJsonLd([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Marketplace",
        path: MARKETPLACE_PAGE_ROUTES.root,
      },
      {
        name: listing.title,
        path: MARKETPLACE_PAGE_ROUTES.listing(listing.slug),
      },
    ]),
  ] as const;

  const signInReturnPath = encodeURIComponent(
    MARKETPLACE_PAGE_ROUTES.listing(listing.slug),
  );

  return (
    <>
      <JsonLd data={jsonLd} id="listing-preview-json-ld" />

      <main>
        <article className="asancha-page-container py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              className="inline-flex rounded-md text-sm font-bold text-primary hover:underline focus:outline-none focus:ring-4 focus:ring-ring/20"
              href={MARKETPLACE_PAGE_ROUTES.root}
            >
              ← Back to marketplace
            </Link>
          </nav>

          <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  {formatEnumLabel(listing.listingCategory)}
                </p>

                {listing.isFeatured ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    Featured
                  </span>
                ) : null}

                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-foreground">
                  {formatEnumLabel(listing.calculatedStatus)}
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                {listing.title}
              </h1>

              <p className="mt-4 text-base font-semibold text-muted-foreground">
                {locationLabel}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground">
                <span>{formatEnumLabel(listing.propertyType)}</span>

                {listing.bedrooms !== null ? (
                  <span>
                    {listing.bedrooms}{" "}
                    {listing.bedrooms === 1 ? "bedroom" : "bedrooms"}
                  </span>
                ) : null}

                {listing.bathrooms !== null ? (
                  <span>
                    {listing.bathrooms}{" "}
                    {listing.bathrooms === 1 ? "bathroom" : "bathrooms"}
                  </span>
                ) : null}

                {listing.receptionRooms !== null ? (
                  <span>
                    {listing.receptionRooms}{" "}
                    {listing.receptionRooms === 1
                      ? "reception room"
                      : "reception rooms"}
                  </span>
                ) : null}

                {listing.occupancyStatus ? (
                  <span>{formatEnumLabel(listing.occupancyStatus)}</span>
                ) : null}

                {listing.tenureType ? (
                  <span>{formatEnumLabel(listing.tenureType)}</span>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:min-w-64">
              <p className="text-sm font-semibold text-muted-foreground">
                Asking price
              </p>

              <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                {formatCurrency(listing.price, listing.currency)}
              </p>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Public pricing is subject to listing availability, verification,
                and platform confirmation.
              </p>
            </div>
          </header>

          <section aria-label="Property media" className="mt-10">
            {coverImage ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <figure className="relative min-h-80 overflow-hidden rounded-2xl bg-muted sm:min-h-[32rem]">
                  <Image
                    alt={coverImage.altText}
                    className="object-cover"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    src={coverImage.url}
                  />

                  {coverImage.caption ? (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-foreground/75 px-4 py-3 text-sm text-background">
                      {coverImage.caption}
                    </figcaption>
                  ) : null}
                </figure>

                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                    {galleryImages.map((image) => (
                      <figure
                        className="relative min-h-40 overflow-hidden rounded-2xl bg-muted"
                        key={image.mediaPublicId}
                      >
                        <Image
                          alt={image.altText}
                          className="object-cover"
                          fill
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          src={image.url}
                        />
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-sm font-semibold text-muted-foreground">
                    Additional public images have not been provided.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-border bg-muted p-8 text-center">
                <div>
                  <p className="font-bold text-foreground">
                    Property media unavailable
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Public images have not been provided for this opportunity.
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-8">
              <section
                aria-labelledby="listing-description-heading"
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <h2
                  className="text-2xl font-bold text-foreground"
                  id="listing-description-heading"
                >
                  About this opportunity
                </h2>

                <div className="mt-5 whitespace-pre-line text-base leading-8 text-muted-foreground">
                  {listing.description}
                </div>
              </section>

              {listing.features.length > 0 ? (
                <section
                  aria-labelledby="listing-features-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="listing-features-heading"
                  >
                    Property highlights
                  </h2>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {listing.features.map((feature) => (
                      <li
                        className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        key={feature}
                      >
                        <span
                          aria-hidden="true"
                          className="font-bold text-primary"
                        >
                          ✓
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {listing.investmentMetrics ? (
                <section
                  aria-labelledby="investment-metrics-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="investment-metrics-heading"
                  >
                    Public investment metrics
                  </h2>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {listing.investmentMetrics.estimatedMarketValue !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          Estimated market value
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {formatCurrency(
                            listing.investmentMetrics.estimatedMarketValue,
                            listing.investmentMetrics.currency,
                          )}
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.bmvDiscountPercent !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          BMV discount
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {listing.investmentMetrics.bmvDiscountPercent}%
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.estimatedMonthlyRent !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          Estimated monthly rent
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {formatCurrency(
                            listing.investmentMetrics.estimatedMonthlyRent,
                            listing.investmentMetrics.currency,
                          )}
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.grossYieldPercent !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          Estimated gross yield
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {listing.investmentMetrics.grossYieldPercent}%
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.estimatedRoiPercent !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          Estimated ROI
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {listing.investmentMetrics.estimatedRoiPercent}%
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.refurbishmentEstimate !==
                    null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          Refurbishment estimate
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {formatCurrency(
                            listing.investmentMetrics.refurbishmentEstimate,
                            listing.investmentMetrics.currency,
                          )}
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.totalInvestmentEstimate !==
                    null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="text-sm font-semibold text-muted-foreground">
                          Total investment estimate
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {formatCurrency(
                            listing.investmentMetrics.totalInvestmentEstimate,
                            listing.investmentMetrics.currency,
                          )}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <p className="mt-6 rounded-xl border border-accent bg-accent p-4 text-sm leading-6 text-accent-foreground">
                    {listing.investmentMetrics.disclaimer ||
                      MARKETPLACE_SAFE_MESSAGES.aiDisclaimer}
                  </p>
                </section>
              ) : null}

              {listing.strategies.length > 0 || listing.badges.length > 0 ? (
                <section
                  aria-labelledby="listing-suitability-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="listing-suitability-heading"
                  >
                    Opportunity suitability
                  </h2>

                  {listing.strategies.length > 0 ? (
                    <div className="mt-5">
                      <h3 className="text-sm font-bold text-foreground">
                        Potential strategies
                      </h3>

                      <ul className="mt-3 flex flex-wrap gap-2">
                        {listing.strategies.map((strategy) => (
                          <li
                            className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-bold text-foreground"
                            key={strategy}
                          >
                            {formatEnumLabel(strategy)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {listing.badges.length > 0 ? (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-foreground">
                        Highlights
                      </h3>

                      <ul className="mt-3 flex flex-wrap gap-2">
                        {listing.badges.map((badge) => (
                          <li
                            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                            key={badge}
                          >
                            {badge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {listing.restrictedSections.length > 0 ? (
                <section
                  aria-labelledby="restricted-information-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="restricted-information-heading"
                  >
                    Protected deal information
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    These sections are not included in the public marketplace
                    preview.
                  </p>

                  <div className="mt-6 grid gap-4">
                    {listing.restrictedSections.map((section) => (
                      <article
                        className="rounded-xl border border-border bg-muted p-5"
                        key={section.key}
                      >
                        <h3 className="font-bold text-foreground">
                          {section.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {section.message}
                        </p>

                        {section.actionLabel ? (
                          <Link
                            className="mt-4 inline-flex rounded-lg font-bold text-primary hover:underline focus:outline-none focus:ring-4 focus:ring-ring/20"
                            href={getRestrictionActionPath(
                              section,
                              listing.slug,
                            )}
                          >
                            {section.actionLabel}
                          </Link>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground">
                  Continue with this opportunity
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Create an account or sign in to save this listing and check
                  which protected actions are available to your active profile.
                </p>

                <div className="mt-5 grid gap-3">
                  <Link
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-ring/20"
                    href={`/auth/sign-in?returnTo=${signInReturnPath}`}
                  >
                    Sign in to continue
                  </Link>

                  <Link
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
                    href="/auth/sign-up"
                  >
                    Create an account
                  </Link>

                  <Link
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
                    href="/support"
                  >
                    Ask a question
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-bold text-foreground">
                  Listing information
                </h2>

                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="font-semibold text-muted-foreground">
                      Listing type
                    </dt>

                    <dd className="mt-1 font-bold text-foreground">
                      {formatEnumLabel(listing.listingType)}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-muted-foreground">
                      Deal status
                    </dt>

                    <dd className="mt-1 font-bold text-foreground">
                      {formatEnumLabel(listing.dealStatus)}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-muted-foreground">
                      Published
                    </dt>

                    <dd className="mt-1 font-bold text-foreground">
                      {formatDate(listing.publishedAt)}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-muted-foreground">
                      Last updated
                    </dt>

                    <dd className="mt-1 font-bold text-foreground">
                      {formatDate(listing.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
