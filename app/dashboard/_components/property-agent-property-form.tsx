"use client";

// File: app/dashboard/_components/property-agent-property-form.tsx

/**
 * Asancha Property Agent Property Form
 *
 * Purpose:
 * Creates a represented property for the active property-agent profile.
 *
 * Security notes:
 * - Authority confirmation is not a substitute for required documentation.
 * - Backend verifies company membership, assignment, authority, ownership,
 *   duplicates, policies, verification, and lifecycle.
 */

import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { authApiPost } from "../../../src/lib/api/auth-fetch";
import {
    AGENT_PROPERTY_TYPE_OPTIONS,
    REPRESENTATION_TYPE_OPTIONS,
} from "../_config/property-agent-dashboard.config";
import type {
    AgentPropertyDetail,
    AgentPropertyFormValues,
    CreateAgentPropertyPayload,
} from "../_types/property-agent-dashboard.types";

const INITIAL_VALUES:
    AgentPropertyFormValues = {
    title: "",
    propertyType: "",

    companyPublicId: null,

    ownerName: "",
    ownerContactEmail: null,
    ownerContactPhone: null,

    representationType: "",
    authorityDocumentPublicId: null,

    address: {
        addressLine1: "",
        addressLine2: null,
        townCity: "",
        county: null,
        postcode: "",
        country: "United Kingdom",
    },

    bedrooms: null,
    bathrooms: null,
    receptionRooms: null,

    description: "",
    occupancyStatus: null,
    condition: null,

    estimatedValue: null,
    askingPrice: null,
    expectedMonthlyRent: null,
    currency: "GBP",

    representationConfirmed: false,
    informationAccurateConfirmed: false,
};

interface CreateAgentPropertyResult {
    property: AgentPropertyDetail;
    nextPath: string;
    message: string;
}

export function PropertyAgentPropertyForm() {
    const router = useRouter();

    const [
        values,
        setValues,
    ] = useState<AgentPropertyFormValues>(
        INITIAL_VALUES,
    );

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const updateRoot = <
        TKey extends keyof AgentPropertyFormValues,
    >(
        key: TKey,
        value: AgentPropertyFormValues[TKey],
    ): void => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const updateAddress = <
        TKey extends keyof AgentPropertyFormValues["address"],
    >(
        key: TKey,
        value: AgentPropertyFormValues["address"][TKey],
    ): void => {
        setValues((current) => ({
            ...current,
            address: {
                ...current.address,
                [key]: value,
            },
        }));
    };

    const parseNumber = (
        value: string,
    ): number | null => {
        if (!value.trim()) {
            return null;
        }

        const parsed = Number(value);

        return Number.isFinite(parsed)
            ? parsed
            : null;
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!values.representationConfirmed) {
            setErrorMessage(
                "Confirm that you have authority to represent this property.",
            );
            return;
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that the property information is accurate.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        const payload:
            CreateAgentPropertyPayload = {
            data: values,
        };

        try {
            const result =
                await authApiPost<CreateAgentPropertyResult>(
                    "/properties",
                    payload,
                );

            router.push(
                result.nextPath ||
                result.property.detailPath,
            );
            router.refresh();
        } catch {
            setErrorMessage(
                "We could not create this represented property.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm";

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Represented property
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Add property
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Add a property only when your agency
                    or profile has authority to represent
                    the relevant owner, vendor, landlord,
                    company, or developer.
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

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Property and representation
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-semibold"
                            >
                                Property title
                            </label>

                            <input
                                id="title"
                                required
                                value={values.title}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "title",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="propertyType"
                                className="text-sm font-semibold"
                            >
                                Property type
                            </label>

                            <select
                                id="propertyType"
                                required
                                value={
                                    values.propertyType
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRoot(
                                        "propertyType",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            >
                                <option value="">
                                    Select type
                                </option>

                                {AGENT_PROPERTY_TYPE_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="representationType"
                                className="text-sm font-semibold"
                            >
                                Representation type
                            </label>

                            <select
                                id="representationType"
                                required
                                value={
                                    values.representationType
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRoot(
                                        "representationType",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            >
                                <option value="">
                                    Select authority
                                </option>

                                {REPRESENTATION_TYPE_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="ownerName"
                                className="text-sm font-semibold"
                            >
                                Owner or vendor name
                            </label>

                            <input
                                id="ownerName"
                                required
                                value={values.ownerName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "ownerName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="ownerContactEmail"
                                className="text-sm font-semibold"
                            >
                                Owner contact email
                            </label>

                            <input
                                id="ownerContactEmail"
                                type="email"
                                value={
                                    values.ownerContactEmail ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "ownerContactEmail",
                                        event.target.value ||
                                        null,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="ownerContactPhone"
                                className="text-sm font-semibold"
                            >
                                Owner contact phone
                            </label>

                            <input
                                id="ownerContactPhone"
                                type="tel"
                                value={
                                    values.ownerContactPhone ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "ownerContactPhone",
                                        event.target.value ||
                                        null,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="authorityDocumentPublicId"
                                className="text-sm font-semibold"
                            >
                                Authority document public
                                ID
                            </label>

                            <input
                                id="authorityDocumentPublicId"
                                value={
                                    values.authorityDocumentPublicId ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "authorityDocumentPublicId",
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
                        Address
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
                                field.key as keyof AgentPropertyFormValues["address"];

                            const fieldValue =
                                values.address[key];

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
                                        value={
                                            typeof fieldValue ===
                                                "string"
                                                ? fieldValue
                                                : ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateAddress(
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

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Property information
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-3">
                        {[
                            {
                                key: "bedrooms",
                                label: "Bedrooms",
                            },
                            {
                                key: "bathrooms",
                                label: "Bathrooms",
                            },
                            {
                                key: "receptionRooms",
                                label: "Reception rooms",
                            },
                            {
                                key: "estimatedValue",
                                label: "Estimated value",
                            },
                            {
                                key: "askingPrice",
                                label: "Asking price",
                            },
                            {
                                key: "expectedMonthlyRent",
                                label:
                                    "Expected monthly rent",
                            },
                        ].map((field) => {
                            const key =
                                field.key as
                                | "bedrooms"
                                | "bathrooms"
                                | "receptionRooms"
                                | "estimatedValue"
                                | "askingPrice"
                                | "expectedMonthlyRent";

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
                                        type="number"
                                        min={0}
                                        value={
                                            values[key] ??
                                            ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateRoot(
                                                key,
                                                parseNumber(
                                                    event.target
                                                        .value,
                                                ),
                                            )
                                        }
                                        className={
                                            fieldClassName
                                        }
                                    />
                                </div>
                            );
                        })}

                        <div className="md:col-span-3">
                            <label
                                htmlFor="description"
                                className="text-sm font-semibold"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                required
                                rows={6}
                                value={
                                    values.description
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                    <div className="grid gap-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.representationConfirmed
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "representationConfirmed",
                                        event.target.checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                I confirm that I have
                                authority to represent this
                                property and can provide
                                evidence where required.
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.informationAccurateConfirmed
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "informationAccurateConfirmed",
                                        event.target.checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                I confirm that the property
                                information is accurate.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-5 min-h-11 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {isSaving
                            ? "Creating…"
                            : "Create represented property"}
                    </button>
                </section>
            </form>
        </main>
    );
}