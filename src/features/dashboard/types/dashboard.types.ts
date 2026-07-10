// File: src/features/dashboard/types/dashboard.types.ts

/**
 * Asancha Dashboard Types
 *
 * Purpose:
 * Defines the public/user dashboard contracts used to resolve the active
 * business workspace and display backend-controlled account, onboarding,
 * verification, document, policy, payment, notification, and action states.
 *
 * Responsibilities:
 * - Define supported public dashboard profile types.
 * - Define dashboard lifecycle and verification states.
 * - Define locked, unlocked, and pending action records.
 * - Define dashboard summary cards and attention items.
 * - Define role-specific navigation contracts.
 * - Define the state and actions exposed by useDashboard.
 *
 * Security notes:
 * - Dashboard navigation and disabled controls are UX guidance only.
 * - Backend authorization and resource-level permission checks remain final.
 * - MongoDB ObjectIds, private KYC notes, internal admin notes, secrets,
 *   restricted document URLs, and provider payloads must not be exposed.
 * - Dashboard access does not mean every sensitive action is approved.
 */

export type DashboardProfileType =
  | "investor"
  | "property_owner"
  | "property_agent"
  | "property_sourcer"
  | "service_provider"
  | "api_partner";

export type DashboardAccountStatus =
  "pending" | "active" | "suspended" | "locked" | "deactivated";

export type DashboardEmailVerificationStatus =
  "unverified" | "pending" | "verified";

export type DashboardGeneralProfileStatus =
  "not_started" | "in_progress" | "completed";

export type DashboardBusinessProfileStatus =
  "draft" | "active" | "inactive" | "suspended" | "archived";

export type DashboardOnboardingStatus =
  "not_started" | "in_progress" | "completed" | "abandoned";

export type DashboardVerificationStatus =
  "pending" | "approved" | "rejected" | "on_hold";

export type DashboardKycStatus =
  | "not_started"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "on_hold"
  | "replacement_required";

export type DashboardActionAvailability = "unlocked" | "locked" | "pending";

export type DashboardActionResponsibility =
  "user" | "asancha" | "system" | null;

export type DashboardActionSeverity = "info" | "warning" | "critical";

export type DashboardRequestState =
  "idle" | "loading" | "refreshing" | "success" | "error";

export type DashboardNavigationIcon =
  | "layout-dashboard"
  | "search"
  | "bookmark"
  | "sparkles"
  | "brain"
  | "calendar-check"
  | "calendar"
  | "credit-card"
  | "file-text"
  | "badge-check"
  | "settings"
  | "map-pin"
  | "building"
  | "home"
  | "list"
  | "messages-square"
  | "briefcase-business"
  | "shield-check"
  | "clipboard-check"
  | "code-xml"
  | "key-round"
  | "chart-no-axes-combined"
  | "webhook"
  | "book-open"
  | "bell"
  | "user-round";

export interface DashboardActionState {
  action: string;
  label: string;
  availability: DashboardActionAvailability;
  reason: string | null;
  nextActionLabel: string | null;
  nextActionPath: string | null;
  responsibleParty: DashboardActionResponsibility;
  severity: DashboardActionSeverity;
}

export interface DashboardDocumentStatusSummary {
  required: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  replacementRequired: number;
}

export interface DashboardPolicyStatusSummary {
  required: number;
  accepted: number;
  missingPolicyTypes: string[];
  reacceptanceRequiredPolicyTypes: string[];
  isComplete: boolean;
}

export interface DashboardPaymentStatusSummary {
  pending: number;
  submitted: number;
  inReview: number;
  succeeded: number;
  failed: number;
  refunded: number;
}

export interface DashboardNotificationSummary {
  unreadCount: number;
  highPriorityUnreadCount: number;
  latestNotificationAt: string | null;
}

export interface DashboardRecommendationSummary {
  availableCount: number;
  newCount: number;
  highMatchCount: number;
  lastGeneratedAt: string | null;
}

export interface DashboardBookingSummary {
  upcomingCount: number;
  pendingResponseCount: number;
  nextBookingAt: string | null;
}

export interface DashboardConversationSummary {
  unreadConversationCount: number;
  unreadMessageCount: number;
  latestMessageAt: string | null;
}

export interface DashboardReservationSummary {
  activeCount: number;
  paymentPendingCount: number;
  expiringSoonCount: number;
}

