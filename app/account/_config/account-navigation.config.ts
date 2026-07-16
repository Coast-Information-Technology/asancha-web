// File: app/account/_config/account-navigation.config.ts

/**
 * Asancha Account Navigation Configuration
 *
 * Purpose:
 * Defines the authenticated account-area navigation and approved public
 * business-profile options.
 *
 * Security notes:
 * - Navigation visibility does not grant backend permission.
 * - Staff roles must not be exposed through public profile creation.
 * - Business-profile eligibility remains backend-controlled.
 */

import type {
    AccountBusinessProfileType,
} from "../_types/account.types";

export interface AccountNavigationItem {
    label: string;
    href: string;
    description: string;
    exactMatch: boolean;
}

export interface BusinessProfileTypeOption {
    profileType: AccountBusinessProfileType;
    label: string;
    description: string;
    onboardingPath: string;
}

export const ACCOUNT_NAVIGATION:
    readonly AccountNavigationItem[] = [
        {
            label: "Overview",
            href: "/account",
            description:
                "Account overview and current profile context",
            exactMatch: true,
        },
        {
            label: "Profile",
            href: "/account/profile",
            description:
                "Personal and contact information",
            exactMatch: true,
        },
        {
            label: "Policies",
            href: "/account/policies",
            description:
                "Policy versions and acceptance history",
            exactMatch: true,
        },
        {
            label: "Security",
            href: "/account/security",
            description:
                "Password, email, sessions, login activity, and security alerts",
            exactMatch: true,
        },
        {
            label: "Notifications",
            href: "/account/notifications",
            description:
                "Notification preferences and delivery settings",
            exactMatch: true,
        },
        {
            label: "Account status",
            href: "/account/status",
            description:
                "Account, onboarding, verification, document, and payment status",
            exactMatch: true,
        },
        {
            label: "Support",
            href: "/account/support",
            description:
                "Contact Asancha support",
            exactMatch: true,
        },
    ];

export const BUSINESS_PROFILE_TYPE_OPTIONS:
    readonly BusinessProfileTypeOption[] = [
        {
            profileType: "investor",
            label: "Investor",
            description:
                "Find, save, review, reserve, and progress suitable property opportunities.",
            onboardingPath:
                "/onboarding/investor",
        },
        {
            profileType: "property_owner",
            label: "Property owner",
            description:
                "Submit and manage properties that you own or are authorised to control.",
            onboardingPath:
                "/onboarding/property-owner",
        },
        {
            profileType: "property_agent",
            label: "Property agent",
            description:
                "Represent property owners, landlords, vendors, developers, or agency companies.",
            onboardingPath:
                "/onboarding/property-agent",
        },
        {
            profileType: "property_sourcer",
            label: "Property sourcer",
            description:
                "Submit investment-focused deals and create compliant investor deal packs.",
            onboardingPath:
                "/onboarding/property-sourcer",
        },
        {
            profileType: "service_provider",
            label: "Service provider",
            description:
                "Offer approved professional and property-related services.",
            onboardingPath:
                "/onboarding/service-provider",
        },
        {
            profileType: "api_partner",
            label: "API partner",
            description:
                "Apply for controlled API access, approved scopes, usage, and billing.",
            onboardingPath:
                "/api-partner/apply",
        },
    ];