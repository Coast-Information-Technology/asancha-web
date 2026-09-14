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
import { cookies } from "next/headers";
import { CheckCircle2, CircleAlert, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { JsonLd } from "@/src/components/seo/json-ld";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/src/features/auth/server/auth-session-cookies";
import { marketplaceApi } from "@/src/features/marketplace/api/marketplace.api";
import { MARKETPLACE_PAGE_ROUTES } from "@/src/features/marketplace/constants/marketplace.constants";
import type {
  MarketplaceInvestmentMetrics,
  MarketplaceListingDetail,
  MarketplacePublicMedia,
  MarketplaceRestrictedSection,
} from "@/src/features/marketplace/types/marketplace.types";
import {
  createBreadcrumbJsonLd,
  createPublicListingPreviewJsonLd,
} from "@/src/lib/seo/json-ld";
import {
  type BusinessProfileType,
  getDashboardPathForBusinessProfile,
  isBusinessProfileType,
} from "@/src/lib/auth/role-guards";

interface ListingPreviewPageProps {
  params: Promise<{
    listingSlug: string;
  }>;
}

interface ListingAccessContext {
  hasAccessToken: boolean;
  businessProfileType: BusinessProfileType | null;
  dashboardHref: string;
}

type InformationClassification =
  "Calculation" | "Calculation / estimate" | "Estimate" | "Fact";

const DEFAULT_INVESTMENT_DISCLAIMER =
  "Investment figures may include estimates and calculations. Review the information labels and assumptions before making an investment decision.";

const PROTECTED_INFORMATION_CATEGORIES = [
  "Detailed deal information",
  "Supporting documents",
  "Property / transaction information",
  "Investment Pack, where available",
] as const;

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
 * Renders the authority classification attached to a displayed value.
 */
function InformationLabel({
  classification,
}: {
  classification: InformationClassification;
}) {
  return (
    <span className="inline-flex rounded-full border border-primary/20 bg-accent px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-wide text-primary">
      {classification}
    </span>
  );
}

/**
 * Uses a richer backend-authored disclaimer when provided, while replacing
 * the deprecated generic marketplace wording.
 */
function getInvestmentDisclaimer(metrics: MarketplaceInvestmentMetrics) {
  const backendDisclaimer = metrics.disclaimer?.trim();

  if (
    backendDisclaimer &&
    backendDisclaimer.toLowerCase() !==
      "public marketplace metrics are estimates only."
  ) {
    return backendDisclaimer;
  }

  return DEFAULT_INVESTMENT_DISCLAIMER;
}

/**
 * Builds an evidence-led overview only from values present on the listing.
 */
function getInvestmentOverview(listing: MarketplaceListingDetail): string {
  const metrics = listing.investmentMetrics;

  if (!metrics) {
    return "Review the available property information and confirm any additional assumptions before deciding whether to progress.";
  }

  const sentences: string[] = [];

  if (listing.price !== null && metrics.estimatedMarketValue !== null) {
    sentences.push(
      `This opportunity is listed at ${formatCurrency(listing.price, listing.currency)} against an estimated market value of ${formatCurrency(metrics.estimatedMarketValue, metrics.currency)}.`,
    );
  } else if (listing.price !== null) {
    sentences.push(
      `This opportunity is listed at ${formatCurrency(listing.price, listing.currency)}.`,
    );
  }

  if (metrics.bmvDiscountPercent !== null) {
    sentences.push(
      `The available figures indicate an estimated ${metrics.bmvDiscountPercent}% below-market discount.`,
    );
  }

  if (
    metrics.estimatedMonthlyRent !== null &&
    metrics.grossYieldPercent !== null
  ) {
    sentences.push(
      `Based on an estimated monthly rent of ${formatCurrency(metrics.estimatedMonthlyRent, metrics.currency)}, the indicated gross yield is approximately ${metrics.grossYieldPercent}%.`,
    );
  } else if (metrics.grossYieldPercent !== null) {
    sentences.push(
      `The available figures indicate a gross yield of approximately ${metrics.grossYieldPercent}%.`,
    );
  }

  if (metrics.refurbishmentEstimate !== null) {
    sentences.push(
      `A refurbishment allowance of ${formatCurrency(metrics.refurbishmentEstimate, metrics.currency)} is currently estimated and should be independently assessed.`,
    );
  }

  return (
    sentences.join(" ") ||
    "Review the available investment figures and their assumptions before deciding whether to progress."
  );
}

function getInvestmentAssumptions(
  metrics: MarketplaceInvestmentMetrics,
): string[] {
  const assumptions: string[] = [];

  if (metrics.bmvDiscountPercent !== null) {
    assumptions.push(
      "The below-market comparison uses the asking price and estimated market value shown on this page.",
    );
  }

  if (metrics.grossYieldPercent !== null) {
    assumptions.push(
      "Gross yield is calculated from the indicated annual rent and asking price before finance, tax, management, maintenance and other costs.",
    );
  }

  if (metrics.refurbishmentEstimate !== null) {
    assumptions.push(
      "The refurbishment figure is an estimate and may change following inspection, specification and professional quotations.",
    );
  }

  if (
    metrics.estimatedRoiPercent !== null ||
    metrics.totalInvestmentEstimate !== null
  ) {
    assumptions.push(
      "ROI and total-investment figures may combine estimates and calculations; confirm their inputs before relying on them.",
    );
  }

  return assumptions;
}

function getKeyOpportunity(listing: MarketplaceListingDetail): string {
  const metrics = listing.investmentMetrics;

  if (metrics?.bmvDiscountPercent !== null && metrics?.bmvDiscountPercent) {
    return `${metrics.bmvDiscountPercent}% estimated below-market positioning based on the available comparison.`;
  }

  if (metrics?.grossYieldPercent !== null && metrics?.grossYieldPercent) {
    return `${metrics.grossYieldPercent}% indicated gross yield based on the available rental estimate.`;
  }

  return "The published property information provides a starting point for further evaluation.";
}

function getKeyConsideration(listing: MarketplaceListingDetail): string {
  const refurbishmentEstimate =
    listing.investmentMetrics?.refurbishmentEstimate;

  if (refurbishmentEstimate !== null && refurbishmentEstimate !== undefined) {
    return `The ${formatCurrency(refurbishmentEstimate, listing.currency)} refurbishment estimate should be validated through inspection and professional quotations.`;
  }

  if (listing.occupancyStatus) {
    return `The property is listed as ${formatEnumLabel(listing.occupancyStatus).toLowerCase()}; confirm the current position and any implications before progressing.`;
  }

  return "Confirm the property information, assumptions, condition and protected deal details before making a decision.";
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
 * Reads the role claim from the access token for frontend route guidance only.
 * Backend authorization remains the final authority for protected actions.
 */
function getBusinessProfileTypeFromAccessToken(
  accessToken: string | null | undefined,
): BusinessProfileType | null {
  if (!accessToken) {
    return null;
  }

  const [, payload] = accessToken.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = JSON.parse(
      Buffer.from(normalizedPayload, "base64").toString("utf8"),
    ) as { role?: unknown };

    return isBusinessProfileType(decodedPayload.role)
      ? decodedPayload.role
      : null;
  } catch {
    return null;
  }
}

/**
 * Resolves public listing actions based on access-token presence.
 */
async function getListingAccessContext(): Promise<ListingAccessContext> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  const businessProfileType =
    getBusinessProfileTypeFromAccessToken(accessToken);

  return {
    hasAccessToken: Boolean(accessToken),
    businessProfileType,
    dashboardHref: businessProfileType
      ? getDashboardPathForBusinessProfile(businessProfileType)
      : "/dashboard",
  };
}

