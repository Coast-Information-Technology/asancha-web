// File: src/features/dashboard/schemas/dashboard.schema.ts

/**
 * Asancha Dashboard Runtime Schemas
 *
 * Purpose:
 * Provides runtime Zod validation for the backend-controlled public/user
 * dashboard-state response.
 *
 * Responsibilities:
 * - Validate active business-profile context.
 * - Validate action availability and next-step guidance.
 * - Validate dashboard summaries and attention items.
 * - Prevent malformed backend state from being trusted by client components.
 *
 * Security notes:
 * - Runtime validation does not replace backend authorization.
 * - Unknown backend fields are stripped by Zod object parsing.
 * - No internal IDs, secrets, private KYC notes, or internal admin notes are
 *   represented by this schema.
 */

import { z } from "zod";

const nullableStringSchema = z.string().nullable();

const nonNegativeIntegerSchema = z.number().int().nonnegative();

export const dashboardProfileTypeSchema = z.enum([
  "investor",
  "property_owner",
  "property_agent",
  "property_sourcer",
  "service_provider",
  "api_partner",
]);

export const dashboardActionStateSchema = z.object({
  action: z.string().trim().min(1).max(120),
  label: z.string().trim().min(1).max(160),
  availability: z.enum(["unlocked", "locked", "pending"]),
  reason: nullableStringSchema,
  nextActionLabel: nullableStringSchema,
  nextActionPath: nullableStringSchema,
  responsibleParty: z.enum(["user", "asancha", "system"]).nullable(),
  severity: z.enum(["info", "warning", "critical"]),
});

export const dashboardBusinessProfileSummarySchema = z.object({
  profilePublicId: z.string().trim().min(3).max(120),
  profileType: dashboardProfileTypeSchema,
  displayName: z.string().trim().min(1).max(160),
  imageUrl: nullableStringSchema,
  companyPublicId: nullableStringSchema,
  companyName: nullableStringSchema,
  status: z.enum(["draft", "active", "inactive", "suspended", "archived"]),
  onboardingStatus: z.enum([
    "not_started",
    "in_progress",
    "completed",
    "abandoned",
  ]),
  verificationStatus: z.enum(["pending", "approved", "rejected", "on_hold"]),
  kycStatus: z.enum([
    "not_started",
    "pending",
    "in_review",
    "approved",
    "rejected",
    "on_hold",
    "replacement_required",
  ]),
  completionPercentage: z.number().min(0).max(100),
  isActive: z.boolean(),
});

const documentStatusSummarySchema = z.object({
  required: nonNegativeIntegerSchema,
  submitted: nonNegativeIntegerSchema,
  inReview: nonNegativeIntegerSchema,
  approved: nonNegativeIntegerSchema,
  rejected: nonNegativeIntegerSchema,
  replacementRequired: nonNegativeIntegerSchema,
});

const policyStatusSummarySchema = z.object({
  required: nonNegativeIntegerSchema,
  accepted: nonNegativeIntegerSchema,
  missingPolicyTypes: z.array(z.string()),
  reacceptanceRequiredPolicyTypes: z.array(z.string()),
  isComplete: z.boolean(),
});

const paymentStatusSummarySchema = z.object({
  pending: nonNegativeIntegerSchema,
  submitted: nonNegativeIntegerSchema,
  inReview: nonNegativeIntegerSchema,
  succeeded: nonNegativeIntegerSchema,
  failed: nonNegativeIntegerSchema,
  refunded: nonNegativeIntegerSchema,
});

const notificationSummarySchema = z.object({
  unreadCount: nonNegativeIntegerSchema,
  highPriorityUnreadCount: nonNegativeIntegerSchema,
  latestNotificationAt: nullableStringSchema,
});

const recommendationSummarySchema = z.object({
  availableCount: nonNegativeIntegerSchema,
  newCount: nonNegativeIntegerSchema,
  highMatchCount: nonNegativeIntegerSchema,
  lastGeneratedAt: nullableStringSchema,
});

const bookingSummarySchema = z.object({
  upcomingCount: nonNegativeIntegerSchema,
  pendingResponseCount: nonNegativeIntegerSchema,
  nextBookingAt: nullableStringSchema,
});

const conversationSummarySchema = z.object({
  unreadConversationCount: nonNegativeIntegerSchema,
  unreadMessageCount: nonNegativeIntegerSchema,
  latestMessageAt: nullableStringSchema,
});

const reservationSummarySchema = z.object({
  activeCount: nonNegativeIntegerSchema,
  paymentPendingCount: nonNegativeIntegerSchema,
  expiringSoonCount: nonNegativeIntegerSchema,
});

const listingSummarySchema = z.object({
  draftCount: nonNegativeIntegerSchema,
  underReviewCount: nonNegativeIntegerSchema,
  publishedCount: nonNegativeIntegerSchema,
  correctionRequiredCount: nonNegativeIntegerSchema,
});

