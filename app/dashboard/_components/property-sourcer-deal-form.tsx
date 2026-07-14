"use client";

// File: app/dashboard/_components/property-sourcer-deal-form.tsx

/**
 * Asancha Property Sourcer Deal Form
 *
 * Purpose:
 * Creates or updates an investment-focused property listing submitted by the
 * active property-sourcer profile.
 *
 * Security notes:
 * - Client validation is UX guidance only.
 * - Backend verification, policy acceptance, authority, duplicate detection,
 *   document, listing-standard, pricing, lifecycle, and publication rules
 *   remain authoritative.
 * - Estimated values must never be presented as guaranteed outcomes.
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
    SOURCER_DEAL_TYPE_OPTIONS,
    SOURCER_FEE_MODEL_OPTIONS,
    SOURCER_PROPERTY_TYPE_OPTIONS,
    SOURCER_STRATEGY_OPTIONS,
} from "../_config/property-sourcer-dashboard.config";
import type {
    CreateSourcerDealPayload,
    SourcerDealDetail,
    SourcerDealFormValues,
    UpdateSourcerDealPayload,
} from "../_types/property-sourcer-dashboard.types";

export interface PropertySourcerDealFormProps {
    mode: "create" | "edit";
    listingPublicId?: string;
}

interface SaveSourcerDealResult {
    deal: SourcerDealDetail;
    nextPath: string | null;
    message: string;
}

const INITIAL_VALUES:
    SourcerDealFormValues = {
    title: "",
    propertyType: "",
    dealTypes: [],
    strategies: [],

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

    occupancyStatus: null,
    refurbishmentLevel: null,

    description: "",
    opportunitySummary: "",
    investorOutcomeSummary: "",

    askingPrice: null,
    estimatedMarketValue: null,
    estimatedRefurbishmentCost: null,
    estimatedMonthlyRent: null,

    estimatedGrossYield: null,
    estimatedRoi: null,
    estimatedBmvDiscount: null,

    currency: "GBP",

    feeModel: "",
    sourcingFeeAmount: null,
    sourcingFeePercentage: null,
    sourcingFeeNotes: null,

    sellerOrSourceType: null,
    sourceReference: null,
    authorityDocumentPublicId: null,

    informationSources: [],
    assumptions: [],
    risksAndWarnings: [],

    authorityConfirmed: false,
    informationAccurateConfirmed: false,
    noGuaranteedOutcomeConfirmed: false,
};

function splitLines(value: string): string[] {
    return value
        .split(/\r?\n/)
        .map((item: string): string =>
            item.trim(),
        )
        .filter(Boolean);
}

function joinLines(values: string[]): string {
    return values.join("\n");
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

function detailToFormValues(
    detail: SourcerDealDetail,
): SourcerDealFormValues {
    return {
        title: detail.title,
        propertyType: detail.propertyType,
        dealTypes: detail.dealTypes,
        strategies: detail.strategies,

        address: detail.address,

        bedrooms: detail.bedrooms,
        bathrooms: detail.bathrooms,
        receptionRooms:
            detail.receptionRooms,

        occupancyStatus:
            detail.occupancyStatus,
        refurbishmentLevel:
            detail.refurbishmentLevel,

        description: detail.description,
        opportunitySummary:
            detail.opportunitySummary,
        investorOutcomeSummary:
            detail.investorOutcomeSummary,

        askingPrice: detail.askingPrice,
        estimatedMarketValue:
            detail.estimatedMarketValue,
        estimatedRefurbishmentCost:
            detail.estimatedRefurbishmentCost,
        estimatedMonthlyRent:
            detail.estimatedMonthlyRent,

        estimatedGrossYield:
            detail.estimatedGrossYield,
        estimatedRoi: detail.estimatedRoi,
        estimatedBmvDiscount:
            detail.estimatedBmvDiscount,

        currency: detail.currency,

        feeModel: detail.feeModel,
        sourcingFeeAmount:
            detail.sourcingFeeAmount,
        sourcingFeePercentage:
            detail.sourcingFeePercentage,
        sourcingFeeNotes:
            detail.sourcingFeeNotes,

        sellerOrSourceType:
            detail.sellerOrSourceType,
        sourceReference:
            detail.sourceReference,
        authorityDocumentPublicId: null,

        informationSources:
            detail.informationSources,
        assumptions: detail.assumptions,
        risksAndWarnings:
            detail.risksAndWarnings,

        authorityConfirmed: true,
        informationAccurateConfirmed:
            false,
        noGuaranteedOutcomeConfirmed:
            false,
    };
}

export function PropertySourcerDealForm({
    mode,
    listingPublicId,
}: PropertySourcerDealFormProps) {
    const router = useRouter();

    const [values, setValues] =
        useState<SourcerDealFormValues>(
            INITIAL_VALUES,
        );

    const [isLoading, setIsLoading] =
        useState(mode === "edit");

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadDeal =
        useCallback(async (): Promise<void> => {
            if (
                mode !== "edit" ||
                !listingPublicId
            ) {
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<SourcerDealDetail>(
                        `/listings/${encodeURIComponent(
                            listingPublicId,
                        )}`,
                    );

                setValues(
                    detailToFormValues(result),
                );
            } catch {
                setErrorMessage(
                    "We could not load this deal for editing.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [listingPublicId, mode]);

    useEffect((): void => {
        void loadDeal();
    }, [loadDeal]);

    const updateRoot = <
        TKey extends keyof SourcerDealFormValues,
    >(
        key: TKey,
        value: SourcerDealFormValues[TKey],
    ): void => {
        setValues(
            (
                current:
                    SourcerDealFormValues,
            ): SourcerDealFormValues => ({
                ...current,
                [key]: value,
            }),
        );

        setErrorMessage(null);
    };

    const updateAddress = <
        TKey extends keyof SourcerDealFormValues["address"],
    >(
        key: TKey,
        value: SourcerDealFormValues["address"][TKey],
    ): void => {
        setValues(
            (
                current:
                    SourcerDealFormValues,
            ): SourcerDealFormValues => ({
                ...current,
                address: {
                    ...current.address,
                    [key]: value,
                },
            }),
        );

        setErrorMessage(null);
    };

    const handleMultiSelect = (
        event: ChangeEvent<HTMLSelectElement>,
        field:
            | "dealTypes"
            | "strategies",
    ): void => {
        const selected: string[] =
            Array.from(
                event.target.selectedOptions,
            ).map(
                (
                    option:
                        HTMLOptionElement,
                ): string => option.value,
            );

        updateRoot(field, selected);
    };

    const validate =
        (): string | null => {
            if (!values.title.trim()) {
                return "Enter a deal title.";
            }

            if (!values.propertyType) {
                return "Select a property type.";
            }

            if (
                values.dealTypes.length === 0
            ) {
                return "Select at least one deal type.";
            }

            if (
                values.strategies.length === 0
            ) {
                return "Select at least one investment strategy.";
            }

            if (
                !values.address.addressLine1.trim() ||
                !values.address.townCity.trim() ||
                !values.address.postcode.trim()
            ) {
                return "Complete the property address.";
            }

            if (
                values.description.trim().length <
                30
            ) {
                return "Enter a detailed property description.";
            }

            if (
                values.opportunitySummary.trim()
                    .length < 20
            ) {
                return "Explain the investment opportunity.";
            }

            if (
                !values.authorityConfirmed
            ) {
                return "Confirm that you have authority to provide this deal information.";
            }

            if (
                !values
                    .informationAccurateConfirmed
            ) {
                return "Confirm that the information is accurate.";
            }

            if (
                !values
                    .noGuaranteedOutcomeConfirmed
            ) {
                return "Confirm that estimates are not guaranteed investment outcomes.";
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

        try {
            if (
                mode === "edit" &&
                listingPublicId
            ) {
                const payload:
                    UpdateSourcerDealPayload = {
                    data: values,
                };

                const result =
                    await authApiPatch<SaveSourcerDealResult>(
                        `/listings/${encodeURIComponent(
                            listingPublicId,
                        )}`,
                        payload,
                    );

                router.push(
                    result.nextPath ??
                        result.deal.detailPath,
                );
                router.refresh();
                return;
            }

            const payload:
                CreateSourcerDealPayload = {
                data: values,
            };

            const result =
                await authApiPost<SaveSourcerDealResult>(
                    "/listings",
                    payload,
                );

            router.push(
                result.nextPath ??
                    result.deal.detailPath,
            );
            router.refresh();
        } catch {
            setErrorMessage(
                mode === "edit"
                    ? "We could not update this deal."
                    : "We could not create this deal.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-xl bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Investment deal submission
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    {mode === "edit"
                        ? "Edit deal"
                        : "Submit deal"}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Provide clear, supportable and
                    investment-focused information.
                    Estimated values must be identified as
                    assumptions rather than guarantees.
                </p>
            </header>

            <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Saving creates or updates a deal draft.
                It does not approve or publish the deal.
            </div>

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
                        Deal identity
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-semibold"
                            >
                                Deal title
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
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="High-Yield HMO Opportunity in Manchester"
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
                                    updateRoot(
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
                                    Select property type
                                </option>

                                {SOURCER_PROPERTY_TYPE_OPTIONS.map(
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
                                htmlFor="feeModel"
                                className="text-sm font-semibold"
                            >
                                Sourcing fee model
                            </label>

                            <select
                                id="feeModel"
                                required
                                value={
                                    values.feeModel
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRoot(
                                        "feeModel",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="">
                                    Select fee model
                                </option>

                                {SOURCER_FEE_MODEL_OPTIONS.map(
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
                                htmlFor="dealTypes"
                                className="text-sm font-semibold"
                            >
                                Deal types
                            </label>

                            <select
                                id="dealTypes"
                                multiple
                                required
                                value={
                                    values.dealTypes
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    handleMultiSelect(
                                        event,
                                        "dealTypes",
                                    )
                                }
                                className={`${fieldClassName} min-h-40`}
                            >
                                {SOURCER_DEAL_TYPE_OPTIONS.map(
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
                                htmlFor="strategies"
                                className="text-sm font-semibold"
                            >
                                Investment strategies
                            </label>

                            <select
                                id="strategies"
                                multiple
                                required
                                value={
                                    values.strategies
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    handleMultiSelect(
                                        event,
                                        "strategies",
                                    )
                                }
                                className={`${fieldClassName} min-h-40`}
                            >
                                {SOURCER_STRATEGY_OPTIONS.map(
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
                    </div>
                </section>

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Property address
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {(
                            [
                                {
                                    key: "addressLine1",
                                    label:
                                        "Address line 1",
                                },
                                {
                                    key: "addressLine2",
                                    label:
                                        "Address line 2",
                                },
                                {
                                    key: "townCity",
                                    label:
                                        "Town or city",
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
                            ] as const
                        ).map((field) => {
                            const fieldValue =
                                values.address[
                                    field.key
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
                                        required={
                                            field.key ===
                                                "addressLine1" ||
                                            field.key ===
                                                "townCity" ||
                                            field.key ===
                                                "postcode" ||
                                            field.key ===
                                                "country"
                                        }
                                        value={
                                            fieldValue ??
                                            ""
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ): void =>
                                            updateAddress(
                                                field.key,
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
                        Opportunity information
                    </h2>

                    <div className="mt-5 grid gap-5">
                        <div>
                            <label
                                htmlFor="description"
                                className="text-sm font-semibold"
                            >
                                Property description
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
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="opportunitySummary"
                                className="text-sm font-semibold"
                            >
                                Investment opportunity
                                summary
                            </label>

                            <textarea
                                id="opportunitySummary"
                                required
                                rows={5}
                                value={
                                    values.opportunitySummary
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "opportunitySummary",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="investorOutcomeSummary"
                                className="text-sm font-semibold"
                            >
                                Intended investor outcome
                            </label>

                            <textarea
                                id="investorOutcomeSummary"
                                required
                                rows={4}
                                value={
                                    values.investorOutcomeSummary
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "investorOutcomeSummary",
                                        event.target
                                            .value,
                                    )
                                }
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Financial estimates
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        All values are estimates and must
                        be supported by the information
                        sources and assumptions supplied.
                    </p>

                    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {(
                            [
                                {
                                    key: "askingPrice",
                                    label:
                                        "Asking price",
                                },
                                {
                                    key:
                                        "estimatedMarketValue",
                                    label:
                                        "Estimated market value",
                                },
                                {
                                    key:
                                        "estimatedRefurbishmentCost",
                                    label:
                                        "Estimated refurbishment cost",
                                },
                                {
                                    key:
                                        "estimatedMonthlyRent",
                                    label:
                                        "Estimated monthly rent",
                                },
                                {
                                    key:
                                        "estimatedGrossYield",
                                    label:
                                        "Estimated gross yield (%)",
                                },
                                {
                                    key:
                                        "estimatedRoi",
                                    label:
                                        "Estimated ROI (%)",
                                },
                                {
                                    key:
                                        "estimatedBmvDiscount",
                                    label:
                                        "Estimated BMV discount (%)",
                                },
                                {
                                    key:
                                        "sourcingFeeAmount",
                                    label:
                                        "Sourcing fee amount",
                                },
                                {
                                    key:
                                        "sourcingFeePercentage",
                                    label:
                                        "Sourcing fee (%)",
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

                                <input
                                    id={field.key}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={
                                        values[
                                            field.key
                                        ] ?? ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        updateRoot(
                                            field.key,
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
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Evidence, assumptions and risks
                    </h2>

                    <div className="mt-5 grid gap-5">
                        <div>
                            <label
                                htmlFor="informationSources"
                                className="text-sm font-semibold"
                            >
                                Information sources
                            </label>

                            <textarea
                                id="informationSources"
                                rows={5}
                                value={joinLines(
                                    values.informationSources,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "informationSources",
                                        splitLines(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                placeholder="Enter one source per line"
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="assumptions"
                                className="text-sm font-semibold"
                            >
                                Assumptions
                            </label>

                            <textarea
                                id="assumptions"
                                rows={5}
                                value={joinLines(
                                    values.assumptions,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "assumptions",
                                        splitLines(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                placeholder="Enter one assumption per line"
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="risksAndWarnings"
                                className="text-sm font-semibold"
                            >
                                Risks and warnings
                            </label>

                            <textarea
                                id="risksAndWarnings"
                                rows={5}
                                value={joinLines(
                                    values.risksAndWarnings,
                                )}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    updateRoot(
                                        "risksAndWarnings",
                                        splitLines(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                placeholder="Enter one risk or warning per line"
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
                                    values.authorityConfirmed
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "authorityConfirmed",
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4"
                            />

                            <span className="text-sm leading-6">
                                I have authority to provide
                                this property and deal
                                information and can provide
                                supporting evidence where
                                required.
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
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4"
                            />

                            <span className="text-sm leading-6">
                                I confirm that the
                                information supplied is
                                accurate to the best of my
                                knowledge.
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    values.noGuaranteedOutcomeConfirmed
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "noGuaranteedOutcomeConfirmed",
                                        event.target
                                            .checked,
                                    )
                                }
                                className="mt-1 h-4 w-4"
                            />

                            <span className="text-sm leading-6">
                                I understand that yield,
                                ROI, BMV, rent, value,
                                refurbishment, finance,
                                resale, and completion
                                figures are estimates and
                                are not guaranteed.
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <button
                            type="button"
                            onClick={(): void =>
                                router.back()
                            }
                            className="min-h-11 rounded-md border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="min-h-11 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                        >
                            {isSaving
                                ? "Saving…"
                                : mode === "edit"
                                  ? "Save deal"
                                  : "Create deal draft"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}