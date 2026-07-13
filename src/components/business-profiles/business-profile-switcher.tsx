"use client";

// File: src/components/business-profiles/business-profile-switcher.tsx

/**
 * Asancha Business Profile Switcher
 *
 * Purpose:
 * Provides the dashboard top-bar entry point for viewing, switching, and
 * adding business profiles.
 *
 * Responsibilities:
 * - Clearly display the active business profile.
 * - Open the business profiles modal.
 * - Open the add-business-profile drawer from the modal.
 * - Coordinate profile switching and overlay state.
 * - Expose responsive compact and full display modes.
 *
 * Security notes:
 * - This component does not decide whether switching is permitted.
 * - Backend-authored profile and action states must be passed through props.
 * - Staff roles must never be supplied to this public frontend component.
 */

import { useMemo, useState } from "react";

import {
    AddBusinessProfileDrawer,
    type AddBusinessProfileOption,
} from "./add-business-profile-drawer";
import {
    type BusinessProfileCardData,
    type BusinessProfileType,
} from "./business-profile-card";
import { BusinessProfilesModal } from "./business-profiles-modal";
import styles from "./business-profiles.module.css";

export interface BusinessProfileSwitcherProps {
    profiles: BusinessProfileCardData[];

    addProfileOptions?: AddBusinessProfileOption[];

    compact?: boolean;

    isLoading?: boolean;
    switchingProfilePublicId?: string | null;

    errorMessage?: string | null;
    successMessage?: string | null;

    onSwitchProfile: (
        profile: BusinessProfileCardData,
    ) => void | Promise<void>;

    onSelectAddProfile?: (
        option: AddBusinessProfileOption,
    ) => void;
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

function getInitials(displayName: string): string {
    return (
        displayName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word: string): string =>
                word.charAt(0).toUpperCase(),
            )
            .join("") || "BP"
    );
}

export function BusinessProfileSwitcher({
    profiles,
    addProfileOptions,
    compact = false,
    isLoading = false,
    switchingProfilePublicId = null,
    errorMessage = null,
    successMessage = null,
    onSwitchProfile,
    onSelectAddProfile,
}: BusinessProfileSwitcherProps) {
    const [profilesModalOpen, setProfilesModalOpen] =
        useState(false);

    const [addProfileDrawerOpen, setAddProfileDrawerOpen] =
        useState(false);

    const activeProfile = useMemo(
        (): BusinessProfileCardData | null =>
            profiles.find(
                (
                    profile: BusinessProfileCardData,
                ): boolean => profile.isActive,
            ) ??
            profiles[0] ??
            null,
        [profiles],
    );

    const openAddProfileDrawer = (): void => {
        setProfilesModalOpen(false);
        setAddProfileDrawerOpen(true);
    };

    const closeAddProfileDrawer = (): void => {
        setAddProfileDrawerOpen(false);
    };

    const handleSwitchProfile = async (
        profile: BusinessProfileCardData,
    ): Promise<void> => {
        await onSwitchProfile(profile);
    };

    const profileTypeLabel = activeProfile
        ? PROFILE_TYPE_LABELS[
        activeProfile.profileType
        ]
        : "Business profile";

    return (
        <>
            <button
                type="button"
                className={`${styles.switcherButton} ${compact ? styles.switcherCompact : ""
                    }`}
                disabled={isLoading}
                aria-haspopup="dialog"
                aria-expanded={profilesModalOpen}
                onClick={() =>
                    setProfilesModalOpen(true)
                }
            >
                <span
                    className={styles.switcherAvatar}
                    aria-hidden="true"
                >
                    {activeProfile?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            className={styles.switcherAvatarImage}
                            src={activeProfile.imageUrl}
                            alt=""
                        />
                    ) : (
                        <span
                            className={
                                styles.switcherAvatarFallback
                            }
                        >
                            {activeProfile
                                ? getInitials(
                                    activeProfile.displayName,
                                )
                                : "+"}
                        </span>
                    )}
                </span>

                {!compact ? (
                    <span className={styles.switcherContent}>
                        <span className={styles.switcherLabel}>
                            {isLoading
                                ? "Loading profile…"
                                : profileTypeLabel}
                        </span>

                        <span className={styles.switcherName}>
                            {activeProfile?.displayName ??
                                "Add a business profile"}
                        </span>
                    </span>
                ) : (
                    <span className={styles.srOnly}>
                        {activeProfile
                            ? `${profileTypeLabel}: ${activeProfile.displayName}`
                            : "Add a business profile"}
                    </span>
                )}

                {activeProfile &&
                    activeProfile.pendingActionCount > 0 ? (
                    <span
                        className={styles.switcherPendingBadge}
                        aria-label={`${activeProfile.pendingActionCount} pending actions`}
                    >
                        {activeProfile.pendingActionCount}
                    </span>
                ) : null}

                <span
                    className={styles.switcherChevron}
                    aria-hidden="true"
                >
                    ▾
                </span>
            </button>

            <BusinessProfilesModal
                open={profilesModalOpen}
                profiles={profiles}
                switchingProfilePublicId={
                    switchingProfilePublicId
                }
                errorMessage={errorMessage}
                successMessage={successMessage}
                onClose={() =>
                    setProfilesModalOpen(false)
                }
                onAddProfile={openAddProfileDrawer}
                onSwitchProfile={handleSwitchProfile}
            />

            <AddBusinessProfileDrawer
                open={addProfileDrawerOpen}
                options={addProfileOptions}
                onClose={closeAddProfileDrawer}
                onSelect={onSelectAddProfile}
            />
        </>
    );
}