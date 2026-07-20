"use client";

// File: app/dashboard/_components/property-agent-company-contacts-page.tsx

/**
 * Asancha Property Agent Company Contacts Page
 *
 * Purpose:
 * Displays and creates company contacts where the authenticated company member
 * has permission.
 *
 * Security notes:
 * - Backend membership and member-role checks remain authoritative.
 * - Contacts must not expose private notes or unrelated company members.
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
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import type {
    AgentCompanyContact,
    AgentCompanyContactFormValues,
    AgentCompanyContactsResponse,
    CreateAgentCompanyContactPayload,
} from "../_types/property-agent-dashboard.types";

const INITIAL_CONTACT:
    AgentCompanyContactFormValues = {
    contactType: "business",
    fullName: "",
    jobTitle: null,
    email: "",
    phoneNumber: null,
    isPrimary: false,
};

export function PropertyAgentCompanyContactsPage() {
    const [
        contactsResponse,
        setContactsResponse,
    ] = useState<AgentCompanyContactsResponse | null>(
        null,
    );

    const [
        formValues,
        setFormValues,
    ] = useState<AgentCompanyContactFormValues>(
        INITIAL_CONTACT,
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

    const loadContacts =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AgentCompanyContactsResponse>(
                        "/companies/me/contacts",
                    );

                setContactsResponse(result);
            } catch {
                setErrorMessage(
                    "We could not load the company contacts.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void Promise.resolve().then(loadContacts);
    }, [loadContacts]);

    const updateValue = <
        TKey extends keyof AgentCompanyContactFormValues,
    >(
        key: TKey,
        value: AgentCompanyContactFormValues[TKey],
    ): void => {
        setFormValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (
            !contactsResponse
                ?.canManageContacts
        ) {
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        const payload:
            CreateAgentCompanyContactPayload = {
            data: formValues,
        };

        try {
            const contact =
                await authApiPost<AgentCompanyContact>(
                    `/companies/${encodeURIComponent(
                        contactsResponse.companyPublicId,
                    )}/contacts`,
                    payload,
                );

            setContactsResponse((current) =>
                current
                    ? {
                        ...current,
                        items: [
                            contact,
                            ...(Array.isArray(
                                current.items,
                            )
                                ? current.items
                                : []),
                        ],
                    }
                    : current,
            );

            setFormValues(INITIAL_CONTACT);
        } catch {
            setErrorMessage(
                "We could not add this company contact.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    const companyContacts = Array.isArray(
        contactsResponse?.items,
    )
        ? contactsResponse.items
        : [];

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Agency company
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Company contacts
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Manage approved business, technical,
                    compliance, billing, and property
                    contacts.
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

            {contactsResponse?.safeUserMessage ? (
                <div className="mt-5 rounded-md bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                    {
                        contactsResponse.safeUserMessage
                    }
                </div>
            ) : null}

            {contactsResponse
                ?.canManageContacts ? (
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
                >
                    <h2 className="text-xl font-bold">
                        Add contact
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <input
                            required
                            value={formValues.fullName}
                            placeholder="Full name"
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "fullName",
                                    event.target.value,
                                )
                            }
                            className="min-h-11 rounded-md border border-[var(--input)] px-3 py-2"
                        />

                        <input
                            value={
                                formValues.jobTitle ??
                                ""
                            }
                            placeholder="Job title"
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "jobTitle",
                                    event.target.value ||
                                    null,
                                )
                            }
                            className="min-h-11 rounded-md border border-[var(--input)] px-3 py-2"
                        />

                        <input
                            required
                            type="email"
                            value={formValues.email}
                            placeholder="Email"
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "email",
                                    event.target.value,
                                )
                            }
                            className="min-h-11 rounded-md border border-[var(--input)] px-3 py-2"
                        />

                        <input
                            type="tel"
                            value={
                                formValues.phoneNumber ??
                                ""
                            }
                            placeholder="Phone number"
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "phoneNumber",
                                    event.target.value ||
                                    null,
                                )
                            }
                            className="min-h-11 rounded-md border border-[var(--input)] px-3 py-2"
                        />

                        <select
                            value={
                                formValues.contactType
                            }
                            onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                            ): void =>
                                updateValue(
                                    "contactType",
                                    event.target
                                        .value as AgentCompanyContactFormValues["contactType"],
                                )
                            }
                            className="min-h-11 rounded-md border border-[var(--input)] px-3 py-2"
                        >
                            <option value="primary">
                                Primary
                            </option>
                            <option value="business">
                                Business
                            </option>
                            <option value="technical">
                                Technical
                            </option>
                            <option value="compliance">
                                Compliance
                            </option>
                            <option value="billing">
                                Billing
                            </option>
                            <option value="property">
                                Property
                            </option>
                            <option value="other">
                                Other
                            </option>
                        </select>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    formValues.isPrimary
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "isPrimary",
                                        event.target
                                            .checked,
                                    )
                                }
                            />

                            Primary company contact
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-5 min-h-11 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {isSaving
                            ? "Adding…"
                            : "Add contact"}
                    </button>
                </form>
            ) : null}

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Existing contacts
                </h2>

                {companyContacts.length ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {companyContacts.map(
                            (contact) => (
                                <article
                                    key={
                                        contact.contactPublicId
                                    }
                                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                            {
                                                contact.contactType
                                            }
                                        </span>

                                        {contact.isPrimary ? (
                                            <span className="rounded-full border border-[var(--primary)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                                                Primary
                                            </span>
                                        ) : null}
                                    </div>

                                    <h3 className="mt-3 font-bold">
                                        {contact.fullName}
                                    </h3>

                                    {contact.jobTitle ? (
                                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                            {
                                                contact.jobTitle
                                            }
                                        </p>
                                    ) : null}

                                    <p className="mt-3 text-sm">
                                        {contact.email}
                                    </p>

                                    {contact.phoneNumber ? (
                                        <p className="mt-1 text-sm">
                                            {
                                                contact.phoneNumber
                                            }
                                        </p>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                        No company contacts have been
                        added.
                    </p>
                )}
            </section>
        </main>
    );
}