export interface DashboardListingSummary {
  draftCount: number;
  underReviewCount: number;
  publishedCount: number;
  correctionRequiredCount: number;
}

export interface DashboardPropertySummary {
  totalCount: number;
  draftCount: number;
  submittedCount: number;
  verifiedCount: number;
  flaggedCount: number;
}

export interface DashboardServiceSummary {
  activeServiceCount: number;
  pendingReviewCount: number;
  bookingRequestCount: number;
}

export interface DashboardApiPartnerSummary {
  applicationStatus: string | null;
  apiClientStatus: string | null;
  activeKeyCount: number;
  approvedScopeCount: number;
  currentPeriodRequestCount: number;
  webhookIssueCount: number;
}

export interface DashboardBusinessProfileSummary {
  profilePublicId: string;
  profileType: DashboardProfileType;
  displayName: string;
  imageUrl: string | null;
  companyPublicId: string | null;
  companyName: string | null;
  status: DashboardBusinessProfileStatus;
  onboardingStatus: DashboardOnboardingStatus;
  verificationStatus: DashboardVerificationStatus;
  kycStatus: DashboardKycStatus;
  completionPercentage: number;
  isActive: boolean;
}

export interface DashboardSummaryCard {
  key: string;
  label: string;
  value: string | number;
  description: string | null;
  href: string | null;
  trendLabel: string | null;
  trendDirection: "up" | "down" | "neutral" | null;
}

export interface DashboardAttentionItem {
  key: string;
  title: string;
  message: string;
  severity: DashboardActionSeverity;
  actionLabel: string | null;
  actionPath: string | null;
  relatedType: string | null;
  relatedPublicId: string | null;
}

export interface DashboardState {
  userPublicId: string;
  accountStatus: DashboardAccountStatus;
  emailVerificationStatus: DashboardEmailVerificationStatus;
  generalProfileStatus: DashboardGeneralProfileStatus;

  activeBusinessProfileType: DashboardProfileType | null;
  activeBusinessProfileStatus: DashboardBusinessProfileStatus | null;
  activeBusinessProfile: DashboardBusinessProfileSummary | null;
  availableBusinessProfiles: DashboardBusinessProfileSummary[];

  onboardingStatus: DashboardOnboardingStatus;
  verificationStatus: DashboardVerificationStatus | null;
  kycStatus: DashboardKycStatus | null;

  documentStatusSummary: DashboardDocumentStatusSummary;
  policyAcceptanceStatus: DashboardPolicyStatusSummary;
  paymentStatusSummary: DashboardPaymentStatusSummary;
  notificationSummary: DashboardNotificationSummary;
  recommendationSummary: DashboardRecommendationSummary | null;
  bookingSummary: DashboardBookingSummary;
  conversationSummary: DashboardConversationSummary;
  reservationSummary: DashboardReservationSummary | null;
  listingSummary: DashboardListingSummary | null;
  propertySummary: DashboardPropertySummary | null;
  serviceSummary: DashboardServiceSummary | null;
  apiPartnerSummary: DashboardApiPartnerSummary | null;

  lockedActions: DashboardActionState[];
  unlockedActions: DashboardActionState[];
  pendingActions: DashboardActionState[];

  summaryCards: DashboardSummaryCard[];
  attentionItems: DashboardAttentionItem[];

  dashboardAccessAllowed: boolean;
  sensitiveActionsAllowed: boolean;
  nextPath: string;
  generatedAt: string;
}

export interface DashboardNavigationItem {
  key: string;
  label: string;
  href: string;
  icon: DashboardNavigationIcon;
  exact?: boolean;
  requiredAction?: string;
  badgeKey?: string;
}

export interface DashboardNavigationGroup {
  key: string;
  label: string | null;
  items: DashboardNavigationItem[];
}

export interface DashboardHookState {
  requestState: DashboardRequestState;
  dashboardState: DashboardState | null;
  activeProfile: DashboardBusinessProfileSummary | null;
  navigation: DashboardNavigationGroup[];
  errorMessage: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastLoadedAt: number | null;
}

export interface DashboardHookActions {
  loadDashboard: () => Promise<DashboardState | null>;
  refreshDashboard: () => Promise<DashboardState | null>;
  clearError: () => void;
  reset: () => void;
  isActionUnlocked: (action: string) => boolean;
  getActionState: (action: string) => DashboardActionState | null;
}

export type UseDashboardResult = DashboardHookState & DashboardHookActions;
