// File: src/features/properties/types/properties.types.ts

/**
 * Asancha Property Types
 *
 * Purpose:
 * Defines the public-user frontend contracts for creating, editing, viewing,
 * submitting, filtering, and deleting property records.
 *
 * Responsibilities:
 * - Define supported property submission sources.
 * - Define property ownership and authority relationships.
 * - Define physical property and address data.
 * - Define property review, verification, and correction states.
 * - Define property list, detail, pagination, and action contracts.
 * - Define the state and actions exposed by useProperties.
 *
 * Security notes:
 * - Frontend routes and payloads must use public IDs only.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Property records are private workspace records unless separately published
 *   through an approved listing.
 * - Private ownership documents, authority documents, internal review notes,
 *   duplicate-check details, risk notes, and private storage URLs must not be
 *   exposed through this feature.
 * - Backend ownership, company membership, authority, verification, policy,
 *   account, profile, and resource-level permission checks remain final.
 */

export type PropertyWorkspaceRole =
  "property_owner" | "property_agent" | "property_sourcer" | "api_partner";

export type PropertySubmissionSource =
  "property_owner" | "property_agent" | "property_sourcer" | "api_partner";

export type PropertyStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "correction_required"
  | "approved"
  | "rejected"
  | "archived";

export type PropertyVerificationStatus =
  | "not_started"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "on_hold"
  | "correction_required";

export type PropertyType =
  | "apartment"
  | "terraced_house"
  | "detached_house"
  | "semi_detached_house"
  | "bungalow"
  | "maisonette"
  | "townhouse"
  | "cottage"
  | "hmo"
  | "block_of_flats"
  | "student_accommodation"
  | "retirement_property"
  | "land"
  | "commercial"
  | "mixed_use"
  | "development_site"
  | "other";

export type PropertyTenureType =
  | "freehold"
  | "leasehold"
  | "share_of_freehold"
  | "commonhold"
  | "unknown"
  | "other";

export type PropertyOccupancyStatus =
  "vacant" | "owner_occupied" | "tenanted" | "part_occupied" | "unknown";

export type PropertyCondition =
  | "new_build"
  | "excellent"
  | "good"
  | "fair"
  | "requires_light_refurbishment"
  | "requires_moderate_refurbishment"
  | "requires_heavy_refurbishment"
  | "development_required"
  | "unknown";

export type PropertyOwnershipCapacity =
  | "sole_owner"
  | "joint_owner"
  | "company_owner"
  | "landlord"
  | "executor"
  | "authorised_representative"
  | "agent_for_owner"
  | "sourcer"
  | "other";

export type PropertyAuthorityType =
  | "owner"
  | "joint_owner"
  | "company_authority"
  | "agency_instruction"
  | "power_of_attorney"
  | "executor_authority"
  | "landlord_authority"
  | "vendor_instruction"
  | "sourcing_agreement"
  | "other";

export type PropertyAuthorityStatus =
  | "not_required"
  | "not_provided"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "replacement_required";

export type PropertyOwnershipProofStatus =
  | "not_provided"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "replacement_required";

export type PropertyListingRelationshipStatus =
  | "none"
  | "draft"
  | "submitted"
  | "under_review"
  | "published"
  | "inactive"
  | "archived";

export type PropertySort =
  | "newest"
  | "oldest"
  | "updated_recently"
  | "title_ascending"
  | "title_descending"
  | "status";

export type PropertyRequestState =
  | "idle"
  | "loading"
  | "refreshing"
  | "creating"
  | "saving"
  | "submitting"
  | "deleting"
  | "success"
  | "empty"
  | "error";

export interface PropertyAddress {
  addressLine1: string;
  addressLine2: string | null;
  townOrCity: string;
  county: string | null;
  postcode: string;
  countryCode: "GB";
}

export interface PropertyCoordinates {
  latitude: number;
  longitude: number;
}

export interface PropertyOwnershipDetails {
  ownershipCapacity: PropertyOwnershipCapacity;
  authorityType: PropertyAuthorityType;
  ownerDisplayName: string | null;
  ownerCompanyPublicId: string | null;
  representingCompanyPublicId: string | null;
  jointOwnerNames: string[];
  authorityDeclarationAccepted: boolean;
  informationAccuracyConfirmed: boolean;
}

export interface PropertyPhysicalDetails {
  propertyType: PropertyType;
  customPropertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  receptionRooms: number | null;
  kitchens: number | null;
  floorAreaSquareFeet: number | null;
  plotAreaSquareFeet: number | null;
  yearBuilt: number | null;
  tenureType: PropertyTenureType;
  leaseYearsRemaining: number | null;
  occupancyStatus: PropertyOccupancyStatus;
  condition: PropertyCondition;
}

export interface PropertyCreateValues {
  title: string;
  referenceName: string | null;
  address: PropertyAddress;
  coordinates: PropertyCoordinates | null;
  physicalDetails: PropertyPhysicalDetails;
  ownershipDetails: PropertyOwnershipDetails;
  shortDescription: string | null;
  internalUserNotes: string | null;
}

export interface PropertyUpdatePayload {
  title?: string;
  referenceName?: string | null;
  address?: Partial<PropertyAddress>;
  coordinates?: PropertyCoordinates | null;
  physicalDetails?: Partial<PropertyPhysicalDetails>;
  ownershipDetails?: Partial<PropertyOwnershipDetails>;
  shortDescription?: string | null;
  internalUserNotes?: string | null;
}

