// File: src/lib/api/api-routes.ts

/**
 * Asancha API Routes
 *
 * Purpose:
 * Centralises frontend API route constants and API URL construction.
 *
 * Important notes:
 * - Do not hardcode sensitive production backend URLs in this file.
 * - The API base URL must come from NEXT_PUBLIC_API_BASE_URL.
 * - Keep route constants public-safe and avoid exposing internal admin/staff
 *   endpoint paths inside the public/user frontend unless explicitly needed
 *   for safe redirects or forbidden-route handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    changeEmail: "/auth/change-email",
    confirmEmailChange: "/auth/confirm-email-change",
    google: "/auth/google",
    googleCallback: "/auth/google/callback",
  },

  me: {
    profile: "/me/profile",
    dashboardState: "/me/dashboard-state",
    activeBusinessProfile: "/me/active-business-profile",
    availableBusinessProfiles: "/me/business-profiles",
    notificationsSummary: "/me/notifications-summary",
  },

  policies: {
    list: "/policies",
    required: "/policies/required",
    acceptances: "/policy-acceptances",
    accept: "/policy-acceptances/accept",
  },

  profiles: {
    me: "/profiles/me",
    completeGeneralProfile: "/profiles/me/complete",
    businessProfiles: "/profiles/me/business-profiles",
    activeBusinessProfile: "/profiles/me/active",
    switchBusinessProfile: "/profiles/me/switch",
  },

  onboarding: {
    status: "/onboarding/status",
    generalProfile: "/onboarding/general-profile",
    investor: "/onboarding/investor",
    propertyOwner: "/onboarding/property-owner",
    propertyAgent: "/onboarding/property-agent",
    propertySourcer: "/onboarding/property-sourcer",
    serviceProvider: "/onboarding/service-provider",
    apiPartner: "/onboarding/api-partner",
  },

  marketplace: {
    listings: "/marketplace/listings",
    filters: "/marketplace/filters",
  },

  properties: {
    me: "/properties/me",
    create: "/properties",
  },

  listings: {
    me: "/listings/me",
    create: "/listings",
    saved: "/listings/saved",
    recommendations: "/listings/recommendations",
  },

  documents: {
    list: "/documents",
    upload: "/documents/upload",
  },

  verification: {
    reviews: "/verification-reviews",
    status: "/verification-reviews/status",
  },

  payments: {
    list: "/payments",
    references: "/payments/references",
  },

  reservations: {
    list: "/reservations",
    create: "/reservations",
  },

  bookings: {
    list: "/bookings",
    create: "/bookings",
  },

  conversations: {
    list: "/conversations",
    create: "/conversations",
  },

  messages: {
    create: "/messages",
  },

  notifications: {
    list: "/notifications",
    unreadCount: "/notifications/unread-count",
    readAll: "/notifications/read-all",
    preferences: "/notifications/preferences",
  },

  recommendations: {
    list: "/ai/recommendations",
    feedback: "/ai/recommendations/feedback",
  },

  apiPartner: {
    apply: "/api-access/applications",
    applicationStatus: "/api-access/application-status",
    dashboard: "/api-access/dashboard",
    client: "/api-access/client",
    keys: "/api-access/keys",
    usage: "/api-access/usage",
    webhooks: "/api-access/webhooks",
    docs: "/partner-api/docs",
    billing: "/api-access/billing",
    payments: "/api-access/payments",
    support: "/api-access/support",
  },
} as const;

/**
 * Returns the configured public API base URL.
 *
 * This value should come from deployment environment variables.
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Removes duplicate slashes from a route while preserving protocol slashes.
 */
function normalizeUrl(url: string): string {
  return url.replace(/([^:]\/)\/+/g, "$1");
}

/**
 * Ensures an API route starts with a slash.
 */
