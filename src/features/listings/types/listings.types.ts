// File: src/features/listings/types/listings.types.ts

/**
 * Asancha Listing Types
 *
 * Purpose:
 * Defines authenticated public-user frontend contracts for listing creation,
 * editing, submission, lifecycle display, visibility, media summaries, and
 * private listing workspace management.
 *
 * Responsibilities:
 * - Define listing creation and update values.
 * - Define listing and deal lifecycle states.
 * - Define public/private visibility summaries.
 * - Define pricing and investment metrics.
 * - Define listing media metadata.
 * - Define list, detail, pagination, and mutation contracts.
 * - Define the state and actions exposed by useListings.
 *
 * Security notes:
 * - Frontend routes and requests must use public IDs only.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Users must not directly approve, publish, unpublish, reserve, complete,
 *   sell, or archive listings unless an explicit backend endpoint permits it.
 * - Private deal packs, sensitive documents, internal review notes, private
 *   contact details, raw storage keys, and restricted AI analysis must not be
 *   exposed through this feature.
 * - Backend authentication, active-profile, property ownership, verification,
 *   policy, document, payment, company, lifecycle, and permission checks remain
 *   final.
 */

export type ListingWorkspaceRole =
  "property_owner" | "property_agent" | "property_sourcer";

export type ListingSubmissionSource =
  | "property_owner"
  | "property_agent"
  | "property_sourcer"
  | "internal_staff"
  | "api_partner";

export type ListingType = "sale" | "rent" | "refurbishment";

export type ListingCategory =
  | "off_market"
  | "bmv"
  | "market_listing"
  | "distressed"
  | "auction_led"
  | "development_opportunity"
  | "manual";

export type ListingVisibility = "private" | "restricted" | "public";

export type ListingStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "published"
  | "on_hold"
  | "correction_required"
  | "rejected"
  | "withdrawn"
  | "archived";

export type ListingDealStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "published"
  | "reserved"
  | "under_offer"
  | "due_diligence"
  | "exchanged"
  | "completed"
  | "sold"
  | "rejected"
  | "withdrawn"
  | "archived";

export type ListingCalculatedStatus =
  "available" | "reserved" | "under_offer" | "inactive";

export type ListingVerificationStatus =
  | "not_started"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "on_hold"
  | "correction_required";

export type ListingOccupancyStatus =
  "vacant" | "owner_occupied" | "tenanted" | "part_occupied" | "unknown";

export type ListingInvestmentStrategy =
  | "buy_to_let"
  | "buy_refurbish_refinance"
  | "flip"
  | "hmo"
  | "serviced_accommodation"
  | "development"
  | "commercial_conversion"
  | "land"
  | "portfolio_purchase"
  | "other";

export type ListingCurrency = "GBP";

export type ListingMediaType = "image" | "floorplan" | "video";

export type ListingSort =
  | "newest"
  | "oldest"
  | "updated_recently"
  | "title_ascending"
  | "title_descending"
  | "price_low_to_high"
  | "price_high_to_low"
  | "status";

export type ListingRequestState =
  | "idle"
  | "loading"
  | "refreshing"
  | "creating"
  | "saving"
  | "submitting"
  | "withdrawing"
  | "deleting"
  | "success"
  | "empty"
  | "error";

export interface ListingPriceDetails {
  askingPrice: number | null;
  guidePrice: number | null;
  estimatedMarketValue: number | null;
  estimatedMonthlyRent: number | null;
  refurbishmentEstimate: number | null;
  otherAcquisitionCostsEstimate: number | null;
  currency: ListingCurrency;
}

export interface ListingMetrics {
  estimatedAnnualRent: number | null;
  bmvDiscountPercent: number | null;
  grossYieldPercent: number | null;
  estimatedRoiPercent: number | null;
  totalInvestmentEstimate: number | null;
  calculationDisclaimer: string | null;
}

