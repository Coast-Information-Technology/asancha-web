/**
 * Backend-aligned option values used by role-specific onboarding forms.
 * Keep these values synchronized with the onboarding API contract.
 */

export const SOURCE_OF_FUNDS = [
    "employment_income",
    "business_income",
    "personal_savings",
    "investment_returns",
    "property_sale",
    "inheritance",
    "gift",
    "company_funds",
    "loan_or_credit",
    "mortgage_financing",
    "other",
] as const;

export const PURCHASE_READINESS = [
    "ready_now",
    "ready_within_30_days",
    "ready_within_3_months",
    "exploring",
] as const;

export const INVESTOR_FUNDING_METHODS = [
    "cash",
    "company_funds",
    "other",
] as const;

export const BUSINESS_PROFILE_OPERATING_MODES = [
    "independent",
    "on_behalf_of_company",
] as const;

export type BusinessProfileOperatingMode =
    (typeof BUSINESS_PROFILE_OPERATING_MODES)[number];

export type SourceOfFunds = (typeof SOURCE_OF_FUNDS)[number];
export type PurchaseReadiness = (typeof PURCHASE_READINESS)[number];
export type InvestorFundingMethod =
    (typeof INVESTOR_FUNDING_METHODS)[number];
export {
    PROPERTY_DOCUMENT_TYPES,
} from "../../../src/features/documents/constants/documents.constants";
export type {
    PropertyDocumentType,
} from "../../../src/features/documents/types/documents.types";

export function createOnboardingOptions<
    TValue extends string,
>(values: readonly TValue[]): ReadonlyArray<{
    value: TValue;
    label: string;
}> {
    return values.map((value) => ({
        value,
        label: value
            .replace(/_/g, " ")
            .replace(/^./, (character) =>
                character.toUpperCase(),
            ),
    }));
}
