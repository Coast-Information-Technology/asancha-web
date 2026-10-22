import type { Page, Route } from "@playwright/test";
import type {
  ConversationDetail,
  ConversationMessage,
} from "../../src/features/conversations/types/conversations.types";
import type { VerificationReviewDetail } from "../../src/features/verification/types/verification.types";
import type { PaymentDetail } from "../../src/features/payments/types/payments.types";

export const timestamp = "2026-10-20T10:00:00.000Z";
export const pagination = {
  page: 1,
  pageSize: 20,
  totalItems: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
export const conversation: ConversationDetail = {
  conversationPublicId: "conv_test",
  conversationReference: "CHAT-TEST",
  conversationType: "support",
  status: "waiting_for_user",
  priority: "normal",
  subject: "Help with my property",
  target: null,
  participantCount: 2,
  participants: [],
  latestMessage: null,
  unreadMessageCount: 1,
  hasUnreadMessages: true,
  safeUserMessage: null,
  canSendMessage: true,
  canUpdate: true,
  canClose: true,
  canMarkRead: true,
  createdAt: timestamp,
  updatedAt: timestamp,
  lastMessageAt: timestamp,
  closedAt: null,
  description: null,
  actions: [],
  currentUserLastReadAt: null,
  resolvedAt: null,
  archivedAt: null,
  blockedAt: null,
};
export const message: ConversationMessage = {
  messagePublicId: "message_test",
  conversationPublicId: "conv_test",
  messageType: "staff_reply",
  status: "delivered",
  safeBody: "Please confirm the property address.",
  senderParticipantPublicId: "participant_team",
  senderUserPublicId: null,
  senderRole: "customer_care_rep",
  senderDisplayName: "Asancha team",
  isCurrentUserSender: false,
  isReadByCurrentUser: false,
  sentAt: timestamp,
  deliveredAt: timestamp,
  readAt: null,
  createdAt: timestamp,
  updatedAt: timestamp,
};
export const review: VerificationReviewDetail = {
  verificationReviewPublicId: "review_test",
  verificationReference: "VERIFY-TEST",
  verificationType: "property_ownership",
  customVerificationType: null,
  status: "correction_required",
  subject: {
    subjectType: "property",
    subjectPublicId: "property_test",
    displayName: "Test property",
    profileType: "property_owner",
    companyPublicId: null,
    companyName: null,
    detailPath: null,
  },
  relatedResource: null,
  kycStatus: "not_started",
  sourceOfFundsStatus: "not_required",
  requirementSummary: {
    total: 1,
    completed: 0,
    pending: 0,
    missing: 0,
    needsAttention: 1,
  },
  documentSummary: {
    required: 1,
    submitted: 1,
    inReview: 0,
    approved: 0,
    rejected: 0,
    onHold: 0,
    replacementRequired: 1,
  },
  correctionRequired: true,
  correctionCount: 1,
  safeUserMessage: "Please update your ownership evidence.",
  nextActionLabel: null,
  nextActionPath: null,
  canRespond: true,
  createdAt: timestamp,
  submittedAt: timestamp,
  updatedAt: timestamp,
  completedAt: null,
  description: "Ownership review",
  documentRequirements: [
    {
      requirementKey: "ownership",
      documentType: "proof_of_ownership",
      title: "Ownership evidence",
      description: "Provide the current ownership document.",
      required: true,
      status: "replacement_required",
      documentPublicId: "document_test",
      uploadPath: "/documents/upload",
      replacementPath: "/documents/document_test/replace",
      safeUserMessage: null,
    },
  ],
  correctionRequests: [
    {
      correctionKey: "correction_test",
      title: "Update ownership document",
      message: "Please replace the outdated document.",
      fieldPath: null,
      documentPublicId: "document_test",
      actionLabel: "Replace ownership evidence",
      actionPath: "/documents/document_test/replace",
      resolved: false,
      requestedAt: timestamp,
      resolvedAt: null,
    },
  ],
  actions: [],
  userResponses: [],
  timeline: [
    {
      eventPublicId: "event_test",
      eventType: "correction_requested",
      title: "Correction requested",
      description: null,
      createdAt: timestamp,
    },
  ],
  latestUserResponseAt: null,
  reviewStartedAt: timestamp,
  approvedAt: null,
  rejectedAt: null,
  onHoldAt: null,
};
export const payment: PaymentDetail = {
  paymentPublicId: "payment_test",
  paymentReference: "ASANCHA-TEST-123",
  purpose: "verification_fee",
  customPurpose: null,
  purposeLabel: "Property verification fee",
  relatedResource: null,
  payer: {
    payerUserPublicId: "user_test",
    payerProfilePublicId: "profile_test",
    payerCompanyPublicId: null,
    expectedPayerName: "Test User",
    submittedPayerName: null,
  },
  expectedAmount: 150,
  submittedAmount: null,
  paidAmount: null,
  currency: "GBP",
  status: "pending",
  referenceStatus: "active",
  reviewStatus: "not_submitted",
  paymentMethod: "bank_transfer",
  provider: "manual",
  expiresAt: null,
  paidAt: null,
  submittedAt: null,
  safeUserMessage: "Use your Asancha reference when making your transfer.",
  nextActionLabel: null,
  nextActionPath: null,
  canSubmitExternalPayment: true,
  canStartStripeCheckout: false,
  canUploadProof: true,
  createdAt: timestamp,
  updatedAt: timestamp,
  description: "Verification fee",
  bankTrace: {
    paymentMethod: null,
    bankTransactionCode: null,
    bankSessionId: null,
    paymentDescriptionUsed: null,
    paidAt: null,
  },
  proofOfPayment: null,
  actions: [],
  rejectionReason: null,
  failureReason: null,
  stripeCheckoutAvailable: false,
  approvedAt: null,
  rejectedAt: null,
  cancelledAt: null,
  expiredAt: null,
  failedAt: null,
  refundedAt: null,
};
export function collection<T>(items: T[]) {
  return {
    items,
    pagination: { ...pagination, totalItems: items.length },
    appliedFilters: {},
    unreadConversationCount: 1,
    unreadMessageCount: 1,
  };
}
export async function ok(route: Route, data: unknown) {
  await route.fulfill({
    json: { success: true, message: "Success", data, error: null, meta: {} },
  });
}
export async function fail(route: Route, status = 403) {
  await route.fulfill({
    status,
    json: {
      success: false,
      message: "Unavailable",
      data: null,
      error: { code: "NOT_ALLOWED", message: "This action is unavailable." },
      meta: {},
    },
  });
}
export async function mockWorkspace(
  page: Page,
  handle: (route: Route, path: string) => Promise<boolean | void>,
  profileType = "property_owner",
) {
  await page.context().addCookies([
    {
      name: "asancha_access_token",
      value: "browser-test-only",
      url: new URL(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001")
        .origin,
    },
  ]);
  const profile = {
    publicId: "profile_test",
    profileType,
    verificationStatus: "approved",
    isVerified: true,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    summary: { displayName: "Test owner" },
  };
  await page.route("**/api/backend/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(
      "/api/backend",
      "",
    );
    if (path === "/profiles/me/active-business-profile")
      return ok(route, { activeBusinessProfile: profile });
    if (path === "/profiles/me/business-profiles") return ok(route, [profile]);
    if (path.includes("/dashboard-state")) return fail(route, 503);
    if (path === "/policies/required")
      return ok(route, {
        missingPolicies: [],
        acceptedPolicies: [],
        allRequiredPolicies: [],
      });
    if (await handle(route, path)) return;
    await fail(route, 404);
  });
}
