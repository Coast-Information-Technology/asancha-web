"use client";

// File: app/account/_components/add-business-profile-page.tsx

/**
 * Asancha Add Business Profile Page
 *
 * Purpose:
 * Allows an existing user to add another approved public business profile
 * without registering a second account.
 *
 * Security notes:
 * - Staff, admin, super-admin, and guest profile types must never be accepted.
 * - Required policy acceptance remains backend-authoritative.
 * - Duplicate-profile and company requirements remain backend-controlled.
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import {
    getDashboardPathForBusinessProfile,
    isBusinessProfileType,
} from "../../../src/lib/auth/role-guards";
import {
    BUSINESS_PROFILE_TYPE_OPTIONS,
} from "../_config/account-navigation.config";
import type {
    AccountBusinessProfileType,
    AvailableBusinessProfileType,
    AvailableBusinessProfileTypesResponse,
    CreateBusinessProfileFormValues,
    CreateBusinessProfilePayload,
    CreateBusinessProfileResult,
} from "../_types/account.types";

const INITIAL_VALUES:
    CreateBusinessProfileFormValues = {
    profileType: "",

    companyPublicId: null,

    acceptedPolicies: [],
};

interface BackendBusinessProfileSummary {
    publicId: string;
    profileType: AccountBusinessProfileType;
    verificationStatus: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    summary: Record<string, unknown>;
}

interface RequiredProfilePolicy {
    policyType: string;
    currentVersion: string;
    title: string;
    required: boolean;
    context: string;
}

interface RequiredProfilePoliciesResponse {
    context: string;
    profileType: AccountBusinessProfileType;
    resolvedPolicyContext: string;
    allRequiredPolicies: RequiredProfilePolicy[];
    acceptedPolicies: RequiredProfilePolicy[];
    missingPolicies: RequiredProfilePolicy[];
    canProceed: boolean;
}

interface PolicyAcceptancePayload
    extends Record<string, unknown> {
    context: string;
    profileType: AccountBusinessProfileType;
    policyType: string;
    version: string;
    source: "onboarding";
}

function getBusinessProfileDestination(
    result:
        | CreateBusinessProfileResult
        | BackendBusinessProfileSummary,
): string {
    if ("profile" in result) {
        return (
            result.onboardingPath ??
            result.profile.detailPath
        );
    }

    if (isBusinessProfileType(result.profileType)) {
        return getDashboardPathForBusinessProfile(
            result.profileType,
        );
    }

    return "/dashboard";
}

function getRequiredPoliciesEndpoint(
    profileType: AccountBusinessProfileType,
): string {
    const searchParams = new URLSearchParams({
        context: "role_profile_onboarding",
        profileType,
    });

    return `/policies/required?${searchParams.toString()}`;
}

function getPolicyHref(policyType: string): string {
    return `/account/policies?policyType=${encodeURIComponent(policyType)}`;
}

function createAvailableTypesFromProfiles(
    profiles:
        BackendBusinessProfileSummary[],
): AvailableBusinessProfileTypesResponse {
    const createdProfileTypes = new Set(
        profiles.map(
            (profile) => profile.profileType,
        ),
    );

    return {
        items: BUSINESS_PROFILE_TYPE_OPTIONS.map(
            (option) => {
                const alreadyCreated =
                    createdProfileTypes.has(
                        option.profileType,
                    );

                return {
                    profileType:
                        option.profileType,
                    available: !alreadyCreated,
                    alreadyCreated,
                    requiresCompany: false,
                    companyOptional: true,
                    lockedReason:
                        alreadyCreated
                            ? "This business profile already exists for your account."
                            : null,
                    requiredPolicies: [],
                };
            },
        ),
        safeUserMessage: null,
    };
}

export function AddBusinessProfilePage() {
    const router = useRouter();

    const [availableTypes, setAvailableTypes] =
        useState<AvailableBusinessProfileTypesResponse | null>(
            null,
        );

    const [values, setValues] =
        useState<CreateBusinessProfileFormValues>(
            INITIAL_VALUES,
        );
    const [
        policyRequirement,
        setPolicyRequirement,
    ] =
        useState<RequiredProfilePoliciesResponse | null>(
            null,
        );
    const [
        acceptedMissingPolicies,
        setAcceptedMissingPolicies,
    ] = useState<Record<string, boolean>>({});

    const [isLoading, setIsLoading] =
        useState(true);

    const [isLoadingPolicies, setIsLoadingPolicies] =
        useState(false);

    const [isCreating, setIsCreating] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadAvailableTypes =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<
                        BackendBusinessProfileSummary[]
                    >(
                        "/profiles/me/business-profiles",
                    );

                setAvailableTypes(
                    createAvailableTypesFromProfiles(
                        result,
                    ),
                );
            } catch {
                setErrorMessage(
                    "We could not load the available business-profile types.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        queueMicrotask(() => {
            void loadAvailableTypes();
        });
    }, [loadAvailableTypes]);

    const loadRequiredPolicies =
        useCallback(
            async (
                profileType:
                    AccountBusinessProfileType,
            ): Promise<void> => {
                setIsLoadingPolicies(true);
                setPolicyRequirement(null);
                setAcceptedMissingPolicies({});
                setErrorMessage(null);

                try {
                    const result =
                        await authApiGet<RequiredProfilePoliciesResponse>(
                            getRequiredPoliciesEndpoint(
                                profileType,
                            ),
                        );

                    setPolicyRequirement(result);
                } catch {
                    setErrorMessage(
                        "We could not load the policies required for this profile.",
                    );
                } finally {
                    setIsLoadingPolicies(false);
                }
            },
            [],
        );

    const selectedType =
        useMemo(
            ():
                | AvailableBusinessProfileType
                | null =>
                availableTypes?.items.find(
                    (
                        item:
                            AvailableBusinessProfileType,
                    ): boolean =>
                        item.profileType ===
                        values.profileType,
                ) ?? null,
            [
                availableTypes,
                values.profileType,
            ],
        );

    const selectProfileType = (
        profileType:
            CreateBusinessProfileFormValues["profileType"],
    ): void => {
        setValues({
            profileType,

            companyPublicId: null,

            acceptedPolicies: [],
        });

        setErrorMessage(null);

        if (profileType) {
            void loadRequiredPolicies(profileType);
        }
    };

    const updatePolicyAcceptance = (
        policyType: string,
        accepted: boolean,
    ): void => {
        setAcceptedMissingPolicies((current) => ({
            ...current,
            [policyType]: accepted,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (
            !values.profileType ||
            !selectedType
        ) {
            setErrorMessage(
                "Choose a business-profile type.",
            );
            return;
        }

        if (!selectedType.available) {
            setErrorMessage(
                selectedType.lockedReason ??
                    "This business-profile type is unavailable.",
            );
            return;
        }

        if (
            selectedType.requiresCompany &&
            !values.companyPublicId
        ) {
            setErrorMessage(
                "Enter the public ID of the company connected to this profile.",
            );
            return;
        }

        const missingPolicies =
            policyRequirement?.missingPolicies ??
            [];

        if (
            missingPolicies.some(
                (policy) =>
                    !acceptedMissingPolicies[
                        policy.policyType
                    ],
            )
        ) {
            setErrorMessage(
                "Accept all required policies before creating this profile.",
            );
            return;
        }

        setIsCreating(true);
        setErrorMessage(null);

        const payload:
            CreateBusinessProfilePayload = {
            profileType:
                values.profileType,

            companyPublicId:
                values.companyPublicId,
        };

        try {
            if (policyRequirement) {
                await Promise.all(
                    missingPolicies.map(
                        (policy) => {
                            const acceptancePayload:
                                PolicyAcceptancePayload =
                                {
                                    context:
                                        policy.context ||
                                        policyRequirement.resolvedPolicyContext,
                                    profileType:
                                        values.profileType as AccountBusinessProfileType,
                                    policyType:
                                        policy.policyType,
                                    version:
                                        policy.currentVersion,
                                    source:
                                        "onboarding",
                                };

                            return authApiPost<
                                unknown,
                                PolicyAcceptancePayload
                            >(
                                "/policy-acceptances",
                                acceptancePayload,
                            );
                        },
                    ),
                );
            }

            const result =
                await authApiPost<
                    | CreateBusinessProfileResult
                    | BackendBusinessProfileSummary,
                    CreateBusinessProfilePayload
                >(
                    "/profiles/me/business-profiles",
                    payload,
                );

            router.push(
                getBusinessProfileDestination(
                    result,
                ),
            );

            router.refresh();
        } catch {
            setErrorMessage(
                "We could not create this business profile.",
            );
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Business profiles
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Add business profile
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Add another role-specific profile to
                    your existing account. You do not
                    need to register again.
                </p>
            </header>

            {availableTypes?.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {
                        availableTypes.safeUserMessage
                    }
                </div>
            ) : null}

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section>
                    <h2 className="text-xl font-bold">
                        Choose profile type
                    </h2>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {BUSINESS_PROFILE_TYPE_OPTIONS.map(
                            (option): ReactNode => {
                                const availability =
                                    availableTypes?.items.find(
                                        (
                                            item:
                                                AvailableBusinessProfileType,
                                        ): boolean =>
                                            item.profileType ===
                                            option.profileType,
                                    );

                                const available =
                                    availability
                                        ?.available ??
                                    false;

                                const selected =
                                    values.profileType ===
                                    option.profileType;

                                return (
                                    <label
                                        key={
                                            option.profileType
                                        }
                                        className={`rounded-[var(--asancha-radius-lg)] border p-5 ${
                                            selected
                                                ? "border-[var(--primary)] bg-[var(--muted)]"
                                                : "border-[var(--border)] bg-[var(--card)]"
                                        } ${
                                            available
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-60"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="profileType"
                                            value={
                                                option.profileType
                                            }
                                            disabled={
                                                !available
                                            }
                                            checked={
                                                selected
                                            }
                                            onChange={(): void =>
                                                selectProfileType(
                                                    option.profileType,
                                                )
                                            }
                                            className="sr-only"
                                        />

                                        <h3 className="font-bold">
                                            {
                                                option.label
                                            }
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                            {
                                                option.description
                                            }
                                        </p>

                                        {availability
                                            ?.alreadyCreated ? (
                                            <p className="mt-3 text-xs font-semibold text-[var(--muted-foreground)]">
                                                Already created
                                            </p>
                                        ) : null}

                                        {availability
                                            ?.lockedReason ? (
                                            <p className="mt-3 text-xs leading-5 text-[var(--destructive)]">
                                                {
                                                    availability.lockedReason
                                                }
                                            </p>
                                        ) : null}
                                    </label>
                                );
                            },
                        )}
                    </div>
                </section>

                {selectedType ? (
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Profile requirements
                        </h2>

                        {selectedType.requiresCompany ||
                        selectedType.companyOptional ? (
                            <div className="mt-5">
                                <label
                                    htmlFor="companyPublicId"
                                    className="text-sm font-semibold"
                                >
                                    Company public ID
                                    {selectedType.companyOptional
                                        ? " (optional)"
                                        : ""}
                                </label>

                                <input
                                    id="companyPublicId"
                                    required={
                                        selectedType.requiresCompany
                                    }
                                    value={
                                        values.companyPublicId ??
                                        ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        setValues(
                                            (current) => ({
                                                ...current,
                                                companyPublicId:
                                                    event
                                                        .target
                                                        .value ||
                                                    null,
                                            }),
                                        )
                                    }
                                    className="mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                                />
                            </div>
                        ) : null}

                        <div className="mt-6">
                            <h3 className="font-bold">
                                Required policies
                            </h3>

                            {isLoadingPolicies ? (
                                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                    Loading required policies...
                                </p>
                            ) : policyRequirement?.missingPolicies
                                  .length ? (
                                <div className="mt-3 grid gap-3">
                                    {policyRequirement.missingPolicies.map(
                                        (
                                            policy,
                                        ): ReactNode => {
                                            return (
                                                <label
                                                    key={
                                                        policy.policyType
                                                    }
                                                    className="flex items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            acceptedMissingPolicies[
                                                                policy
                                                                    .policyType
                                                            ] ??
                                                            false
                                                        }
                                                        onChange={(
                                                            event: ChangeEvent<HTMLInputElement>,
                                                        ): void =>
                                                            updatePolicyAcceptance(
                                                                policy.policyType,
                                                                event
                                                                    .target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="mt-1 h-4 w-4 accent-[var(--primary)]"
                                                    />

                                                    <span>
                                                        <a
                                                            href={getPolicyHref(
                                                                policy.policyType,
                                                            )}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block text-sm font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                                                        >
                                                            {policy.title}
                                                        </a>

                                                        <span className="mt-1 block text-sm leading-6 text-[var(--muted-foreground)]">
                                                            Review and accept this required policy before creating the profile.
                                                        </span>

                                                        <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
                                                            Version{" "}
                                                            {
                                                                policy.currentVersion
                                                            }
                                                        </span>
                                                    </span>
                                                </label>
                                            );
                                        },
                                    )}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                    No additional policy acceptance is required.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={
                                isCreating ||
                                isLoadingPolicies ||
                                !selectedType.available
                            }
                            className="mt-6 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isCreating
                                ? "Creating…"
                                : "Create business profile"}
                        </button>
                    </section>
                ) : null}
            </form>
        </main>
    );
}
