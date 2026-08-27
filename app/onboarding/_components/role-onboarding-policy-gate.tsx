"use client";

// File: app/onboarding/_components/role-onboarding-policy-gate.tsx

/**
 * Blocks a role-specific onboarding form until the current user has accepted
 * every policy required by the backend for that profile type.
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import {
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import type {
    RoleOnboardingProfileType,
} from "../_lib/role-onboarding-flow";

type StandardRoleOnboardingProfileType = Exclude<
    RoleOnboardingProfileType,
    "api_partner"
>;

interface PolicyAcceptancePayload
    extends Record<string, unknown> {
    policyType: string;
    version: string;
    context: string;
    source: "onboarding";
}

interface RequiredOnboardingPolicy {
    policyType: string;
    currentVersion: string;
    title: string;
    required: boolean;
    context: string;
    acceptance?: PolicyAcceptancePayload;
}

interface RequiredOnboardingPoliciesResult {
    context: "role_profile_onboarding";
    profileType: StandardRoleOnboardingProfileType;
    resolvedPolicyContext: string;
    allRequiredPolicies: RequiredOnboardingPolicy[];
    acceptedPolicies: RequiredOnboardingPolicy[];
    missingPolicies: RequiredOnboardingPolicy[];
    canProceed: boolean;
}

interface RoleOnboardingPolicyGateProps {
    children: ReactNode;
    profileType: StandardRoleOnboardingProfileType;
}

const POLICY_CONTEXT = "role_profile_onboarding";

function getRequiredPoliciesEndpoint(
    profileType: StandardRoleOnboardingProfileType,
): string {
    const searchParams = new URLSearchParams({
        context: POLICY_CONTEXT,
        profileType,
    });

    return `/policies/required?${searchParams.toString()}`;
}

function getPolicyKey(
    policy: RequiredOnboardingPolicy,
): string {
    return `${policy.policyType}:${policy.currentVersion}:${policy.context}`;
}

function resolveMissingPolicies(
    result: RequiredOnboardingPoliciesResult,
): RequiredOnboardingPolicy[] {
    if (result.missingPolicies.length > 0) {
        return result.missingPolicies;
    }

    const acceptedPolicyKeys = new Set(
        result.acceptedPolicies.map(getPolicyKey),
    );

    return result.allRequiredPolicies.filter(
        (policy) =>
            policy.required &&
            !acceptedPolicyKeys.has(getPolicyKey(policy)),
    );
}

function getAcceptancePayload(
    policy: RequiredOnboardingPolicy,
    resolvedPolicyContext: string,
): PolicyAcceptancePayload {
    return {
        policyType:
            policy.acceptance?.policyType ??
            policy.policyType,
        version:
            policy.acceptance?.version ??
            policy.currentVersion,
        context:
            policy.acceptance?.context ||
            policy.context ||
            resolvedPolicyContext,
        source: "onboarding",
    };
}

function getPolicyHref(policyType: string): string {
    return `/account/policies?policyType=${encodeURIComponent(policyType)}`;
}

export function RoleOnboardingPolicyGate({
    children,
    profileType,
}: RoleOnboardingPolicyGateProps) {
    const hasStartedInitialPolicyCheck = useRef(false);
    const [policyResult, setPolicyResult] =
        useState<RequiredOnboardingPoliciesResult | null>(
            null,
        );
    const [acceptedPolicyKeys, setAcceptedPolicyKeys] =
        useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const missingPolicies = useMemo(
        () =>
            policyResult
                ? resolveMissingPolicies(policyResult)
                : [],
        [policyResult],
    );

    const allMissingPoliciesSelected =
        missingPolicies.length > 0 &&
        missingPolicies.every(
            (policy) =>
                acceptedPolicyKeys[getPolicyKey(policy)],
        );

    const canProceed =
        policyResult?.canProceed === true &&
        missingPolicies.length === 0;

    const loadRequiredPolicies = useCallback(
        async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<RequiredOnboardingPoliciesResult>(
                        getRequiredPoliciesEndpoint(
                            profileType,
                        ),
                    );

                setPolicyResult(result);
                setAcceptedPolicyKeys({});

                if (
                    !result.canProceed &&
                    resolveMissingPolicies(result)
                        .length === 0
                ) {
                    setErrorMessage(
                        "The policy check has not allowed onboarding to continue yet. Try the check again.",
                    );
                }
            } catch {
                setPolicyResult(null);
                setErrorMessage(
                    "We could not load the policies required for this profile. Try again before continuing.",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [profileType],
    );

    useEffect(() => {
        if (hasStartedInitialPolicyCheck.current) {
            return;
        }

        hasStartedInitialPolicyCheck.current = true;

        queueMicrotask(() => {
            void loadRequiredPolicies();
        });
    }, [loadRequiredPolicies]);

    const acceptRequiredPolicies = async (): Promise<void> => {
        if (
            !policyResult ||
            !allMissingPoliciesSelected
        ) {
            return;
        }

        setIsAccepting(true);
        setErrorMessage(null);

        try {
            await Promise.all(
                missingPolicies.map((policy) =>
                    authApiPost<
                        unknown,
                        PolicyAcceptancePayload
                    >(
                        "/policy-acceptances",
                        getAcceptancePayload(
                            policy,
                            policyResult.resolvedPolicyContext,
                        ),
                    ),
                ),
            );

            await loadRequiredPolicies();
        } catch {
            setErrorMessage(
                "We could not record all required policy acceptances. Try again.",
            );
        } finally {
            setIsAccepting(false);
        }
    };

    if (canProceed) {
        return children;
    }

    return (
        <div
            aria-describedby="onboarding-policy-gate-description"
            aria-labelledby="onboarding-policy-gate-heading"
            aria-modal="true"
            className="fixed inset-0 z-[80] grid place-items-center bg-[color-mix(in_srgb,var(--foreground)_55%,transparent)] p-4"
            role="dialog"
        >
            <section className="max-h-[min(44rem,90vh)] w-full max-w-2xl overflow-y-auto rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Required policies
                </p>

                <h1
                    className="mt-2 text-2xl font-bold tracking-tight"
                    id="onboarding-policy-gate-heading"
                >
                    Accept required policies before onboarding
                </h1>

                <p
                    className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]"
                    id="onboarding-policy-gate-description"
                >
                    Review and accept every outstanding
                    policy for this profile. Your
                    onboarding will start only after the
                    backend confirms that you can
                    proceed.
                </p>

                {isLoading ? (
                    <div
                        aria-busy="true"
                        aria-label="Loading required policies"
                        className="mt-6 grid gap-3"
                    >
                        {Array.from({ length: 3 }).map(
                            (_item, index) => (
                                <div
                                    className="h-16 animate-pulse rounded-[var(--asancha-radius-md)] bg-[var(--muted)]"
                                    key={index}
                                />
                            ),
                        )}
                    </div>
                ) : null}

                {!isLoading &&
                missingPolicies.length > 0 ? (
                    <div className="mt-6 grid gap-3">
                        {missingPolicies.map((policy) => {
                            const policyKey =
                                getPolicyKey(policy);

                            return (
                                <label
                                    className="flex items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4"
                                    key={policyKey}
                                >
                                    <input
                                        checked={Boolean(
                                            acceptedPolicyKeys[
                                                policyKey
                                            ],
                                        )}
                                        className="mt-1 size-4 accent-[var(--primary)]"
                                        disabled={isAccepting}
                                        onChange={(event) =>
                                            setAcceptedPolicyKeys(
                                                (current) => ({
                                                    ...current,
                                                    [policyKey]:
                                                        event
                                                            .target
                                                            .checked,
                                                }),
                                            )
                                        }
                                        type="checkbox"
                                    />

                                    <span>
                                        <a
                                            className="text-sm font-bold text-[var(--primary)] hover:underline"
                                            href={getPolicyHref(
                                                policy.policyType,
                                            )}
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            {policy.title}
                                        </a>

                                        <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
                                            Version{" "}
                                            {
                                                policy.currentVersion
                                            }
                                        </span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                ) : null}

                {errorMessage ? (
                    <p
                        className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm leading-6 text-[var(--destructive)]"
                        role="alert"
                    >
                        {errorMessage}
                    </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {errorMessage &&
                    missingPolicies.length === 0 ? (
                        <button
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-bold hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]"
                            disabled={isLoading}
                            onClick={() =>
                                void loadRequiredPolicies()
                            }
                            type="button"
                        >
                            Try again
                        </button>
                    ) : null}

                    {missingPolicies.length > 0 ? (
                        <button
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={
                                isLoading ||
                                isAccepting ||
                                !allMissingPoliciesSelected
                            }
                            onClick={() =>
                                void acceptRequiredPolicies()
                            }
                            type="button"
                        >
                            {isAccepting
                                ? "Accepting policies…"
                                : "Accept all and continue"}
                        </button>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
