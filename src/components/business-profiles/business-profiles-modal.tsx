"use client";

// File: src/components/business-profiles/business-profiles-modal.tsx

/**
 * Asancha Business Profiles Modal
 *
 * Purpose:
 * Displays the current user's safe business profiles and allows eligible
 * profile switching.
 *
 * Responsibilities:
 * - Separate the active profile from other available profiles.
 * - Display profile onboarding, verification, and pending-action states.
 * - Expose the add-business-profile drawer action.
 * - Confirm that dashboard context changes before switching.
 * - Support Escape, backdrop, and close-button dismissal.
 *
 * Security notes:
 * - Profile switching eligibility comes from the backend.
 * - This modal must not infer permission from role names alone.
 * - It must not expose staff profiles, ObjectIds, internal notes, or private
 *   verification information.
 */

import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import {
    BusinessProfileCard,
    type BusinessProfileCardData,
} from "./business-profile-card";
import styles from "./business-profiles.module.css";

export interface BusinessProfilesModalProps {
    open: boolean;
    profiles: BusinessProfileCardData[];

    switchingProfilePublicId?: string | null;

    errorMessage?: string | null;
    successMessage?: string | null;

    onClose: () => void;
    onAddProfile: () => void;

    onSwitchProfile: (
        profile: BusinessProfileCardData,
    ) => void | Promise<void>;
}

