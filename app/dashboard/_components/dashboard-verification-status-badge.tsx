"use client";

// File: app/dashboard/_components/dashboard-verification-status-badge.tsx

/**
 * Dashboard Verification Status Badge
 *
 * Purpose:
 * Renders a compact verification badge with consistent dashboard status
 * colours and an accessible hover/focus tooltip.
 */

import type {
    DashboardVerificationStatus,
} from "../_types/dashboard.types";

interface DashboardVerificationStatusBadgeProps {
    status:
        | DashboardVerificationStatus
        | string
        | null
        | undefined;
    profileLabel: string;
    tooltipId: string;
}

function formatStatusLabel(status: string): string {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

function getBadgeClassName(status: string): string {
    switch (status) {
        case "approved":
        case "verified":
            return "border-emerald-200 bg-emerald-50 text-emerald-800";

        case "rejected":
        case "declined":
            return "border-red-200 bg-red-50 text-red-800";

        case "correction_required":
        case "replacement_required":
            return "border-amber-200 bg-amber-50 text-amber-900";

        case "on_hold":
        case "suspended":
            return "border-slate-300 bg-slate-100 text-slate-800";

        case "in_review":
        case "pending":
        default:
            return "border-orange-200 bg-orange-50 text-orange-800";
    }
}

function getTooltipText(status: string, profileLabel: string): string {
    switch (status) {
        case "approved":
        case "verified":
            return `Your ${profileLabel} verification has been approved.`;

        case "rejected":
        case "declined":
            return `Your ${profileLabel} verification was not approved.`;

        case "correction_required":
        case "replacement_required":
            return `Your ${profileLabel} verification needs updates before review can continue.`;

        case "on_hold":
        case "suspended":
            return `Your ${profileLabel} verification is currently on hold.`;

        case "in_review":
            return `Your ${profileLabel} verification is being reviewed.`;

        case "pending":
        default:
            return `Your ${profileLabel} verification is pending review.`;
    }
}

export function DashboardVerificationStatusBadge({
    status,
    profileLabel,
    tooltipId,
}: DashboardVerificationStatusBadgeProps) {
    if (!status) return null;

    return (
        <span className="group relative inline-flex items-center">
            <span
                aria-describedby={tooltipId}
                className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-bold shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] ${getBadgeClassName(
                    status,
                )}`}
                tabIndex={0}
            >
                <span
                    className="mr-1.5 size-1.5 rounded-full bg-current"
                    aria-hidden="true"
                />
                {formatStatusLabel(status)}
            </span>

            <span
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-64 -translate-x-1/2 rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-3 py-2 text-xs font-medium leading-5 text-[var(--background)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
                {getTooltipText(status, profileLabel)}
            </span>
        </span>
    );
}
