"use client";

// File: src/features/marketplace/hooks/use-marketplace.ts

/**
 * Asancha Marketplace Hook
 *
 * Purpose:
 * Provides client components with public marketplace listing, filtering,
 * pagination, listing-detail, and view-mode state.
 *
 * Responsibilities:
 * - Load filtered marketplace listing cards.
 * - Refresh current marketplace results.
 * - Load additional result pages.
 * - Load one public listing by slug.
 * - Load backend-provided filter configuration.
 * - Update, replace, and reset marketplace filters.
 * - Manage grid/list view state.
 * - Expose safe loading, empty, and error states.
 *
 * Security notes:
 * - This hook stores public-safe marketplace data in component memory only.
 * - It must not store private seller data, restricted documents, payment data,
 *   restricted AI analysis, ObjectIds, internal notes, or private media URLs.
 * - Client-side filtering does not control listing visibility.
 * - Backend publication and access rules remain final.
 */

import { useCallback, useRef, useState } from "react";

import { marketplaceApi } from "../api/marketplace.api";
import {
  DEFAULT_MARKETPLACE_FILTERS,
  MARKETPLACE_DEFAULT_VIEW_MODE,
  MARKETPLACE_SAFE_MESSAGES,
} from "../constants/marketplace.constants";
import { marketplaceFiltersSchema } from "../schemas/marketplace-filters.schema";
import type {
  MarketplaceFilterConfiguration,
  MarketplaceFilters,
  MarketplaceHookState,
  MarketplaceListingCollection,
  MarketplaceListingDetail,
  MarketplaceViewMode,
  UseMarketplaceResult,
} from "../types/marketplace.types";

const INITIAL_MARKETPLACE_STATE: MarketplaceHookState = {
  requestState: "idle",

  listings: [],
  selectedListing: null,
  filterConfiguration: null,
  filters: DEFAULT_MARKETPLACE_FILTERS,
  pagination: null,

  viewMode: MARKETPLACE_DEFAULT_VIEW_MODE,
  errorMessage: null,

  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  isEmpty: false,
};

function mergeUniqueListings(
  currentListings: MarketplaceHookState["listings"],
  incomingListings: MarketplaceHookState["listings"],
): MarketplaceHookState["listings"] {
  const listingMap = new Map(
    currentListings.map((listing) => [listing.listingPublicId, listing]),
  );

  for (const listing of incomingListings) {
    listingMap.set(listing.listingPublicId, listing);
  }

  return Array.from(listingMap.values());
}

