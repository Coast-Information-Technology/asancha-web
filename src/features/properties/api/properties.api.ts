// File: src/features/properties/api/properties.api.ts

/**
 * Asancha Properties API
 *
 * Purpose:
 * Provides typed authenticated API functions for private property workspace
 * records.
 *
 * Responsibilities:
 * - Create property drafts.
 * - Retrieve active-profile-scoped property lists.
 * - Retrieve one property by public ID.
 * - Update eligible property records.
 * - Submit eligible property records for review.
 * - Delete eligible draft property records.
 *
 * Security notes:
 * - All requests use authenticated API helpers.
 * - Property records are scoped by the active business profile and backend
 *   resource ownership rules.
 * - Frontend code must not request admin property-review routes.
 * - Submission does not publish the property to the marketplace.
 * - Raw backend errors are normalised by the shared API client.
 */

import {
  authApiDelete,
  authApiGet,
  authApiPatch,
  authApiPost,
} from "../../../lib/api/auth-fetch";

import { PROPERTIES_API_ENDPOINTS } from "../constants/properties.constants";
import type {
  CreatePropertyPayload,
  CreatePropertyResult,
  DeletePropertyResult,
  PropertyCollection,
  PropertyDetail,
  PropertyFilters,
  PropertyQuery,
  PropertyUpdatePayload,
  SubmitPropertyPayload,
  SubmitPropertyResult,
  UpdatePropertyResult,
} from "../types/properties.types";

function appendString(
  searchParams: URLSearchParams,
  key: string,
  value: string | undefined,
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

function createPropertyQueryString(
  query: PropertyQuery | Partial<PropertyFilters>,
): string {
  const searchParams = new URLSearchParams();

  appendString(searchParams, "search", query.search);

  appendStringArray(searchParams, "statuses", query.statuses);

  appendStringArray(
    searchParams,
    "verificationStatuses",
    query.verificationStatuses,
  );

  appendStringArray(searchParams, "propertyTypes", query.propertyTypes);

  appendStringArray(searchParams, "occupancyStatuses", query.occupancyStatuses);

  appendStringArray(searchParams, "submissionSources", query.submissionSources);

  appendStringArray(searchParams, "townsOrCities", query.townsOrCities);

  appendBoolean(
    searchParams,
    "correctionRequired",
    query.correctionRequired ?? undefined,
  );

  appendBoolean(searchParams, "hasListing", query.hasListing ?? undefined);

  appendString(searchParams, "sort", query.sort);

  appendNumber(searchParams, "page", query.page);

  appendNumber(searchParams, "pageSize", query.pageSize);

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

async function getProperties(
  query: PropertyQuery | Partial<PropertyFilters> = {},
): Promise<PropertyCollection> {
  const queryString = createPropertyQueryString(query);

  return authApiGet<PropertyCollection>(
    `${PROPERTIES_API_ENDPOINTS.mine}${queryString}`,
  );
}

async function getProperty(propertyPublicId: string): Promise<PropertyDetail> {
  return authApiGet<PropertyDetail>(
    PROPERTIES_API_ENDPOINTS.property(propertyPublicId),
  );
}

async function createProperty(
  payload: CreatePropertyPayload,
): Promise<CreatePropertyResult> {
  return authApiPost<CreatePropertyResult, CreatePropertyPayload>(
    PROPERTIES_API_ENDPOINTS.create,
    payload,
  );
}

async function updateProperty(
  propertyPublicId: string,
  payload: PropertyUpdatePayload,
): Promise<UpdatePropertyResult> {
  return authApiPatch<UpdatePropertyResult, PropertyUpdatePayload>(
    PROPERTIES_API_ENDPOINTS.property(propertyPublicId),
    payload,
  );
}

async function submitProperty(
  propertyPublicId: string,
  payload: SubmitPropertyPayload,
): Promise<SubmitPropertyResult> {
  return authApiPost<SubmitPropertyResult, SubmitPropertyPayload>(
    PROPERTIES_API_ENDPOINTS.submit(propertyPublicId),
    payload,
  );
}

async function deleteProperty(
  propertyPublicId: string,
): Promise<DeletePropertyResult> {
  return authApiDelete<DeletePropertyResult>(
    PROPERTIES_API_ENDPOINTS.property(propertyPublicId),
  );
}

export const propertiesApi = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  submitProperty,
  deleteProperty,
} as const;
