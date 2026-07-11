// File: src/features/properties/constants/properties.constants.ts

/**
 * Asancha Property Constants
 *
 * Purpose:
 * Defines stable property endpoint paths, page routes, supported form options,
 * default filters, pagination rules, and public-safe messages.
 *
 * Responsibilities:
 * - Keep property API paths in one place.
 * - Define property lifecycle, type, ownership, authority, and condition options.
 * - Provide dashboard route helpers for owner and agent workspaces.
 * - Provide default filter state.
 * - Provide safe property action messages.
 *
 * Security notes:
 * - These constants guide frontend UX only.
 * - Property publication is not handled by this feature.
 * - Backend ownership, authority, verification, profile, company membership,
 *   policy acceptance, and resource-state checks remain final.
 */

import type {
  PropertyCondition,
  PropertyFilters,
  PropertyOccupancyStatus,
  PropertyOwnershipCapacity,
  PropertyStatus,
  PropertySubmissionSource,
  PropertyTenureType,
  PropertyType,
  PropertyWorkspaceRole,
} from "../types/properties.types";

export const PROPERTIES_API_ENDPOINTS = {
  create: "/properties",
  mine: "/properties/me",

  property: (propertyPublicId: string): string =>
    `/properties/${encodeURIComponent(propertyPublicId)}`,

  submit: (propertyPublicId: string): string =>
    `/properties/${encodeURIComponent(propertyPublicId)}/submit`,
} as const;

export const PROPERTY_PAGE_ROUTES = {
  ownerProperties: "/dashboard/property-owner/properties",
  ownerCreate: "/dashboard/property-owner/properties/new",

  ownerDetail: (propertyPublicId: string): string =>
    `/dashboard/property-owner/properties/${encodeURIComponent(
      propertyPublicId,
    )}`,

  ownerEdit: (propertyPublicId: string): string =>
    `/dashboard/property-owner/properties/${encodeURIComponent(
      propertyPublicId,
    )}/edit`,

  agentProperties: "/dashboard/property-agent/properties",
  agentCreate: "/dashboard/property-agent/properties/new",

  agentDetail: (propertyPublicId: string): string =>
    `/dashboard/property-agent/properties/${encodeURIComponent(
      propertyPublicId,
    )}`,

  documents: "/documents",
  verification: "/verification",
} as const;

export const PROPERTY_WORKSPACE_ROLES = [
  "property_owner",
  "property_agent",
  "property_sourcer",
  "api_partner",
] as const satisfies readonly PropertyWorkspaceRole[];

export const PROPERTY_SUBMISSION_SOURCES = [
  "property_owner",
  "property_agent",
  "property_sourcer",
  "api_partner",
] as const satisfies readonly PropertySubmissionSource[];

export const PROPERTY_STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "submitted",
    label: "Submitted",
  },
  {
    value: "under_review",
    label: "Under review",
  },
  {
    value: "correction_required",
    label: "Correction required",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "archived",
    label: "Archived",
  },
] as const satisfies ReadonlyArray<{
  value: PropertyStatus;
  label: string;
}>;

export const PROPERTY_TYPE_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "terraced_house", label: "Terraced house" },
  { value: "detached_house", label: "Detached house" },
  {
    value: "semi_detached_house",
    label: "Semi-detached house",
  },
  { value: "bungalow", label: "Bungalow" },
  { value: "maisonette", label: "Maisonette" },
  { value: "townhouse", label: "Townhouse" },
  { value: "cottage", label: "Cottage" },
  { value: "hmo", label: "HMO" },
  { value: "block_of_flats", label: "Block of flats" },
  {
    value: "student_accommodation",
    label: "Student accommodation",
  },
  {
    value: "retirement_property",
    label: "Retirement property",
  },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial property" },
  { value: "mixed_use", label: "Mixed-use property" },
  { value: "development_site", label: "Development site" },
  { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
  value: PropertyType;
  label: string;
}>;

export const PROPERTY_TENURE_OPTIONS = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
  {
    value: "share_of_freehold",
    label: "Share of freehold",
  },
  { value: "commonhold", label: "Commonhold" },
  { value: "unknown", label: "Unknown" },
  { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
  value: PropertyTenureType;
  label: string;
}>;

export const PROPERTY_OCCUPANCY_OPTIONS = [
  { value: "vacant", label: "Vacant" },
  { value: "owner_occupied", label: "Owner occupied" },
  { value: "tenanted", label: "Tenanted" },
  { value: "part_occupied", label: "Part occupied" },
  { value: "unknown", label: "Unknown" },
] as const satisfies ReadonlyArray<{
  value: PropertyOccupancyStatus;
  label: string;
}>;

