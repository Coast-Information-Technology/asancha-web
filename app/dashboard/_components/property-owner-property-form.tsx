"use client";

// File: app/dashboard/_components/property-owner-property-form.tsx

/**
 * Asancha Property Owner Property Form
 *
 * Purpose:
 * Creates or updates a property connected to the active property-owner profile.
 *
 * Responsibilities:
 * - Render typed property fields.
 * - Load an existing property for edit mode.
 * - Create or update a draft property.
 * - Keep submission separate from saving.
 *
 * Security notes:
 * - Client validation is UX guidance only.
 * - Backend ownership, active-profile, policy, verification, duplicate,
 *   address, document, and lifecycle checks remain final.
 * - Saving a property must not imply listing creation or publication.
 */

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import {
    authApiGet,
    authApiPatch,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import {
    OWNERSHIP_CAPACITY_OPTIONS,
    PROPERTY_INTENT_OPTIONS,
    PROPERTY_TYPE_OPTIONS,
} from "../_config/property-owner-dashboard.config";
import type {
    CreateOwnerPropertyPayload,
    CreateOwnerPropertyResult,
    OwnerPropertyDetail,
    OwnerPropertyFormValues,
    UpdateOwnerPropertyPayload,
    UpdateOwnerPropertyResult,
} from "../_types/property-owner-dashboard.types";

export interface PropertyOwnerPropertyFormProps {
    mode: "create" | "edit";
    propertyPublicId?: string;
}

const INITIAL_VALUES: OwnerPropertyFormValues = {
    title: "",
    propertyType: "",
    ownershipCapacity: "",
    submissionIntent: "",

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
    condition: null,
    occupancyStatus: null,

    estimatedValue: null,
    expectedSalePrice: null,
    expectedMonthlyRent: null,
    currency: "GBP",

    saleTimeline: null,
    sellerMotivation: null,

    ownershipEvidenceAvailable: false,
    authorityConfirmed: false,
    informationAccurateConfirmed: false,
};

function detailToFormValues(
    property: OwnerPropertyDetail,
): OwnerPropertyFormValues {
    return {
        title: property.title,
        propertyType: property.propertyType,
        ownershipCapacity:
            property.ownershipCapacity,
        submissionIntent:
            property.submissionIntent,

        address: property.address,

        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        receptionRooms:
            property.receptionRooms,

        description: property.description,
        condition: property.condition,
        occupancyStatus:
            property.occupancyStatus,

        estimatedValue:
            property.estimatedValue,
        expectedSalePrice:
            property.expectedSalePrice,
        expectedMonthlyRent:
            property.expectedMonthlyRent,
        currency: property.currency,

        saleTimeline: property.saleTimeline,
        sellerMotivation:
            property.sellerMotivation,

        ownershipEvidenceAvailable: true,
        authorityConfirmed: true,
        informationAccurateConfirmed: false,
    };
}

export function PropertyOwnerPropertyForm({
    mode,
    propertyPublicId,
}: PropertyOwnerPropertyFormProps) {
    const router = useRouter();

    const [values, setValues] =
        useState<OwnerPropertyFormValues>(
            INITIAL_VALUES,
        );

    const [isLoading, setIsLoading] =
        useState(mode === "edit");

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadProperty =
        useCallback(async (): Promise<void> => {
            if (
                mode !== "edit" ||
                !propertyPublicId
            ) {
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);

            try {
                const property =
                    await authApiGet<OwnerPropertyDetail>(
                        `/properties/${encodeURIComponent(
                            propertyPublicId,
                        )}`,
                    );

                setValues(
                    detailToFormValues(property),
                );
            } catch {
                setErrorMessage(
                    "We could not load this property for editing.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [mode, propertyPublicId]);

    useEffect((): void => {
        void loadProperty();
    }, [loadProperty]);

    const updateRootValue = <
        TKey extends keyof OwnerPropertyFormValues,
    >(
        key: TKey,
        value: OwnerPropertyFormValues[TKey],
    ): void => {
        setValues(
            (
                current:
                    OwnerPropertyFormValues,
            ): OwnerPropertyFormValues => ({
                ...current,
                [key]: value,
            }),
        );

        setErrorMessage(null);
    };

    const updateAddressValue = <
        TKey extends keyof OwnerPropertyFormValues["address"],
    >(
        key: TKey,
        value: OwnerPropertyFormValues["address"][TKey],
    ): void => {
        setValues(
            (
                current:
                    OwnerPropertyFormValues,
            ): OwnerPropertyFormValues => ({
                ...current,
                address: {
                    ...current.address,
                    [key]: value,
                },
            }),
        );

        setErrorMessage(null);
    };

    const parseOptionalNumber = (
        value: string,
    ): number | null => {
        if (value.trim() === "") {
            return null;
        }

        const parsed = Number(value);

        return Number.isFinite(parsed)
            ? parsed
            : null;
    };

    const validate = (): string | null => {
        if (!values.title.trim()) {
            return "Enter a property title.";
        }

        if (!values.propertyType) {
            return "Choose a property type.";
        }

        if (!values.ownershipCapacity) {
            return "Choose your ownership capacity.";
        }

        if (!values.submissionIntent) {
            return "Choose the property submission intent.";
        }

        if (
            !values.address.addressLine1.trim() ||
            !values.address.townCity.trim() ||
            !values.address.postcode.trim()
        ) {
            return "Complete the property address.";
        }

        if (values.description.trim().length < 30) {
            return "Property description must contain at least 30 characters.";
        }

        if (!values.authorityConfirmed) {
            return "Confirm that you own or are authorised to represent this property.";
        }

        if (
            !values.informationAccurateConfirmed
        ) {
            return "Confirm that the property information is accurate.";
        }

        return null;
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const validationMessage = validate();

        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        try {
            if (
                mode === "edit" &&
                propertyPublicId
            ) {
                const payload:
                    UpdateOwnerPropertyPayload = {
                    data: values,
                };

                const result =
                    await authApiPatch<UpdateOwnerPropertyResult>(
                        `/properties/${encodeURIComponent(
                            propertyPublicId,
                        )}`,
                        payload,
                    );

                router.push(
                    result.property.detailPath,
                );
                router.refresh();
                return;
            }

            const payload:
                CreateOwnerPropertyPayload = {
                data: values,
            };

            const result =
                await authApiPost<CreateOwnerPropertyResult>(
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
                mode === "edit"
                    ? "We could not update this property."
                    : "We could not create this property.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Property submission
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    {mode === "edit"
                        ? "Edit property"
                        : "Add property"}
                </h1>

                <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                    {mode === "edit"
                        ? "Update the property information. Backend lifecycle rules determine which fields may still be changed."
                        : "Create a property record under your active property-owner profile. You can add documents and submit it for review afterward."}
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Saving this form creates or updates a
                property record only. It does not publish
                the property in the marketplace.
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                {errorMessage ? (
                    <div
                        role="alert"
                        className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-4 text-sm text-[var(--destructive)]"
                    >
                        {errorMessage}
                    </div>
                ) : null}

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Property details
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
                                    updateRootValue(
                                        "title",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Victorian Townhouse in Notting Hill"
                                className={
                                    fieldClassName
                                }
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
                                    updateRootValue(
                                        "propertyType",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select type
                                </option>

                                {PROPERTY_TYPE_OPTIONS.map(
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
                                htmlFor="ownershipCapacity"
                                className="text-sm font-semibold"
                            >
                                Ownership capacity
                            </label>

                            <select
                                id="ownershipCapacity"
                                required
                                value={
                                    values.ownershipCapacity
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRootValue(
                                        "ownershipCapacity",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select capacity
                                </option>

                                {OWNERSHIP_CAPACITY_OPTIONS.map(
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
                                htmlFor="submissionIntent"
                                className="text-sm font-semibold"
                            >
                                Submission intent
                            </label>

                            <select
                                id="submissionIntent"
                                required
                                value={
                                    values.submissionIntent
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRootValue(
                                        "submissionIntent",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select intent
                                </option>

                                {PROPERTY_INTENT_OPTIONS.map(
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
                                htmlFor="occupancyStatus"
                                className="text-sm font-semibold"
                            >
                                Occupancy status
                            </label>

                            <select
                                id="occupancyStatus"
                                value={
                                    values.occupancyStatus ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRootValue(
                                        "occupancyStatus",
                                        event.target
                                            .value ||
                                        null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select status
                                </option>
                                <option value="vacant">
                                    Vacant
                                </option>
                                <option value="owner_occupied">
                                    Owner occupied
                                </option>
                                <option value="tenanted">
                                    Tenanted
                                </option>
                                <option value="part_occupied">
                                    Part occupied
                                </option>
                                <option value="unknown">
                                    Unknown
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="bedrooms"
                                className="text-sm font-semibold"
                            >
                                Bedrooms
                            </label>

                            <input
                                id="bedrooms"
                                type="number"
                                min={0}
                                value={
                                    values.bedrooms ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "bedrooms",
                                        parseOptionalNumber(
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

                        <div>
                            <label
                                htmlFor="bathrooms"
                                className="text-sm font-semibold"
                            >
                                Bathrooms
                            </label>

                            <input
                                id="bathrooms"
                                type="number"
                                min={0}
                                value={
                                    values.bathrooms ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "bathrooms",
                                        parseOptionalNumber(
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

                        <div>
                            <label
                                htmlFor="receptionRooms"
                                className="text-sm font-semibold"
                            >
                                Reception rooms
                            </label>

                            <input
                                id="receptionRooms"
                                type="number"
                                min={0}
                                value={
                                    values.receptionRooms ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "receptionRooms",
                                        parseOptionalNumber(
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

                        <div>
                            <label
                                htmlFor="condition"
                                className="text-sm font-semibold"
                            >
                                Condition
                            </label>

                            <select
                                id="condition"
                                value={
                                    values.condition ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRootValue(
                                        "condition",
                                        event.target
                                            .value ||
                                        null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select condition
                                </option>
                                <option value="excellent">
                                    Excellent
                                </option>
                                <option value="good">
                                    Good
                                </option>
                                <option value="fair">
                                    Fair
                                </option>
                                <option value="light_refurbishment">
                                    Light refurbishment
                                </option>
                                <option value="medium_refurbishment">
                                    Medium refurbishment
                                </option>
                                <option value="heavy_refurbishment">
                                    Heavy refurbishment
                                </option>
                                <option value="development">
                                    Development required
                                </option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
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
                                    updateRootValue(
                                        "description",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Property address
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label
                                htmlFor="addressLine1"
                                className="text-sm font-semibold"
                            >
                                Address line 1
                            </label>

                            <input
                                id="addressLine1"
                                required
                                value={
                                    values.address
                                        .addressLine1
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateAddressValue(
                                        "addressLine1",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="addressLine2"
                                className="text-sm font-semibold"
                            >
                                Address line 2
                            </label>

                            <input
                                id="addressLine2"
                                value={
                                    values.address
                                        .addressLine2 ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateAddressValue(
                                        "addressLine2",
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

                        <div>
                            <label
                                htmlFor="townCity"
                                className="text-sm font-semibold"
                            >
                                Town or city
                            </label>

                            <input
                                id="townCity"
                                required
                                value={
                                    values.address
                                        .townCity
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateAddressValue(
                                        "townCity",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="county"
                                className="text-sm font-semibold"
                            >
                                County
                            </label>

                            <input
                                id="county"
                                value={
                                    values.address
                                        .county ?? ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateAddressValue(
                                        "county",
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

                        <div>
                            <label
                                htmlFor="postcode"
                                className="text-sm font-semibold"
                            >
                                Postcode
                            </label>

                            <input
                                id="postcode"
                                required
                                value={
                                    values.address
                                        .postcode
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateAddressValue(
                                        "postcode",
                                        event.target
                                            .value.toUpperCase(),
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="country"
                                className="text-sm font-semibold"
                            >
                                Country
                            </label>

                            <input
                                id="country"
                                required
                                value={
                                    values.address
                                        .country
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateAddressValue(
                                        "country",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Value and timeline
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="estimatedValue"
                                className="text-sm font-semibold"
                            >
                                Estimated value
                            </label>

                            <input
                                id="estimatedValue"
                                type="number"
                                min={0}
                                step={1000}
                                value={
                                    values.estimatedValue ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "estimatedValue",
                                        parseOptionalNumber(
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

                        <div>
                            <label
                                htmlFor="expectedSalePrice"
                                className="text-sm font-semibold"
                            >
                                Expected sale price
                            </label>

                            <input
                                id="expectedSalePrice"
                                type="number"
                                min={0}
                                step={1000}
                                value={
                                    values.expectedSalePrice ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "expectedSalePrice",
                                        parseOptionalNumber(
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

                        <div>
                            <label
                                htmlFor="expectedMonthlyRent"
                                className="text-sm font-semibold"
                            >
                                Expected monthly rent
                            </label>

                            <input
                                id="expectedMonthlyRent"
                                type="number"
                                min={0}
                                step={50}
                                value={
                                    values.expectedMonthlyRent ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRootValue(
                                        "expectedMonthlyRent",
                                        parseOptionalNumber(
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

                        <div>
                            <label
                                htmlFor="saleTimeline"
                                className="text-sm font-semibold"
                            >
                                Sale or letting timeline
                            </label>

                            <select
                                id="saleTimeline"
                                value={
                                    values.saleTimeline ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRootValue(
                                        "saleTimeline",
                                        event.target
                                            .value ||
                                        null,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select timeline
                                </option>
                                <option value="immediately">
                                    Immediately
                                </option>
                                <option value="within_3_months">
                                    Within 3 months
                                </option>
                                <option value="within_6_months">
                                    Within 6 months
                                </option>
                                <option value="within_12_months">
                                    Within 12 months
                                </option>
                                <option value="not_decided">
                                    Not decided
                                </option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="sellerMotivation"
                                className="text-sm font-semibold"
                            >
                                Property or seller
                                circumstances
                            </label>

                            <textarea
                                id="sellerMotivation"
                                rows={4}
                                value={
                                    values.sellerMotivation ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRootValue(
                                        "sellerMotivation",
                                        event.target
                                            .value ||
                                        null,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Declarations
                    </h2>

                    <div className="mt-5 grid gap-4">
                        {[
                            {
                                key: "ownershipEvidenceAvailable",
                                label:
                                    "I can provide ownership or authority evidence where required.",
                            },
                            {
                                key: "authorityConfirmed",
                                label:
                                    "I confirm that I own or am authorised to represent this property.",
                            },
                            {
                                key: "informationAccurateConfirmed",
                                label:
                                    "I confirm that the information supplied is accurate.",
                            },
                        ].map((item) => (
                            <label
                                key={item.key}
                                className="flex cursor-pointer items-start gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        values[
                                        item.key as
                                        | "ownershipEvidenceAvailable"
                                        | "authorityConfirmed"
                                        | "informationAccurateConfirmed"
                                        ]
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateRootValue(
                                            item.key as
                                            | "ownershipEvidenceAvailable"
                                            | "authorityConfirmed"
                                            | "informationAccurateConfirmed",
                                            event.target
                                                .checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 accent-[var(--primary)]"
                                />

                                <span className="text-sm leading-6">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <footer className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        onClick={(): void =>
                            router.back()
                        }
                        className="min-h-11 rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSaving
                            ? "Saving…"
                            : mode === "edit"
                                ? "Save changes"
                                : "Create property"}
                    </button>
                </footer>
            </form>
        </main>
    );
}