export interface PropertyDocumentStatusSummary {
  required: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  replacementRequired: number;
}

export interface PropertyCorrectionItem {
  key: string;
  fieldPath: string | null;
  title: string;
  message: string;
  actionLabel: string | null;
  actionPath: string | null;
  resolved: boolean;
}

export interface PropertyActionState {
  action: string;
  allowed: boolean;
  reason: string | null;
  nextActionLabel: string | null;
  nextActionPath: string | null;
}

export interface PropertySummary {
  propertyPublicId: string;
  slug: string | null;
  title: string;
  referenceName: string | null;

  addressSummary: string;
  townOrCity: string;
  county: string | null;
  postcode: string;

  propertyType: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  occupancyStatus: PropertyOccupancyStatus;
  condition: PropertyCondition;

  status: PropertyStatus;
  verificationStatus: PropertyVerificationStatus;
  ownershipProofStatus: PropertyOwnershipProofStatus;
  authorityStatus: PropertyAuthorityStatus;
  listingStatus: PropertyListingRelationshipStatus;

  submissionSource: PropertySubmissionSource;
  sourceProfilePublicId: string;
  sourceCompanyPublicId: string | null;

  correctionRequired: boolean;
  correctionCount: number;

  canEdit: boolean;
  canSubmit: boolean;
  canDelete: boolean;
  canCreateListing: boolean;

  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
}

export interface PropertyDetail extends PropertySummary {
  address: PropertyAddress;
  coordinates: PropertyCoordinates | null;
  physicalDetails: PropertyPhysicalDetails;
  ownershipDetails: PropertyOwnershipDetails;

  shortDescription: string | null;
  internalUserNotes: string | null;

  documentStatusSummary: PropertyDocumentStatusSummary;
  corrections: PropertyCorrectionItem[];
  actions: PropertyActionState[];

  listingPublicIds: string[];
  activeListingPublicId: string | null;

  safeUserMessage: string | null;
  rejectedAt: string | null;
  archivedAt: string | null;
}

export interface PropertyPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PropertyFilters {
  search: string;
  statuses: PropertyStatus[];
  verificationStatuses: PropertyVerificationStatus[];
  propertyTypes: PropertyType[];
  occupancyStatuses: PropertyOccupancyStatus[];
  submissionSources: PropertySubmissionSource[];
  townsOrCities: string[];
  correctionRequired: boolean | null;
  hasListing: boolean | null;
  sort: PropertySort;
  page: number;
  pageSize: number;
}

export interface PropertyQuery {
  search?: string;
  statuses?: PropertyStatus[];
  verificationStatuses?: PropertyVerificationStatus[];
  propertyTypes?: PropertyType[];
  occupancyStatuses?: PropertyOccupancyStatus[];
  submissionSources?: PropertySubmissionSource[];
  townsOrCities?: string[];
  correctionRequired?: boolean;
  hasListing?: boolean;
  sort?: PropertySort;
  page?: number;
  pageSize?: number;
}

export interface PropertyCollection {
  items: PropertySummary[];
  pagination: PropertyPagination;
  appliedFilters: Partial<PropertyFilters>;
}

export interface CreatePropertyPayload {
  data: PropertyCreateValues;
}

export interface CreatePropertyResult {
  property: PropertyDetail;
  created: true;
  nextPath: string;
  message: string;
}

export interface UpdatePropertyResult {
  property: PropertyDetail;
  updated: true;
  message: string;
}

export interface SubmitPropertyPayload {
  informationAccurate: true;
  authorityConfirmed: true;
}

export interface SubmitPropertyResult {
  property: PropertyDetail;
  submitted: true;
  verificationStatus: PropertyVerificationStatus;
  nextPath: string;
  message: string;
}

export interface DeletePropertyResult {
  propertyPublicId: string;
  deleted: true;
}

export interface PropertiesHookState {
  requestState: PropertyRequestState;
  properties: PropertySummary[];
  selectedProperty: PropertyDetail | null;
  filters: PropertyFilters;
  pagination: PropertyPagination | null;

  errorMessage: string | null;
  successMessage: string | null;

  isLoading: boolean;
  isRefreshing: boolean;
  isCreating: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  isEmpty: boolean;
}

export interface PropertiesHookActions {
  loadProperties: (
    filters?: Partial<PropertyFilters>,
  ) => Promise<PropertyCollection | null>;

  refreshProperties: () => Promise<PropertyCollection | null>;

  loadProperty: (propertyPublicId: string) => Promise<PropertyDetail | null>;

  createProperty: (
    payload: CreatePropertyPayload,
  ) => Promise<CreatePropertyResult>;

  updateProperty: (
    propertyPublicId: string,
    payload: PropertyUpdatePayload,
  ) => Promise<UpdatePropertyResult>;

  submitProperty: (
    propertyPublicId: string,
    payload: SubmitPropertyPayload,
  ) => Promise<SubmitPropertyResult>;

  deleteProperty: (propertyPublicId: string) => Promise<DeletePropertyResult>;

  setFilters: (filters: Partial<PropertyFilters>) => void;
  replaceFilters: (filters: PropertyFilters) => void;
  resetFilters: () => void;

  clearSelectedProperty: () => void;
  clearMessages: () => void;
  reset: () => void;
}

export type UsePropertiesResult = PropertiesHookState & PropertiesHookActions;