export function normalizeApiPath(path: string): string {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Builds a full API URL from a route path.
 *
 * If NEXT_PUBLIC_API_BASE_URL is not set, this returns a relative path.
 */
export function buildApiUrl(path: string): string {
  const normalizedPath = normalizeApiPath(path);

  if (!API_BASE_URL) {
    return normalizedPath;
  }

  return normalizeUrl(`${API_BASE_URL}${normalizedPath}`);
}

/**
 * Builds a route for a public listing detail lookup.
 */
export function buildMarketplaceListingRoute(listingSlug: string): string {
  return `${API_ROUTES.marketplace.listings}/${encodeURIComponent(listingSlug)}`;
}

/**
 * Builds a route for a document detail lookup.
 */
export function buildDocumentRoute(documentPublicId: string): string {
  return `${API_ROUTES.documents.list}/${encodeURIComponent(documentPublicId)}`;
}

/**
 * Builds a route for document replacement.
 */
export function buildDocumentReplaceRoute(documentPublicId: string): string {
  return `${buildDocumentRoute(documentPublicId)}/replace`;
}

/**
 * Builds a route for a verification review detail lookup.
 */
export function buildVerificationReviewRoute(
  verificationReviewPublicId: string,
): string {
  return `${API_ROUTES.verification.reviews}/${encodeURIComponent(
    verificationReviewPublicId,
  )}`;
}

/**
 * Builds a route for a payment detail lookup.
 */
export function buildPaymentRoute(paymentPublicId: string): string {
  return `${API_ROUTES.payments.list}/${encodeURIComponent(paymentPublicId)}`;
}

/**
 * Builds a route for a payment reference lookup.
 */
export function buildPaymentReferenceRoute(paymentReference: string): string {
  return `${API_ROUTES.payments.references}/${encodeURIComponent(
    paymentReference,
  )}`;
}

/**
 * Builds a route for payment proof submission.
 */
export function buildPaymentProofSubmissionRoute(
  paymentReference: string,
): string {
  return `${buildPaymentReferenceRoute(paymentReference)}/submit-proof`;
}

/**
 * Builds a route for a reservation detail lookup.
 */
export function buildReservationRoute(reservationPublicId: string): string {
  return `${API_ROUTES.reservations.list}/${encodeURIComponent(
    reservationPublicId,
  )}`;
}

/**
 * Builds a route for a booking detail lookup.
 */
export function buildBookingRoute(bookingPublicId: string): string {
  return `${API_ROUTES.bookings.list}/${encodeURIComponent(bookingPublicId)}`;
}

/**
 * Builds a route for booking reschedule.
 */
export function buildBookingRescheduleRoute(bookingPublicId: string): string {
  return `${buildBookingRoute(bookingPublicId)}/reschedule`;
}

/**
 * Builds a route for a conversation detail lookup.
 */
export function buildConversationRoute(conversationPublicId: string): string {
  return `${API_ROUTES.conversations.list}/${encodeURIComponent(
    conversationPublicId,
  )}`;
}

/**
 * Builds a route for a notification detail or mutation endpoint.
 */
export function buildNotificationRoute(notificationPublicId: string): string {
  return `${API_ROUTES.notifications.list}/${encodeURIComponent(
    notificationPublicId,
  )}`;
}

/**
 * Builds a route for marking a notification as read.
 */
export function buildNotificationReadRoute(
  notificationPublicId: string,
): string {
  return `${buildNotificationRoute(notificationPublicId)}/read`;
}

/**
 * Builds a route for marking a notification as unread.
 */
export function buildNotificationUnreadRoute(
  notificationPublicId: string,
): string {
  return `${buildNotificationRoute(notificationPublicId)}/unread`;
}

/**
 * Builds a route for dismissing a notification.
 */
export function buildNotificationDismissRoute(
  notificationPublicId: string,
): string {
  return `${buildNotificationRoute(notificationPublicId)}/dismiss`;
}

/**
 * Builds a route for an AI recommendation detail lookup.
 */
export function buildRecommendationRoute(
  recommendationPublicId: string,
): string {
  return `${API_ROUTES.recommendations.list}/${encodeURIComponent(
    recommendationPublicId,
  )}`;
}

/**
 * Builds a route for AI recommendation feedback submission.
 */
export function buildRecommendationFeedbackRoute(
  recommendationPublicId: string,
): string {
  return `${buildRecommendationRoute(recommendationPublicId)}/feedback`;
}

/**
 * Builds a route for an API partner webhook detail lookup.
 */
export function buildApiPartnerWebhookRoute(webhookPublicId: string): string {
  return `${API_ROUTES.apiPartner.webhooks}/${encodeURIComponent(
    webhookPublicId,
  )}`;
}