export function useMarketplace(): UseMarketplaceResult {
  const [marketplaceState, setMarketplaceState] =
    useState<MarketplaceHookState>(INITIAL_MARKETPLACE_STATE);

  const filtersRef = useRef<MarketplaceFilters>(DEFAULT_MARKETPLACE_FILTERS);

  const applyFilters = useCallback((filters: MarketplaceFilters): void => {
    filtersRef.current = filters;

    setMarketplaceState((currentState) => ({
      ...currentState,
      filters,
    }));
  }, []);

  const loadMarketplace = useCallback(
    async (
      filters?: Partial<MarketplaceFilters>,
    ): Promise<MarketplaceListingCollection | null> => {
      const requestedFilters = marketplaceFiltersSchema.parse({
        ...filtersRef.current,
        ...filters,
        page: filters?.page ?? 1,
      });

      applyFilters(requestedFilters);

      setMarketplaceState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        isRefreshing: false,
        isLoadingMore: false,
        isEmpty: false,
        errorMessage: null,
      }));

      try {
        const result = await marketplaceApi.getListings(requestedFilters);

        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: result.items.length === 0 ? "empty" : "success",

          listings: result.items,
          pagination: result.pagination,
          filters: requestedFilters,

          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
          isEmpty: result.items.length === 0,
          errorMessage: null,
        }));

        return result;
      } catch {
        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "error",
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
          isEmpty: false,
          errorMessage: MARKETPLACE_SAFE_MESSAGES.loadError,
        }));

        return null;
      }
    },
    [applyFilters],
  );

  const refreshMarketplace =
    useCallback(async (): Promise<MarketplaceListingCollection | null> => {
      setMarketplaceState((currentState) => ({
        ...currentState,
        requestState: "refreshing",
        isLoading: false,
        isRefreshing: true,
        isLoadingMore: false,
        errorMessage: null,
      }));

      try {
        const currentFilters = marketplaceFiltersSchema.parse({
          ...filtersRef.current,
          page: 1,
        });

        applyFilters(currentFilters);

        const result = await marketplaceApi.getListings(currentFilters);

        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: result.items.length === 0 ? "empty" : "success",

          listings: result.items,
          pagination: result.pagination,
          filters: currentFilters,

          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
          isEmpty: result.items.length === 0,
          errorMessage: null,
        }));

        return result;
      } catch {
        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "error",
          isRefreshing: false,
          errorMessage: MARKETPLACE_SAFE_MESSAGES.loadError,
        }));

        return null;
      }
    }, [applyFilters]);

  const loadMore =
    useCallback(async (): Promise<MarketplaceListingCollection | null> => {
      const currentPagination = marketplaceState.pagination;

      if (marketplaceState.isLoadingMore || !currentPagination?.hasNextPage) {
        return null;
      }

      const nextFilters = marketplaceFiltersSchema.parse({
        ...filtersRef.current,
        page: currentPagination.page + 1,
      });

      setMarketplaceState((currentState) => ({
        ...currentState,
        requestState: "loading_more",
        isLoadingMore: true,
        errorMessage: null,
      }));

      try {
        const result = await marketplaceApi.getListings(nextFilters);

        applyFilters(nextFilters);

        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "success",

          listings: mergeUniqueListings(currentState.listings, result.items),

          pagination: result.pagination,
          filters: nextFilters,

          isLoadingMore: false,
          isEmpty: false,
          errorMessage: null,
        }));

        return result;
      } catch {
        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "error",
          isLoadingMore: false,
          errorMessage: MARKETPLACE_SAFE_MESSAGES.loadError,
        }));

        return null;
      }
    }, [
      applyFilters,
      marketplaceState.isLoadingMore,
      marketplaceState.pagination,
    ]);

  const loadListing = useCallback(
    async (listingSlug: string): Promise<MarketplaceListingDetail | null> => {
      const normalizedSlug = listingSlug.trim();

      if (!normalizedSlug) {
        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "error",
          errorMessage: MARKETPLACE_SAFE_MESSAGES.listingLoadError,
        }));

        return null;
      }

      setMarketplaceState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        errorMessage: null,
      }));

      try {
        const selectedListing = await marketplaceApi.getListing(normalizedSlug);

        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "success",
          selectedListing,
          isLoading: false,
          errorMessage: null,
        }));

        return selectedListing;
      } catch {
        setMarketplaceState((currentState) => ({
          ...currentState,
          requestState: "error",
          selectedListing: null,
          isLoading: false,
          errorMessage: MARKETPLACE_SAFE_MESSAGES.listingLoadError,
        }));

        return null;
      }
    },
    [],
  );

  const loadFilterConfiguration =
    useCallback(async (): Promise<MarketplaceFilterConfiguration | null> => {
      setMarketplaceState((currentState) => ({
        ...currentState,
        errorMessage: null,
      }));

      try {
        const filterConfiguration =
          await marketplaceApi.getFilterConfiguration();

        setMarketplaceState((currentState) => ({
          ...currentState,
          filterConfiguration,
          errorMessage: null,
        }));

        return filterConfiguration;
      } catch {
        setMarketplaceState((currentState) => ({
          ...currentState,
          errorMessage: MARKETPLACE_SAFE_MESSAGES.filtersLoadError,
        }));

        return null;
      }
    }, []);

  const setFilters = useCallback(
    (filters: Partial<MarketplaceFilters>): void => {
      const nextFilters = marketplaceFiltersSchema.parse({
        ...filtersRef.current,
        ...filters,
        page:
          filters.page ??
          (Object.keys(filters).some(
            (key) => key !== "page" && key !== "pageSize",
          )
            ? 1
            : filtersRef.current.page),
      });

      applyFilters(nextFilters);
    },
    [applyFilters],
  );

  const replaceFilters = useCallback(
    (filters: MarketplaceFilters): void => {
      const nextFilters = marketplaceFiltersSchema.parse(filters);

      applyFilters(nextFilters);
    },
    [applyFilters],
  );

  const resetFilters = useCallback((): void => {
    applyFilters({
      ...DEFAULT_MARKETPLACE_FILTERS,
    });

    setMarketplaceState((currentState) => ({
      ...currentState,
      listings: [],
      pagination: null,
      requestState: "idle",
      isEmpty: false,
      errorMessage: null,
    }));
  }, [applyFilters]);

  const setViewMode = useCallback((viewMode: MarketplaceViewMode): void => {
    setMarketplaceState((currentState) => ({
      ...currentState,
      viewMode,
    }));
  }, []);

  const clearSelectedListing = useCallback((): void => {
    setMarketplaceState((currentState) => ({
      ...currentState,
      selectedListing: null,
    }));
  }, []);

  const clearError = useCallback((): void => {
    setMarketplaceState((currentState) => ({
      ...currentState,
      requestState:
        currentState.listings.length > 0 || currentState.selectedListing
          ? "success"
          : "idle",

      errorMessage: null,
    }));
  }, []);

  const reset = useCallback((): void => {
    filtersRef.current = {
      ...DEFAULT_MARKETPLACE_FILTERS,
    };

    setMarketplaceState({
      ...INITIAL_MARKETPLACE_STATE,
      filters: {
        ...DEFAULT_MARKETPLACE_FILTERS,
      },
    });
  }, []);

  return {
    ...marketplaceState,

    loadMarketplace,
    refreshMarketplace,
    loadMore,
    loadListing,
    loadFilterConfiguration,

    setFilters,
    replaceFilters,
    resetFilters,
    setViewMode,

    clearSelectedListing,
    clearError,
    reset,
  };
}
