"use client";

// File: src/features/listings/hooks/use-listings.ts

/**
 * Asancha Listings Hook
 *
 * Purpose:
 * Provides property-owner, property-agent, and property-sourcer workspace
 * components with listing list, detail, creation, update, submission,
 * withdrawal, deletion, filter, pagination, and request state.
 *
 * Responsibilities:
 * - Load active-profile-scoped listings.
 * - Load one private listing by public ID.
 * - Create and update listing drafts.
 * - Submit eligible listings for review.
 * - Withdraw eligible listings.
 * - Delete eligible listing drafts.
 * - Maintain listing filter and pagination state.
 * - Expose safe success and error messages.
 *
 * Security notes:
 * - This hook stores public-user-safe listing workspace data in memory only.
 * - It must not store private deal packs, sensitive document contents,
 *   internal staff notes, secrets, ObjectIds, or restricted AI analysis.
 * - Client-side action states do not grant mutation permission.
 * - Backend enforcement remains final.
 */

import { useCallback, useRef, useState } from "react";

import { listingsApi } from "../api/listings.api";
import {
  DEFAULT_LISTING_FILTERS,
  LISTING_SAFE_MESSAGES,
} from "../constants/listings.constants";
import type {
  CreateListingPayload,
  CreateListingResult,
  DeleteListingResult,
  ListingCollection,
  ListingDetail,
  ListingFilters,
  ListingSummary,
  ListingsHookState,
  ListingUpdatePayload,
  SubmitListingPayload,
  SubmitListingResult,
  UpdateListingResult,
  UseListingsResult,
  WithdrawListingPayload,
  WithdrawListingResult,
} from "../types/listings.types";

const INITIAL_LISTINGS_STATE: ListingsHookState = {
  requestState: "idle",

  listings: [],
  selectedListing: null,

  filters: DEFAULT_LISTING_FILTERS,
  pagination: null,

  errorMessage: null,
  successMessage: null,

  isLoading: false,
  isRefreshing: false,
  isCreating: false,
  isSaving: false,
  isSubmitting: false,
  isWithdrawing: false,
  isDeleting: false,
  isEmpty: false,
};

function replaceListingSummary(
  listings: ListingSummary[],
  listing: ListingDetail,
): ListingSummary[] {
  const exists = listings.some(
    (currentListing) =>
      currentListing.listingPublicId === listing.listingPublicId,
  );

  if (!exists) {
    return [listing, ...listings];
  }

  return listings.map((currentListing) =>
    currentListing.listingPublicId === listing.listingPublicId
      ? listing
      : currentListing,
  );
}

