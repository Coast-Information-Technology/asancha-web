// File: src/components/marketplace/marketplace-empty-state.tsx

/**
 * Asancha Marketplace Empty State
 *
 * Purpose:
 * Explains when no marketplace results match the applied filters.
 */

import { MARKETPLACE_SAFE_MESSAGES } from "@/src/features/marketplace/constants/marketplace.constants";

import styles from "./marketplace-browser.module.css";

interface MarketplaceEmptyStateProps {
  onChangeSearch: () => void;
  onReset: () => void;
}

/**
 * Renders the no-results marketplace state.
 */
export function MarketplaceEmptyState({
  onChangeSearch,
  onReset,
}: MarketplaceEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div aria-hidden="true" className={styles.emptyStateIcon}>
        ◇
      </div>

      <h2 className={styles.emptyStateTitle}>
        No opportunities match your search yet.
      </h2>

      <p className={styles.emptyStateMessage}>
        {MARKETPLACE_SAFE_MESSAGES.empty}
      </p>

      <div className={styles.emptyStateActions}>
        <button className={styles.applyButton} onClick={onReset} type="button">
          Clear Filters
        </button>
        <button
          className={styles.resetButton}
          onClick={onChangeSearch}
          type="button"
        >
          Change Search
        </button>
      </div>
    </div>
  );
}
