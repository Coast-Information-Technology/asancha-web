"use client";

// File: app/account/_components/account-support-page.tsx

/**
 * Asancha Account Support Page
 *
 * Purpose:
 * Creates an authenticated support request linked to the current account and,
 * where supplied, a public business object.
 *
 * Security notes:
 * - Do not request passwords, one-time codes, private keys, card details, or
 *   secret API credentials.
 * - Related records must use public IDs.
 */

import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import { authApiPost } from "../../../src/lib/api/auth-fetch";
import type {
    AccountSupportRequestFormValues,
    AccountSupportRequestResult,
    CreateSupportRequestPayload,
} from "../_types/account.types";

const INITIAL_VALUES:
    AccountSupportRequestFormValues = {
    category: "account",

    subject: "",
    message: "",

    relatedType: null,
    relatedPublicId: null,

    preferredContactMethod: "email",

    informationAccurateConfirmed: false,
};

export function AccountSupportPage() {
    const [values, setValues] =
        useState<AccountSupportRequestFormValues>(
            INITIAL_VALUES,
        );

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const updateValue = <
        TKey extends keyof AccountSupportRequestFormValues,
    >(
        key: TKey,
        value: AccountSupportRequestFormValues[TKey],
    ): void => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (
            values.subject.trim().length <
                5 ||
            values.message.trim().length <
                20
        ) {
            setErrorMessage(
                "Enter a clear subject and a detailed message.",
            );
            return;
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that the information supplied is accurate.",
            );
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            CreateSupportRequestPayload = {
            data: values,
        };

        try {
            const result =
                await authApiPost<AccountSupportRequestResult>(
                    "/support/requests",
                    payload,
                );

            setValues(INITIAL_VALUES);

            setSuccessMessage(
                result.message ||
                    "Your support request has been submitted.",
            );
        } catch {
            setErrorMessage(
                "We could not submit your support request.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm";

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Help and assistance
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Support
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Contact Asancha about your account,
                    profile, verification, documents,
                    payments, bookings, listings,
                    conversations, or API access.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Never include your password, one-time
                verification code, payment-card details,
                API secret, private key, or session token.
            </div>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            <form
                onSubmit={handleSubmit}
                className="mt-6 rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="category"
                            className="text-sm font-semibold"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            value={values.category}
                            onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                            ): void =>
                                updateValue(
                                    "category",
                                    event.target
                                        .value as AccountSupportRequestFormValues["category"],
                                )
                            }
                            className={fieldClassName}
                        >
                            <option value="account">
                                Account
                            </option>
                            <option value="profile">
                                Business profile
                            </option>
                            <option value="verification">
                                Verification
                            </option>
                            <option value="documents">
                                Documents
                            </option>
                            <option value="payments">
                                Payments
                            </option>
                            <option value="bookings">
                                Bookings
                            </option>
                            <option value="conversations">
                                Conversations
                            </option>
                            <option value="listings">
                                Properties and listings
                            </option>
                            <option value="api_partner">
                                API partner
                            </option>
                            <option value="technical">
                                Technical issue
                            </option>
                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="preferredContactMethod"
                            className="text-sm font-semibold"
                        >
                            Preferred contact method
                        </label>

                        <select
                            id="preferredContactMethod"
                            value={
                                values.preferredContactMethod
                            }
                            onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                            ): void =>
                                updateValue(
                                    "preferredContactMethod",
                                    event.target
                                        .value as AccountSupportRequestFormValues["preferredContactMethod"],
                                )
                            }
                            className={fieldClassName}
                        >
                            <option value="email">
                                Email
                            </option>
                            <option value="phone">
                                Phone
                            </option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="subject"
                            className="text-sm font-semibold"
                        >
                            Subject
                        </label>

                        <input
                            id="subject"
                            required
                            value={values.subject}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "subject",
                                    event.target.value,
                                )
                            }
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="relatedType"
                            className="text-sm font-semibold"
                        >
                            Related record type
                        </label>

                        <input
                            id="relatedType"
                            value={
                                values.relatedType ??
                                ""
                            }
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "relatedType",
                                    event.target.value ||
                                        null,
                                )
                            }
                            placeholder="property, listing, payment, booking…"
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="relatedPublicId"
                            className="text-sm font-semibold"
                        >
                            Related public ID
                        </label>

                        <input
                            id="relatedPublicId"
                            value={
                                values.relatedPublicId ??
                                ""
                            }
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "relatedPublicId",
                                    event.target.value ||
                                        null,
                                )
                            }
                            className={fieldClassName}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="message"
                            className="text-sm font-semibold"
                        >
                            Message
                        </label>

                        <textarea
                            id="message"
                            required
                            rows={8}
                            value={values.message}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement>,
                            ): void =>
                                updateValue(
                                    "message",
                                    event.target.value,
                                )
                            }
                            className={`${fieldClassName} resize-y`}
                        />
                    </div>
                </div>

                <label className="mt-5 flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={
                            values.informationAccurateConfirmed
                        }
                        onChange={(
                            event: ChangeEvent<HTMLInputElement>,
                        ): void =>
                            updateValue(
                                "informationAccurateConfirmed",
                                event.target.checked,
                            )
                        }
                        className="mt-1 h-4 w-4 accent-[var(--primary)]"
                    />

                    <span className="text-sm leading-6">
                        I confirm that the information
                        supplied is accurate and does not
                        contain passwords, private keys,
                        secret tokens, or payment-card
                        details.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Submitting…"
                        : "Submit support request"}
                </button>
            </form>
        </main>
    );
}