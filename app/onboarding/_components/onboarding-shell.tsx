// File: app/onboarding/_components/onboarding-shell.tsx

/**
 * Asancha Onboarding Shell
 *
 * Purpose:
 * Provides the shared visual structure for all onboarding pages.
 *
 * Responsibilities:
 * - Display Asancha onboarding identity and progress context.
 * - Keep onboarding content centred and readable.
 * - Provide safe support and sign-out links.
 *
 * Security notes:
 * - This shell does not provide authentication or authorisation.
 * - Middleware and backend checks remain authoritative.
 */

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export interface OnboardingShellProps {
    children: ReactNode;
}

export function OnboardingShell({
    children,
}: OnboardingShellProps) {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <header className="border-b border-[var(--border)] bg-[var(--card)]">
                <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] focus-visible:ring-offset-2"
                    >
                        <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-[var(--asancha-radius-md)] bg-white">
                            <Image
                                alt="Asancha"
                                src="/logo.png"
                                width={44}
                                height={44}
                                className="h-11 w-auto object-contain"
                                priority
                            />
                        </span>

                        <span>
                            <span className="block text-sm font-bold">
                                Asancha
                            </span>
                            <span className="block text-xs text-[var(--muted-foreground)]">
                                Account setup
                            </span>
                        </span>
                    </Link>

                    <nav
                        aria-label="Onboarding assistance"
                        className="flex items-center gap-2"
                    >
                        <Link
                            href="/support"
                            className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                        >
                            Support
                        </Link>

                        <Link
                            href="/account"
                            className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                        >
                            My account
                        </Link>
                    </nav>
                </div>
            </header>

            {children}

            <footer className="border-t border-[var(--border)] bg-[var(--card)]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>
                        Your information is used to operate and
                        secure your Asancha account.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/legal/privacy"
                            className="hover:text-[var(--foreground)] hover:underline"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/legal/terms"
                            className="hover:text-[var(--foreground)] hover:underline"
                        >
                            Terms
                        </Link>

                        <Link
                            href="/legal/platform-rules"
                            className="hover:text-[var(--foreground)] hover:underline"
                        >
                            Platform rules
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
