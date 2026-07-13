// File: app/dashboard/layout.tsx

/**
 * Asancha Protected Dashboard Layout
 *
 * Purpose:
 * Applies the authenticated public-user dashboard shell to all role dashboard
 * routes.
 *
 * Security notes:
 * - Middleware should require authentication before this layout renders.
 * - Backend guards remain authoritative.
 * - Staff users must use the separate admin application.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = {
    title: {
        default: "Dashboard | Asancha",
        template: "%s | Asancha",
    },

    description:
        "Manage your active Asancha business profile.",

    robots: {
        index: false,
        follow: false,
    },
};

export interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}