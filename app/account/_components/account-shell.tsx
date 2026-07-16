"use client";

// File: app/account/_components/account-shell.tsx

/**
 * Asancha Account Shell
 *
 * Purpose:
 * Provides account navigation and a consistent authenticated account layout.
 *
 * Security notes:
 * - Navigation is UX only.
 * - Backend account and route guards remain authoritative.
 */

import Link from "next/link";
import {
    usePathname,
} from "next/navigation";
import type {
    ReactNode,
} from "react";

import {
    ACCOUNT_NAVIGATION,
    type AccountNavigationItem,
} from "../_config/account-navigation.config";

export interface AccountShellProps {
    children: ReactNode;
}

function isNavigationItemActive(
    pathname: string,
    item: AccountNavigationItem,
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

export function AccountShell({
    children,
}: AccountShellProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <header className="border-b border-[var(--border)] bg-[var(--card)]">
                <div className="mx-auto flex min-h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-[var(--asancha-radius-md)] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                    >
                        <span
                            aria-hidden="true"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                        >
                            A
                        </span>

                        <span>Asancha</span>
                    </Link>

                    <nav
                        aria-label="Account utilities"
                        className="flex items-center gap-2"
                    >
                        <Link
                            href="/dashboard"
                            className="rounded-[var(--asancha-radius-md)] px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/marketplace"
                            className="hidden rounded-[var(--asancha-radius-md)] px-3 py-2 text-sm font-semibold hover:bg-[var(--muted)] sm:inline-flex"
                        >
                            Marketplace
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-[90rem] lg:grid-cols-[16rem_minmax(0,1fr)]">
                <aside className="border-b border-[var(--border)] bg-[var(--card)] p-4 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
                    <p className="px-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                        Account
                    </p>

                    <nav
                        aria-label="Account navigation"
                        className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible"
                    >
                        {ACCOUNT_NAVIGATION.map(
                            (
                                item:
                                    AccountNavigationItem,
                            ) => {
                                const active =
                                    isNavigationItemActive(
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
                                        className={`whitespace-nowrap rounded-[var(--asancha-radius-md)] px-3 py-2.5 text-sm font-medium transition-colors ${
                                            active
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
                </aside>

                <div className="min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}