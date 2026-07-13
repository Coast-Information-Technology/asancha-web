// File: src/features/recommendations/types/recommendations.types.ts

/**
 * Asancha Recommendation Types
 *
 * Purpose:
 * Defines authenticated investor-facing contracts for AI-generated property
 * recommendations, listing-match explanations, safe warnings, saving,
 * dismissal, conversion actions, and recommendation feedback.
 *
 * Responsibilities:
 * - Define recommendation and confidence states.
 * - Define safe listing snapshots.
 * - Define match reasons and mismatch warnings.
 * - Define available and locked recommendation actions.
 * - Define recommendation feedback values and results.
 * - Define collection, pagination, filter, and hook contracts.
 *
 * Security notes:
 * - Only public IDs and safe listing data may be exposed.
 * - MongoDB ObjectIds must never appear.
 * - Internal matching snapshots, private prompts, model-provider payloads,
 *   hidden scoring weights, private investor data, risk internals, staff notes,
 *   and restricted listing data must not appear.
 * - AI recommendations do not override listing visibility, verification,
 *   payment, reservation, booking, document, policy, or permission rules.
 * - AI output must not be presented as guaranteed advice or outcomes.
 */

export type RecommendationType =
    | "investor_listing_match"
    | "similar_listing"
    | "location_match"
    | "strategy_match"
    | "budget_match"
    | "yield_match"
    | "roi_match"
    | "bmv_opportunity"
    | "refurbishment_opportunity"
    | "portfolio_fit"
    | "other";

export type RecommendationStatus =
    | "active"
    | "viewed"
    | "saved"
    | "dismissed"
    | "converted"
    | "expired"
    | "withdrawn";

export type RecommendationConfidenceLevel =
    | "low"
    | "medium"
    | "high"
    | "very_high";

export type RecommendationFeedbackType =
    | "good_match"
    | "bad_match"
    | "not_interested"
    | "wrong_location"
    | "too_expensive"
    | "yield_too_low"
    | "roi_too_low"
    | "wrong_strategy"
    | "refurb_too_heavy"
    | "already_seen"
    | "not_enough_data"
    | "other";

export type RecommendationActionType =
    | "view_listing"
    | "save"
    | "unsave"
    | "dismiss"
    | "feedback"
    | "book_viewing"
    | "reserve"
    | "view_marketplace";

export type RecommendationSort =
    | "recommended"
    | "highest_match"
    | "lowest_match"
    | "newest"
    | "oldest"
    | "price_low_to_high"
    | "price_high_to_low"
    | "confidence";

export type RecommendationRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "marking_viewed"
    | "saving"
    | "unsaving"
    | "dismissing"
    | "submitting_feedback"
    | "success"
    | "empty"
    | "error";

export interface RecommendationListingMedia {
    mediaPublicId: string;
    url: string;
    altText: string;
    isCover: boolean;
}

export interface RecommendationListingSnapshot {
    listingPublicId: string;
    slug: string;

    title: string;
    shortDescription: string;
    location: string;

    propertyType: string;
    listingType: string;
    listingCategory: string;

    bedrooms: number | null;
    bathrooms: number | null;

    askingPrice: number | null;
    estimatedMarketValue: number | null;
    estimatedMonthlyRent: number | null;

    grossYieldPercent: number | null;
    estimatedRoiPercent: number | null;
    bmvDiscountPercent: number | null;

    currency: "GBP";

    investmentStrategies: string[];
    badges: string[];

    dealStatus: string;
    calculatedStatus: string;

    coverMedia: RecommendationListingMedia | null;

    isPublished: boolean;
    isMarketplaceVisible: boolean;

    publicListingPath: string | null;
}

export interface RecommendationReason {
    reasonKey: string;
    title: string;
    explanation: string;
    importance: "low" | "medium" | "high";
}

export interface RecommendationWarning {
    warningKey: string;
    title: string;
    explanation: string;
    severity: "information" | "warning" | "important";
}

export interface RecommendationScoreBreakdown {
    category: string;
    label: string;
    score: number;
    maximumScore: number;
    explanation: string | null;
}

export interface RecommendationAction {
    action: RecommendationActionType;
    allowed: boolean;
    reason: string | null;
    label: string;
    path: string | null;
}

export interface RecommendationFeedbackSummary {
    feedbackPublicId: string;
    feedbackType: RecommendationFeedbackType;
    feedbackReason: string | null;
    comment: string | null;
    createdAt: string;
}

export interface RecommendationSummary {
    recommendationPublicId: string;

    recommendationType: RecommendationType;
    status: RecommendationStatus;

    listing: RecommendationListingSnapshot;

    matchScore: number;
    confidenceLevel: RecommendationConfidenceLevel;

    primaryReasons: RecommendationReason[];
    warnings: RecommendationWarning[];

    recommendedAction: RecommendationAction | null;

    isViewed: boolean;
    isSaved: boolean;
    isDismissed: boolean;
    hasFeedback: boolean;

    canView: boolean;
    canSave: boolean;
    canDismiss: boolean;
    canGiveFeedback: boolean;

    safeUserMessage: string | null;