/**
 * Returns the appropriate public route for a restricted section.
 */
function getRestrictionActionPath(
  section: MarketplaceRestrictedSection,
  listingSlug: string,
  accessContext: ListingAccessContext,
): string {
  if (accessContext.hasAccessToken) {
    switch (section.reason) {
      case "profile_required":
        return "/account/business-profiles/add";

      case "authentication_required":
        return accessContext.dashboardHref;

      case "verification_required":
      case "payment_required":
      case "reservation_required":
      case "permission_required":
      default:
        return section.actionPath || accessContext.dashboardHref;
    }
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
      return section.actionPath || `/auth/sign-in?returnTo=${returnTo}`;
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
      title: "Property Not Found | Asancha",
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
    title: `${listing.title} | Asancha Property Opportunity`,
    description,
    alternates: {
      canonical: MARKETPLACE_PAGE_ROUTES.listing(listing.slug),
    },
    openGraph: {
      title: `${listing.title} | Asancha Property Opportunity`,
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
  const [listing, accessContext] = await Promise.all([
    getPublicListing(listingSlug),
    getListingAccessContext(),
  ]);

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
        name: "Find Properties",
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
  const signInPath = `/auth/sign-in?returnTo=${signInReturnPath}`;
  const investmentAssumptions = listing.investmentMetrics
    ? getInvestmentAssumptions(listing.investmentMetrics)
    : [];
  const hasInvestorProfile = accessContext.businessProfileType === "investor";
  const explainableInvestorMatch =
    hasInvestorProfile && listing.investorMatch?.matchReasons.length
      ? listing.investorMatch
      : null;
  const investorProfileAction = accessContext.hasAccessToken
    ? hasInvestorProfile
      ? "/dashboard/investor/preferences"
      : "/account/business-profiles/add"
    : "/auth/sign-up";
  const progressionLabel = listing.canRequestAccess
    ? "Request Access"
    : listing.canReserve
      ? "Reserve This Opportunity"
      : listing.canStartConversation
        ? "Ask About This Opportunity"
        : "View Available Actions";
  const listingBadgeLabels = new Set(
    listing.badges.map((badge) => badge.trim().toLowerCase()),
  );
  const propertyDetails = listing.features.filter(
    (feature) => !listingBadgeLabels.has(feature.trim().toLowerCase()),
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
              ← Back to Find Properties
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

                {listing.verificationStatus ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-bold text-primary">
                    <CheckCircle2 aria-hidden="true" size={14} />
                    Verification: {formatEnumLabel(listing.verificationStatus)}
                  </span>
                ) : null}
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
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  Asking price
                </p>
                <InformationLabel classification="Fact" />
              </div>

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

              {listing.investmentMetrics ? (
                <section
                  aria-labelledby="investment-metrics-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="investment-metrics-heading"
                  >
                    Key investment numbers
                  </h2>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {listing.investmentMetrics.estimatedMarketValue !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>Estimated market value</span>
                          <InformationLabel classification="Estimate" />
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
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>BMV discount</span>
                          <InformationLabel classification="Calculation / estimate" />
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {listing.investmentMetrics.bmvDiscountPercent}%
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.estimatedMonthlyRent !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>Estimated monthly rent</span>
                          <InformationLabel classification="Estimate" />
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
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>Gross yield</span>
                          <InformationLabel classification="Calculation" />
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {listing.investmentMetrics.grossYieldPercent}%
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.estimatedRoiPercent !== null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>Estimated ROI</span>
                          <InformationLabel classification="Calculation / estimate" />
                        </dt>

                        <dd className="mt-2 text-xl font-extrabold text-foreground">
                          {listing.investmentMetrics.estimatedRoiPercent}%
                        </dd>
                      </div>
                    ) : null}

                    {listing.investmentMetrics.refurbishmentEstimate !==
                    null ? (
                      <div className="rounded-xl bg-muted p-4">
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>Refurbishment cost</span>
                          <InformationLabel classification="Estimate" />
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
                        <dt className="flex items-start justify-between gap-3 text-sm font-semibold text-muted-foreground">
                          <span>Total investment</span>
                          <InformationLabel classification="Calculation / estimate" />
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

                  <div className="mt-6 rounded-xl border border-accent bg-accent p-4 text-sm leading-6 text-accent-foreground">
                    <p>{getInvestmentDisclaimer(listing.investmentMetrics)}</p>

                    {investmentAssumptions.length > 0 ? (
                      <details className="group mt-3">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring marker:content-none">
                          View assumptions &amp; methodology
                          <span
                            aria-hidden="true"
                            className="transition-transform group-open:rotate-90"
                          >
                            →
                          </span>
                        </summary>
                        <ul className="mt-4 grid gap-2 border-t border-primary/15 pt-4">
                          {investmentAssumptions.map((assumption) => (
                            <li className="flex gap-2" key={assumption}>
                              <span aria-hidden="true">•</span>
                              <span>{assumption}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {listing.investmentMetrics || listing.strategies.length > 0 ? (
                <section
                  aria-labelledby="investment-overview-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="investment-overview-heading"
                  >
                    Investment overview
                  </h2>

                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    {getInvestmentOverview(listing)}
                  </p>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    {listing.strategies.length > 0 ? (
                      <div className="rounded-xl border border-border bg-muted p-4">
                        <dt className="text-xs font-extrabold uppercase tracking-wide text-primary">
                          Potential strategy
                        </dt>
                        <dd className="mt-2 font-bold text-foreground">
                          {listing.strategies
                            .map((strategy) => formatEnumLabel(strategy))
                            .join(", ")}
                        </dd>
                      </div>
                    ) : null}
                    <div className="rounded-xl border border-border bg-muted p-4">
                      <dt className="text-xs font-extrabold uppercase tracking-wide text-primary">
                        Key opportunity
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-foreground">
                        {getKeyOpportunity(listing)}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-border bg-muted p-4 sm:col-span-2">
                      <dt className="text-xs font-extrabold uppercase tracking-wide text-primary">
                        Key consideration
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-foreground">
                        {getKeyConsideration(listing)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-xs leading-5 text-muted-foreground">
                    This summary interprets available public information and
                    does not guarantee value, rent, yield, returns or property
                    condition.
                  </p>
                </section>
              ) : null}

              <section
                aria-labelledby="listing-suitability-heading"
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                      Personalised suitability
                    </p>
                    <h2
                      className="mt-2 text-2xl font-bold text-foreground"
                      id="listing-suitability-heading"
                    >
                      How This Opportunity Matches You
                    </h2>
                  </div>

                  {explainableInvestorMatch ? (
                    <div className="rounded-xl bg-primary px-4 py-3 text-center text-primary-foreground">
                      <strong className="block text-2xl">
                        {explainableInvestorMatch.scorePercent}%
                      </strong>
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Explainable match
                      </span>
                    </div>
                  ) : null}
                </div>

                {explainableInvestorMatch ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-muted p-5">
                      <h3 className="font-bold text-foreground">
                        Matching requirements
                      </h3>
                      <ul className="mt-4 grid gap-3">
                        {explainableInvestorMatch.matchReasons.map((reason) => (
                          <li
                            className="flex gap-3 text-sm leading-6 text-muted-foreground"
                            key={reason}
                          >
                            <CheckCircle2
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-primary"
                              size={18}
                            />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-muted p-5">
                      <h3 className="font-bold text-foreground">
                        Points to consider
                      </h3>
                      {explainableInvestorMatch.mismatchReasons.length > 0 ? (
                        <ul className="mt-4 grid gap-3">
                          {explainableInvestorMatch.mismatchReasons.map(
                            (reason) => (
                              <li
                                className="flex gap-3 text-sm leading-6 text-muted-foreground"
                                key={reason}
                              >
                                <CircleAlert
                                  aria-hidden="true"
                                  className="mt-0.5 shrink-0 text-primary"
                                  size={18}
                                />
                                <span>{reason}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          No mismatch reasons were provided. Continue reviewing
                          the property information and assumptions before
                          progressing.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {hasInvestorProfile
                        ? "Complete or update your investor requirements to compare this opportunity with your budget, target location, strategy, yield and property preferences."
                        : "Create an investor profile to see how this opportunity aligns with your budget, target location, strategy and investment criteria."}
                    </p>
                    <Link
                      className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
                      href={investorProfileAction}
                    >
                      {hasInvestorProfile
                        ? "Review Investor Requirements"
                        : "Create Investor Profile"}
                    </Link>
                  </>
                )}
              </section>

              {propertyDetails.length > 0 ? (
                <section
                  aria-labelledby="listing-features-heading"
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <h2
                    className="text-2xl font-bold text-foreground"
                    id="listing-features-heading"
                  >
                    Property details
                  </h2>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {propertyDetails.map((feature) => (
                      <li
                        className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        key={feature}
                      >
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-primary"
                          size={18}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section
                aria-labelledby="restricted-information-heading"
                className="rounded-2xl border border-border bg-foreground p-6 text-primary-foreground shadow-sm sm:p-8"
              >
                <h2
                  className="text-2xl font-bold text-primary-foreground"
                  id="restricted-information-heading"
                >
                  Protected Deal Information
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-primary-foreground/75">
                  Eligible investors may be able to access additional property
                  and deal information after signing in and completing the
                  required verification.
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {PROTECTED_INFORMATION_CATEGORIES.map((category) => (
                    <li
                      className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/8 p-4 text-sm font-bold"
                      key={category}
                    >
                      <LockKeyhole
                        aria-hidden="true"
                        className="shrink-0"
                        size={18}
                      />
                      <span>{category}</span>
                    </li>
                  ))}
                </ul>

                {listing.restrictedSections.length > 0 ? (
                  <details className="group mt-5 rounded-xl border border-primary-foreground/15 p-4">
                    <summary className="cursor-pointer list-none font-bold marker:content-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground">
                      View access requirements
                    </summary>
                    <div className="mt-4 grid gap-4 border-t border-primary-foreground/15 pt-4">
                      {listing.restrictedSections.map((section) => (
                        <article key={section.key}>
                          <h3 className="font-bold">{section.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-primary-foreground/70">
                            {section.message}
                          </p>
                          {section.actionLabel ? (
                            <Link
                              className="mt-2 inline-flex cursor-pointer rounded-md font-bold text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground"
                              href={getRestrictionActionPath(
                                section,
                                listing.slug,
                                accessContext,
                              )}
                            >
                              {accessContext.hasAccessToken &&
                              section.reason === "authentication_required"
                                ? "Continue"
                                : section.actionLabel}
                            </Link>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </details>
                ) : null}

                <Link
                  className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                  href={
                    accessContext.hasAccessToken
                      ? accessContext.dashboardHref
                      : signInPath
                  }
                >
                  {accessContext.hasAccessToken
                    ? "Review Access Requirements"
                    : "Sign In to Request Access"}
                </Link>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground">
                  Interested in This Opportunity?
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {accessContext.hasAccessToken
                    ? "Continue with the next action currently available to your active profile. Eligibility and access remain subject to the applicable platform requirements."
                    : "Sign in or create an account to save this property, access eligible deal information and take the next available step."}
                </p>

                <div className="mt-5 grid gap-3">
                  {accessContext.hasAccessToken ? (
                    <Link
                      className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                      href={accessContext.dashboardHref}
                    >
                      {progressionLabel}
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                        href={signInPath}
                      >
                        Sign In to Continue
                      </Link>

                      <Link
                        className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
                        href="/auth/sign-up"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}

                  <Link
                    className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
                    href="/support"
                  >
                    Ask a Question
                  </Link>
                </div>
              </section>
            </aside>
          </div>

          <section
            aria-labelledby="listing-information-heading"
            className="mt-8 rounded-2xl border border-border bg-muted p-6 sm:p-8"
          >
            <h2
              className="text-lg font-bold text-foreground"
              id="listing-information-heading"
            >
              Listing information
            </h2>

            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
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
                  Opportunity status
                </dt>
                <dd className="mt-1 font-bold text-foreground">
                  {formatEnumLabel(listing.calculatedStatus)}
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
        </article>
      </main>
    </>
  );
}
