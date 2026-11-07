"use client";

// File: app/_components/authenticated-app-shell.tsx

/**
 * Keeps the authenticated public-user shell mounted while users navigate
 * between protected workspace and account route groups.
 *
 * Route-specific layouts may still provide metadata, but they must not create
 * their own DashboardShell instance. Keeping that responsibility here avoids
 * reloading profile context and sidebar navigation at sibling route boundaries.
 */

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const DashboardShell = dynamic(
    async () => {
        const dashboardShellModule = await import(
            "../dashboard/_components/dashboard-shell"
        );

        return dashboardShellModule.DashboardShell;
    },
);

const AUTHENTICATED_SHELL_ROUTE_PREFIXES = [
    "/dashboard",
    "/account",
    "/documents",
    "/verification",
    "/payments",
    "/conversations",
] as const;

export interface AuthenticatedAppShellProps {
    children: ReactNode;
}

function usesAuthenticatedShell(
    pathname: string,
): boolean {
    return AUTHENTICATED_SHELL_ROUTE_PREFIXES.some(
        (routePrefix): boolean =>
            pathname === routePrefix ||
            pathname.startsWith(
                `${routePrefix}/`,
            ),
    );
}

export function AuthenticatedAppShell({
    children,
}: AuthenticatedAppShellProps) {
    const pathname = usePathname();

    if (!usesAuthenticatedShell(pathname)) {
        return children;
    }

    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
