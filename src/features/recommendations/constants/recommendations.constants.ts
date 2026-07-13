// File: src/features/recommendations/constants/recommendations.constants.ts

/**
 * Asancha Recommendation Constants
 *
 * Purpose:
 * Defines recommendation endpoints, routes, filter options, feedback options,
 * defaults, and safe AI guidance.
 *
 * Security notes:
 * - Internal AI-analysis and matching-snapshot routes must not appear here.
 * - Frontend constants do not grant access to restricted listing actions.
 * - All displayed AI guidance must remain non-guaranteeing.
 */

import type {
    RecommendationConfidenceLevel,
    RecommendationFeedbackType,
    RecommendationFilters,
    RecommendationStatus,
    RecommendationType,
} from "../types/recommendations.types";

export const RECOMMENDATIONS_API_ENDPOINTS = {
    mine: "/ai/recommendations/me",

    recommendation: (
        recommendationPublicId: string,
    ): string =>
        `/ai/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}`,

    view: (
        recommendationPublicId: string,
    ): string =>
        `/ai/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}/view`,

    save: (
        recommendationPublicId: string,
    ): string =>
        `/ai/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}/save`,

    unsave: (
        recommendationPublicId: string,
    ): string =>
        `/ai/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}/unsave`,

    dismiss: (
        recommendationPublicId: string,
    ): string =>
        `/ai/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}/dismiss`,

    feedback: (
        recommendationPublicId: string,
    ): string =>
        `/ai/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}/feedback`,
} as const;

export const RECOMMENDATION_PAGE_ROUTES = {
    root: "/recommendations",

    detail: (
        recommendationPublicId: string,
    ): string =>
        `/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}`,

    feedback: (
        recommendationPublicId: string,
    ): string =>
        `/recommendations/${encodeURIComponent(
            recommendationPublicId,
        )}/feedback`,

    marketplace: "/marketplace",

    listing: (listingSlug: string): string =>
        `/marketplace/${encodeURIComponent(
            listingSlug,
        )}`,

    investorPreferences:
        "/dashboard/investor/preferences",

    verification: "/verification",
} as const;

export const RECOMMENDATION_STATUS_OPTIONS = [
    {
        value: "active",
        label: "Active",
    },
    {
        value: "viewed",
        label: "Viewed",
    },
    {
        value: "saved",
        label: "Saved",
    },
    {
        value: "dismissed",
        label: "Dismissed",
    },
    {
        value: "converted",
        label: "Action taken",
    },
    {
        value: "expired",
        label: "Expired",
    },
    {
        value: "withdrawn",
        label: "Unavailable",
    },
] as const satisfies ReadonlyArray<{
    value: RecommendationStatus;
    label: string;
}>;

export const RECOMMENDATION_TYPE_OPTIONS = [
    {
        value: "investor_listing_match",
        label: "Investor match",
    },
    {
        value: "similar_listing",
        label: "Similar listing",
    },
    {
        value: "location_match",
        label: "Location match",
    },
    {
        value: "strategy_match",
        label: "Strategy match",
    },
    {
        value: "budget_match",
        label: "Budget match",
    },
    {
        value: "yield_match",
        label: "Yield match",
    },
    {
        value: "roi_match",
        label: "ROI match",
    },
    {
        value: "bmv_opportunity",
        label: "Below-market-value opportunity",
    },
    {
        value: "refurbishment_opportunity",
        label: "Refurbishment opportunity",
    },
    {
        value: "portfolio_fit",
        label: "Portfolio fit",
    },
    {
        value: "other",
        label: "Other recommendation",
    },
] as const satisfies ReadonlyArray<{
    value: RecommendationType;
    label: string;
}>;

export const RECOMMENDATION_CONFIDENCE_OPTIONS = [
    {
        value: "low",
        label: "Low confidence",
    },
    {
        value: "medium",
        label: "Medium confidence",
    },
    {
        value: "high",
        label: "High confidence",
    },
    {
        value: "very_high",
        label: "Very high confidence",
    },
] as const satisfies ReadonlyArray<{
    value: RecommendationConfidenceLevel;
    label: string;
}>;

