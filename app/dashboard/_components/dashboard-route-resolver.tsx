"use client";

// File: app/dashboard/_components/dashboard-route-resolver.tsx

/**
 * Asancha Dashboard Route Resolver
 *
 * Purpose:
 * Resolves `/dashboard` through the session route so refresh-token renewal can
 * set fresh auth cookies before the user is routed to their active dashboard.
 *
 * Security notes:
 * - This is UX routing only.
 * - Backend session, profile, policy, verification, and permission checks
 *   remain authoritative.
 */

import {
    useRouter,
} from "next/navigation";
import {
    useEffect,
    useState,
} from "react";

interface AuthSessionEnvelope {
    success: boolean;
    data: {
        authenticated: boolean;
        dashboardHref: string | null;
    } | null;
}

const SIGN_IN_PATH =
    "/auth/sign-in?redirect=%2Fdashboard";

async function loadSession(): Promise<AuthSessionEnvelope | null> {
    const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "X-Asancha-Client": "asancha-web",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    return (await response.json()) as AuthSessionEnvelope;
}

export function DashboardRouteResolver() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function resolveRoute(): Promise<void> {
            try {
                const session = await loadSession();

                if (!isActive) {
                    return;
                }

                if (
                    !session?.success ||
                    !session.data?.authenticated
                ) {
                    router.replace(SIGN_IN_PATH);
                    return;
                }

                router.replace(
                    session.data.dashboardHref ??
                        "/onboarding",
                );
            } catch {
                if (!isActive) {
                    return;
                }

                setErrorMessage(
                    "We could not resolve your dashboard. Sign in again to continue.",
                );
                router.replace(SIGN_IN_PATH);
            }
        }

        void resolveRoute();

        return () => {
            isActive = false;
        };
    }, [router]);

    return (
        <main className="px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Dashboard
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight">
                    Opening your workspace
                </h1>

                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    We are checking your active profile and
                    sending you to the right dashboard.
                </p>

                {errorMessage ? (
                    <div
                        role="alert"
                        className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                    >
                        {errorMessage}
                    </div>
                ) : null}
            </section>
        </main>
    );
}
