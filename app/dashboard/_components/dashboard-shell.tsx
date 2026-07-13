"use client";

// File: app/dashboard/_components/dashboard-shell.tsx

/**
 * Asancha Protected Dashboard Shell
 *
 * Purpose:
 * Provides the authenticated dashboard top bar, role-specific sidebar, mobile
 * navigation, and active-business-profile context.
 *
 * Responsibilities:
 * - Load backend-authored dashboard state.
 * - Display the active business profile.
 * - Render investor and property-owner navigation.
 * - Switch the active business profile through the authenticated profile API.
 * - Refresh dashboard state after a successful profile switch.
 * - Route the user to the selected profile's protected dashboard.
 * - Display pending-action and notification indicators.
 * - Provide responsive desktop and mobile dashboard navigation.
 *
 * Security notes:
 * - Frontend route visibility is not authorisation.
 * - Backend dashboard state remains the source of truth.
 * - Profile switching must be authorised and audited by the backend.
 * - Switching must not bypass policy, verification, company-membership,
 *   account-status, or lifecycle requirements.
 * - Only public profile IDs may be submitted.
 * - Staff roles must not use this public application.
 */

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type MouseEvent,
    type ReactNode,
} from "react";
import {
    usePathname,
    useRouter,
} from "next/navigation";

