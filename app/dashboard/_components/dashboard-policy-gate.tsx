"use client";

// File: app/dashboard/_components/dashboard-policy-gate.tsx

/**
 * Dashboard policy gate.
 *
 * Loads role-profile onboarding policy requirements for the active dashboard
 * role and blocks the dashboard with a modal until missing policies are
 * accepted.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { authApiGet, authApiPost } from "@/src/lib/api/auth-fetch";
import type { PublicBusinessProfileType } from "../_types/dashboard.types";

interface DashboardPolicyGateProps {
    profileType: PublicBusinessProfileType | null | undefined;
    onAccepted?: () => void;
}

interface RequiredDashboardPolicy {
    policyType: string;
    currentVersion: string;
    title: string;
    required: boolean;
    context: string;
}

interface RequiredDashboardPoliciesResult {
    context: string;
    profileType: PublicBusinessProfileType;
    resolvedPolicyContext: string;
    allRequiredPolicies: RequiredDashboardPolicy[];
    acceptedPolicies: RequiredDashboardPolicy[];
    missingPolicies: RequiredDashboardPolicy[];
    canProceed: boolean;
}

interface AcceptDashboardPolicyPayload extends Record<string, unknown> {
    context: string;
    profileType: PublicBusinessProfileType;
    policyType: string;
    version: string;
    source: "onboarding";
}

const DASHBOARD_POLICY_CONTEXT = "role_profile_onboarding";

const POLICY_MESSAGES = {
    loadError:
        "We could not load your required profile policies. Refresh the page and try again.",
    acceptError:
        "We could not record the required policy acceptances. Please try again.",
    accepted:
        "Required profile policies have been accepted.",
} as const;

function buildRequiredPoliciesPath(profileType: PublicBusinessProfileType) {
    const searchParams = new URLSearchParams({
        context: DASHBOARD_POLICY_CONTEXT,
        profileType,
    });

    return `/policies/required?${searchParams.toString()}`;
}

function getMissingPolicies(
    result: RequiredDashboardPoliciesResult | null,
): RequiredDashboardPolicy[] {
    if (!result) {
        return [];
    }

    if (result.missingPolicies.length > 0) {
        return result.missingPolicies;
    }

    const acceptedKeys = new Set(
        result.acceptedPolicies.map(
            (policy) => `${policy.policyType}:${policy.currentVersion}`,
        ),
    );

    return result.allRequiredPolicies.filter((policy) => {
        if (!policy.required) {
            return false;
        }

        return !acceptedKeys.has(`${policy.policyType}:${policy.currentVersion}`);
    });
}

export function DashboardPolicyGate({
    profileType,
    onAccepted,
}: DashboardPolicyGateProps) {
    const pathname = usePathname();
    const [policyResult, setPolicyResult] =
        useState<RequiredDashboardPoliciesResult | null>(null);
    const [acceptedPolicyTypes, setAcceptedPolicyTypes] = useState<
        Record<string, boolean>
    >({});
    const [isLoading, setIsLoading] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const shouldCheckPolicies =
        Boolean(profileType) &&
        profileType !== "api_partner" &&
        pathname.startsWith("/dashboard");

    const missingPolicies = useMemo(
        () => getMissingPolicies(policyResult),
        [policyResult],
    );

    const allMissingPoliciesAccepted =
        missingPolicies.length > 0 &&
        missingPolicies.every(
            (policy) =>
                acceptedPolicyTypes[
                    `${policy.policyType}:${policy.currentVersion}`
                ],
        );

    const loadRequiredPolicies = useCallback(async (): Promise<void> => {
        if (!shouldCheckPolicies || !profileType) {
            setPolicyResult(null);
            setAcceptedPolicyTypes({});
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setPolicyResult(null);
        setAcceptedPolicyTypes({});

        try {
            const result =
                await authApiGet<RequiredDashboardPoliciesResult>(
                    buildRequiredPoliciesPath(profileType),
                );

            setPolicyResult(result);
        } catch {
            setErrorMessage(POLICY_MESSAGES.loadError);
        } finally {
            setIsLoading(false);
        }
    }, [profileType, shouldCheckPolicies]);

    useEffect(() => {
        queueMicrotask(() => {
            void loadRequiredPolicies();
        });
    }, [loadRequiredPolicies]);

    async function handleAcceptPolicies() {
        if (!policyResult || !profileType || !allMissingPoliciesAccepted) {
            return;
        }

        setIsAccepting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await Promise.all(
                missingPolicies.map((policy) => {
                    const payload: AcceptDashboardPolicyPayload = {
                        context: policy.context || policyResult.resolvedPolicyContext,
                        profileType,
                        policyType: policy.policyType,
                        version: policy.currentVersion,
                        source: "onboarding",
                    };

                    return authApiPost<unknown, AcceptDashboardPolicyPayload>(
                        "/policy-acceptances",
                        payload,
                    );
                }),
            );

            setSuccessMessage(POLICY_MESSAGES.accepted);
            await loadRequiredPolicies();
            onAccepted?.();
        } catch {
            setErrorMessage(POLICY_MESSAGES.acceptError);
        } finally {
            setIsAccepting(false);
        }
    }

    if (!shouldCheckPolicies) {
        return null;
    }

    if (!isLoading && missingPolicies.length === 0 && !errorMessage) {
        return null;
    }

    return (
        <div
            aria-labelledby="dashboard-policy-gate-heading"
            aria-modal="true"
            className="fixed inset-0 z-[70] grid place-items-center bg-[color-mix(in_srgb,var(--foreground)_55%,transparent)] p-4"
            role="dialog"
        >
            <section className="max-h-[min(42rem,90vh)] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Required policies
                </p>

                <h2
                    className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--foreground)]"
                    id="dashboard-policy-gate-heading"
                >
                    Accept required profile policies before onboarding.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    Your active profile has required policies that must be
                    accepted before you continue with onboarding and protected
                    dashboard actions.
                </p>

                {isLoading ? (
                    <div
                        aria-busy="true"
                        className="mt-6 grid gap-3"
                    >
                        {Array.from({ length: 3 }).map((_item, index) => (
                            <div
                                className="h-14 animate-pulse rounded-md bg-[var(--muted)]"
                                key={index}
                            />
                        ))}
                    </div>
                ) : null}

                {!isLoading && missingPolicies.length > 0 ? (
                    <div className="mt-6 grid gap-3">
                        {missingPolicies.map((policy) => {
                            const policyKey = `${policy.policyType}:${policy.currentVersion}`;

                            return (
                                <label
                                    className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4"
                                    key={policyKey}
                                >
                                    <input
                                        checked={Boolean(
                                            acceptedPolicyTypes[policyKey],
                                        )}
                                        className="mt-1 h-4 w-4 accent-[var(--primary)]"
                                        disabled={isAccepting}
                                        onChange={(event) =>
                                            setAcceptedPolicyTypes((current) => ({
                                                ...current,
                                                [policyKey]: event.target.checked,
                                            }))
                                        }
                                        type="checkbox"
                                    />
                                    <span>
                                        <span className="block text-sm font-bold text-[var(--foreground)]">
                                            {policy.title}
                                        </span>
                                        <span className="mt-1 block text-xs font-semibold text-[var(--muted-foreground)]">
                                            Version {policy.currentVersion}
                                        </span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                ) : null}

                {errorMessage ? (
                    <p
                        className="mt-5 rounded-md border border-[var(--destructive)] bg-[var(--card)] p-4 text-sm leading-6 text-[var(--destructive)]"
                        role="alert"
                    >
                        {errorMessage}
                    </p>
                ) : null}

                {successMessage ? (
                    <p
                        className="mt-5 rounded-md border border-[var(--primary)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--foreground)]"
                        role="status"
                    >
                        {successMessage}
                    </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {errorMessage && missingPolicies.length === 0 ? (
                        <button
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-bold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                            disabled={isLoading}
                            onClick={() => void loadRequiredPolicies()}
                            type="button"
                        >
                            Try again
                        </button>
                    ) : null}

                    {missingPolicies.length > 0 ? (
                        <button
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={
                                isAccepting ||
                                isLoading ||
                                !allMissingPoliciesAccepted
                            }
                            onClick={handleAcceptPolicies}
                            type="button"
                        >
                            {isAccepting
                                ? "Accepting policies"
                                : "Accept required policies"}
                        </button>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
