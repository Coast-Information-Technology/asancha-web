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
  onReset: () => void;
}

/**
 * Renders the no-results marketplace state.
 */
export function MarketplaceEmptyState({ onReset }: MarketplaceEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div aria-hidden="true" className={styles.emptyStateIcon}>
        ◇
      </div>

      <h2 className={styles.emptyStateTitle}>No matching opportunities</h2>

      <p className={styles.emptyStateMessage}>
        {MARKETPLACE_SAFE_MESSAGES.empty}
      </p>

      <button className={styles.applyButton} onClick={onReset} type="button">
        Clear all filters
      </button>
    </div>
  );
}