import type {
    BusinessProfileCardData,
} from "../../../src/components/business-profiles/business-profile-card";
import { BusinessProfileSwitcher } from "../../../src/components/business-profiles/business-profile-switcher";
import {
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import {
    INVESTOR_NAVIGATION,
    type InvestorNavigationItem,
} from "../_config/investor-dashboard.config";
import {
    PROPERTY_OWNER_NAVIGATION,
    type PropertyOwnerNavigationItem,
} from "../_config/property-owner-dashboard.config";
import type {
    DashboardBusinessProfile,
    DashboardState,
    PublicBusinessProfileType,
} from "../_types/dashboard.types";

export interface DashboardShellProps {
    children: ReactNode;
}

interface SwitchBusinessProfilePayload
    extends Record<string, unknown> {
    data: {
        profilePublicId: string;
    };
}

interface SwitchBusinessProfileResult {
    activeBusinessProfile:
    DashboardBusinessProfile;

    dashboardPath: string | null;

    switched: true;

    message: string;
}

const DASHBOARD_PATHS: Record<
    PublicBusinessProfileType,
    string
> = {
    investor: "/dashboard/investor",

    property_owner:
        "/dashboard/property-owner",

    property_agent:
        "/dashboard/property-agent",

    property_sourcer:
        "/dashboard/property-sourcer",

    service_provider:
        "/dashboard/service-provider",

    api_partner:
        "/api-partner/dashboard",
};

const SAFE_MESSAGES = {
    dashboardLoadError:
        "We could not load your dashboard state. Refresh the page or sign in again.",

    profileSwitchError:
        "We could not switch your business profile. Review the profile requirements and try again.",

    unsupportedProfile:
        "The selected business profile does not have an available dashboard.",

    profileSwitchSuccess:
        "Your active business profile has been changed.",
} as const;

function toBusinessProfileCardData(
    profile: DashboardBusinessProfile,
): BusinessProfileCardData {
    return {
        profilePublicId:
            profile.profilePublicId,

        profileType:
            profile.profileType,

        displayName:
            profile.displayName,

        imageUrl:
            profile.imageUrl,

        onboardingStatus:
            profile.onboardingStatus,

        verificationStatus:
            profile.verificationStatus,

        pendingActionCount:
            profile.pendingActionCount,

        isActive:
            profile.isActive,

        canSwitch:
            profile.canSwitch,

        switchLockedReason:
            profile.switchLockedReason,

        detailPath:
            profile.detailPath,

        dashboardPath:
            profile.dashboardPath,

        continueSetupPath:
            profile.continueSetupPath,
    };
}

function isInvestorNavigationItemActive(
    pathname: string,
    item: InvestorNavigationItem,
): boolean {
    if (item.exactMatch) {
        return pathname === item.href;
    }

    return (
        pathname === item.href ||
        pathname.startsWith(
            `${item.href}/`,
        )
    );
}

function isPropertyOwnerNavigationItemActive(
    pathname: string,
    item: PropertyOwnerNavigationItem,
): boolean {
    if (item.exactMatch) {
        return pathname === item.href;
    }

    return (
        pathname === item.href ||
        pathname.startsWith(
            `${item.href}/`,
        )
    );
}

function getNotificationCountLabel(
    unreadCount: number,
): string {
    if (unreadCount > 99) {
        return "99+";
    }

    return String(unreadCount);
}

function getWorkspaceLabel(
    profileType:
        | PublicBusinessProfileType
        | null
        | undefined,
): string {
    switch (profileType) {
        case "investor":
            return "Investor workspace";

        case "property_owner":
            return "Property owner workspace";

        case "property_agent":
            return "Property agent workspace";

        case "property_sourcer":
            return "Property sourcer workspace";

        case "service_provider":
            return "Service provider workspace";

        case "api_partner":
            return "API partner workspace";

        default:
            return "Dashboard";
    }
}

export function DashboardShell({
    children,
}: DashboardShellProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [
        dashboardState,
        setDashboardState,
    ] = useState<DashboardState | null>(
        null,
    );

    const [
        mobileNavigationOpen,
        setMobileNavigationOpen,
    ] = useState(false);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        switchingProfilePublicId,
        setSwitchingProfilePublicId,
    ] = useState<string | null>(null);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    const loadDashboardState =
        useCallback(
            async (): Promise<
                DashboardState | null
            > => {
                setIsLoading(true);
                setErrorMessage(null);

                try {
                    const state =
                        await authApiGet<DashboardState>(
                            "/me/dashboard-state",
                        );

                    setDashboardState(state);

                    return state;
                } catch {
                    setErrorMessage(
                        SAFE_MESSAGES
                            .dashboardLoadError,
                    );

                    return null;
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );

    useEffect((): void => {
        void loadDashboardState();
    }, [loadDashboardState]);

    useEffect((): void => {
        setMobileNavigationOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileNavigationOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (event.key === "Escape") {
                setMobileNavigationOpen(
                    false,
                );
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [mobileNavigationOpen]);

    const profileCards = useMemo(
        (): BusinessProfileCardData[] =>
            dashboardState
                ?.availableBusinessProfiles
                .map(
                    (
                        profile:
                            DashboardBusinessProfile,
                    ): BusinessProfileCardData =>
                        toBusinessProfileCardData(
                            profile,
                        ),
                ) ?? [],
        [dashboardState],
    );

    const activeProfileType:
        | PublicBusinessProfileType
        | null
        | undefined =
        dashboardState
            ?.activeBusinessProfileType;

    const unreadNotificationCount:
        number =
        dashboardState
            ?.investorSummary
            ?.unreadNotificationCount ??
        0;

    const workspaceLabel: string =
        getWorkspaceLabel(
            activeProfileType,
        );

    const handleProfileSwitch =
        async (
            profile:
                BusinessProfileCardData,
        ): Promise<void> => {
            if (
                profile.isActive ||
                !profile.canSwitch ||
                switchingProfilePublicId !==
                null
            ) {
                return;
            }

            setSwitchingProfilePublicId(
                profile.profilePublicId,
            );

            setErrorMessage(null);
            setSuccessMessage(null);

            const payload:
                SwitchBusinessProfilePayload = {
                data: {
                    profilePublicId:
                        profile.profilePublicId,
                },
            };

            try {
                const result =
                    await authApiPost<SwitchBusinessProfileResult>(
                        "/profiles/me/switch",
                        payload,
                    );

                setSuccessMessage(
                    result.message ||
                    SAFE_MESSAGES
                        .profileSwitchSuccess,
                );

                const refreshedState =
                    await loadDashboardState();

                const resolvedProfileType:
                    PublicBusinessProfileType =
                    refreshedState
                        ?.activeBusinessProfileType ??
                    result
                        .activeBusinessProfile
                        .profileType;

                const configuredDashboardPath:
                    string | undefined =
                    DASHBOARD_PATHS[
                    resolvedProfileType
                    ];

                const targetPath:
                    string | null =
                    result.dashboardPath ??
                    refreshedState
                        ?.activeBusinessProfile
                        ?.dashboardPath ??
                    configuredDashboardPath ??
                    null;

                if (!targetPath) {
                    setErrorMessage(
                        SAFE_MESSAGES
                            .unsupportedProfile,
                    );

                    return;
                }

                router.push(targetPath);
                router.refresh();
            } catch {
                setErrorMessage(
                    SAFE_MESSAGES
                        .profileSwitchError,
                );
            } finally {
                setSwitchingProfilePublicId(
                    null,
                );
            }
        };

    const handleMobileBackdropMouseDown =
        (
            event:
                MouseEvent<HTMLDivElement>,
        ): void => {
            if (
                event.target ===
                event.currentTarget
            ) {
                setMobileNavigationOpen(
                    false,
                );
            }
        };

    const renderLoadingNavigation =
        (): ReactNode => (
            <div
                className="grid gap-2"
                aria-label="Loading dashboard navigation"
            >
                {Array.from({
                    length: 8,
                }).map(
                    (
                        _value: unknown,
                        index: number,
                    ): ReactNode => (
                        <div
                            key={index}
                            className="h-10 animate-pulse rounded-[var(--asancha-radius-md)] bg-[var(--muted)]"
                        />
                    ),
                )}
            </div>
        );

    const renderInvestorNavigation =
        (): ReactNode => (
            <nav
                aria-label="Investor workspace"
                className="grid gap-1"
            >
                {INVESTOR_NAVIGATION.map(
                    (
                        item:
                            InvestorNavigationItem,
                    ): ReactNode => {
                        const active:
                            boolean =
                            isInvestorNavigationItemActive(
                                pathname,
                                item,
                            );

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={
                                    item.description
                                }
                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }
                                className={`rounded-[var(--asancha-radius-md)] px-3 py-2.5 text-sm font-medium transition-colors ${active
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    },
                )}
            </nav>
        );

    const renderPropertyOwnerNavigation =
        (): ReactNode => (
            <nav
                aria-label="Property owner workspace"
                className="grid gap-1"
            >
                {PROPERTY_OWNER_NAVIGATION.map(
                    (
                        item:
                            PropertyOwnerNavigationItem,
                    ): ReactNode => {
                        const active:
                            boolean =
                            isPropertyOwnerNavigationItemActive(
                                pathname,
                                item,
                            );

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={
                                    item.description
                                }
                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }
                                className={`rounded-[var(--asancha-radius-md)] px-3 py-2.5 text-sm font-medium transition-colors ${active
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    },
                )}
            </nav>
        );

    const renderNavigation =
        (): ReactNode => {
            if (isLoading) {
                return renderLoadingNavigation();
            }

            switch (activeProfileType) {
                case "investor":
                    return renderInvestorNavigation();

                case "property_owner":
                    return renderPropertyOwnerNavigation();

                case "property_agent":
                case "property_sourcer":
                case "service_provider":
                    return (
                        <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                            Navigation for this business
                            profile will become available
                            when its dashboard routes are
                            implemented.
                        </div>
                    );

                case "api_partner":
                    return (
                        <nav
                            aria-label="API partner workspace"
                            className="grid gap-1"
                        >
                            <Link
                                href="/api-partner/dashboard"
                                aria-current={
                                    pathname ===
                                        "/api-partner/dashboard"
                                        ? "page"
                                        : undefined
                                }
                                className={`rounded-[var(--asancha-radius-md)] px-3 py-2.5 text-sm font-medium transition-colors ${pathname ===
                                        "/api-partner/dashboard"
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    }`}
                            >
                                API partner dashboard
                            </Link>
                        </nav>
                    );

                default:
                    return (
                        <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                            Choose or complete a business
                            profile to access its
                            workspace navigation.
                        </div>
                    );
            }
        };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]">
                <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] lg:hidden"
                        aria-label="Open dashboard navigation"
                        aria-controls="mobile-dashboard-navigation"
                        aria-expanded={
                            mobileNavigationOpen
                        }
                        onClick={(): void =>
                            setMobileNavigationOpen(
                                true,
                            )
                        }
                    >
                        <span aria-hidden="true">
                            ☰
                        </span>
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex flex-none items-center gap-2 rounded-md font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                    >
                        <span
                            aria-hidden="true"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                        >
                            A
                        </span>

                        <span className="hidden sm:inline">
                            Asancha
                        </span>
                    </Link>

                    <div className="min-w-0 flex-1">
                        <BusinessProfileSwitcher
                            profiles={
                                profileCards
                            }
                            compact={false}
                            isLoading={
                                isLoading
                            }
                            switchingProfilePublicId={
                                switchingProfilePublicId
                            }
                            errorMessage={
                                errorMessage
                            }
                            successMessage={
                                successMessage
                            }
                            onSwitchProfile={
                                handleProfileSwitch
                            }
                        />
                    </div>

                    <nav
                        aria-label="Dashboard utilities"
                        className="flex flex-none items-center gap-1"
                    >
                        <Link
                            href="/marketplace"
                            className="hidden rounded-md px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] md:inline-flex"
                        >
                            Marketplace
                        </Link>

                        <Link
                            href="/notifications"
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                            aria-label={
                                unreadNotificationCount >
                                    0
                                    ? `${unreadNotificationCount} unread notifications`
                                    : "Notifications"
                            }
                        >
                            <span aria-hidden="true">
                                🔔
                            </span>

                            {unreadNotificationCount >
                                0 ? (
                                <span
                                    className="absolute right-0.5 top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[var(--destructive)] px-1 text-[0.625rem] font-bold leading-none text-[var(--destructive-foreground)]"
                                    aria-hidden="true"
                                >
                                    {getNotificationCountLabel(
                                        unreadNotificationCount,
                                    )}
                                </span>
                            ) : null}
                        </Link>

                        <Link
                            href="/account/support"
                            className="hidden rounded-md px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] sm:inline-flex"
                        >
                            Support
                        </Link>

                        <Link
                            href="/account/profile"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm font-bold hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                            aria-label="Open account profile"
                        >
                            AC
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-[96rem] lg:grid-cols-[17rem_minmax(0,1fr)]">
                <aside className="hidden min-h-[calc(100vh-4rem)] border-r border-[var(--border)] bg-[var(--card)] p-4 lg:block">
                    <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                        {workspaceLabel}
                    </p>

                    {renderNavigation()}

                    {dashboardState &&
                        dashboardState.pendingActions
                            .length > 0 ? (
                        <section
                            className="mt-6 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4"
                            aria-labelledby="dashboard-pending-actions-heading"
                        >
                            <h2
                                id="dashboard-pending-actions-heading"
                                className="text-sm font-bold"
                            >
                                Pending actions
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                {
                                    dashboardState
                                        .pendingActions
                                        .length
                                }{" "}
                                account or profile{" "}
                                {dashboardState
                                    .pendingActions
                                    .length === 1
                                    ? "action requires"
                                    : "actions require"}{" "}
                                attention.
                            </p>

                            {dashboardState
                                .pendingActions[0]
                                ?.actionPath &&
                                dashboardState
                                    .pendingActions[0]
                                    ?.actionLabel ? (
                                <Link
                                    href={
                                        dashboardState
                                            .pendingActions[0]
                                            .actionPath
                                    }
                                    className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                >
                                    {
                                        dashboardState
                                            .pendingActions[0]
                                            .actionLabel
                                    }
                                </Link>
                            ) : null}
                        </section>
                    ) : null}
                </aside>

                <div className="min-w-0">
                    {errorMessage ? (
                        <div
                            role="alert"
                            className="m-4 flex items-start justify-between gap-4 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-4 text-sm text-[var(--destructive)]"
                        >
                            <span>
                                {errorMessage}
                            </span>

                            <button
                                type="button"
                                className="flex-none font-semibold underline"
                                onClick={(): void =>
                                    setErrorMessage(
                                        null,
                                    )
                                }
                            >
                                Dismiss
                            </button>
                        </div>
                    ) : null}

                    {successMessage ? (
                        <div
                            role="status"
                            className="m-4 flex items-start justify-between gap-4 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] bg-[var(--card)] p-4 text-sm"
                        >
                            <span>
                                {successMessage}
                            </span>

                            <button
                                type="button"
                                className="flex-none font-semibold underline"
                                onClick={(): void =>
                                    setSuccessMessage(
                                        null,
                                    )
                                }
                            >
                                Dismiss
                            </button>
                        </div>
                    ) : null}

                    {children}
                </div>
            </div>

            {mobileNavigationOpen ? (
                <div
                    className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--foreground)_50%,transparent)] lg:hidden"
                    onMouseDown={
                        handleMobileBackdropMouseDown
                    }
                >
                    <aside
                        id="mobile-dashboard-navigation"
                        className="h-full w-[min(88vw,20rem)] overflow-y-auto bg-[var(--card)] p-4 shadow-xl"
                        aria-label="Mobile dashboard navigation"
                    >
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <p className="font-bold">
                                {workspaceLabel}
                            </p>

                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                                aria-label="Close dashboard navigation"
                                onClick={(): void =>
                                    setMobileNavigationOpen(
                                        false,
                                    )
                                }
                            >
                                <span aria-hidden="true">
                                    ×
                                </span>
                            </button>
                        </div>

                        {renderNavigation()}

                        {dashboardState &&
                            dashboardState
                                .pendingActions
                                .length > 0 ? (
                            <section className="mt-6 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4">
                                <h2 className="text-sm font-bold">
                                    Pending actions
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {
                                        dashboardState
                                            .pendingActions
                                            .length
                                    }{" "}
                                    {dashboardState
                                        .pendingActions
                                        .length === 1
                                        ? "action requires"
                                        : "actions require"}{" "}
                                    attention.
                                </p>

                                {dashboardState
                                    .pendingActions[0]
                                    ?.actionPath &&
                                    dashboardState
                                        .pendingActions[0]
                                        ?.actionLabel ? (
                                    <Link
                                        href={
                                            dashboardState
                                                .pendingActions[0]
                                                .actionPath
                                        }
                                        className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                    >
                                        {
                                            dashboardState
                                                .pendingActions[0]
                                                .actionLabel
                                        }
                                    </Link>
                                ) : null}
                            </section>
                        ) : null}

                        <div className="mt-6 grid gap-1 border-t border-[var(--border)] pt-4">
                            <Link
                                href="/marketplace"
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                Marketplace
                            </Link>

                            <Link
                                href="/notifications"
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                Notifications
                                {unreadNotificationCount >
                                    0
                                    ? ` (${getNotificationCountLabel(
                                        unreadNotificationCount,
                                    )})`
                                    : ""}
                            </Link>

                            <Link
                                href="/account/support"
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                Support
                            </Link>

                            <Link
                                href="/account/profile"
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                Account profile
                            </Link>
                        </div>
                    </aside>
                </div>
            ) : null}
        </div>
    );
}