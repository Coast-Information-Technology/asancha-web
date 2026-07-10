// File: src/components/marketplace/marketplace-loading-state.tsx

/**
 * Asancha Marketplace Loading State
 *
 * Purpose:
 * Provides a non-blocking visual loading state while public listings load.
 */

import type { MarketplaceViewMode } from "@/src/features/marketplace/types/marketplace.types";

import styles from "./marketplace-browser.module.css";

interface MarketplaceLoadingStateProps {
  viewMode: MarketplaceViewMode;
}

/**
 * Renders accessible marketplace loading placeholders.
 */
export function MarketplaceLoadingState({
  viewMode,
}: MarketplaceLoadingStateProps) {
  return (
    <div
      aria-label="Loading marketplace opportunities"
      className={viewMode === "grid" ? styles.listingGrid : styles.listingList}
      role="status"
    >
      <span className="sr-only">Loading marketplace opportunities</span>

      {Array.from({ length: 6 }, (_, index) => (
        <div
          aria-hidden="true"
          className={`${styles.loadingCard} ${
            viewMode === "list" ? styles.loadingCardList : ""
          }`}
          key={index}
        >
          <div className={styles.loadingMedia} />

          <div className={styles.loadingContent}>
            <div className={styles.loadingLineShort} />
            <div className={styles.loadingLineTitle} />
            <div className={styles.loadingLineMedium} />
            <div className={styles.loadingMetricRow}>
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
