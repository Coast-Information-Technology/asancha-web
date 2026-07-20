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
 * - Render role-specific dashboard navigation.
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
 *   account-status, assignment, ownership, or lifecycle requirements.
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
import {
    BadgeCheck,
    Bell,
    Bookmark,
    Bot,
    BriefcaseBusiness,
    Building2,
    CalendarCheck,
    CreditCard,
    FileText,
    Gauge,
    Headphones,
    Home,
    LineChart,
    MapPin,
    MessageSquare,
    Search,
    Settings,
    ShieldCheck,
    SlidersHorizontal,
    UserCircle,
    Wrench,
    type LucideIcon,
} from "lucide-react";

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
    PROPERTY_AGENT_NAVIGATION,
    type PropertyAgentNavigationItem,
} from "../_config/property-agent-dashboard.config";
import {
    PROPERTY_OWNER_NAVIGATION,
    type PropertyOwnerNavigationItem,
} from "../_config/property-owner-dashboard.config";
import {
    PROPERTY_SOURCER_NAVIGATION,
    type PropertySourcerNavigationItem,
} from "../_config/property-sourcer-dashboard.config";
import {
    SERVICE_PROVIDER_NAVIGATION,
    type ServiceProviderNavigationItem,
} from "../_config/service-provider-dashboard.config";
import type {
    DashboardBusinessProfile,
    DashboardState,
    PublicBusinessProfileType,
} from "../_types/dashboard.types";
import {
    USE_DASHBOARD_DUMMY_DATA,
    getDashboardPreviewProfileType,
    getPreviewDashboardState,
} from "../_lib/dashboard-preview-state";

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

interface DashboardNotificationSummary {
    unreadNotificationCount: number;
}

