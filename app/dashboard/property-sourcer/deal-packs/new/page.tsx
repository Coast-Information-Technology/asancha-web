"use client";

// File: app/dashboard/property-sourcer/deal-packs/new/page.tsx

/**
 * Asancha New Sourcer Deal Pack Route
 *
 * Purpose:
 * Creates an investor-facing deal-pack draft for an eligible deal.
 *
 * Security notes:
 * - Deal-pack creation and publication remain separate.
 * - Restricted documents and private seller information must not be included.
 */

import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import type {
    CreateSourcerDealPackPayload,
    SourcerDealPackFormValues,
} from "../../../_types/property-sourcer-dashboard.types";
import { authApiPost } from "@/src/lib/api/auth-fetch";

interface CreateDealPackResult {
    dealPackPublicId: string;
    detailPath: string | null;
    message: string;
}

const INITIAL_VALUES:
    SourcerDealPackFormValues = {
    listingPublicId: "",

    headline: "",
    executiveSummary: "",

    investmentHighlights: [],
    financialSummary: "",
    locationSummary: "",
    propertySummary: "",
    strategySummary: "",
    refurbishmentSummary: null,

    risksAndWarnings: [],
    assumptions: [],

    documentPublicIds: [],

    fullPackAccessMode:
        "verified_investor",

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

export default function NewSourcerDealPackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [values, setValues] =
        useState<SourcerDealPackFormValues>({
            ...INITIAL_VALUES,
            listingPublicId:
                searchParams.get(
                    "listingPublicId",
                ) ?? "",
        });

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const updateValue = <
        TKey extends keyof SourcerDealPackFormValues,
    >(
        key: TKey,
        value: SourcerDealPackFormValues[TKey],
    ): void => {
        setValues(
            (
                current:
                    SourcerDealPackFormValues,
            ): SourcerDealPackFormValues => ({
                ...current,
                [key]: value,
            }),
        );

        setErrorMessage(null);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!values.listingPublicId.trim()) {
            setErrorMessage(
                "Select or enter the deal public ID.",
            );
            return;
        }

        if (!values.headline.trim()) {
            setErrorMessage(
                "Enter a deal-pack headline.",
            );
            return;
        }

        if (
            !values
                .informationAccurateConfirmed ||
            !values
                .noGuaranteedOutcomeConfirmed
        ) {
            setErrorMessage(
                "Complete the required declarations.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        const payload:
            CreateSourcerDealPackPayload = {
            data: values,
        };

        try {
            const result =
                await authApiPost<CreateDealPackResult>(
                    "/deal-packs",
                    payload,
                );

            router.push(
                result.detailPath ??
                    "/dashboard/property-sourcer/deal-packs",
            );

            router.refresh();
        } catch {
            setErrorMessage(
                "We could not create this deal pack.",
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
                    Investor deal materials
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Create deal pack
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Create a structured investor-facing
                    summary from verified and supportable
                    deal information.
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
                    <div className="grid gap-5">
                        <div>
                            <label
                                htmlFor="listingPublicId"
                                className="text-sm font-semibold"
                            >
                                Deal public ID
                            </label>

                            <input
                                id="listingPublicId"
                                required
                                value={
                                    values.listingPublicId
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "listingPublicId",
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
                                htmlFor="headline"
                                className="text-sm font-semibold"
                            >
                                Headline
                            </label>

                            <input
                                id="headline"
                                required
                                value={values.headline}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "headline",
                                        event.target
                                            .value,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            />
                        </div>

                        {(
                            [
                                {
                                    key:
                                        "executiveSummary",
                                    label:
                                        "Executive summary",
                                },
                                {
                                    key:
                                        "propertySummary",
                                    label:
                                        "Property summary",
                                },
                                {
                                    key:
                                        "financialSummary",
                                    label:
                                        "Financial summary",
                                },
                                {
                                    key:
                                        "locationSummary",
                                    label:
                                        "Location summary",
                                },
                                {
                                    key:
                                        "strategySummary",
                                    label:
                                        "Strategy summary",
                                },
                                {
                                    key:
                                        "refurbishmentSummary",
                                    label:
                                        "Refurbishment summary",
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
                                    required={
                                        field.key !==
                                        "refurbishmentSummary"
                                    }
                                    rows={5}
                                    value={
                                        values[
                                            field.key
                                        ] ?? ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLTextAreaElement>,
                                    ): void =>
                                        updateValue(
                                            field.key,
                                            event.target
                                                .value ||
                                                null,
                                        )
                                    }
                                    className={`${fieldClassName} resize-y`}
                                />
                            </div>
                        ))}

                        {(
                            [
                                {
                                    key:
                                        "investmentHighlights",
                                    label:
                                        "Investment highlights",
                                },
                                {
                                    key:
                                        "risksAndWarnings",
                                    label:
                                        "Risks and warnings",
                                },
                                {
                                    key: "assumptions",
                                    label:
                                        "Assumptions",
                                },
                                {
                                    key:
                                        "documentPublicIds",
                                    label:
                                        "Supporting document public IDs",
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
                                    rows={5}
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

                        <div>
                            <label
                                htmlFor="fullPackAccessMode"
                                className="text-sm font-semibold"
                            >
                                Full-pack access
                            </label>

                            <select
                                id="fullPackAccessMode"
                                value={
                                    values.fullPackAccessMode
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateValue(
                                        "fullPackAccessMode",
                                        event.target
                                            .value as SourcerDealPackFormValues["fullPackAccessMode"],
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                <option value="public">
                                    Public
                                </option>
                                <option value="verified_investor">
                                    Verified investors
                                </option>
                                <option value="proof_of_funds">
                                    Approved proof of
                                    funds
                                </option>
                                <option value="paid">
                                    Paid access
                                </option>
                                <option value="restricted">
                                    Restricted
                                </option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                    <div className="grid gap-4">
                        <label className="flex items-start gap-3">
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
                                I confirm that the deal-pack
                                information is accurate and
                                supportable.
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
                                    updateValue(
                                        "noGuaranteedOutcomeConfirmed",
                                        event.target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm leading-6">
                                I confirm that the deal
                                pack does not guarantee
                                yield, ROI, finance, rent,
                                resale, legal outcomes, or
                                completion.
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
                            : "Create deal-pack draft"}
                    </button>
                </section>
            </form>
        </main>
    );
}