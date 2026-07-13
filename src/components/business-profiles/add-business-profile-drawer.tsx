"use client";

// File: src/components/business-profiles/add-business-profile-drawer.tsx

/**
 * Asancha Add Business Profile Drawer
 *
 * Purpose:
 * Allows an existing user to choose another approved business profile type
 * before entering the add-profile onboarding flow.
 *
 * Responsibilities:
 * - Display approved additional public business profile types.
 * - Exclude guest and all internal staff roles.
 * - Explain duplicate or unavailable profile restrictions.
 * - Route selected profile types to the add-profile route.
 * - Keep API partner access on its controlled application route.
 *
 * Security notes:
 * - Profile availability and duplicate restrictions must come from the
 *   backend.
 * - Frontend filtering is not authorisation.
 * - Staff roles must never appear in this public-user drawer.
 */

import {
    useEffect,
    useId,
    useRef,
} from "react";
import { useRouter } from "next/navigation";

import type { BusinessProfileType } from "./business-profile-card";
import styles from "./business-profiles.module.css";

export interface AddBusinessProfileOption {
    profileType: BusinessProfileType;
    title: string;
    description: string;

    available: boolean;
    unavailableReason: string | null;

    route?: string;
}

export interface AddBusinessProfileDrawerProps {
    open: boolean;

    options?: AddBusinessProfileOption[];

    onClose: () => void;

    onSelect?: (
        option: AddBusinessProfileOption,
    ) => void;
}

const DEFAULT_PROFILE_OPTIONS: AddBusinessProfileOption[] =
    [
        {
            profileType: "investor",
            title: "Investor",
            description:
                "Discover opportunities, save deals, receive recommendations, make reservations, and manage investment activity.",
            available: true,
            unavailableReason: null,
        },
        {
            profileType: "property_owner",
            title: "Property Owner",
            description:
                "Add properties, manage ownership information, create listings, and track property activity.",
            available: true,
            unavailableReason: null,
        },
        {
            profileType: "property_agent",
            title: "Property Agent",
            description:
                "Represent property owners, manage company-linked properties, listings, authority documents, and enquiries.",
            available: true,
            unavailableReason: null,
        },
        {
            profileType: "property_sourcer",
            title: "Property Sourcer",
            description:
                "Create investment opportunities, submit deal information, manage compliance, and track deal performance.",
            available: true,
            unavailableReason: null,
        },
        {
            profileType: "service_provider",
            title: "Service Provider",
            description:
                "Create a professional service profile, manage services, availability, bookings, and customer conversations.",
            available: true,
            unavailableReason: null,
        },
        {
            profileType: "api_partner",
            title: "API Partner",
            description:
                "Apply for controlled partner access, approved scopes, API keys, usage reporting, and webhooks.",
            available: true,
            unavailableReason: null,
            route: "/api-partner/apply",
        },
    ];

export function AddBusinessProfileDrawer({
    open,
    options = DEFAULT_PROFILE_OPTIONS,
    onClose,
    onSelect,
}: AddBusinessProfileDrawerProps) {
    const router = useRouter();

    const titleId = useId();
    const descriptionId = useId();

    const closeButtonRef =
        useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) {
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
                onClose();
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
    }, [onClose, open]);

    if (!open) {
        return null;
    }

    const handleSelect = (
        option: AddBusinessProfileOption,
    ): void => {
        if (!option.available) {
            return;
        }

        if (onSelect) {
            onSelect(option);
            return;
        }

        const targetRoute =
            option.route ??
            `/account/business-profiles/add?type=${encodeURIComponent(
                option.profileType,
            )}`;

        onClose();
        router.push(targetRoute);
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
            className={styles.drawerBackdrop}
            onMouseDown={handleBackdropClick}
        >
            <aside
                className={styles.drawerPanel}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                <header className={styles.drawerHeader}>
                    <div>
                        <p className={styles.modalEyebrow}>
                            Add profile
                        </p>

                        <h2
                            id={titleId}
                            className={styles.drawerTitle}
                        >
                            Which business profile would you like
                            to add?
                        </h2>

                        <p
                            id={descriptionId}
                            className={styles.drawerDescription}
                        >
                            You will keep your existing login.
                            Profile-specific policies and onboarding
                            will follow after your selection.
                        </p>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className={styles.closeButton}
                        aria-label="Close add business profile drawer"
                        onClick={onClose}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <div className={styles.drawerContent}>
                    <div className={styles.profileOptionList}>
                        {options.map(
                            (
                                option: AddBusinessProfileOption,
                            ) => (
                                <button
                                    key={option.profileType}
                                    type="button"
                                    className={`${styles.profileOption} ${!option.available
                                            ? styles.profileOptionDisabled
                                            : ""
                                        }`}
                                    disabled={!option.available}
                                    aria-disabled={!option.available}
                                    onClick={() =>
                                        handleSelect(option)
                                    }
                                >
                                    <span
                                        className={
                                            styles.profileOptionIcon
                                        }
                                        aria-hidden="true"
                                    >
                                        {option.title
                                            .split(/\s+/)
                                            .slice(0, 2)
                                            .map(
                                                (word: string): string =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase(),
                                            )
                                            .join("")}
                                    </span>

                                    <span
                                        className={
                                            styles.profileOptionContent
                                        }
                                    >
                                        <span
                                            className={
                                                styles.profileOptionTitle
                                            }
                                        >
                                            {option.title}
                                        </span>

                                        <span
                                            className={
                                                styles.profileOptionDescription
                                            }
                                        >
                                            {option.description}
                                        </span>

                                        {!option.available &&
                                            option.unavailableReason ? (
                                            <span
                                                className={
                                                    styles.profileOptionReason
                                                }
                                            >
                                                {option.unavailableReason}
                                            </span>
                                        ) : null}
                                    </span>

                                    <span
                                        className={
                                            styles.profileOptionArrow
                                        }
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </button>
                            ),
                        )}
                    </div>

                    <div className={styles.drawerNotice}>
                        <strong>
                            You do not need another account.
                        </strong>

                        <span>
                            New profiles remain connected to your
                            current Asancha login.
                        </span>
                    </div>
                </div>
            </aside>
        </div>
    );
}