interface DashboardNavigationItemLike {
    label: string;
    href: string;
    description: string;
    exactMatch: boolean;
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

function isNavigationItemActive(
    pathname: string,
    href: string,
    exactMatch: boolean,
): boolean {
    if (exactMatch) {
        return pathname === href;
    }

    return (
        pathname === href ||
        pathname.startsWith(
            `${href}/`,
        )
    );
}

function getDashboardNavigationIcon(
    href: string,
    label: string,
): LucideIcon {
    const normalizedLabel =
        label.toLowerCase();

    if (
        normalizedLabel.includes(
            "overview",
        )
    ) {
        return Home;
    }

    if (
        normalizedLabel.includes(
            "properties",
        ) ||
        normalizedLabel.includes(
            "property",
        ) ||
        normalizedLabel.includes(
            "services",
        )
    ) {
        return Building2;
    }

    if (
        normalizedLabel.includes(
            "listings",
        ) ||
        normalizedLabel.includes(
            "opportunities",
        ) ||
        normalizedLabel.includes("deals")
    ) {
        return Search;
    }

    if (
        normalizedLabel.includes(
            "documents",
        ) ||
        normalizedLabel.includes(
            "authority",
        )
    ) {
        return FileText;
    }

    if (
        normalizedLabel.includes(
            "verification",
        ) ||
        normalizedLabel.includes(
            "compliance",
        )
    ) {
        return ShieldCheck;
    }

    if (
        normalizedLabel.includes(
            "bookings",
        ) ||
        normalizedLabel.includes(
            "reservations",
        )
    ) {
        return CalendarCheck;
    }

    if (
        normalizedLabel.includes(
            "conversations",
        )
    ) {
        return MessageSquare;
    }

    if (
        normalizedLabel.includes(
            "payments",
        )
    ) {
        return CreditCard;
    }

    if (
        normalizedLabel.includes("saved")
    ) {
        return Bookmark;
    }

    if (
        normalizedLabel.includes(
            "recommendations",
        ) ||
        normalizedLabel.includes("ai")
    ) {
        return Bot;
    }

    if (
        normalizedLabel.includes(
            "preferences",
        ) ||
        normalizedLabel.includes(
            "availability",
        )
    ) {
        return SlidersHorizontal;
    }

    if (
        normalizedLabel.includes(
            "performance",
        )
    ) {
        return LineChart;
    }

    if (
        normalizedLabel.includes(
            "profile",
        ) ||
        normalizedLabel.includes(
            "company",
        )
    ) {
        return BriefcaseBusiness;
    }

    if (href.includes("service-areas")) {
        return MapPin;
    }

    if (href.includes("support")) {
        return Headphones;
    }

    if (href.includes("notifications")) {
        return Bell;
    }

    if (href.includes("account")) {
        return UserCircle;
    }

    if (href.includes("settings")) {
        return Settings;
    }

    if (href.includes("maintenance")) {
        return Wrench;
    }

    if (href.includes("api-partner")) {
        return BadgeCheck;
    }

    return Gauge;
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

function getUnreadNotificationCount(
    dashboardState: DashboardState | null,
    activeProfileType:
        | PublicBusinessProfileType
        | null
        | undefined,
): number {
    if (!dashboardState) {
        return 0;
    }

    let summary:
        | DashboardNotificationSummary
        | null
        | undefined;

    switch (activeProfileType) {
        case "investor":
            summary =
                dashboardState
                    .investorSummary;

            break;

        case "property_owner":
            summary =
                dashboardState
                    .propertyOwnerSummary;

            break;

        case "property_agent":
            summary =
                dashboardState
                    .propertyAgentSummary;

            break;

        case "property_sourcer":
            summary =
                dashboardState
                    .propertySourcerSummary;

            break;

        case "service_provider":
            summary =
                dashboardState
                    .serviceProviderSummary;

            break;

        case "api_partner":
        default:
            summary = null;
    }

    return (
        summary?.unreadNotificationCount ??
        0
    );
}

function getDashboardUiPreviewHref(
    pathname: string,
    href: string,
): string {
    if (!pathname.startsWith("/dashboard-ui")) {
        return href;
    }

    if (href === "/dashboard") {
        return "/dashboard-ui";
    }

    if (href.startsWith("/dashboard/")) {
        return href.replace(
            "/dashboard",
            "/dashboard-ui",
        );
    }

    if (href === "/notifications") {
        return "/dashboard-ui/notifications";
    }

    if (href === "/account/profile") {
        return "/dashboard-ui/profile";
    }

    if (href === "/account/support") {
        return "/dashboard-ui/support";
    }

    return href;
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
                    if (USE_DASHBOARD_DUMMY_DATA) {
                        const state =
                            getPreviewDashboardState<DashboardState>(
                                getDashboardPreviewProfileType(
                                    pathname,
                                ),
                            );

                        setDashboardState(state);

                        return state;
                    }

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
            [pathname],
        );

    useEffect((): void => {
        queueMicrotask(() => {
            void loadDashboardState();
        });
    }, [loadDashboardState]);

    useEffect((): void => {
        queueMicrotask(() => {
            setMobileNavigationOpen(false);
        });
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
        getUnreadNotificationCount(
            dashboardState,
            activeProfileType,
        );

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
                    string =
                    DASHBOARD_PATHS[
                        resolvedProfileType
                    ];

                const targetPath:
                    string =
                    result.dashboardPath ??
                    refreshedState
                        ?.activeBusinessProfile
                        ?.dashboardPath ??
                    configuredDashboardPath;

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

    const renderNavigationLink =
        (
            item: DashboardNavigationItemLike,
        ): ReactNode => {
            const href =
                getDashboardUiPreviewHref(
                    pathname,
                    item.href,
                );
            const active =
                isNavigationItemActive(
                    pathname,
                    href,
                    item.exactMatch,
                );
            const Icon =
                getDashboardNavigationIcon(
                    item.href,
                    item.label,
                );

            return (
                <Link
                    key={item.href}
                    href={href}
                    title={item.description}
                    aria-current={
                        active ? "page" : undefined
                    }
                    className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                        active
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-md transition-colors ${
                            active
                                ? "bg-[color-mix(in_srgb,var(--primary-foreground)_18%,transparent)] text-[var(--primary-foreground)]"
                                : "bg-[var(--background)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
                        }`}
                    >
                        <Icon
                            size={17}
                            strokeWidth={2.35}
                        />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                        {item.label}
                    </span>
                    {active ? (
                        <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-[var(--primary-foreground)]"
                        />
                    ) : null}
                </Link>
            );
        };

    const renderLoadingNavigation =
        (): ReactNode => (
            <div
                className="grid gap-2"
                aria-label="Loading dashboard navigation"
                aria-busy="true"
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
                    ): ReactNode =>
                        renderNavigationLink(
                            item,
                        ),
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
                    ): ReactNode =>
                        renderNavigationLink(
                            item,
                        ),
                )}
            </nav>
        );

    const renderPropertyAgentNavigation =
        (): ReactNode => (
            <nav
                aria-label="Property agent workspace"
                className="grid gap-1"
            >
                {PROPERTY_AGENT_NAVIGATION.map(
                    (
                        item:
                            PropertyAgentNavigationItem,
                    ): ReactNode =>
                        renderNavigationLink(
                            item,
                        ),
                )}
            </nav>
        );

    const renderPropertySourcerNavigation =
        (): ReactNode => (
            <nav
                aria-label="Property sourcer workspace"
                className="grid gap-1"
            >
                {PROPERTY_SOURCER_NAVIGATION.map(
                    (
                        item:
                            PropertySourcerNavigationItem,
                    ): ReactNode =>
                        renderNavigationLink(
                            item,
                        ),
                )}
            </nav>
        );

    const renderServiceProviderNavigation =
        (): ReactNode => (
            <nav
                aria-label="Service provider workspace"
                className="grid gap-1"
            >
                {SERVICE_PROVIDER_NAVIGATION.map(
                    (
                        item:
                            ServiceProviderNavigationItem,
                    ): ReactNode =>
                        renderNavigationLink(
                            item,
                        ),
                )}
            </nav>
        );

    const renderApiPartnerNavigation =
        (): ReactNode => (
            <nav
                aria-label="API partner workspace"
                className="grid gap-1"
            >
                {renderNavigationLink({
                    label: "API partner dashboard",
                    href: "/api-partner/dashboard",
                    description:
                        "API partner dashboard",
                    exactMatch: true,
                })}
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
                    return renderPropertyAgentNavigation();

                case "property_sourcer":
                    return renderPropertySourcerNavigation();

                case "service_provider":
                    return renderServiceProviderNavigation();

                case "api_partner":
                    return renderApiPartnerNavigation();

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

    const firstPendingAction =
        dashboardState
            ?.pendingActions[0] ??
        null;

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
                            href={getDashboardUiPreviewHref(
                                pathname,
                                "/dashboard",
                            )}
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
                            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] md:inline-flex"
                        >
                            <Building2
                                aria-hidden="true"
                                size={16}
                                strokeWidth={2.4}
                            />
                            Marketplace
                        </Link>

                        <Link
                            href={getDashboardUiPreviewHref(
                                pathname,
                                "/notifications",
                            )}
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                            aria-label={
                                unreadNotificationCount >
                                0
                                    ? `${unreadNotificationCount} unread notifications`
                                    : "Notifications"
                            }
                        >
                            <Bell
                                aria-hidden="true"
                                size={18}
                                strokeWidth={2.4}
                            />

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
                            href={getDashboardUiPreviewHref(
                                pathname,
                                "/account/support",
                            )}
                            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] sm:inline-flex"
                        >
                            <Headphones
                                aria-hidden="true"
                                size={16}
                                strokeWidth={2.4}
                            />
                            Support
                        </Link>

                        <Link
                            href={getDashboardUiPreviewHref(
                                pathname,
                                "/account/profile",
                            )}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm font-bold hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                            aria-label="Open account profile"
                        >
                            <UserCircle
                                aria-hidden="true"
                                size={20}
                                strokeWidth={2.4}
                            />
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-[100rem] lg:grid-cols-[var(--asancha-dashboard-sidebar-width)_minmax(0,1fr)]">
                <aside className="hidden h-[calc(100vh-4rem)] overflow-y-auto border-r border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_96%,var(--muted))] p-4 lg:block">
                    <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                            Active workspace
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
                            >
                                <Gauge
                                    size={19}
                                    strokeWidth={2.4}
                                />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-extrabold text-[var(--foreground)]">
                                    {workspaceLabel}
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                                    Static role navigation
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                        Menu
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

                            {firstPendingAction
                                ?.actionPath &&
                            firstPendingAction
                                .actionLabel ? (
                                <Link
                                    href={
                                        getDashboardUiPreviewHref(
                                            pathname,
                                            firstPendingAction
                                                .actionPath,
                                        )
                                    }
                                    className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                >
                                    {
                                        firstPendingAction
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

                                {firstPendingAction
                                    ?.actionPath &&
                                firstPendingAction
                                    .actionLabel ? (
                                    <Link
                                        href={
                                            getDashboardUiPreviewHref(
                                                pathname,
                                                firstPendingAction
                                                    .actionPath,
                                            )
                                        }
                                        className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                    >
                                        {
                                            firstPendingAction
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
                                    href={getDashboardUiPreviewHref(
                                        pathname,
                                        "/notifications",
                                    )}
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
                                    href={getDashboardUiPreviewHref(
                                        pathname,
                                        "/account/support",
                                    )}
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                Support
                            </Link>

                                <Link
                                    href={getDashboardUiPreviewHref(
                                        pathname,
                                        "/account/profile",
                                    )}
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