export interface ListingAccessRequirements {
  authenticationRequired: boolean;
  investorProfileRequired: boolean;
  onboardingRequired: boolean;
  verificationRequired: boolean;
  proofOfFundsRequired: boolean;
  paymentRequired: boolean;
  reservationRequired: boolean;
}

export interface ListingCreateValues {
  propertyPublicId: string;

  title: string;
  shortDescription: string;
  description: string;

  listingType: ListingType;
  listingCategory: ListingCategory;
  occupancyStatus: ListingOccupancyStatus;

  priceDetails: ListingPriceDetails;

  investmentStrategies: ListingInvestmentStrategy[];
  badges: string[];
  features: string[];

  accessRequirements: ListingAccessRequirements;

  isFeaturedRequested: boolean;
  informationAccurateConfirmed: boolean;
  listingStandardsAccepted: boolean;
  authorityConfirmed: boolean;
}

export interface ListingUpdatePayload {
  title?: string;
  shortDescription?: string;
  description?: string;

  listingType?: ListingType;
  listingCategory?: ListingCategory;
  occupancyStatus?: ListingOccupancyStatus;

  priceDetails?: Partial<ListingPriceDetails>;

  investmentStrategies?: ListingInvestmentStrategy[];
  badges?: string[];
  features?: string[];

  accessRequirements?: Partial<ListingAccessRequirements>;

  isFeaturedRequested?: boolean;
  informationAccurateConfirmed?: boolean;
  listingStandardsAccepted?: boolean;
  authorityConfirmed?: boolean;
}

export interface ListingPropertySummary {
  propertyPublicId: string;
  propertySlug: string | null;
  title: string;
  addressSummary: string;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  verificationStatus: string;
  status: string;
}

export interface ListingMediaSummary {
  mediaPublicId: string;
  mediaType: ListingMediaType;
  url: string;
  altText: string;
  caption: string | null;
  sortOrder: number;
  isCover: boolean;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListingCorrectionItem {
  key: string;
  fieldPath: string | null;
  title: string;
  message: string;
  actionLabel: string | null;
  actionPath: string | null;
  resolved: boolean;
}

export interface ListingDocumentSummary {
  required: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  replacementRequired: number;
}

export interface ListingActionState {
  action: string;
  allowed: boolean;
  reason: string | null;
  nextActionLabel: string | null;
  nextActionPath: string | null;
}

export interface ListingSummary {
  listingPublicId: string;
  propertyPublicId: string;

  slug: string | null;
  title: string;
  shortDescription: string;

  listingType: ListingType;
  listingCategory: ListingCategory;
  visibility: ListingVisibility;

  status: ListingStatus;
  dealStatus: ListingDealStatus;
  calculatedStatus: ListingCalculatedStatus;
  verificationStatus: ListingVerificationStatus;

  askingPrice: number | null;
  currency: ListingCurrency;

  occupancyStatus: ListingOccupancyStatus;
  investmentStrategies: ListingInvestmentStrategy[];

  submissionSource: ListingSubmissionSource;
  sourceProfilePublicId: string;
  sourceCompanyPublicId: string | null;

  coverMedia: ListingMediaSummary | null;

  isPublished: boolean;
  isMarketplaceVisible: boolean;
  isFeatured: boolean;

  correctionRequired: boolean;
  correctionCount: number;

  canEdit: boolean;
  canSubmit: boolean;
  canWithdraw: boolean;
  canDelete: boolean;
  canManageMedia: boolean;

  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
}

export interface ListingDetail extends ListingSummary {
  description: string;

  property: ListingPropertySummary;

  priceDetails: ListingPriceDetails;
  metrics: ListingMetrics;

  accessRequirements: ListingAccessRequirements;

  badges: string[];
  features: string[];
  media: ListingMediaSummary[];

  documentSummary: ListingDocumentSummary;
  corrections: ListingCorrectionItem[];
  actions: ListingActionState[];

  safeUserMessage: string | null;

