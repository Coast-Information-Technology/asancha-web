// File: app/dashboard-ui/layout.tsx

/**
 * Dashboard UI Preview Layout
 *
 * Purpose:
 * Provides an unprotected UI-only dashboard workspace backed by local dummy
 * data. This route exists so dashboard UX can be designed without weakening
 * the real /dashboard protected routes.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardShell } from "../dashboard/_components/dashboard-shell";

export const metadata: Metadata = {
    title: {
        default: "Dashboard UI Preview | Asancha",
        template: "%s | Asancha",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export interface DashboardUiLayoutProps {
    children: ReactNode;
}

export default function DashboardUiLayout({
    children,
}: DashboardUiLayoutProps) {
    return <DashboardShell>{children}</DashboardShell>;
}
