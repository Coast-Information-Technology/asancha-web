"use client";

// File: app/dashboard/_components/service-provider-service-form.tsx

/**
 * Asancha Service Provider Service Form
 *
 * Purpose:
 * Creates a service draft under the active service-provider profile.
 *
 * Security notes:
 * - Client validation is UX guidance only.
 * - Backend category, profile, ownership, verification, document, pricing,
 *   service-area, lifecycle, and visibility checks remain authoritative.
 * - Creating a service does not publish it.
 */

import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import {
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import {
    SERVICE_CATEGORY_OPTIONS,
    SERVICE_DELIVERY_MODE_OPTIONS,
    SERVICE_PRICING_MODEL_OPTIONS,
} from "../_config/service-provider-dashboard.config";
import type {
    CreateProviderServicePayload,
    ProviderServiceDetail,
    ProviderServiceFormValues,
} from "../_types/service-provider-dashboard.types";

const INITIAL_VALUES:
    ProviderServiceFormValues = {
    title: "",
    category: "",

    shortDescription: "",
    fullDescription: "",

    deliveryModes: [],

    pricingModel: "",

    priceAmount: null,
    minimumPriceAmount: null,
    maximumPriceAmount: null,

    percentageRate: null,

    currency: "GBP",

    estimatedDurationMinutes: null,

    bookingRequired: true,
    quoteRequired: false,

    emergencyService: false,

    serviceAreaPublicIds: [],

    requirements: [],
    exclusions: [],
    deliverables: [],

    informationAccurateConfirmed: false,
};

interface CreateProviderServiceResult {
    service: ProviderServiceDetail;
    nextPath: string | null;
    message: string;
}

function parseOptionalNumber(
    value: string,
): number | null {
    if (!value.trim()) {
        return null;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : null;
}

function splitLines(value: string): string[] {
    return value
        .split(/\r?\n/)
        .map(
            (item: string): string =>
                item.trim(),
        )
        .filter(Boolean);
}

function joinLines(values: string[]): string {
    return values.join("\n");
}

export function ServiceProviderServiceForm() {
    const router = useRouter();

    const [values, setValues] =
        useState<ProviderServiceFormValues>(
            INITIAL_VALUES,
        );

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const updateValue = <
        TKey extends keyof ProviderServiceFormValues,
    >(
        key: TKey,
        value: ProviderServiceFormValues[TKey],
    ): void => {
        setValues(
            (
                current:
                    ProviderServiceFormValues,
            ): ProviderServiceFormValues => ({
                ...current,
                [key]: value,
            }),
        );

        setErrorMessage(null);
    };

    const handleDeliveryModesChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const selectedValues: string[] =
            Array.from(
                event.target.selectedOptions,
            ).map(
                (
                    option: HTMLOptionElement,
                ): string => option.value,
            );

        updateValue(
            "deliveryModes",
            selectedValues,
        );
    };

    const validate = (): string | null => {
        if (!values.title.trim()) {
            return "Enter a service title.";
        }

        if (!values.category) {
            return "Select a service category.";
        }

        if (
            values.deliveryModes.length === 0
        ) {
            return "Select at least one delivery mode.";
        }

        if (!values.pricingModel) {
            return "Select a pricing model.";
        }

        if (
            values.shortDescription.trim()
                .length < 20
        ) {
            return "Enter a short description of at least 20 characters.";
        }

        if (
            values.fullDescription.trim()
                .length < 40
        ) {
            return "Enter a full service description of at least 40 characters.";
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            return "Confirm that the service information is accurate.";
        }

        return null;
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const validationMessage =
            validate();

        if (validationMessage) {
            setErrorMessage(
                validationMessage,
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        const payload:
            CreateProviderServicePayload = {
            data: values,
        };

        try {
            const result =
                await authApiPost<CreateProviderServiceResult>(
                    "/services",
                    payload,
                );

            router.push(
                result.nextPath ??
                    result.service.detailPath,
            );

            router.refresh();
        } catch {
            setErrorMessage(
                "We could not create this service.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]";

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Service catalogue
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Add service
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Create a clear service description,
                    pricing approach, delivery method,
                    requirements, and expected
                    deliverables.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Creating this service saves a service
                draft only. The service is not public
                until all backend approval and visibility
                requirements are satisfied.
            </div>

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
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Service information
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="title"
                                className="text-sm font-semibold"
                            >
                                Service title
                            </label>

                            <input
                                id="title"
                                required
                                value={values.title}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "title",
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
                                htmlFor="category"
                                className="text-sm font-semibold"
                            >
                                Service category
                            </label>

                            <select
                                id="category"
                                required
                                value={values.category}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateValue(
                                        "category",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select category
                                </option>

                                {SERVICE_CATEGORY_OPTIONS.map(
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

                        <div className="md:col-span-2">
                            <label
                                htmlFor="shortDescription"
                                className="text-sm font-semibold"
                            >
                                Short description
                            </label>

                            <textarea
                                id="shortDescription"
                                required
                                rows={3}
                                value={
                                    values.shortDescription
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateValue(
                                        "shortDescription",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="fullDescription"
                                className="text-sm font-semibold"
                            >
                                Full description
                            </label>

                            <textarea
                                id="fullDescription"
                                required
                                rows={7}
                                value={
                                    values.fullDescription
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateValue(
                                        "fullDescription",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="deliveryModes"
                                className="text-sm font-semibold"
                            >
                                Delivery modes
                            </label>

                            <select
                                id="deliveryModes"
                                multiple
                                required
                                value={
                                    values.deliveryModes
                                }
                                onChange={
                                    handleDeliveryModesChange
                                }
                                className={`${fieldClassName} min-h-32`}
                            >
                                {SERVICE_DELIVERY_MODE_OPTIONS.map(
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
                                htmlFor="estimatedDurationMinutes"
                                className="text-sm font-semibold"
                            >
                                Estimated duration in
                                minutes
                            </label>

                            <input
                                id="estimatedDurationMinutes"
                                type="number"
                                min={15}
                                step={15}
                                value={
                                    values.estimatedDurationMinutes ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "estimatedDurationMinutes",
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
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Pricing
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label
                                htmlFor="pricingModel"
                                className="text-sm font-semibold"
                            >
                                Pricing model
                            </label>

                            <select
                                id="pricingModel"
                                required
                                value={
                                    values.pricingModel
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateValue(
                                        "pricingModel",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select pricing model
                                </option>

                                {SERVICE_PRICING_MODEL_OPTIONS.map(
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
                                htmlFor="priceAmount"
                                className="text-sm font-semibold"
                            >
                                Price amount
                            </label>

                            <input
                                id="priceAmount"
                                type="number"
                                min={0}
                                step="0.01"
                                value={
                                    values.priceAmount ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "priceAmount",
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
                                htmlFor="percentageRate"
                                className="text-sm font-semibold"
                            >
                                Percentage rate
                            </label>

                            <input
                                id="percentageRate"
                                type="number"
                                min={0}
                                max={100}
                                step="0.01"
                                value={
                                    values.percentageRate ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "percentageRate",
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
                                htmlFor="minimumPriceAmount"
                                className="text-sm font-semibold"
                            >
                                Minimum price
                            </label>

                            <input
                                id="minimumPriceAmount"
                                type="number"
                                min={0}
                                step="0.01"
                                value={
                                    values.minimumPriceAmount ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "minimumPriceAmount",
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
                                htmlFor="maximumPriceAmount"
                                className="text-sm font-semibold"
                            >
                                Maximum price
                            </label>

                            <input
                                id="maximumPriceAmount"
                                type="number"
                                min={0}
                                step="0.01"
                                value={
                                    values.maximumPriceAmount ??
                                    ""
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "maximumPriceAmount",
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
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Scope and delivery
                    </h2>

                    <div className="mt-5 grid gap-5">
                        {(
                            [
                                {
                                    key: "requirements",
                                    label:
                                        "Client requirements",
                                },
                                {
                                    key: "deliverables",
                                    label: "Deliverables",
                                },
                                {
                                    key: "exclusions",
                                    label: "Exclusions",
                                },
                                {
                                    key:
                                        "serviceAreaPublicIds",
                                    label:
                                        "Service-area public IDs",
                                },
                            ] as const
                        ).map((field) => (
                            <div key={field.key}>
                                <label
                                    htmlFor={field.key}
                                    className="text-sm font-semibold"
                                >
                                    {field.label}
                                </label>

                                <textarea
                                    id={field.key}
                                    rows={4}
                                    value={joinLines(
                                        values[
                                            field.key
                                        ],
                                    )}
                                    onChange={(
                                        event: ChangeEvent<HTMLTextAreaElement>,
                                    ): void =>
                                        updateValue(
                                            field.key,
                                            splitLines(
                                                event
                                                    .target
                                                    .value,
                                            ),
                                        )
                                    }
                                    placeholder="Enter one item per line"
                                    className={`${fieldClassName} resize-y`}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <div className="grid gap-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.bookingRequired
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "bookingRequired",
                                        event.target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                A booking is required for
                                this service.
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.quoteRequired
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "quoteRequired",
                                        event.target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                The client must request a
                                quote.
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.emergencyService
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "emergencyService",
                                        event.target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                This service may support
                                emergency requests.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
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
                                        event.target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                I confirm that the service,
                                pricing, requirements, and
                                delivery information is
                                accurate.
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
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
                            className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isSaving
                                ? "Creating…"
                                : "Create service draft"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}