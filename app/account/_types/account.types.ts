// File: app/account/_types/account.types.ts

/**
 * Asancha Account Types
 *
 * Purpose:
 * Defines safe authenticated account, profile, policy, security, notification,
 * support, status, and business-profile contracts.
 *
 * Security notes:
 * - Only public IDs may appear.
 * - Password hashes, token hashes, raw session tokens, ObjectIds, private KYC
 *   notes, internal staff notes, provider secrets, and private document URLs
 *   must never appear.
 */

import type {
    DashboardOnboardingStatus,
    DashboardVerificationStatus,
} from "../../dashboard/_types/dashboard.types";

export type AccountBusinessProfileType =
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider"
    | "api_partner";

export interface AccountBusinessProfileSummary {
    profilePublicId: string;
    profileType: AccountBusinessProfileType;

    displayName: string;

    onboardingStatus:
        DashboardOnboardingStatus;

    verificationStatus:
        DashboardVerificationStatus;

    lifecycleStatus: string;

    isActive: boolean;
    canSwitch: boolean;
    canEdit: boolean;

    pendingActionCount: number;

    dashboardPath: string | null;
    detailPath: string;
    continueSetupPath: string | null;

    switchLockedReason: string | null;
    safeUserMessage: string | null;
}

export interface AccountOverview {
    userPublicId: string;

    email: string;
    phoneNumber: string | null;

    accountStatus: string;
    emailVerificationStatus: string;

    onboardingStatus:
        DashboardOnboardingStatus;

    activeBusinessProfile:
        AccountBusinessProfileSummary | null;

    availableBusinessProfiles:
        AccountBusinessProfileSummary[];

    policyAcceptanceSummary: {
        complete: boolean;
        acceptedCount: number;
        missingCount: number;
        outdatedCount: number;
    };

    verificationSummary: {
        status:
            DashboardVerificationStatus;

        pendingReviewCount: number;
        correctionRequiredCount: number;
    };

    documentSummary: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        replacementRequired: number;
    };

    paymentSummary: {
        total: number;
        pending: number;
        submitted: number;
        approved: number;
        rejected: number;
    };

    safeUserMessage: string | null;
}

export interface AccountGeneralProfile {
    profilePublicId: string;

    firstName: string;
    lastName: string;

    displayName: string;

    phoneNumber: string | null;

    dateOfBirth: string | null;

    address: {
        addressLine1: string;
        addressLine2: string | null;
        townCity: string;
        county: string | null;
        postcode: string;
        country: string;
    };

    completionStatus:
        | "not_started"
        | "in_progress"
        | "completed";

    canEdit: boolean;

    safeUserMessage: string | null;

    updatedAt: string | null;
}

export interface AccountGeneralProfileFormValues {
    firstName: string;
    lastName: string;

    displayName: string;

    phoneNumber: string | null;
    dateOfBirth: string | null;

    address: {
        addressLine1: string;
        addressLine2: string | null;
        townCity: string;
        county: string | null;
        postcode: string;
        country: string;
    };

    informationAccurateConfirmed: boolean;
}

export interface AccountPolicyAcceptance {
    policyAcceptancePublicId: string;

    policyType: string;
    policyTitle: string;

    policyVersion: string;
    currentVersion: string | null;

    profileType:
        AccountBusinessProfileType | null;

    accepted: boolean;
    current: boolean;

    acceptedAt: string | null;

    source: string;

    requiresAction: boolean;

    actionPath: string | null;

    safeUserMessage: string | null;
}

export interface AccountPolicyAcceptanceResponse {
    items: AccountPolicyAcceptance[];

    summary: {
        complete: boolean;
        acceptedCount: number;
        missingCount: number;
        outdatedCount: number;
    };

    safeUserMessage: string | null;
}

export interface AccountSecuritySummary {
    email: string;
    emailVerificationStatus: string;

    passwordConfigured: boolean;

    activeSessionCount: number;

    recentFailedLoginCount: number;

    securityNotificationCount: number;

    canChangePassword: boolean;
    canRequestEmailChange: boolean;

    safeUserMessage: string | null;
}

export interface AccountSession {
    sessionPublicId: string;

    deviceName: string;
    browserName: string | null;
    operatingSystem: string | null;

    approximateLocation: string | null;

    ipAddressMasked: string | null;

    current: boolean;

    createdAt: string;
    lastUsedAt: string;

    expiresAt: string | null;

    canRevoke: boolean;
}

export interface AccountLoginActivity {
    activityPublicId: string;

    eventType:
        | "login_success"
        | "login_failure"
        | "logout"
        | "password_changed"
        | "password_reset"
        | "email_change_requested"
        | "email_changed"
        | "session_revoked"
        | string;

    deviceName: string | null;

    browserName: string | null;

    approximateLocation: string | null;

    ipAddressMasked: string | null;

    successful: boolean;

    occurredAt: string;
}

export interface AccountSecurityNotification {
    notificationPublicId: string;

    title: string;
    message: string;

    severity:
        | "information"
        | "warning"
        | "critical";

    read: boolean;

    actionLabel: string | null;
    actionPath: string | null;