const propertySummarySchema = z.object({
  totalCount: nonNegativeIntegerSchema,
  draftCount: nonNegativeIntegerSchema,
  submittedCount: nonNegativeIntegerSchema,
  verifiedCount: nonNegativeIntegerSchema,
  flaggedCount: nonNegativeIntegerSchema,
});

const serviceSummarySchema = z.object({
  activeServiceCount: nonNegativeIntegerSchema,
  pendingReviewCount: nonNegativeIntegerSchema,
  bookingRequestCount: nonNegativeIntegerSchema,
});

const apiPartnerSummarySchema = z.object({
  applicationStatus: nullableStringSchema,
  apiClientStatus: nullableStringSchema,
  activeKeyCount: nonNegativeIntegerSchema,
  approvedScopeCount: nonNegativeIntegerSchema,
  currentPeriodRequestCount: nonNegativeIntegerSchema,
  webhookIssueCount: nonNegativeIntegerSchema,
});

const summaryCardSchema = z.object({
  key: z.string().trim().min(1).max(120),
  label: z.string().trim().min(1).max(160),
  value: z.union([z.string(), z.number()]),
  description: nullableStringSchema,
  href: nullableStringSchema,
  trendLabel: nullableStringSchema,
  trendDirection: z.enum(["up", "down", "neutral"]).nullable(),
});

const attentionItemSchema = z.object({
  key: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(180),
  message: z.string().trim().min(1).max(500),
  severity: z.enum(["info", "warning", "critical"]),
  actionLabel: nullableStringSchema,
  actionPath: nullableStringSchema,
  relatedType: nullableStringSchema,
  relatedPublicId: nullableStringSchema,
});

export const dashboardStateSchema = z
  .object({
    userPublicId: z.string().trim().min(3).max(120),

    accountStatus: z.enum([
      "pending",
      "active",
      "suspended",
      "locked",
      "deactivated",
    ]),

    emailVerificationStatus: z.enum(["unverified", "pending", "verified"]),

    generalProfileStatus: z.enum(["not_started", "in_progress", "completed"]),

    activeBusinessProfileType: dashboardProfileTypeSchema.nullable(),

    activeBusinessProfileStatus: z
      .enum(["draft", "active", "inactive", "suspended", "archived"])
      .nullable(),

    activeBusinessProfile: dashboardBusinessProfileSummarySchema.nullable(),

    availableBusinessProfiles: z.array(dashboardBusinessProfileSummarySchema),

    onboardingStatus: z.enum([
      "not_started",
      "in_progress",
      "completed",
      "abandoned",
    ]),

    verificationStatus: z
      .enum(["pending", "approved", "rejected", "on_hold"])
      .nullable(),

    kycStatus: z
      .enum([
        "not_started",
        "pending",
        "in_review",
        "approved",
        "rejected",
        "on_hold",
        "replacement_required",
      ])
      .nullable(),

    documentStatusSummary: documentStatusSummarySchema,
    policyAcceptanceStatus: policyStatusSummarySchema,
    paymentStatusSummary: paymentStatusSummarySchema,
    notificationSummary: notificationSummarySchema,

    recommendationSummary: recommendationSummarySchema.nullable(),

    bookingSummary: bookingSummarySchema,
    conversationSummary: conversationSummarySchema,

    reservationSummary: reservationSummarySchema.nullable(),
    listingSummary: listingSummarySchema.nullable(),
    propertySummary: propertySummarySchema.nullable(),
    serviceSummary: serviceSummarySchema.nullable(),
    apiPartnerSummary: apiPartnerSummarySchema.nullable(),

    lockedActions: z.array(dashboardActionStateSchema),
    unlockedActions: z.array(dashboardActionStateSchema),
    pendingActions: z.array(dashboardActionStateSchema),

    summaryCards: z.array(summaryCardSchema),
    attentionItems: z.array(attentionItemSchema),

    dashboardAccessAllowed: z.boolean(),
    sensitiveActionsAllowed: z.boolean(),
    nextPath: z.string().trim().min(1),
    generatedAt: z.string().trim().min(1),
  })
  .superRefine((state, context) => {
    if (
      state.activeBusinessProfileType !== null &&
      state.activeBusinessProfile === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["activeBusinessProfile"],
        message:
          "An active business profile summary is required when an active profile type is present.",
      });
    }

    if (
      state.activeBusinessProfile !== null &&
      state.activeBusinessProfileType !==
        state.activeBusinessProfile.profileType
    ) {
      context.addIssue({
        code: "custom",
        path: ["activeBusinessProfileType"],
        message:
          "The active profile type does not match the active profile summary.",
      });
    }

    const actionKeys = [
      ...state.lockedActions,
      ...state.unlockedActions,
      ...state.pendingActions,
    ].map((action) => action.action);

    if (new Set(actionKeys).size !== actionKeys.length) {
      context.addIssue({
        code: "custom",
        path: ["lockedActions"],
        message:
          "A dashboard action cannot appear in more than one availability group.",
      });
    }
  });

export type DashboardStateSchemaOutput = z.output<typeof dashboardStateSchema>;