export function useListings(): UseListingsResult {
  const [hookState, setHookState] = useState<ListingsHookState>(
    INITIAL_LISTINGS_STATE,
  );

  const filtersRef = useRef<ListingFilters>(DEFAULT_LISTING_FILTERS);

  const applyFilters = useCallback((filters: ListingFilters): void => {
    filtersRef.current = filters;

    setHookState((currentState) => ({
      ...currentState,
      filters,
    }));
  }, []);

  const setError = useCallback((message: string): void => {
    setHookState((currentState) => ({
      ...currentState,

      requestState: "error",

      errorMessage: message,
      successMessage: null,

      isLoading: false,
      isRefreshing: false,
      isCreating: false,
      isSaving: false,
      isSubmitting: false,
      isWithdrawing: false,
      isDeleting: false,
    }));
  }, []);

  const loadListings = useCallback(
    async (
      filters?: Partial<ListingFilters>,
    ): Promise<ListingCollection | null> => {
      const nextFilters: ListingFilters = {
        ...filtersRef.current,
        ...filters,
        page: filters?.page ?? 1,
      };

      applyFilters(nextFilters);

      setHookState((currentState) => ({
        ...currentState,

        requestState: "loading",

        isLoading: true,
        isRefreshing: false,
        isEmpty: false,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const collection = await listingsApi.getListings(nextFilters);

        setHookState((currentState) => ({
          ...currentState,

          requestState: collection.items.length === 0 ? "empty" : "success",

          listings: collection.items,
          pagination: collection.pagination,
          filters: nextFilters,

          isLoading: false,
          isRefreshing: false,
          isEmpty: collection.items.length === 0,

          errorMessage: null,
        }));

        return collection;
      } catch {
        setError(LISTING_SAFE_MESSAGES.loadError);

        return null;
      }
    },
    [applyFilters, setError],
  );

  const refreshListings =
    useCallback(async (): Promise<ListingCollection | null> => {
      setHookState((currentState) => ({
        ...currentState,

        requestState: "refreshing",

        isLoading: false,
        isRefreshing: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const collection = await listingsApi.getListings(filtersRef.current);

        setHookState((currentState) => ({
          ...currentState,

          requestState: collection.items.length === 0 ? "empty" : "success",

          listings: collection.items,
          pagination: collection.pagination,

          isRefreshing: false,
          isEmpty: collection.items.length === 0,

          errorMessage: null,
        }));

        return collection;
      } catch {
        setError(LISTING_SAFE_MESSAGES.loadError);

        return null;
      }
    }, [setError]);

  const loadListing = useCallback(
    async (listingPublicId: string): Promise<ListingDetail | null> => {
      const normalizedPublicId = listingPublicId.trim();

      if (!normalizedPublicId) {
        setError(LISTING_SAFE_MESSAGES.detailLoadError);

        return null;
      }

      setHookState((currentState) => ({
        ...currentState,

        requestState: "loading",
        isLoading: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const listing = await listingsApi.getListing(normalizedPublicId);

        setHookState((currentState) => ({
          ...currentState,

          requestState: "success",

          selectedListing: listing,

          listings: replaceListingSummary(currentState.listings, listing),

          isLoading: false,
          errorMessage: null,
        }));

        return listing;
      } catch {
        setError(LISTING_SAFE_MESSAGES.detailLoadError);

        return null;
      }
    },
    [setError],
  );

  const createListing = useCallback(
    async (payload: CreateListingPayload): Promise<CreateListingResult> => {
      setHookState((currentState) => ({
        ...currentState,

        requestState: "creating",
        isCreating: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await listingsApi.createListing(payload);

        setHookState((currentState) => ({
          ...currentState,

          requestState: "success",

          listings: replaceListingSummary(
            currentState.listings,
            result.listing,
          ),

          selectedListing: result.listing,

          isCreating: false,
          isEmpty: false,

          errorMessage: null,

          successMessage: result.message || LISTING_SAFE_MESSAGES.created,
        }));

        return result;
      } catch {
        setError(LISTING_SAFE_MESSAGES.createError);

        throw new Error(LISTING_SAFE_MESSAGES.createError);
      }
    },
    [setError],
  );

  const updateListing = useCallback(
    async (
      listingPublicId: string,
      payload: ListingUpdatePayload,
    ): Promise<UpdateListingResult> => {
      setHookState((currentState) => ({
        ...currentState,

        requestState: "saving",
        isSaving: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await listingsApi.updateListing(
          listingPublicId,
          payload,
        );

        setHookState((currentState) => ({
          ...currentState,

          requestState: "success",

          listings: replaceListingSummary(
            currentState.listings,
            result.listing,
          ),

          selectedListing: result.listing,

          isSaving: false,
          errorMessage: null,

          successMessage: result.message || LISTING_SAFE_MESSAGES.saved,
        }));

        return result;
      } catch {
        setError(LISTING_SAFE_MESSAGES.saveError);

        throw new Error(LISTING_SAFE_MESSAGES.saveError);
      }
    },
    [setError],
  );

  const submitListing = useCallback(
    async (
      listingPublicId: string,
      payload: SubmitListingPayload,
    ): Promise<SubmitListingResult> => {
      setHookState((currentState) => ({
        ...currentState,

        requestState: "submitting",
        isSubmitting: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await listingsApi.submitListing(
          listingPublicId,
          payload,
        );

        setHookState((currentState) => ({
          ...currentState,

          requestState: "success",

          listings: replaceListingSummary(
            currentState.listings,
            result.listing,
          ),

          selectedListing: result.listing,

          isSubmitting: false,
          errorMessage: null,

          successMessage: result.message || LISTING_SAFE_MESSAGES.submitted,
        }));

        return result;
      } catch {
        setError(LISTING_SAFE_MESSAGES.submitError);

        throw new Error(LISTING_SAFE_MESSAGES.submitError);
      }
    },
    [setError],
  );

  const withdrawListing = useCallback(
    async (
      listingPublicId: string,
      payload: WithdrawListingPayload,
    ): Promise<WithdrawListingResult> => {
      setHookState((currentState) => ({
        ...currentState,

        requestState: "withdrawing",
        isWithdrawing: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await listingsApi.withdrawListing(
          listingPublicId,
          payload,
        );

        setHookState((currentState) => ({
          ...currentState,

          requestState: "success",

          listings: replaceListingSummary(
            currentState.listings,
            result.listing,
          ),

          selectedListing: result.listing,

          isWithdrawing: false,
          errorMessage: null,

          successMessage: result.message || LISTING_SAFE_MESSAGES.withdrawn,
        }));

        return result;
      } catch {
        setError(LISTING_SAFE_MESSAGES.withdrawError);

        throw new Error(LISTING_SAFE_MESSAGES.withdrawError);
      }
    },
    [setError],
  );

  const deleteListing = useCallback(
    async (listingPublicId: string): Promise<DeleteListingResult> => {
      setHookState((currentState) => ({
        ...currentState,

        requestState: "deleting",
        isDeleting: true,

        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await listingsApi.deleteListing(listingPublicId);

        setHookState((currentState) => {
          const nextListings = currentState.listings.filter(
            (listing) => listing.listingPublicId !== result.listingPublicId,
          );

          return {
            ...currentState,

            requestState: "success",

            listings: nextListings,

            selectedListing:
              currentState.selectedListing?.listingPublicId ===
              result.listingPublicId
                ? null
                : currentState.selectedListing,

            isDeleting: false,
            isEmpty: nextListings.length === 0,

            errorMessage: null,
            successMessage: LISTING_SAFE_MESSAGES.deleted,
          };
        });

        return result;
      } catch {
        setError(LISTING_SAFE_MESSAGES.deleteError);

        throw new Error(LISTING_SAFE_MESSAGES.deleteError);
      }
    },
    [setError],
  );

  const setFilters = useCallback(
    (filters: Partial<ListingFilters>): void => {
      const filterKeys = Object.keys(filters);

      const changesSearchCriteria = filterKeys.some(
        (key) => key !== "page" && key !== "pageSize",
      );

      const nextFilters: ListingFilters = {
        ...filtersRef.current,
        ...filters,

        page:
          filters.page ?? (changesSearchCriteria ? 1 : filtersRef.current.page),
      };

      applyFilters(nextFilters);
    },
    [applyFilters],
  );

  const replaceFilters = useCallback(
    (filters: ListingFilters): void => {
      applyFilters(filters);
    },
    [applyFilters],
  );

  const resetFilters = useCallback((): void => {
    const nextFilters = {
      ...DEFAULT_LISTING_FILTERS,
    };

    applyFilters(nextFilters);

    setHookState((currentState) => ({
      ...currentState,

      requestState: "idle",

      listings: [],
      pagination: null,

      isEmpty: false,

      errorMessage: null,
      successMessage: null,
    }));
  }, [applyFilters]);

  const clearSelectedListing = useCallback((): void => {
    setHookState((currentState) => ({
      ...currentState,
      selectedListing: null,
    }));
  }, []);

  const clearMessages = useCallback((): void => {
    setHookState((currentState) => ({
      ...currentState,

      requestState:
        currentState.listings.length > 0 || currentState.selectedListing
          ? "success"
          : "idle",

      errorMessage: null,
      successMessage: null,
    }));
  }, []);

  const reset = useCallback((): void => {
    filtersRef.current = {
      ...DEFAULT_LISTING_FILTERS,
    };

    setHookState({
      ...INITIAL_LISTINGS_STATE,

      filters: {
        ...DEFAULT_LISTING_FILTERS,
      },
    });
  }, []);

  return {
    ...hookState,

    loadListings,
    refreshListings,
    loadListing,

    createListing,
    updateListing,
    submitListing,
    withdrawListing,
    deleteListing,

    setFilters,
    replaceFilters,
    resetFilters,

    clearSelectedListing,
    clearMessages,
    reset,
  };
}
