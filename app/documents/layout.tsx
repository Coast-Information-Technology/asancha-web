// File: app/documents/layout.tsx

/**
 * Asancha Documents Layout
 *
 * Purpose:
 * Wraps authenticated document routes with the dashboard navigation shell so
 * document workflows stay inside the protected dashboard experience.
 */

import type {
    ReactNode,
} from "react";

import { DashboardShell } from "../dashboard/_components/dashboard-shell";

export interface DocumentsLayoutProps {
    children: ReactNode;
}

export default function DocumentsLayout({
    children,
}: DocumentsLayoutProps) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
