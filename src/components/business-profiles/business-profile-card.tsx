"use client";

// File: src/components/business-profiles/business-profile-card.tsx

/**
 * Asancha Business Profile Card
 *
 * Purpose:
 * Displays one safe public-user business profile inside the business profiles
 * modal.
 *
 * Responsibilities:
 * - Display profile identity, type, onboarding, and verification states.
 * - Display active-profile and pending-action indicators.
 * - Expose safe switch, setup, detail, and dashboard actions.
 * - Explain why a profile cannot currently be switched to.
 *
 * Security notes:
 * - Frontend action availability is UX guidance only.
 * - Backend profile ownership, status, policy, verification, and switching
 *   rules remain authoritative.
 * - Only public profile identifiers may be passed to this component.
 * - Internal notes, ObjectIds, private KYC data, and restricted profile fields
 *   must never be rendered.
 */

import Link from "next/link";

import styles from "./business-profiles.module.css";

export type BusinessProfileType =
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider"
    | "api_partner";

export type BusinessProfileOnboardingStatus =
    | "not_started"
    | "in_progress"
    | "submitted"
    | "completed"
    | "correction_required";

export type BusinessProfileVerificationStatus =
    | "not_started"
    | "pending"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required";

export interface BusinessProfileCardData {
    profilePublicId: string;
    profileType: BusinessProfileType;

    displayName: string;
    imageUrl: string | null;

    onboardingStatus: BusinessProfileOnboardingStatus;
    verificationStatus: BusinessProfileVerificationStatus;

    pendingActionCount: number;

    isActive: boolean;
    canSwitch: boolean;
    switchLockedReason: string | null;

    detailPath: string | null;
    dashboardPath: string | null;
    continueSetupPath: string | null;
}

export interface BusinessProfileCardProps {
    profile: BusinessProfileCardData;

    isSwitching?: boolean;

    onSwitch?: (
        profile: BusinessProfileCardData,
    ) => void | Promise<void>;
}

const PROFILE_TYPE_LABELS: Record<
    BusinessProfileType,
    string
> = {
    investor: "Investor",
    property_owner: "Property Owner",
    property_agent: "Property Agent",
    property_sourcer: "Property Sourcer",
    service_provider: "Service Provider",
    api_partner: "API Partner",
};

const ONBOARDING_STATUS_LABELS: Record<
    BusinessProfileOnboardingStatus,
    string
> = {
    not_started: "Setup not started",
    in_progress: "Setup in progress",
    submitted: "Setup submitted",
    completed: "Setup complete",
    correction_required: "Setup needs attention",
};

const VERIFICATION_STATUS_LABELS: Record<
    BusinessProfileVerificationStatus,
    string
> = {
    not_started: "Verification not started",
    pending: "Verification pending",
    in_review: "Verification in review",
    approved: "Verified",
    rejected: "Verification not approved",
    on_hold: "Verification on hold",
    correction_required: "Verification needs attention",
};

function getInitials(displayName: string): string {
    const words = displayName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "BP";
    }

    return words
        .slice(0, 2)
        .map((word: string): string =>
            word.charAt(0).toUpperCase(),
        )
        .join("");
}

function getStatusClassName(
    status:
        | BusinessProfileOnboardingStatus
        | BusinessProfileVerificationStatus,
): string {
    switch (status) {
        case "approved":
        case "completed":
            return styles.statusSuccess;

        case "rejected":
        case "correction_required":
            return styles.statusDanger;

        case "on_hold":
            return styles.statusWarning;

        case "pending":
        case "in_review":
        case "submitted":
        case "in_progress":
            return styles.statusPending;

        default:
            return styles.statusNeutral;
    }
}