  reviewedAt: string | null;
  rejectedAt: string | null;
  withdrawnAt: string | null;
  archivedAt: string | null;
}

export interface ListingFilters {
  search: string;
  statuses: ListingStatus[];
  dealStatuses: ListingDealStatus[];
  verificationStatuses: ListingVerificationStatus[];
  listingTypes: ListingType[];
  listingCategories: ListingCategory[];
  visibilities: ListingVisibility[];
  submissionSources: ListingSubmissionSource[];

  propertyPublicId: string | null;
  correctionRequired: boolean | null;
  isPublished: boolean | null;
  isMarketplaceVisible: boolean | null;

  sort: ListingSort;
  page: number;
  pageSize: number;
}

export interface ListingQuery {
  search?: string;
  statuses?: ListingStatus[];
  dealStatuses?: ListingDealStatus[];
  verificationStatuses?: ListingVerificationStatus[];
  listingTypes?: ListingType[];
  listingCategories?: ListingCategory[];
  visibilities?: ListingVisibility[];
  submissionSources?: ListingSubmissionSource[];

  propertyPublicId?: string;
  correctionRequired?: boolean;
  isPublished?: boolean;
  isMarketplaceVisible?: boolean;

  sort?: ListingSort;
  page?: number;
  pageSize?: number;
}

export interface ListingPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ListingCollection {
  items: ListingSummary[];
  pagination: ListingPagination;
  appliedFilters: Partial<ListingFilters>;
}

export interface CreateListingPayload {
  data: ListingCreateValues;
}

export interface CreateListingResult {
  listing: ListingDetail;
  created: true;
  nextPath: string;
  message: string;
}

export interface UpdateListingResult {
  listing: ListingDetail;
  updated: true;
  message: string;
}

export interface SubmitListingPayload {
  informationAccurateConfirmed: true;
  listingStandardsAccepted: true;
  authorityConfirmed: true;
}

export interface SubmitListingResult {
  listing: ListingDetail;
  submitted: true;
  nextPath: string;
  message: string;
}

export interface WithdrawListingPayload {
  reason: string;
}

export interface WithdrawListingResult {
  listing: ListingDetail;
  withdrawn: true;
  message: string;
}

export interface DeleteListingResult {
  listingPublicId: string;
  deleted: true;
}

export interface ListingsHookState {
  requestState: ListingRequestState;

  listings: ListingSummary[];
  selectedListing: ListingDetail | null;

  filters: ListingFilters;
  pagination: ListingPagination | null;

  errorMessage: string | null;
  successMessage: string | null;

  isLoading: boolean;
  isRefreshing: boolean;
  isCreating: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isWithdrawing: boolean;
  isDeleting: boolean;
  isEmpty: boolean;
}

export interface ListingsHookActions {
  loadListings: (
    filters?: Partial<ListingFilters>,
  ) => Promise<ListingCollection | null>;

  refreshListings: () => Promise<ListingCollection | null>;

  loadListing: (listingPublicId: string) => Promise<ListingDetail | null>;

  createListing: (
    payload: CreateListingPayload,
  ) => Promise<CreateListingResult>;

  updateListing: (
    listingPublicId: string,
    payload: ListingUpdatePayload,
  ) => Promise<UpdateListingResult>;

  submitListing: (
    listingPublicId: string,
    payload: SubmitListingPayload,
  ) => Promise<SubmitListingResult>;

  withdrawListing: (
    listingPublicId: string,
    payload: WithdrawListingPayload,
  ) => Promise<WithdrawListingResult>;

  deleteListing: (listingPublicId: string) => Promise<DeleteListingResult>;

  setFilters: (filters: Partial<ListingFilters>) => void;

  replaceFilters: (filters: ListingFilters) => void;

  resetFilters: () => void;

  clearSelectedListing: () => void;
  clearMessages: () => void;
  reset: () => void;
}

export type UseListingsResult = ListingsHookState & ListingsHookActions;