export const PROPERTY_CONDITION_OPTIONS = [
  { value: "new_build", label: "New build" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  {
    value: "requires_light_refurbishment",
    label: "Requires light refurbishment",
  },
  {
    value: "requires_moderate_refurbishment",
    label: "Requires moderate refurbishment",
  },
  {
    value: "requires_heavy_refurbishment",
    label: "Requires heavy refurbishment",
  },
  {
    value: "development_required",
    label: "Development required",
  },
  { value: "unknown", label: "Unknown" },
] as const satisfies ReadonlyArray<{
  value: PropertyCondition;
  label: string;
}>;

export const PROPERTY_OWNERSHIP_CAPACITY_OPTIONS = [
  { value: "sole_owner", label: "Sole owner" },
  { value: "joint_owner", label: "Joint owner" },
  { value: "company_owner", label: "Company owner" },
  { value: "landlord", label: "Landlord" },
  { value: "executor", label: "Executor" },
  {
    value: "authorised_representative",
    label: "Authorised representative",
  },
  {
    value: "agent_for_owner",
    label: "Agent acting for owner",
  },
  { value: "sourcer", label: "Property sourcer" },
  { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
  value: PropertyOwnershipCapacity;
  label: string;
}>;

export const PROPERTY_AUTHORITY_TYPE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "joint_owner", label: "Joint owner" },
  {
    value: "company_authority",
    label: "Company authority",
  },
  {
    value: "agency_instruction",
    label: "Agency instruction",
  },
  {
    value: "power_of_attorney",
    label: "Power of attorney",
  },
  {
    value: "executor_authority",
    label: "Executor authority",
  },
  {
    value: "landlord_authority",
    label: "Landlord authority",
  },
  {
    value: "vendor_instruction",
    label: "Vendor instruction",
  },
  {
    value: "sourcing_agreement",
    label: "Sourcing agreement",
  },
  { value: "other", label: "Other" },
] as const;

export const PROPERTY_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  {
    value: "updated_recently",
    label: "Recently updated",
  },
  {
    value: "title_ascending",
    label: "Title: A to Z",
  },
  {
    value: "title_descending",
    label: "Title: Z to A",
  },
  { value: "status", label: "Status" },
] as const;

export const PROPERTY_PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

export const PROPERTY_MAX_PAGE_SIZE = 50;

export const DEFAULT_PROPERTY_FILTERS: PropertyFilters = {
  search: "",
  statuses: [],
  verificationStatuses: [],
  propertyTypes: [],
  occupancyStatuses: [],
  submissionSources: [],
  townsOrCities: [],
  correctionRequired: null,
  hasListing: null,
  sort: "updated_recently",
  page: 1,
  pageSize: 20,
};

export const INITIAL_PROPERTY_CREATE_VALUES = {
  title: "",
  referenceName: null,
  address: {
    addressLine1: "",
    addressLine2: null,
    townOrCity: "",
    county: null,
    postcode: "",
    countryCode: "GB",
  },
  coordinates: null,
  physicalDetails: {
    propertyType: "terraced_house",
    customPropertyType: null,
    bedrooms: null,
    bathrooms: null,
    receptionRooms: null,
    kitchens: null,
    floorAreaSquareFeet: null,
    plotAreaSquareFeet: null,
    yearBuilt: null,
    tenureType: "unknown",
    leaseYearsRemaining: null,
    occupancyStatus: "unknown",
    condition: "unknown",
  },
  ownershipDetails: {
    ownershipCapacity: "sole_owner",
    authorityType: "owner",
    ownerDisplayName: null,
    ownerCompanyPublicId: null,
    representingCompanyPublicId: null,
    jointOwnerNames: [],
    authorityDeclarationAccepted: false,
    informationAccuracyConfirmed: false,
  },
  shortDescription: null,
  internalUserNotes: null,
} as const;

export const PROPERTY_SAFE_MESSAGES = {
  loadError: "We could not load your properties. Please refresh the page.",

  detailLoadError:
    "We could not load this property. It may not exist or may not be available to your active profile.",

  createError:
    "We could not create the property. Please review the information and try again.",

  created: "The property draft has been created.",

  saveError:
    "We could not save the property. Please review the information and try again.",

  saved: "The property has been updated.",

  submitError:
    "We could not submit the property. Complete the required information, policies, and documents before trying again.",

  submitted:
    "The property has been submitted for review. Submission does not publish it to the marketplace.",

  deleteError:
    "We could not delete the property. Only eligible draft records may be deleted.",

  deleted: "The property draft has been deleted.",

  correctionRequired:
    "Some property information or documents need your attention before review can continue.",

  publicationControlled:
    "Property approval does not automatically create or publish a marketplace listing.",
} as const;

export function getPropertyWorkspaceListPath(
  role: PropertyWorkspaceRole,
): string {
  switch (role) {
    case "property_agent":
      return PROPERTY_PAGE_ROUTES.agentProperties;

    case "property_owner":
    default:
      return PROPERTY_PAGE_ROUTES.ownerProperties;
  }
}

export function getPropertyWorkspaceDetailPath(
  role: PropertyWorkspaceRole,
  propertyPublicId: string,
): string {
  switch (role) {
    case "property_agent":
      return PROPERTY_PAGE_ROUTES.agentDetail(propertyPublicId);

    case "property_owner":
    default:
      return PROPERTY_PAGE_ROUTES.ownerDetail(propertyPublicId);
  }
}