export function BusinessProfileCard({
    profile,
    isSwitching = false,
    onSwitch,
}: BusinessProfileCardProps) {
    const profileTypeLabel =
        PROFILE_TYPE_LABELS[profile.profileType];

    const onboardingLabel =
        ONBOARDING_STATUS_LABELS[
        profile.onboardingStatus
        ];

    const verificationLabel =
        VERIFICATION_STATUS_LABELS[
        profile.verificationStatus
        ];

    const handleSwitch = (): void => {
        if (
            profile.isActive ||
            !profile.canSwitch ||
            isSwitching ||
            !onSwitch
        ) {
            return;
        }

        void onSwitch(profile);
    };

    return (
        <article
            className={`${styles.profileCard} ${profile.isActive
                    ? styles.profileCardActive
                    : ""
                }`}
            aria-current={
                profile.isActive ? "true" : undefined
            }
        >
            <div className={styles.profileCardHeader}>
                <div className={styles.profileIdentity}>
                    <div
                        className={styles.profileAvatar}
                        aria-hidden="true"
                    >
                        {profile.imageUrl ? (
                            // A normal img is used because profile images may be served
                            // from an approved backend URL not configured for next/image.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                className={styles.profileAvatarImage}
                                src={profile.imageUrl}
                                alt=""
                            />
                        ) : (
                            <span
                                className={
                                    styles.profileAvatarFallback
                                }
                            >
                                {getInitials(profile.displayName)}
                            </span>
                        )}
                    </div>

                    <div className={styles.profileIdentityText}>
                        <div className={styles.profileTypeRow}>
                            <span className={styles.profileType}>
                                {profileTypeLabel}
                            </span>

                            {profile.isActive ? (
                                <span className={styles.activeBadge}>
                                    Active profile
                                </span>
                            ) : null}
                        </div>

                        <h3 className={styles.profileName}>
                            {profile.displayName}
                        </h3>
                    </div>
                </div>

                {profile.pendingActionCount > 0 ? (
                    <span
                        className={styles.pendingActionBadge}
                        aria-label={`${profile.pendingActionCount} pending ${profile.pendingActionCount === 1
                                ? "action"
                                : "actions"
                            }`}
                    >
                        {profile.pendingActionCount}
                    </span>
                ) : null}
            </div>

            <dl className={styles.profileStatusList}>
                <div className={styles.profileStatusItem}>
                    <dt>Onboarding</dt>
                    <dd>
                        <span
                            className={`${styles.statusBadge} ${getStatusClassName(
                                profile.onboardingStatus,
                            )}`}
                        >
                            {onboardingLabel}
                        </span>
                    </dd>
                </div>

                <div className={styles.profileStatusItem}>
                    <dt>Verification</dt>
                    <dd>
                        <span
                            className={`${styles.statusBadge} ${getStatusClassName(
                                profile.verificationStatus,
                            )}`}
                        >
                            {verificationLabel}
                        </span>
                    </dd>
                </div>
            </dl>

            {!profile.isActive &&
                !profile.canSwitch &&
                profile.switchLockedReason ? (
                <p
                    className={styles.profileLockedReason}
                    role="status"
                >
                    {profile.switchLockedReason}
                </p>
            ) : null}

            <div className={styles.profileCardActions}>
                {profile.isActive &&
                    profile.dashboardPath ? (
                    <Link
                        href={profile.dashboardPath}
                        className={styles.primaryAction}
                    >
                        Open dashboard
                    </Link>
                ) : null}

                {!profile.isActive &&
                    profile.canSwitch ? (
                    <button
                        type="button"
                        className={styles.primaryAction}
                        disabled={isSwitching}
                        onClick={handleSwitch}
                    >
                        {isSwitching
                            ? "Switching…"
                            : "Switch profile"}
                    </button>
                ) : null}

                {profile.continueSetupPath ? (
                    <Link
                        href={profile.continueSetupPath}
                        className={styles.secondaryAction}
                    >
                        Continue setup
                    </Link>
                ) : null}

                {profile.detailPath ? (
                    <Link
                        href={profile.detailPath}
                        className={styles.textAction}
                    >
                        View details
                    </Link>
                ) : null}
            </div>
        </article>
    );
}