    recommendedAt: string;
    viewedAt: string | null;
    savedAt: string | null;
    dismissedAt: string | null;
    expiresAt: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface RecommendationDetail
    extends RecommendationSummary {
    explanationSummary: string;

    reasons: RecommendationReason[];
    mismatchWarnings: RecommendationWarning[];
    scoreBreakdown: RecommendationScoreBreakdown[];

    actions: RecommendationAction[];

    feedback: RecommendationFeedbackSummary | null;

    dataCompletenessPercent: number | null;

    aiDisclaimer: string;
}

export interface RecommendationFilters {
    search: string;

    statuses: RecommendationStatus[];
    recommendationTypes: RecommendationType[];
    confidenceLevels: RecommendationConfidenceLevel[];

    savedOnly: boolean | null;
    unviewedOnly: boolean | null;
    feedbackMissingOnly: boolean | null;

    minimumMatchScore: number | null;
    maximumPrice: number | null;

    sort: RecommendationSort;
    page: number;
    pageSize: number;
}

export interface RecommendationQuery {
    search?: string;

    statuses?: RecommendationStatus[];
    recommendationTypes?: RecommendationType[];
    confidenceLevels?: RecommendationConfidenceLevel[];

    savedOnly?: boolean;
    unviewedOnly?: boolean;
    feedbackMissingOnly?: boolean;

    minimumMatchScore?: number;
    maximumPrice?: number;

    sort?: RecommendationSort;
    page?: number;
    pageSize?: number;
}

export interface RecommendationPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface RecommendationStatusSummary {
    total: number;
    active: number;
    unviewed: number;
    saved: number;
    dismissed: number;
    converted: number;
    expired: number;
}

export interface RecommendationCollection {
    items: RecommendationSummary[];
    statusSummary: RecommendationStatusSummary;
    pagination: RecommendationPagination;
    appliedFilters: Partial<RecommendationFilters>;
}

export type MarkRecommendationViewedPayload =
    Record<string, unknown> & {
        data: {
            viewedAt: string | null;
        };
    };

export interface MarkRecommendationViewedResult {
    recommendation: RecommendationDetail;
    viewed: true;
}

export type SaveRecommendationPayload =
    Record<string, unknown> & {
        data: {
            savedAt: string | null;
        };
    };

export interface SaveRecommendationResult {
    recommendation: RecommendationDetail;
    saved: true;
    message: string;
}

export type UnsaveRecommendationPayload =
    Record<string, unknown> & {
        data: {
            unsavedAt: string | null;
        };
    };

export interface UnsaveRecommendationResult {
    recommendation: RecommendationDetail;
    unsaved: true;
    message: string;
}

export interface DismissRecommendationValues {
    reason: string | null;
    dismissalConfirmed: true;
}

export type DismissRecommendationPayload =
    Record<string, unknown> & {
        data: DismissRecommendationValues;
    };

export interface DismissRecommendationResult {
    recommendation: RecommendationDetail;
    dismissed: true;
    message: string;
}

export interface RecommendationFeedbackValues {
    feedbackType: RecommendationFeedbackType;
    feedbackReason: string | null;
    comment: string | null;

    feedbackAccurateConfirmed: true;
}

export type SubmitRecommendationFeedbackPayload =
    Record<string, unknown> & {
        data: RecommendationFeedbackValues;
    };

export interface SubmitRecommendationFeedbackResult {
    recommendation: RecommendationDetail;
    feedback: RecommendationFeedbackSummary;
    submitted: true;
    message: string;
}

export interface RecommendationsHookState {
    requestState: RecommendationRequestState;

    recommendations: RecommendationSummary[];
    selectedRecommendation: RecommendationDetail | null;
    statusSummary: RecommendationStatusSummary | null;

    filters: RecommendationFilters;
    pagination: RecommendationPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isMarkingViewed: boolean;
    isSaving: boolean;
    isUnsaving: boolean;
    isDismissing: boolean;
    isSubmittingFeedback: boolean;
    isEmpty: boolean;
}

export interface RecommendationsHookActions {
    loadRecommendations: (
        filters?: Partial<RecommendationFilters>,
    ) => Promise<RecommendationCollection | null>;

    refreshRecommendations: () => Promise<RecommendationCollection | null>;

    loadRecommendation: (
        recommendationPublicId: string,
    ) => Promise<RecommendationDetail | null>;

    markRecommendationViewed: (
        recommendationPublicId: string,
    ) => Promise<MarkRecommendationViewedResult>;

    saveRecommendation: (
        recommendationPublicId: string,
    ) => Promise<SaveRecommendationResult>;

    unsaveRecommendation: (
        recommendationPublicId: string,
    ) => Promise<UnsaveRecommendationResult>;

    dismissRecommendation: (
        recommendationPublicId: string,
        payload: DismissRecommendationPayload,
    ) => Promise<DismissRecommendationResult>;

    submitRecommendationFeedback: (
        recommendationPublicId: string,
        payload: SubmitRecommendationFeedbackPayload,
    ) => Promise<SubmitRecommendationFeedbackResult>;

    setFilters: (
        filters: Partial<RecommendationFilters>,
    ) => void;

    replaceFilters: (
        filters: RecommendationFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedRecommendation: () => void;
    clearFeedbackMessages: () => void;
    reset: () => void;
}

export type UseRecommendationsResult =
    RecommendationsHookState &
    RecommendationsHookActions;