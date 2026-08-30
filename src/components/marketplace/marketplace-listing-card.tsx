// File: src/components/marketplace/marketplace-listing-card.tsx

/**
 * Asancha Marketplace Listing Card
 *
 * Purpose:
 * Displays one public-safe property opportunity preview.
 *
 * Security notes:
 * - The card must render only public-safe listing fields.
 * - It must not render seller contact details, private documents, deal packs,
 *   restricted analysis, internal notes, or ObjectIds.
 */

import Image from "next/image";
import Link from "next/link";

import { MARKETPLACE_PAGE_ROUTES } from "@/src/features/marketplace/constants/marketplace.constants";
import type {
  MarketplaceListingCard as MarketplaceListingCardType,
  MarketplaceViewMode,
} from "@/src/features/marketplace/types/marketplace.types";

import styles from "./marketplace-browser.module.css";

interface MarketplaceListingCardProps {
  listing: MarketplaceListingCardType;
  viewMode: MarketplaceViewMode;
}

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

function formatPropertyType(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatStatus(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Renders one public listing preview.
 */
export function MarketplaceListingCard({
  listing,
  viewMode,
}: MarketplaceListingCardProps) {
  const detailPath = MARKETPLACE_PAGE_ROUTES.listing(listing.slug);

  const location =
    listing.location.displayName ||
    [listing.location.townOrCity, listing.location.county]
      .filter(Boolean)
      .join(", ");

  return (
    <article
      className={`${styles.listingCard} ${
        viewMode === "list" ? styles.listingCardList : ""
      }`}
    >
      <Link
        aria-label={`View ${listing.title}`}
        className={styles.listingMedia}
        href={detailPath}
      >
        {listing.coverImage ? (
          <Image
            alt={listing.coverImage.altText}
            className={styles.listingImage}
            fill
            sizes={
              viewMode === "list"
                ? "(max-width: 768px) 100vw, 320px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            src={listing.coverImage.url}
          />
        ) : (
          <div className={styles.listingImagePlaceholder}>
            <span>Property preview</span>
          </div>
        )}

        <div className={styles.listingMediaBadges}>
          {listing.isFeatured ? (
            <span className={styles.featuredBadge}>Featured</span>
          ) : null}

          <span className={styles.statusBadge}>
            {formatStatus(listing.calculatedStatus)}
          </span>
        </div>
      </Link>

      <div className={styles.listingContent}>
        <div className={styles.listingHeadingRow}>
          <div>
            <p className={styles.listingCategory}>
              {formatStatus(listing.listingCategory)}
            </p>

            <h2 className={styles.listingTitle}>
              <Link href={detailPath}>{listing.title}</Link>
            </h2>
          </div>

          <div className={styles.listingPriceGroup}>
            <span className={styles.informationType}>Fact</span>
            <p className={styles.listingPrice}>
              {formatCurrency(listing.price, listing.currency)}
            </p>
          </div>
        </div>

        <p className={styles.listingLocation}>{location || "United Kingdom"}</p>

        {listing.verificationStatus ? (
          <p className={styles.verificationStatus}>
            <span>Verification</span>
            {formatStatus(listing.verificationStatus)}
          </p>
        ) : null}

        <div className={styles.propertyFacts}>
          <span>{formatPropertyType(listing.propertyType)}</span>

          {listing.bedrooms !== null ? (
            <span>
              {listing.bedrooms} {listing.bedrooms === 1 ? "bed" : "beds"}
            </span>
          ) : null}

          {listing.bathrooms !== null ? (
            <span>
              {listing.bathrooms} {listing.bathrooms === 1 ? "bath" : "baths"}
            </span>
          ) : null}

          {listing.occupancyStatus ? (
            <span>{formatStatus(listing.occupancyStatus)}</span>
          ) : null}

          {listing.tenureType ? (
            <span>{formatStatus(listing.tenureType)}</span>
          ) : null}
        </div>

        {listing.shortDescription ? (
          <p className={styles.listingDescription}>
            {listing.shortDescription}
          </p>
        ) : null}

        {listing.investmentMetrics ? (
          <dl className={styles.metricGrid}>
            {listing.investmentMetrics.grossYieldPercent !== null ? (
              <div>
                <dt>
                  Gross yield
                  <span>Calculation</span>
                </dt>
                <dd>{listing.investmentMetrics.grossYieldPercent}%</dd>
              </div>
            ) : null}

            {listing.investmentMetrics.estimatedMonthlyRent !== null ? (
              <div>
                <dt>
                  Estimated rent
                  <span>Estimate</span>
                </dt>
                <dd>
                  {formatCurrency(
                    listing.investmentMetrics.estimatedMonthlyRent,
                    listing.investmentMetrics.currency,
                  )}{" "}
                  pcm
                </dd>
              </div>
            ) : null}

            {listing.investmentMetrics.bmvDiscountPercent !== null ? (
              <div>
                <dt>
                  Below-market estimate
                  <span>Estimate</span>
                </dt>
                <dd>{listing.investmentMetrics.bmvDiscountPercent}%</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {listing.investorMatch ? (
          <section
            aria-label="Personalised investor match"
            className={styles.matchSummary}
          >
            <div className={styles.matchSummaryHeading}>
              <span>Investor match</span>
              <strong>{listing.investorMatch.scorePercent}%</strong>
            </div>
            <p>
              {listing.investorMatch.matchReasons[0] ??
                "Review how this opportunity aligns with your criteria."}
            </p>
            {listing.investorMatch.mismatchReasons[0] ? (
              <p className={styles.mismatchReason}>
                Consider: {listing.investorMatch.mismatchReasons[0]}
              </p>
            ) : null}
          </section>
        ) : null}

        {listing.badges.length > 0 ? (
          <ul aria-label="Property highlights" className={styles.badgeList}>
            {listing.badges.slice(0, 3).map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
          </ul>
        ) : null}

        <div className={styles.listingFooter}>
          <Link className={styles.viewListingLink} href={detailPath}>
            View opportunity
          </Link>

          {listing.canSave ? (
            <span className={styles.saveHint}>
              {listing.isSaved ? "Saved" : "Can be saved"}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
