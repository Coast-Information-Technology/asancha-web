// File: src/components/marketplace/marketplace-listing-grid.tsx

/**
 * Asancha Marketplace Listing Grid
 *
 * Purpose:
 * Renders public marketplace cards in grid or list presentation.
 */

import type {
  MarketplaceListingCard as MarketplaceListingCardType,
  MarketplaceViewMode,
} from "@/src/features/marketplace/types/marketplace.types";

import { MarketplaceListingCard } from "./marketplace-listing-card";
import styles from "./marketplace-browser.module.css";

interface MarketplaceListingGridProps {
  listings: MarketplaceListingCardType[];
  viewMode: MarketplaceViewMode;
}

/**
 * Renders marketplace listing results.
 */
export function MarketplaceListingGrid({
  listings,
  viewMode,
}: MarketplaceListingGridProps) {
  return (
    <div
      className={viewMode === "grid" ? styles.listingGrid : styles.listingList}
    >
      {listings.map((listing) => (
        <MarketplaceListingCard
          key={listing.listingPublicId}
          listing={listing}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