export const RECOMMENDATION_FEEDBACK_OPTIONS = [
    {
        value: "good_match",
        label: "Good match",
    },
    {
        value: "bad_match",
        label: "Bad match",
    },
    {
        value: "not_interested",
        label: "Not interested",
    },
    {
        value: "wrong_location",
        label: "Wrong location",
    },
    {
        value: "too_expensive",
        label: "Too expensive",
    },
    {
        value: "yield_too_low",
        label: "Yield too low",
    },
    {
        value: "roi_too_low",
        label: "ROI too low",
    },
    {
        value: "wrong_strategy",
        label: "Wrong strategy",
    },
    {
        value: "refurb_too_heavy",
        label: "Refurbishment too heavy",
    },
    {
        value: "already_seen",
        label: "Already seen",
    },
    {
        value: "not_enough_data",
        label: "Not enough information",
    },
    {
        value: "other",
        label: "Other feedback",
    },
] as const satisfies ReadonlyArray<{
    value: RecommendationFeedbackType;
    label: string;
}>;

export const RECOMMENDATION_SORT_OPTIONS = [
    {
        value: "recommended",
        label: "Recommended order",
    },
    {
        value: "highest_match",
        label: "Highest match",
    },
    {
        value: "lowest_match",
        label: "Lowest match",
    },
    {
        value: "newest",
        label: "Newest first",
    },
    {
        value: "oldest",
        label: "Oldest first",
    },
    {
        value: "price_low_to_high",
        label: "Price: low to high",
    },
    {
        value: "price_high_to_low",
        label: "Price: high to low",
    },
    {
        value: "confidence",
        label: "Confidence",
    },
] as const;

export const DEFAULT_RECOMMENDATION_FILTERS:
    RecommendationFilters = {
    search: "",

    statuses: [],
    recommendationTypes: [],
    confidenceLevels: [],

    savedOnly: null,
    unviewedOnly: null,
    feedbackMissingOnly: null,

    minimumMatchScore: null,
    maximumPrice: null,

    sort: "recommended",
    page: 1,
    pageSize: 20,
};

export const RECOMMENDATION_AI_DISCLAIMER =
    "AI recommendations are for guidance only. They do not guarantee rental income, capital growth, financing approval, legal outcome, refurbishment cost, investment return, resale value, or sale completion.";

export const RECOMMENDATION_SAFE_MESSAGES = {
    loadError:
        "We could not load your recommendations. Please refresh the page.",

    detailLoadError:
        "We could not load this recommendation. It may have expired, become unavailable, or may not belong to your active investor profile.",

    markViewedError:
        "We could not update the recommendation view status.",

    saveError:
        "We could not save this recommendation.",

    saved:
        "The recommendation has been saved.",

    unsaveError:
        "We could not remove this recommendation from your saved deals.",

    unsaved:
        "The recommendation has been removed from your saved deals.",

    dismissError:
        "We could not dismiss this recommendation.",

    dismissed:
        "The recommendation has been dismissed.",

    feedbackError:
        "We could not submit your feedback. Please review it and try again.",

    feedbackSubmitted:
        "Thank you. Your feedback has been recorded.",

    empty:
        "No recommendations yet. Complete your investment preferences to help Asancha match you with suitable opportunities.",

    expired:
        "This recommendation has expired.",

    listingUnavailable:
        "The recommended listing is no longer available.",

    restrictedAction:
        "This action is currently unavailable. Review the reason shown for the action.",

    investorProfileRequired:
        "An active investor profile is required to receive recommendations.",

    preferencesRequired:
        "Complete your investment preferences to receive more suitable recommendations.",

    explanationRule:
        "Recommendation scores are estimates based on the information currently available.",

    noOverrideRule:
        "AI recommendations do not override verification, payment, reservation, booking, document, policy, listing visibility, or permission requirements.",
} as const;

export function getRecommendationConfidenceLabel(
    confidenceLevel: RecommendationConfidenceLevel,
): string {
    return (
        RECOMMENDATION_CONFIDENCE_OPTIONS.find(
            (option) =>
                option.value === confidenceLevel,
        )?.label ?? confidenceLevel
    );
}

export function getRecommendationFeedbackLabel(
    feedbackType: RecommendationFeedbackType,
): string {
    return (
        RECOMMENDATION_FEEDBACK_OPTIONS.find(
            (option) =>
                option.value === feedbackType,
        )?.label ?? feedbackType
    );
}