    createdAt: string;
}

export interface AccountSecurityResponse {
    summary: AccountSecuritySummary;

    sessions: AccountSession[];

    loginActivity:
        AccountLoginActivity[];

    securityNotifications:
        AccountSecurityNotification[];
}

export interface AccountNotificationPreference {
    preferenceKey: string;

    label: string;
    description: string;

    category:
        | "account"
        | "security"
        | "profiles"
        | "documents"
        | "verification"
        | "listings"
        | "reservations"
        | "payments"
        | "bookings"
        | "conversations"
        | "api"
        | "recommendations"
        | string;

    inAppEnabled: boolean;
    emailEnabled: boolean;

    required: boolean;
}

export interface AccountNotificationPreferencesResponse {
    items:
        AccountNotificationPreference[];

    emailAddress: string;

    safeUserMessage: string | null;
}

export interface AccountStatusResponse {
    accountStatus: string;
    emailVerificationStatus: string;

    generalProfileStatus: string;

    onboardingStatus:
        DashboardOnboardingStatus;

    verificationStatus:
        DashboardVerificationStatus;

    activeBusinessProfileType:
        AccountBusinessProfileType | null;

    suspended: boolean;
    suspensionMessage: string | null;

    policyAcceptanceStatus: {
        complete: boolean;
        missingCount: number;
        outdatedCount: number;
    };

    documentStatusSummary: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        replacementRequired: number;
    };

    paymentStatusSummary: {
        total: number;
        pending: number;
        submitted: number;
        approved: number;
        rejected: number;
    };

    lockedActions: Array<{
        actionKey: string;
        title: string;
        lockedReason: string | null;
        actionLabel: string | null;
        actionPath: string | null;
    }>;

    safeUserMessage: string | null;
}

export interface AccountSupportRequestFormValues {
    category:
        | "account"
        | "profile"
        | "verification"
        | "documents"
        | "payments"
        | "bookings"
        | "conversations"
        | "listings"
        | "api_partner"
        | "technical"
        | "other";

    subject: string;
    message: string;

    relatedType: string | null;
    relatedPublicId: string | null;

    preferredContactMethod:
        | "email"
        | "phone";

    informationAccurateConfirmed: boolean;
}

export interface AccountSupportRequestResult {
    supportRequestPublicId: string;

    status: string;

    message: string;
}

export interface AvailableBusinessProfileType {
    profileType:
        AccountBusinessProfileType;

    available: boolean;

    alreadyCreated: boolean;

    requiresCompany: boolean;

    companyOptional: boolean;

    lockedReason: string | null;

    requiredPolicies: Array<{
        policyType: string;
        policyTitle: string;
        policyVersion: string;
        summary: string;
        accepted: boolean;
    }>;
}

export interface AvailableBusinessProfileTypesResponse {
    items:
        AvailableBusinessProfileType[];

    safeUserMessage: string | null;
}

export interface CreateBusinessProfileFormValues {
    profileType:
        AccountBusinessProfileType | "";

    companyPublicId: string | null;

    acceptedPolicies: Array<{
        policyType: string;
        policyVersion: string;
        accepted: boolean;
    }>;
}

export interface CreateBusinessProfileResult {
    profile:
        AccountBusinessProfileSummary;

    onboardingPath: string | null;

    message: string;
}

export interface BusinessProfileDetail {
    profile:
        AccountBusinessProfileSummary;

    statusSummary: {
        onboardingStatus:
            DashboardOnboardingStatus;

        verificationStatus:
            DashboardVerificationStatus;

        documentStatus: string;
        policyStatus: string;
        paymentStatus: string;
    };

    actions: Array<{
        actionKey: string;
        label: string;

        allowed: boolean;
        lockedReason: string | null;

        path: string | null;
    }>;

    recentActivity: Array<{
        activityPublicId: string;

        title: string;
        description: string | null;

        occurredAt: string;
    }>;

    safeUserMessage: string | null;
}

export type UpdateAccountGeneralProfilePayload =
    Record<string, unknown> & {
        data:
            AccountGeneralProfileFormValues;
    };

export type ChangePasswordPayload =
    Record<string, unknown> & {
        data: {
            currentPassword: string;
            newPassword: string;
            confirmNewPassword: string;
        };
    };

export type RequestEmailChangePayload =
    Record<string, unknown> & {
        data: {
            newEmail: string;
            currentPassword: string | null;
        };
    };

export type UpdateNotificationPreferencesPayload =
    Record<string, unknown> & {
        data: {
            preferences: Array<{
                preferenceKey: string;
                inAppEnabled: boolean;
                emailEnabled: boolean;
            }>;
        };
    };

export type CreateSupportRequestPayload =
    Record<string, unknown> & {
        data:
            AccountSupportRequestFormValues;
    };

export type CreateBusinessProfilePayload =
    Record<string, unknown> & {
        data: {
            profileType:
                AccountBusinessProfileType;

            companyPublicId:
                string | null;

            acceptedPolicies: Array<{
                policyType: string;
                policyVersion: string;
                accepted: boolean;
            }>;
        };
    };