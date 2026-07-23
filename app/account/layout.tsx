// File: app/account/layout.tsx

/**
 * Asancha Account Layout
 *
 * Purpose:
 * Wraps authenticated account routes with the dashboard navigation shell.
 */

import type {
    ReactNode,
} from "react";

import { DashboardShell } from "../dashboard/_components/dashboard-shell";

export interface AccountLayoutProps {
    children: ReactNode;
}

export default function AccountLayout({
    children,
}: AccountLayoutProps) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