export function BusinessProfilesModal({
    open,
    profiles,
    switchingProfilePublicId = null,
    errorMessage = null,
    successMessage = null,
    onClose,
    onAddProfile,
    onSwitchProfile,
}: BusinessProfilesModalProps) {
    const titleId = useId();
    const descriptionId = useId();

    const closeButtonRef =
        useRef<HTMLButtonElement>(null);

    const [profilePendingConfirmation, setProfilePendingConfirmation] =
        useState<BusinessProfileCardData | null>(
            null,
        );

    useEffect(() => {
        if (!open) {
            setProfilePendingConfirmation(null);
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const focusTimer = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (event.key === "Escape") {
                if (profilePendingConfirmation) {
                    setProfilePendingConfirmation(null);
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.clearTimeout(focusTimer);

            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [
        onClose,
        open,
        profilePendingConfirmation,
    ]);

    if (!open) {
        return null;
    }

    const activeProfile =
        profiles.find(
            (
                profile: BusinessProfileCardData,
            ): boolean => profile.isActive,
        ) ?? null;

    const otherProfiles = profiles.filter(
        (
            profile: BusinessProfileCardData,
        ): boolean => !profile.isActive,
    );

    const requestProfileSwitch = (
        profile: BusinessProfileCardData,
    ): void => {
        setProfilePendingConfirmation(profile);
    };

    const confirmProfileSwitch = (): void => {
        if (!profilePendingConfirmation) {
            return;
        }

        void onSwitchProfile(
            profilePendingConfirmation,
        );

        setProfilePendingConfirmation(null);
    };

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={styles.modalBackdrop}
            onMouseDown={handleBackdropClick}
        >
            <section
                className={styles.modalPanel}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                <header className={styles.modalHeader}>
                    <div>
                        <p className={styles.modalEyebrow}>
                            Workspace
                        </p>

                        <h2
                            id={titleId}
                            className={styles.modalTitle}
                        >
                            Business profiles
                        </h2>

                        <p
                            id={descriptionId}
                            className={styles.modalDescription}
                        >
                            Choose which profile controls your
                            dashboard, actions, documents,
                            notifications, and recommendations.
                        </p>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className={styles.closeButton}
                        aria-label="Close business profiles"
                        onClick={onClose}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <div className={styles.modalContent}>
                    {errorMessage ? (
                        <div
                            className={styles.errorMessage}
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    ) : null}

                    {successMessage ? (
                        <div
                            className={styles.successMessage}
                            role="status"
                        >
                            {successMessage}
                        </div>
                    ) : null}

                    {profiles.length === 0 ? (
                        <div className={styles.emptyProfiles}>
                            <h3>No business profile yet</h3>

                            <p>
                                Add a business profile to begin the
                                relevant onboarding process.
                            </p>
                        </div>
                    ) : (
                        <>
                            {activeProfile ? (
                                <section
                                    className={
                                        styles.profileGroupSection
                                    }
                                    aria-labelledby={`${titleId}-active`}
                                >
                                    <div
                                        className={
                                            styles.profileGroupHeader
                                        }
                                    >
                                        <h3
                                            id={`${titleId}-active`}
                                            className={
                                                styles.profileGroupTitle
                                            }
                                        >
                                            Active profile
                                        </h3>
                                    </div>

                                    <BusinessProfileCard
                                        profile={activeProfile}
                                        isSwitching={
                                            switchingProfilePublicId ===
                                            activeProfile.profilePublicId
                                        }
                                        onSwitch={
                                            requestProfileSwitch
                                        }
                                    />
                                </section>
                            ) : null}

                            {otherProfiles.length > 0 ? (
                                <section
                                    className={
                                        styles.profileGroupSection
                                    }
                                    aria-labelledby={`${titleId}-other`}
                                >
                                    <div
                                        className={
                                            styles.profileGroupHeader
                                        }
                                    >
                                        <h3
                                            id={`${titleId}-other`}
                                            className={
                                                styles.profileGroupTitle
                                            }
                                        >
                                            Other profiles
                                        </h3>

                                        <span
                                            className={
                                                styles.profileGroupCount
                                            }
                                        >
                                            {otherProfiles.length}
                                        </span>
                                    </div>

                                    <div className={styles.profileList}>
                                        {otherProfiles.map(
                                            (
                                                profile: BusinessProfileCardData,
                                            ) => (
                                                <BusinessProfileCard
                                                    key={
                                                        profile.profilePublicId
                                                    }
                                                    profile={profile}
                                                    isSwitching={
                                                        switchingProfilePublicId ===
                                                        profile.profilePublicId
                                                    }
                                                    onSwitch={
                                                        requestProfileSwitch
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </section>
                            ) : null}
                        </>
                    )}
                </div>

                <footer className={styles.modalFooter}>
                    <button
                        type="button"
                        className={styles.addProfileButton}
                        onClick={onAddProfile}
                    >
                        <span
                            className={styles.addProfileIcon}
                            aria-hidden="true"
                        >
                            +
                        </span>
                        Add new business profile
                    </button>
                </footer>

                {profilePendingConfirmation ? (
                    <div
                        className={styles.confirmationOverlay}
                    >
                        <section
                            className={styles.confirmationDialog}
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby={`${titleId}-confirmation`}
                            aria-describedby={`${titleId}-confirmation-description`}
                        >
                            <h3
                                id={`${titleId}-confirmation`}
                                className={
                                    styles.confirmationTitle
                                }
                            >
                                Switch business profile?
                            </h3>

                            <p
                                id={`${titleId}-confirmation-description`}
                                className={
                                    styles.confirmationDescription
                                }
                            >
                                You are switching to{" "}
                                <strong>
                                    {
                                        profilePendingConfirmation.displayName
                                    }
                                </strong>
                                . Your dashboard, actions, documents,
                                notifications, and recommendations may
                                change.
                            </p>

                            <div
                                className={
                                    styles.confirmationActions
                                }
                            >
                                <button
                                    type="button"
                                    className={styles.secondaryAction}
                                    onClick={() =>
                                        setProfilePendingConfirmation(
                                            null,
                                        )
                                    }
                                >
                                    Keep current profile
                                </button>

                                <button
                                    type="button"
                                    className={styles.primaryAction}
                                    onClick={confirmProfileSwitch}
                                >
                                    Switch profile
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}
            </section>
        </div>
    );
}