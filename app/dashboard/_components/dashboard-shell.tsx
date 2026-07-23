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

import Image from "next/image";
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
    LogOut,
    MapPin,
    MessageSquare,
    UserRound,
    Search,
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
    authApiPatch,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import {
    clearAuthTokens,
    getAccessToken,
} from "../../../src/features/auth/lib/auth-token-store";
import {
    clearBrowserSessionHint,
} from "../../../src/lib/auth/auth-cookies";
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

export interface DashboardShellProps {
    children: ReactNode;
}

interface SwitchBusinessProfilePayload
    extends Record<string, unknown> {
    profileType:
        PublicBusinessProfileType;
}

interface SwitchBusinessProfileResult {
    activeBusinessProfile:
        BackendBusinessProfileSummary | null;

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

interface AccountMenuItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface BackendBusinessProfileSummary {
    publicId: string;
    profileType: PublicBusinessProfileType;
    verificationStatus: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    summary: Record<string, unknown>;
}

interface ActiveBusinessProfileResponse {
    activeBusinessProfile:
        BackendBusinessProfileSummary | null;
}

interface BackendOnboardingStartResponse {
    status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "completed"
        | "abandoned"
        | "correction_required";
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

const ONBOARDING_PATHS: Record<
    PublicBusinessProfileType,
    string
> = {
    investor: "/onboarding/investor",

    property_owner:
        "/onboarding/property-owner",

    property_agent:
        "/onboarding/property-agent",

    property_sourcer:
        "/onboarding/property-sourcer",

    service_provider:
        "/onboarding/service-provider",

    api_partner:
        "/onboarding/api-partner",
};

const SAFE_MESSAGES = {
    dashboardLoadError:
        "We could not load your business profile context. Refresh the page or sign in again.",

    profileSwitchError:
        "We could not switch your business profile. Review the profile requirements and try again.",

    unsupportedProfile:
        "The selected business profile does not have an available dashboard.",

    profileSwitchSuccess:
        "Your active business profile has been changed.",
} as const;

const ACCOUNT_MENU_ITEMS: readonly AccountMenuItem[] = [
    {
        label: "Profile",
        href: "/account/profile",
        icon: UserRound,
    },
    {
        label: "Business profiles",
        href: "/account/business-profiles/add",
        icon: BriefcaseBusiness,
    },
    {
        label: "Security",
        href: "/account/security",
        icon: ShieldCheck,
    },
    {
        label: "Notifications",
        href: "/account/notifications",
        icon: Bell,
    },
    {
        label: "Support",
        href: "/account/support",
        icon: Headphones,
    },
] as const;

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

function getStringSummaryValue(
    summary: Record<string, unknown>,
    keys: readonly string[],
): string | null {
    for (const key of keys) {
        const value = summary[key];

        if (
            typeof value === "string" &&
            value.trim().length > 0
        ) {
            return value.trim();
        }
    }

    return null;
}

function getBusinessProfileDisplayName(
    profile: BackendBusinessProfileSummary,
): string {
    return (
        getStringSummaryValue(profile.summary, [
            "displayName",
            "businessName",
            "companyName",
            "agencyName",
            "serviceName",
            "tradingName",
            "fullName",
            "name",
        ]) ??
        getWorkspaceLabel(profile.profileType)
    );
}

function toDashboardBusinessProfile(
    profile: BackendBusinessProfileSummary,
    activeProfileType:
        PublicBusinessProfileType | null,
): DashboardBusinessProfile {
    const dashboardPath =
        DASHBOARD_PATHS[profile.profileType];

    return {
        profilePublicId: profile.publicId,
        profileType: profile.profileType,
        displayName:
            getBusinessProfileDisplayName(
                profile,
            ),
        imageUrl: null,
        onboardingStatus: "completed",
        verificationStatus: profile.isVerified
            ? "approved"
            : "pending",
        pendingActionCount: 0,
        isActive:
            profile.profileType ===
            activeProfileType,
        canSwitch:
            profile.isActive &&
            profile.profileType !==
                activeProfileType,
        switchLockedReason: profile.isActive
            ? null
            : "This business profile is inactive.",
        detailPath: `/account/business-profiles/${encodeURIComponent(
            profile.profileType,
        )}`,
        dashboardPath,
        continueSetupPath: null,
    };
}

function createDashboardShellState(
    businessProfiles:
        BackendBusinessProfileSummary[],
    activeProfile:
        BackendBusinessProfileSummary | null,
    onboardingStatus:
        DashboardState["status"]["onboardingStatus"] =
            "completed",
): DashboardState {
    const activeProfileType =
        activeProfile?.profileType ??
        businessProfiles[0]?.profileType ??
        null;
    const availableBusinessProfiles =
        businessProfiles.map((profile) =>
            toDashboardBusinessProfile(
                profile,
                activeProfileType,
            ),
        );
    const activeBusinessProfile =
        availableBusinessProfiles.find(
            (profile) =>
                profile.profileType ===
                activeProfileType,
        ) ?? null;

    return {
        activeBusinessProfileType:
            activeProfileType,
        activeBusinessProfile,
        availableBusinessProfiles,
        status: {
            accountStatus: "active",
            emailVerificationStatus: "verified",
            generalProfileStatus: "completed",
            onboardingStatus,
            verificationStatus:
                activeBusinessProfile
                    ?.verificationStatus ??
                "pending",
            documentStatusSummary: {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                replacementRequired: 0,
            },
            paymentStatusSummary: {
                total: 0,
                pending: 0,
                submitted: 0,
                approved: 0,
                rejected: 0,
            },
            policyAcceptanceStatus: {
                complete: true,
                missingCount: 0,
            },
        },
        investorSummary: null,
        propertyOwnerSummary: null,
        propertyAgentSummary: null,
        propertySourcerSummary: null,
        serviceProviderSummary: null,
        apiPartnerSummary: null,
        lockedActions: [],
        unlockedActions: [],
        pendingActions:
            activeBusinessProfile &&
            onboardingStatus !== "completed"
                ? [
                      {
                          actionKey:
                              "complete_role_onboarding",
                          title:
                              "Complete onboarding",
                          description:
                              "Your active business profile setup is not completed yet.",
                          allowed: true,
                          lockedReason: null,
                          responsibleParty:
                              "user",
                          actionLabel:
                              "Continue onboarding",
                          actionPath:
                              ONBOARDING_PATHS[
                                  activeBusinessProfile
                                      .profileType
                              ],
                      },
                  ]
                : [],
        nextActions: [],
        safeUserMessage: null,
    };
}

function normalizeOnboardingStatus(
    status:
        | BackendOnboardingStartResponse["status"]
        | null
        | undefined,
): DashboardState["status"]["onboardingStatus"] {
    switch (status) {
        case "not_started":
        case "in_progress":
        case "submitted":
        case "completed":
        case "correction_required":
            return status;

        case "abandoned":
            return "in_progress";

        default:
            return "completed";
    }
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

    if (href.includes("security")) {
        return ShieldCheck;
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
        accountMenuOpen,
        setAccountMenuOpen,
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
        isSigningOut,
        setIsSigningOut,
    ] = useState(false);

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
                    const [
                        activeProfileResult,
                        businessProfiles,
                    ] = await Promise.all([
                        authApiGet<ActiveBusinessProfileResponse>(
                            "/profiles/me/active-business-profile",
                        ),
                        authApiGet<BackendBusinessProfileSummary[]>(
                            "/profiles/me/business-profiles",
                        ),
                    ]);
                    const activeProfileType =
                        activeProfileResult
                            .activeBusinessProfile
                            ?.profileType ??
                        businessProfiles[0]
                            ?.profileType ??
                        null;
                    const onboarding =
                        activeProfileType
                            ? await authApiPost<
                                  BackendOnboardingStartResponse,
                                  {
                                      profileType:
                                          PublicBusinessProfileType;
                                  }
                              >(
                                  "/onboarding/start",
                                  {
                                      profileType:
                                          activeProfileType,
                                  },
                              ).catch(() => null)
                            : null;

                    const mergedState =
                        createDashboardShellState(
                            businessProfiles,
                            activeProfileResult
                                .activeBusinessProfile,
                            normalizeOnboardingStatus(
                                onboarding?.status ??
                                    null,
                            ),
                        );

                    setDashboardState(mergedState);

                    return mergedState;
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
        queueMicrotask(() => {
            void loadDashboardState();
        });
    }, [loadDashboardState]);

