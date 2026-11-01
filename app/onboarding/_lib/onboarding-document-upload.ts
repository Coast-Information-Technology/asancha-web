import { documentsApi } from "../../../src/features/documents/api/documents.api";
import type { DocumentType } from "../../../src/features/documents/types/documents.types";

const DOCUMENT_TYPES_BY_FIELD: Readonly<Record<string, DocumentType>> = {
    identityDocumentPublicId: "identity_document",
    responsibleUserIdentityDocumentPublicId: "identity_document",
    governmentIdDocumentPublicId: "kyc_id",
    proofOfAddressDocumentPublicId: "proof_of_address",
    proofOfFundsDocumentPublicId: "proof_of_funds",
    sourceOfFundsDocumentPublicId: "source_of_funds",
    authorityDocumentPublicId: "authority_to_represent",
    authorityToRepresentDocumentPublicId: "authority_to_represent",
    executorAuthorityDocumentPublicId: "authority_to_represent",
    executorLegalAuthorityDocumentPublicId: "authority_to_represent",
    companyRegistrationDocumentPublicId: "company_registration",
    businessProofDocumentPublicId: "compliance_document",
    companyBusinessEvidenceDocumentPublicId: "compliance_document",
    proofOfBusinessIdentityDocumentPublicId: "sourcer_verification",
    agencyLicenceOrMembershipDocumentPublicId: "compliance_document",
    insuranceDocumentPublicId: "service_provider_verification",
    licenceOrProfessionalProofDocumentPublicId: "service_provider_verification",
};

function inferDocumentType(fieldName: string): DocumentType {
    const configuredType =
        DOCUMENT_TYPES_BY_FIELD[fieldName];

    if (configuredType) {
        return configuredType;
    }

    const normalizedFieldName =
        fieldName.toLowerCase();

    if (normalizedFieldName.includes("identity")) {
        return "identity_document";
    }

    if (normalizedFieldName.includes("address")) {
        return "proof_of_address";
    }

    if (normalizedFieldName.includes("authority")) {
        return "authority_to_represent";
    }

    if (
        normalizedFieldName.includes("company") &&
        normalizedFieldName.includes("registration")
    ) {
        return "company_registration";
    }

    if (
        normalizedFieldName.includes("business") ||
        normalizedFieldName.includes("company")
    ) {
        return "compliance_document";
    }

    return "other";
}

function formatFieldName(fieldName: string): string {
    return fieldName
        .replace(/PublicId$/, "")
        .replace(/Uploaded$/, "")
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace(/^./, (character) => character.toUpperCase());
}

export async function uploadOnboardingDocument(
    fieldName: string,
    file: File,
): Promise<string> {
    const result = await documentsApi.uploadDocument({
        data: {
            documentType: inferDocumentType(fieldName),
            customDocumentType: null,
            relatedType: "business_profile",
            relatedPublicId: null,
            displayName: file.name || formatFieldName(fieldName),
            description: `Uploaded during onboarding: ${formatFieldName(fieldName)}.`,
            file,
            informationAccurateConfirmed: true,
            uploadAuthorityConfirmed: true,
        },
    });

    return result.documentPublicId;
}
