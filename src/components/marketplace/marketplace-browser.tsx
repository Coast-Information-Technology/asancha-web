"use client";

// File: src/components/marketplace/marketplace-browser.tsx

/**
 * Asancha Marketplace Browser
 *
 * Purpose:
 * Coordinates public marketplace filters, listing results, sorting,
 * pagination, loading states, and view preferences.
 *
 * Responsibilities:
 * - Load marketplace listings and filter configuration.
 * - Maintain draft filters separately from applied filters.
 * - Apply and reset marketplace filters.
 * - Render results, loading, empty, and error states.
 * - Support grid and list view modes.
 *
 * Security notes:
 * - This component renders public-safe marketplace data only.
 * - Client-side filters do not control listing publication or access.
 * - Backend marketplace visibility rules remain final.
 */

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_MARKETPLACE_FILTERS } from "@/src/features/marketplace/constants/marketplace.constants";
import { useMarketplace } from "@/src/features/marketplace/hooks/use-marketplace";
import type { MarketplaceFilters } from "@/src/features/marketplace/types/marketplace.types";
import { MarketplaceListingGrid } from "./marketplace-listing-grid";
import { MarketplaceLoadingState } from "./marketplace-loading-state";
import { MarketplacePagination } from "./marketplace-pagination";
import { MarketplaceResultsToolbar } from "./marketplace-results-toolbar";
import styles from "./marketplace-browser.module.css";
import { MarketplaceFilterPanel } from "./marketplace-filter-panel";
import { MarketplaceEmptyState } from "./marketplace-empty-state";

/**
 * Renders the complete interactive public marketplace experience.
 */
export function MarketplaceBrowser({
  initialFilters,
}: {
  initialFilters?: Partial<MarketplaceFilters>;
}) {
  const [resolvedInitialFilters] = useState<MarketplaceFilters>(() => ({
    ...DEFAULT_MARKETPLACE_FILTERS,
    ...initialFilters,
  }));
  const {
    listings,
    filterConfiguration,
    filters,
    pagination,
    viewMode,
    errorMessage,
    isLoading,
    isRefreshing,
    isEmpty,
    loadMarketplace,
    loadFilterConfiguration,
    setViewMode,
    clearError,
  } = useMarketplace();

  const [draftFilters, setDraftFilters] = useState<MarketplaceFilters>(
    resolvedInitialFilters,
  );

  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleFiltersClose = useCallback((): void => {
    setFiltersOpen(false);
    queueMicrotask(() => {
      document.getElementById("marketplace-more-filters")?.focus();
    });
  }, []);

  useEffect(() => {
    void Promise.all([
      loadMarketplace(resolvedInitialFilters),
      loadFilterConfiguration(),
    ]);
  }, [loadFilterConfiguration, loadMarketplace, resolvedInitialFilters]);

  useEffect(() => {
    queueMicrotask(() => {
      setDraftFilters(filters);
    });
  }, [filters]);

  const handleDraftFiltersChange = useCallback(
    (nextFilters: Partial<MarketplaceFilters>): void => {
      setDraftFilters((currentFilters) => ({
        ...currentFilters,
        ...nextFilters,
      }));
    },
    [],
  );

  const handleApplyFilters = useCallback((): void => {
    handleFiltersClose();

    void loadMarketplace({
      ...draftFilters,
      page: 1,
    });
  }, [draftFilters, handleFiltersClose, loadMarketplace]);

  const handleResetFilters = useCallback((): void => {
    const resetFilters = {
      ...DEFAULT_MARKETPLACE_FILTERS,
    };

    setDraftFilters(resetFilters);
    handleFiltersClose();

    void loadMarketplace(resetFilters);
  }, [handleFiltersClose, loadMarketplace]);

  const handleSearchSubmit = useCallback((): void => {
    void loadMarketplace({
      ...draftFilters,
      page: 1,
    });
  }, [draftFilters, loadMarketplace]);

  const handleSortChange = useCallback(
    (sort: MarketplaceFilters["sort"]): void => {
      const nextFilters: MarketplaceFilters = {
        ...draftFilters,
        sort,
        page: 1,
      };

      setDraftFilters(nextFilters);
      void loadMarketplace(nextFilters);
    },
    [draftFilters, loadMarketplace],
  );

  const handlePageChange = useCallback(
    (page: number): void => {
      void loadMarketplace({
        ...filters,
        page,
      });

      document.getElementById("marketplace-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [filters, loadMarketplace],
  );

  return (
    <div className={styles.browser}>
      <MarketplaceFilterPanel
        filterConfiguration={filterConfiguration}
        filters={draftFilters}
        isOpen={filtersOpen}
        onApply={handleApplyFilters}
        onChange={handleDraftFiltersChange}
        onClose={handleFiltersClose}
        onReset={handleResetFilters}
      />

      <div className={styles.resultsColumn}>
        <MarketplaceResultsToolbar
          filters={draftFilters}
          onFilterOpen={() => setFiltersOpen(true)}
          onFiltersChange={handleDraftFiltersChange}
          onSearchSubmit={handleSearchSubmit}
          onSortChange={handleSortChange}
          onViewModeChange={setViewMode}
          pagination={pagination}
          viewMode={viewMode}
        />

        <div
          aria-busy={isLoading || isRefreshing}
          aria-live="polite"
          id="marketplace-results"
        >
          {errorMessage ? (
            <div className={styles.errorState} role="alert">
              <div>
                <h2 className={styles.errorTitle}>
                  Property search unavailable
                </h2>

                <p className={styles.errorMessage}>{errorMessage}</p>
              </div>

              <button
                className={styles.retryButton}
                onClick={() => {
                  clearError();
                  void loadMarketplace(filters);
                }}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : null}

          {isLoading && listings.length === 0 ? (
            <MarketplaceLoadingState viewMode={viewMode} />
          ) : null}

          {!isLoading && !errorMessage && isEmpty ? (
            <MarketplaceEmptyState
              onChangeSearch={() => {
                document.getElementById("marketplace-location-search")?.focus();
              }}
              onReset={handleResetFilters}
            />
          ) : null}

          {listings.length > 0 ? (
            <>
              <MarketplaceListingGrid listings={listings} viewMode={viewMode} />

              <MarketplacePagination
                onPageChange={handlePageChange}
                pagination={pagination}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
