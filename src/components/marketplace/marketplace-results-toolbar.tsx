"use client";

// File: src/components/marketplace/marketplace-results-toolbar.tsx

/**
 * Asancha Marketplace Results Toolbar
 *
 * Purpose:
 * Provides marketplace search, result count, sorting, refresh, filter,
 * and grid/list view controls.
 */

import { MARKETPLACE_SORT_OPTIONS } from "@/src/features/marketplace/constants/marketplace.constants";
import type {
  MarketplaceFilters,
  MarketplacePagination as MarketplacePaginationType,
  MarketplaceViewMode,
} from "@/src/features/marketplace/types/marketplace.types";

import styles from "./marketplace-browser.module.css";

interface MarketplaceResultsToolbarProps {
  filters: MarketplaceFilters;
  pagination: MarketplacePaginationType | null;
  viewMode: MarketplaceViewMode;
  isRefreshing: boolean;
  onFilterOpen: () => void;
  onRefresh: () => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
  onSortChange: (sort: MarketplaceFilters["sort"]) => void;
  onViewModeChange: (viewMode: MarketplaceViewMode) => void;
}

/**
 * Renders marketplace result controls.
 */
export function MarketplaceResultsToolbar({
  filters,
  pagination,
  viewMode,
  isRefreshing,
  onFilterOpen,
  onRefresh,
  onSearchChange,
  onSearchSubmit,
  onSortChange,
  onViewModeChange,
}: MarketplaceResultsToolbarProps) {
  const totalItems = pagination?.totalItems ?? 0;

  return (
    <div className={styles.toolbar}>
      <form
        className={styles.toolbarSearch}
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit();
        }}
        role="search"
      >
        <label className="sr-only" htmlFor="marketplace-toolbar-search">
          Search marketplace
        </label>

        <input
          className={styles.toolbarSearchInput}
          id="marketplace-toolbar-search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search location or keyword"
          type="search"
          value={filters.search}
        />

        <button className={styles.toolbarSearchButton} type="submit">
          Search
        </button>
      </form>

      <div className={styles.toolbarSummary}>
        <p aria-live="polite" className={styles.resultCount}>
          {totalItems === 1
            ? "1 opportunity"
            : `${totalItems.toLocaleString("en-GB")} opportunities`}
        </p>

        <div className={styles.toolbarControls}>
          <button
            className={styles.mobileFilterButton}
            onClick={onFilterOpen}
            type="button"
          >
            Filters
          </button>

          <label className={styles.sortControl}>
            <span className="sr-only">Sort marketplace results</span>

            <select
              className={styles.select}
              onChange={(event) =>
                onSortChange(event.target.value as MarketplaceFilters["sort"])
              }
              value={filters.sort}
            >
              {MARKETPLACE_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div
            aria-label="Result view"
            className={styles.viewSwitcher}
            role="group"
          >
            <button
              aria-pressed={viewMode === "grid"}
              className={`${styles.viewButton} ${
                viewMode === "grid" ? styles.viewButtonActive : ""
              }`}
              onClick={() => onViewModeChange("grid")}
              type="button"
            >
              Grid
            </button>

            <button
              aria-pressed={viewMode === "list"}
              className={`${styles.viewButton} ${
                viewMode === "list" ? styles.viewButtonActive : ""
              }`}
              onClick={() => onViewModeChange("list")}
              type="button"
            >
              List
            </button>
          </div>

          <button
            className={styles.refreshButton}
            disabled={isRefreshing}
            onClick={onRefresh}
            type="button"
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}