    useEffect((): void => {
        queueMicrotask(() => {
            setMobileNavigationOpen(false);
            setAccountMenuOpen(false);
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

    useEffect((): void => {
        if (
            !activeProfileType ||
            !pathname?.startsWith("/dashboard/")
        ) {
            return;
        }

        const expectedDashboardPath =
            DASHBOARD_PATHS[activeProfileType];

        if (
            expectedDashboardPath &&
            !pathname.startsWith(
                expectedDashboardPath,
            )
        ) {
            router.replace(
                expectedDashboardPath,
            );
        }
    }, [activeProfileType, pathname, router]);

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
                profileType: profile.profileType,
            };

            try {
                const result =
                    await authApiPatch<
                        SwitchBusinessProfileResult,
                        SwitchBusinessProfilePayload
                    >(
                        "/profiles/me/active-business-profile",
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
                        ?.profileType ??
                    profile.profileType;

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

    const handleSignOut =
        async (
            allDevices = false,
        ): Promise<void> => {
            if (isSigningOut) {
                return;
            }

            setIsSigningOut(true);
            setErrorMessage(null);

            try {
                const accessToken =
                    getAccessToken();
                const headers = new Headers();

                if (accessToken) {
                    headers.set(
                        "Authorization",
                        `Bearer ${accessToken}`,
                    );
                }

                await fetch(
                    allDevices
                        ? "/api/auth/logout-all-devices"
                        : "/api/auth/logout",
                    {
                        method: "POST",
                        credentials: "include",
                        headers,
                    },
                );
            } finally {
                clearAuthTokens();
                clearBrowserSessionHint();
                setAccountMenuOpen(false);
                router.replace("/auth/sign-in");
                router.refresh();
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
            const href = item.href;
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

    const renderAccountMenuLinks =
        (compact = false): ReactNode => (
            <nav
                aria-label="Account navigation"
                className={
                    compact
                        ? "grid gap-1"
                        : "grid gap-1"
                }
            >
                {ACCOUNT_MENU_ITEMS.map(
                    (item): ReactNode => {
                        const Icon = item.icon;
                        const active =
                            pathname === item.href ||
                            pathname.startsWith(
                                `${item.href}/`,
                            );

                        return (
                            <Link
                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }
                                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                                    active
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                }`}
                                href={item.href}
                                key={item.href}
                                onClick={() => {
                                    setAccountMenuOpen(
                                        false,
                                    );
                                    setMobileNavigationOpen(
                                        false,
                                    );
                                }}
                            >
                                <Icon
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={2.4}
                                />
                                <span>{item.label}</span>
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
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid lg:grid-cols-[var(--asancha-dashboard-sidebar-width)_minmax(0,1fr)]">
            <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_96%,var(--muted))] p-4 lg:block">
                <div className="mb-5 border-b border-[var(--border)] pb-5">
                    <Link
                        aria-label="Asancha home"
                        className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                        href="/"
                    >
                        <Image
                            alt="Asancha logo"
                            className="h-auto w-20"
                            height={80}
                            priority
                            src="/logo.png"
                            style={{ height: "auto" }}
                            width={80}
                        />
                    </Link>
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
                                href={firstPendingAction.actionPath}
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
                        aria-label="Asancha home"
                        className="inline-flex flex-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] lg:hidden"
                        href="/"
                    >
                        <Image
                            alt="Asancha logo"
                            className="h-auto w-16"
                            height={80}
                            priority
                            src="/logo.png"
                            style={{ height: "auto" }}
                            width={80}
                        />
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
                            href="/notifications"
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
                            href="/account/support"
                            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] sm:inline-flex"
                        >
                            <Headphones
                                aria-hidden="true"
                                size={16}
                                strokeWidth={2.4}
                            />
                            Support
                        </Link>

                        <div className="relative">
                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm font-bold hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                                aria-label="Open account menu"
                                aria-haspopup="menu"
                                aria-expanded={
                                    accountMenuOpen
                                }
                                onClick={() =>
                                    setAccountMenuOpen(
                                        (current) =>
                                            !current,
                                    )
                                }
                            >
                                <UserCircle
                                    aria-hidden="true"
                                    size={20}
                                    strokeWidth={2.4}
                                />
                            </button>

                            {accountMenuOpen ? (
                                <div
                                    className="absolute right-0 top-12 z-50 w-64 rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl"
                                    role="menu"
                                >
                                    <div className="border-b border-[var(--border)] px-3 py-2">
                                        <p className="text-sm font-bold">
                                            Account
                                        </p>
                                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                            Profile, security,
                                            notifications, and
                                            support
                                        </p>
                                    </div>

                                    <div className="mt-2">
                                        {renderAccountMenuLinks(
                                            true,
                                        )}
                                    </div>

                                    <div className="mt-2 border-t border-[var(--border)] pt-2">
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
                                            disabled={
                                                isSigningOut
                                            }
                                            onClick={() => {
                                                void handleSignOut(
                                                    false,
                                                );
                                            }}
                                        >
                                            <LogOut
                                                aria-hidden="true"
                                                size={16}
                                                strokeWidth={
                                                    2.4
                                                }
                                            />
                                            <span>
                                                Logout
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-[var(--destructive)] hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-60"
                                            disabled={
                                                isSigningOut
                                            }
                                            onClick={() => {
                                                void handleSignOut(
                                                    true,
                                                );
                                            }}
                                        >
                                            <ShieldCheck
                                                aria-hidden="true"
                                                size={16}
                                                strokeWidth={
                                                    2.4
                                                }
                                            />
                                            <span>
                                                Logout from all
                                                devices
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </nav>
                    </div>
                </header>

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
                                        href={firstPendingAction.actionPath}
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
                        </div>
                    </aside>
                </div>
            ) : null}

        </div>
    );
}
