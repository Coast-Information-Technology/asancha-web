"use client";

// File: app/dashboard/_components/property-sourcer-policy-page.tsx

/**
 * Asancha Property Sourcer Policy Page
 *
 * Purpose:
 * Displays and accepts the current listing-standards or sourcer-compliance
 * policy version.
 *
 * Security notes:
 * - The backend must return the current authoritative policy version.
 * - Acceptance must be recorded in policy_acceptances.
 */

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import type {
    AcceptSourcerPolicyPayload,
    SourcerPolicyDocument,
} from "../_types/property-sourcer-dashboard.types";

export interface PropertySourcerPolicyPageProps {
    policyKey:
        | "listing_standards"
        | "sourcer_compliance_declaration";
}

interface AcceptSourcerPolicyResult {
    accepted: true;
    policyKey:
        | "listing_standards"
        | "sourcer_compliance_declaration";
    version: string;
    acceptedAt: string;
    message: string;
}

export function PropertySourcerPolicyPage({
    policyKey,
}: PropertySourcerPolicyPageProps) {
    const router = useRouter();

    const [policy, setPolicy] =
        useState<SourcerPolicyDocument | null>(
            null,
        );

    const [acceptedConfirmed, setAcceptedConfirmed] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isAccepting, setIsAccepting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const loadPolicy =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<SourcerPolicyDocument>(
                        `/policies/current/${encodeURIComponent(
                            policyKey,
                        )}`,
                    );

                setPolicy(result);
            } catch {
                setErrorMessage(
                    "We could not load the current policy.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [policyKey]);

    useEffect((): void => {
        void loadPolicy();
    }, [loadPolicy]);

    const acceptPolicy =
        async (): Promise<void> => {
            if (
                !policy ||
                !acceptedConfirmed
            ) {
                return;
            }

            setIsAccepting(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            const payload:
                AcceptSourcerPolicyPayload = {
                data: {
                    policyKey,
                    version: policy.version,
                    accepted: true,
                },
            };

            try {
                const result =
                    await authApiPost<AcceptSourcerPolicyResult>(
                        "/policy-acceptances",
                        payload,
                    );

                setSuccessMessage(
                    result.message,
                );

                await loadPolicy();
                router.refresh();
            } catch {
                setErrorMessage(
                    "We could not record your policy acceptance.",
                );
            } finally {
                setIsAccepting(false);
            }
        };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    if (!policy) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "This policy is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Sourcer compliance
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    {policy.title}
                </h1>

                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                    Version {policy.version} · Effective{" "}
                    {new Date(
                        policy.effectiveAt,
                    ).toLocaleDateString("en-GB")}
                </p>

                <p className="mt-4 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    {policy.summary}
                </p>
            </header>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-md border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-md border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            <article className="mt-6 grid gap-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                {policy.sections.map(
                    (section): ReactNode => (
                        <section
                            key={section.sectionKey}
                        >
                            <h2 className="text-xl font-bold">
                                {section.title}
                            </h2>

                            <div className="mt-3 grid gap-3 text-sm leading-7 text-[var(--muted-foreground)]">
                                {section.paragraphs.map(
                                    (
                                        paragraph: string,
                                    ): ReactNode => (
                                        <p
                                            key={
                                                paragraph
                                            }
                                        >
                                            {paragraph}
                                        </p>
                                    ),
                                )}
                            </div>
                        </section>
                    ),
                )}
            </article>

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                {policy.alreadyAccepted &&
                policy.acceptedVersion ===
                    policy.version ? (
                    <div>
                        <h2 className="font-bold">
                            Current version accepted
                        </h2>

                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            Accepted on{" "}
                            {policy.acceptedAt
                                ? new Date(
                                      policy.acceptedAt,
                                  ).toLocaleString(
                                      "en-GB",
                                  )
                                : "the recorded acceptance date"}
                            .
                        </p>
                    </div>
                ) : (
                    <>
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    acceptedConfirmed
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    setAcceptedConfirmed(
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4"
                            />

                            <span className="text-sm leading-6">
                                I have read and accept
                                version {policy.version} of{" "}
                                {policy.title}.
                            </span>
                        </label>

                        <button
                            type="button"
                            disabled={
                                !acceptedConfirmed ||
                                isAccepting
                            }
                            onClick={(): void => {
                                void acceptPolicy();
                            }}
                            className="mt-5 min-h-11 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isAccepting
                                ? "Recording acceptance…"
                                : "Accept current version"}
                        </button>
                    </>
                )}
            </section>
        </main>
    );
}