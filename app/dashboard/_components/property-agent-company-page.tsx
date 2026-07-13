"use client";

// File: app/dashboard/_components/property-agent-company-page.tsx

/**
 * Asancha Property Agent Company Page
 *
 * Purpose:
 * Displays and updates the agency/company linked to the active property-agent
 * profile.
 *
 * Security notes:
 * - Backend membership and member-role checks determine edit permission.
 * - A company role does not automatically grant mutation permission.
 */

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    authApiGet,
    authApiPatch,
} from "../../../src/lib/api/auth-fetch";
import type {
    AgentCompanyFormValues,
    AgentCompanySummary,
    UpdateAgentCompanyPayload,
} from "../_types/property-agent-dashboard.types";

function companyToFormValues(
    company: AgentCompanySummary,
): AgentCompanyFormValues {
    return {
        companyName: company.companyName,
        tradingName: company.tradingName,

        companyRegistrationNumber:
            company.companyRegistrationNumber,

        website: company.website,

        primaryBusinessRole:
            "property_agent",

        businessRoles:
            company.businessRoles,

        registeredAddress:
            company.registeredAddress,

        informationAccurateConfirmed:
            false,
    };
}

export function PropertyAgentCompanyPage() {
    const [
        company,
        setCompany,
    ] = useState<AgentCompanySummary | null>(
        null,
    );

    const [
        values,
        setValues,
    ] = useState<AgentCompanyFormValues | null>(
        null,
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    const loadCompany =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AgentCompanySummary>(
                        "/companies/me",
                    );

                setCompany(result);
                setValues(
                    companyToFormValues(result),
                );
            } catch {
                setErrorMessage(
                    "We could not load the company linked to your property-agent profile.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void loadCompany();
    }, [loadCompany]);

    const updateRootValue = <
        TKey extends keyof AgentCompanyFormValues,
    >(
        key: TKey,
        value: AgentCompanyFormValues[TKey],
    ): void => {
        setValues((current) =>
            current
                ? {
                    ...current,
                    [key]: value,
                }
                : current,
        );
    };

    const updateAddressValue = <
        TKey extends keyof AgentCompanyFormValues["registeredAddress"],
    >(
        key: TKey,
        value: AgentCompanyFormValues["registeredAddress"][TKey],
    ): void => {
        setValues((current) =>
            current
                ? {
                    ...current,
                    registeredAddress: {
                        ...current.registeredAddress,
                        [key]: value,
                    },
                }
                : current,
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (
            !company ||
            !values ||
            !company.canEdit
        ) {
            return;
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that the company information is accurate.",
            );

            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateAgentCompanyPayload = {
            data: values,
        };

        try {
            const result =
                await authApiPatch<AgentCompanySummary>(
                    `/companies/${encodeURIComponent(
                        company.companyPublicId,
                    )}`,
                    payload,
                );

            setCompany(result);
            setValues(
                companyToFormValues(result),
            );

            setSuccessMessage(
                "Company information has been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update the company information.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    if (!company || !values) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-md border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "No company is linked to this profile."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Agency company
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Company
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Review the company linked to your
                    active property-agent profile.
                </p>
            </header>

            {company.safeUserMessage ? (
                <div className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {company.safeUserMessage}
                </div>
            ) : null}

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

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold">
                            {company.status}
                        </span>

                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                            {company.verificationStatus}
                        </span>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="companyName"
                                className="text-sm font-semibold"
                            >
                                Company name
                            </label>

                            <input
                                id="companyName"
                                required
                                disabled={!company.canEdit}
                                value={values.companyName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "companyName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tradingName"
                                className="text-sm font-semibold"
                            >
                                Trading name
                            </label>

                            <input
                                id="tradingName"
                                disabled={!company.canEdit}
                                value={
                                    values.tradingName ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "tradingName",
                                        event.target.value ||
                                        null,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="companyRegistrationNumber"
                                className="text-sm font-semibold"
                            >
                                Company registration
                                number
                            </label>

                            <input
                                id="companyRegistrationNumber"
                                required
                                disabled={!company.canEdit}
                                value={
                                    values.companyRegistrationNumber
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "companyRegistrationNumber",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="website"
                                className="text-sm font-semibold"
                            >
                                Website
                            </label>

                            <input
                                id="website"
                                type="url"
                                disabled={!company.canEdit}
                                value={values.website ?? ""}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "website",
                                        event.target.value ||
                                        null,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Registered address
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {[
                            {
                                key: "addressLine1",
                                label: "Address line 1",
                            },
                            {
                                key: "addressLine2",
                                label: "Address line 2",
                            },
                            {
                                key: "townCity",
                                label: "Town or city",
                            },
                            {
                                key: "county",
                                label: "County",
                            },
                            {
                                key: "postcode",
                                label: "Postcode",
                            },
                            {
                                key: "country",
                                label: "Country",
                            },
                        ].map((field) => {
                            const key =
                                field.key as keyof AgentCompanyFormValues["registeredAddress"];

                            const fieldValue =
                                values.registeredAddress[
                                key
                                ];

                            return (
                                <div key={field.key}>
                                    <label
                                        htmlFor={
                                            field.key
                                        }
                                        className="text-sm font-semibold"
                                    >
                                        {field.label}
                                    </label>

                                    <input
                                        id={field.key}
                                        disabled={
                                            !company.canEdit
                                        }
                                        value={
                                            typeof fieldValue ===
                                                "string"
                                                ? fieldValue
                                                : ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateAddressValue(
                                                key,
                                                event.target
                                                    .value ||
                                                null,
                                            )
                                        }
                                        className={
                                            fieldClassName
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>

                {company.canEdit ? (
                    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.informationAccurateConfirmed
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "informationAccurateConfirmed",
                                        event.target.checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            />

                            <span className="text-sm leading-6">
                                I confirm that this company
                                information is accurate and
                                that I am authorised to
                                provide it.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="mt-5 min-h-11 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isSaving
                                ? "Saving…"
                                : "Save company"}
                        </button>
                    </section>
                ) : null}
            </form>
        </main>
    );
}