"use client";

// File: src/components/marketplace/marketplace-results-toolbar.tsx

/**
 * Asancha Marketplace Results Toolbar
 *
 * Purpose:
 * Provides marketplace search, result count, sorting, refresh, filter,
 * and grid/list view controls.
 */

import {
  MARKETPLACE_SORT_OPTIONS,
  MARKETPLACE_STRATEGY_OPTIONS,
} from "@/src/features/marketplace/constants/marketplace.constants";
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
  onFilterOpen: () => void;
  onFiltersChange: (filters: Partial<MarketplaceFilters>) => void;
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
  onFilterOpen,
  onFiltersChange,
  onSearchSubmit,
  onSortChange,
  onViewModeChange,
}: MarketplaceResultsToolbarProps) {
  const totalItems = pagination?.totalItems ?? 0;

  return (
    <div className={styles.toolbar}>
      <form
        aria-label="Search property opportunities"
        className={styles.toolbarSearch}
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit();
        }}
        role="search"
      >
        <label className={styles.quickSearchField}>
          <span>Location / Postcode</span>
          <input
            className={styles.toolbarSearchInput}
            id="marketplace-location-search"
            onChange={(event) =>
              onFiltersChange({ search: event.target.value })
            }
            placeholder="Town, city or postcode"
            type="search"
            value={filters.search}
          />
        </label>

        <label className={styles.quickSearchField}>
          <span>Budget</span>
          <input
            className={styles.input}
            inputMode="numeric"
            min={0}
            onChange={(event) =>
              onFiltersChange({
                maximumPrice: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            placeholder="Maximum price"
            type="number"
            value={filters.maximumPrice ?? ""}
          />
        </label>

        <label className={styles.quickSearchField}>
          <span>Investment Strategy</span>
          <select
            className={styles.select}
            onChange={(event) =>
              onFiltersChange({
                strategies: event.target.value
                  ? [
                      event.target
                        .value as MarketplaceFilters["strategies"][number],
                    ]
                  : [],
              })
            }
            value={filters.strategies[0] ?? ""}
          >
            <option value="">Any strategy</option>
            {MARKETPLACE_STRATEGY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button className={styles.toolbarSearchButton} type="submit">
          Search Properties
        </button>
      </form>

      <div className={styles.toolbarSummary}>
        <p aria-live="polite" className={styles.resultCount}>
          {totalItems === 1
            ? "1 available opportunity"
            : `${totalItems.toLocaleString("en-GB")} available opportunities`}
        </p>

        <div className={styles.toolbarControls}>
          <button
            className={styles.mobileFilterButton}
            id="marketplace-more-filters"
            onClick={onFilterOpen}
            type="button"
          >
            More Filters
          </button>

          <label className={styles.sortControl}>
            <span className="sr-only">Sort property results</span>

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
        </div>
      </div>
    </div>
  );
}
