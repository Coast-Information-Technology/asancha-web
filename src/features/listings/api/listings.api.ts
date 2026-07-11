// File: src/features/listings/api/listings.api.ts

/**
 * Asancha Listings API
 *
 * Purpose:
 * Provides typed authenticated API functions for listing workspace records.
 *
 * Responsibilities:
 * - Create listing drafts linked to approved properties.
 * - Retrieve active-profile-scoped listing collections.
 * - Retrieve one private listing by public ID.
 * - Update eligible listing drafts or correction-required listings.
 * - Submit eligible listings for review.
 * - Withdraw eligible listings.
 * - Delete eligible draft listings.
 *
 * Security notes:
 * - All requests use authenticated API helpers.
 * - This module does not call admin publication or review endpoints.
 * - Users cannot directly set approval, publication, marketplace visibility,
 *   reservation, completion, sold, or archive states through this API.
 * - Submission does not publish the listing.
 * - Backend ownership, property approval, profile, verification, policy,
 *   document, lifecycle, and company permission checks remain final.
 */

import {
  authApiDelete,
  authApiGet,
  authApiPatch,
  authApiPost,
} from "../../../lib/api/auth-fetch";

import { LISTINGS_API_ENDPOINTS } from "../constants/listings.constants";
import type {
  CreateListingPayload,
  CreateListingResult,
  DeleteListingResult,
  ListingCollection,
  ListingDetail,
  ListingFilters,
  ListingQuery,
  ListingUpdatePayload,
  SubmitListingPayload,
  SubmitListingResult,
  UpdateListingResult,
  WithdrawListingPayload,
  WithdrawListingResult,
} from "../types/listings.types";

function appendString(
  searchParams: URLSearchParams,
  key: string,
  value: string | null | undefined,
): void {
  const normalizedValue = value?.trim();

  if (normalizedValue) {
    searchParams.set(key, normalizedValue);
  }
}

function appendStringArray(
  searchParams: URLSearchParams,
  key: string,
  values: readonly string[] | undefined,
): void {
  if (!values?.length) {
    return;
  }

  for (const value of values) {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      searchParams.append(key, normalizedValue);
    }
  }
}

function appendNumber(
  searchParams: URLSearchParams,
  key: string,
  value: number | undefined,
): void {
  if (value !== undefined && Number.isFinite(value)) {
    searchParams.set(key, String(value));
  }
}

function appendBoolean(
  searchParams: URLSearchParams,
  key: string,
  value: boolean | undefined,
): void {
  if (value !== undefined) {
    searchParams.set(key, String(value));
  }
}

function createListingQueryString(
  query: ListingQuery | Partial<ListingFilters>,
): string {
  const searchParams = new URLSearchParams();

  appendString(searchParams, "search", query.search);

  appendStringArray(searchParams, "statuses", query.statuses);

  appendStringArray(searchParams, "dealStatuses", query.dealStatuses);

  appendStringArray(
    searchParams,
    "verificationStatuses",
    query.verificationStatuses,
  );

  appendStringArray(searchParams, "listingTypes", query.listingTypes);

  appendStringArray(searchParams, "listingCategories", query.listingCategories);

  appendStringArray(searchParams, "visibilities", query.visibilities);

  appendStringArray(searchParams, "submissionSources", query.submissionSources);

  appendString(searchParams, "propertyPublicId", query.propertyPublicId);

  appendBoolean(
    searchParams,
    "correctionRequired",
    query.correctionRequired ?? undefined,
  );

  appendBoolean(searchParams, "isPublished", query.isPublished ?? undefined);

  appendBoolean(
    searchParams,
    "isMarketplaceVisible",
    query.isMarketplaceVisible ?? undefined,
  );

  appendString(searchParams, "sort", query.sort);

  appendNumber(searchParams, "page", query.page);

  appendNumber(searchParams, "pageSize", query.pageSize);

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

async function getListings(
  query: ListingQuery | Partial<ListingFilters> = {},
): Promise<ListingCollection> {
  const queryString = createListingQueryString(query);

  return authApiGet<ListingCollection>(
    `${LISTINGS_API_ENDPOINTS.mine}${queryString}`,
  );
}

async function getListing(listingPublicId: string): Promise<ListingDetail> {
  return authApiGet<ListingDetail>(
    LISTINGS_API_ENDPOINTS.listing(listingPublicId),
  );
}

async function createListing(
  payload: CreateListingPayload,
): Promise<CreateListingResult> {
  return authApiPost<CreateListingResult, CreateListingPayload>(
    LISTINGS_API_ENDPOINTS.create,
    payload,
  );
}

async function updateListing(
  listingPublicId: string,
  payload: ListingUpdatePayload,
): Promise<UpdateListingResult> {
  return authApiPatch<UpdateListingResult, ListingUpdatePayload>(
    LISTINGS_API_ENDPOINTS.listing(listingPublicId),
    payload,
  );
}

async function submitListing(
  listingPublicId: string,
  payload: SubmitListingPayload,
): Promise<SubmitListingResult> {
  return authApiPost<SubmitListingResult, SubmitListingPayload>(
    LISTINGS_API_ENDPOINTS.submit(listingPublicId),
    payload,
  );
}

async function withdrawListing(
  listingPublicId: string,
  payload: WithdrawListingPayload,
): Promise<WithdrawListingResult> {
  return authApiPost<WithdrawListingResult, WithdrawListingPayload>(
    LISTINGS_API_ENDPOINTS.withdraw(listingPublicId),
    payload,
  );
}

async function deleteListing(
  listingPublicId: string,
): Promise<DeleteListingResult> {
  return authApiDelete<DeleteListingResult>(
    LISTINGS_API_ENDPOINTS.listing(listingPublicId),
  );
}

export const listingsApi = {
  getListings,
  getListing,
  createListing,
  updateListing,
  submitListing,
  withdrawListing,
  deleteListing,
} as const;
