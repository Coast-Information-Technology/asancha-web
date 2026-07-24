"use client";

// File: app/api-partner/apply/_components/api-partner-apply-page-client.tsx

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Button } from "@/src/components/ui/button/button";
import { Checkbox } from "@/src/components/ui/checkbox/checkbox";
import { Input } from "@/src/components/ui/input/input";
import { useAuthSession } from "@/src/features/auth/hooks/use-auth-session";
import { isAsanchaApiError } from "@/src/lib/api/api-error";
import { apiPost } from "@/src/lib/api/api-client";
import { API_ROUTES } from "@/src/lib/api/api-routes";
import {
  authApiGet,
  authApiPatch,
  authApiPost,
} from "@/src/lib/api/auth-fetch";

type ApiPartnerPolicyType =
  | "terms_of_use"
  | "privacy_policy"
  | "platform_rules"
  | "api_acceptable_use_policy"
  | "api_billing_terms"
  | "data_processing_consent";

type ApiPartnerStageKey =
  | "api_partner_application"
  | "contacts"
  | "compliance_verification"
  | "commercial_setup"
  | "admin_approval"
  | "api_access_issued";

interface ApiPartnerRegistrationPayload extends Record<string, unknown> {
  email: string;
  password: string;
  companyName: string;
  contactName: string;
  acceptedPolicies: ApiPartnerPolicyType[];
}

interface ApiPartnerRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  contactName: string;
  acceptedPolicies: ApiPartnerPolicyType[];
}

interface ApiPartnerStage {
  stageKey: ApiPartnerStageKey;
  stageTitle: string;
  stageNumber: number;
  actor: "api_partner" | "asancha_admin";
  description?: string;
}

interface ApiPartnerStagesResponse {
  flowType: "api_partner_application";
  totalStages: number;
  stages: ApiPartnerStage[];
}

interface ContactPayload {
  name: string;
  email: string;
  phoneNumber: string;
}

interface ApiPartnerApplicationPayload extends Record<string, unknown> {
  companyName: string;
  website: string;
  country: string;
  businessUseCase: string;
}

interface ApiPartnerContactsPayload extends Record<string, unknown> {
  businessContact: ContactPayload;
  technicalContact: ContactPayload;
}

interface ApiPartnerCompliancePayload extends Record<string, unknown> {
  companyRegistrationDocumentPublicId: string;
  intendedUsage: string;
  complianceConfirmation: boolean;
  dataProcessingConfirmation: boolean;
}

interface ApiPartnerCommercialPayload extends Record<string, unknown> {
  estimatedMonthlyApiCalls: number;
  requestedPlan: string;
  requestedScopes: string[];
  billingEmail: string;
  apiAcceptableUsePolicyAccepted: boolean;
  apiBillingTermsAccepted: boolean;
}

interface ApiPartnerSubmitPayload extends Record<string, unknown> {
  confirmAccuracy: true;
  submitForReview: true;
}

interface ApplicationFormState {
  companyName: string;
  website: string;
  country: string;
  businessUseCase: string;

  businessContactName: string;
  businessContactEmail: string;
  businessContactPhone: string;
  technicalContactName: string;
  technicalContactEmail: string;
  technicalContactPhone: string;

  companyRegistrationDocumentPublicId: string;
  intendedUsage: string;
  complianceConfirmation: boolean;
  dataProcessingConfirmation: boolean;

  estimatedMonthlyApiCalls: string;
  requestedPlan: string;
  requestedScopes: string[];
  billingEmail: string;
  apiAcceptableUsePolicyAccepted: boolean;
  apiBillingTermsAccepted: boolean;
}

const REQUIRED_API_PARTNER_POLICIES: ReadonlyArray<{
  policyType: ApiPartnerPolicyType;
  title: string;
  href: string;
  description: string;
}> = [
  {
    policyType: "terms_of_use",
    title: "Terms of Use",
    href: "/legal/terms",
    description: "The rules for using Asancha.",
  },
  {
    policyType: "privacy_policy",
    title: "Privacy Policy",
    href: "/legal/privacy",
    description: "How Asancha handles account and contact information.",
  },
  {
    policyType: "platform_rules",
    title: "Platform Rules",
    href: "/legal/platform-rules",
    description: "Expected conduct and safe platform use.",
  },
  {
    policyType: "api_acceptable_use_policy",
    title: "API Acceptable Use Policy",
    href: "/api-partners",
    description: "Usage limits and responsible integration expectations.",
  },
  {
    policyType: "api_billing_terms",
    title: "API Billing Terms",
    href: "/pricing",
    description: "Billing, usage, and payment-aware API access terms.",
  },
  {
    policyType: "data_processing_consent",
    title: "Data Processing Consent",
    href: "/legal/data-processing",
    description: "Consent for account and application data processing.",
  },
];

const API_SCOPE_OPTIONS = [
  "sandbox:read",
  "properties:read",
  "listings:read",
  "marketplace:read",
] as const;

const INITIAL_REGISTRATION_FORM: ApiPartnerRegistrationForm = {
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  contactName: "",
  acceptedPolicies: [],
};

const INITIAL_APPLICATION_FORM: ApplicationFormState = {
  companyName: "",
  website: "",
  country: "United Kingdom",
  businessUseCase: "",

  businessContactName: "",
  businessContactEmail: "",
  businessContactPhone: "",
  technicalContactName: "",
  technicalContactEmail: "",
  technicalContactPhone: "",

  companyRegistrationDocumentPublicId: "",
  intendedUsage: "",
  complianceConfirmation: false,
  dataProcessingConfirmation: false,

  estimatedMonthlyApiCalls: "50000",
  requestedPlan: "sandbox_growth",
  requestedScopes: ["sandbox:read"],
  billingEmail: "",
  apiAcceptableUsePolicyAccepted: false,
  apiBillingTermsAccepted: false,
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getSafeErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return "We could not complete that request. Review the details and try again.";
}

function PolicyLabel({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <span>
      I accept the{" "}
      <Link
        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
      >
        {title}
        <ExternalLink aria-hidden="true" size={14} />
      </Link>
      .
    </span>
  );
}

function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <span>
      {children}
      <span aria-hidden="true" className="ml-1 text-red-600">
        *
      </span>
    </span>
  );
}

function TextareaField({
  errorMessage,
  label,
  onChange,
  required = false,
  value,
}: {
  errorMessage?: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-red-600">
            *
          </span>
        ) : null}
      </span>
      <textarea
        className={`min-h-32 rounded-[var(--asancha-radius-md)] border bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none focus:ring-4 focus:ring-[var(--primary)]/15 ${
          errorMessage
            ? "border-[var(--destructive)]"
            : "border-[var(--border)]"
        }`}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
      {errorMessage ? (
        <span className="text-xs font-semibold text-[var(--destructive)]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}

function StageProgress({
  activeStage,
  stages,
}: {
  activeStage: number;
  stages: ApiPartnerStage[];
}) {
  const displayStages =
    stages.length > 0
      ? stages
      : [
          {
            stageKey: "api_partner_application" as const,
            stageTitle: "API Partner Application",
            stageNumber: 1,
            actor: "api_partner" as const,
            description: "Submit company and use-case information.",
          },
          {
            stageKey: "contacts" as const,
            stageTitle: "Contacts",
            stageNumber: 2,
            actor: "api_partner" as const,
          },
          {
            stageKey: "compliance_verification" as const,
            stageTitle: "Compliance & Verification",
            stageNumber: 3,
            actor: "api_partner" as const,
          },
          {
            stageKey: "commercial_setup" as const,
            stageTitle: "Commercial Setup",
            stageNumber: 4,
            actor: "api_partner" as const,
          },
          {
            stageKey: "admin_approval" as const,
            stageTitle: "Review",
            stageNumber: 5,
            actor: "asancha_admin" as const,
          },
          {
            stageKey: "api_access_issued" as const,
            stageTitle: "API Access Issued",
            stageNumber: 6,
            actor: "asancha_admin" as const,
          },
        ];

  return (
    <ol className="grid gap-3">
      {displayStages.map((stage) => {
        const isActive = stage.stageNumber === activeStage;
        const isComplete = stage.stageNumber < activeStage;

        return (
          <li
            className={`rounded-[var(--asancha-radius-md)] border p-4 ${
              isActive
                ? "border-[var(--primary)] bg-[var(--muted)]"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
            key={stage.stageKey}
          >
            <div className="flex items-start gap-3">
              <span
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isComplete
                    ? "bg-green-100 text-green-800"
                    : isActive
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 aria-hidden="true" size={16} />
                ) : (
                  stage.stageNumber
                )}
              </span>
              <div>
                <h3 className="text-sm font-bold">{stage.stageTitle}</h3>
                {stage.description ? (
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                    {stage.description}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

interface ApiPartnerApplyPageClientProps {
  mode: "registration" | "application";
}

export function ApiPartnerApplyPageClient({
  mode,
}: ApiPartnerApplyPageClientProps) {
  const router = useRouter();
  const authSession = useAuthSession();

  const [registrationForm, setRegistrationForm] =
    useState<ApiPartnerRegistrationForm>(INITIAL_REGISTRATION_FORM);
  const [applicationForm, setApplicationForm] =
    useState<ApplicationFormState>(INITIAL_APPLICATION_FORM);
  const [stages, setStages] = useState<ApiPartnerStage[]>([]);
  const [activeStage, setActiveStage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  const [isSavingStage, setIsSavingStage] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const isApiPartner =
    authSession.user?.activeBusinessProfile?.profileType === "api_partner" ||
    authSession.user?.availableBusinessProfiles.some(
      (profile) => profile.profileType === "api_partner",
    );

  const canLoadApplication =
    mode === "application" && authSession.isAuthenticated && isApiPartner;

  const acceptedPolicySet = useMemo(
    () => new Set(registrationForm.acceptedPolicies),
    [registrationForm.acceptedPolicies],
  );

  const updateRegistrationField = <
    TKey extends keyof ApiPartnerRegistrationForm,
  >(
    key: TKey,
    value: ApiPartnerRegistrationForm[TKey],
  ): void => {
    setRegistrationForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateApplicationField = <TKey extends keyof ApplicationFormState>(
    key: TKey,
    value: ApplicationFormState[TKey],
  ): void => {
    setApplicationForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const togglePolicy = (
    policyType: ApiPartnerPolicyType,
    checked: boolean,
  ): void => {
    setRegistrationForm((current) => {
      const nextPolicies = new Set(current.acceptedPolicies);

      if (checked) {
        nextPolicies.add(policyType);
      } else {
        nextPolicies.delete(policyType);
      }

      return {
        ...current,
        acceptedPolicies: Array.from(nextPolicies),
      };
    });
  };

  const toggleScope = (scope: string, checked: boolean): void => {
    setApplicationForm((current) => {
      const nextScopes = new Set(current.requestedScopes);

      if (checked) {
        nextScopes.add(scope);
      } else {
        nextScopes.delete(scope);
      }

      return {
        ...current,
        requestedScopes: Array.from(nextScopes),
      };
    });
  };

  const loadApplication = useCallback(async (): Promise<void> => {
    if (!canLoadApplication) {
      return;
    }

    setIsLoadingApplication(true);
    setErrorMessage(null);

    try {
      const stepsResult = await authApiGet<ApiPartnerStagesResponse>(
        API_ROUTES.apiPartner.applicationSteps,
      ).catch(() => null);

      if (stepsResult?.stages) {
        setStages(stepsResult.stages);
      }
    } catch (error) {
      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsLoadingApplication(false);
    }
  }, [canLoadApplication]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplication();
    });
  }, [loadApplication]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isValidEmail(registrationForm.email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (registrationForm.password.length < 8) {
      setErrorMessage("Use at least 8 characters for the password.");
      return;
    }

    if (registrationForm.password !== registrationForm.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (registrationForm.companyName.trim().length < 2) {
      setErrorMessage("Enter the company name.");
      return;
    }

    if (registrationForm.contactName.trim().length < 2) {
      setErrorMessage("Enter the main contact name.");
      return;
    }

    if (
      REQUIRED_API_PARTNER_POLICIES.some(
        (policy) => !acceptedPolicySet.has(policy.policyType),
      )
    ) {
      setErrorMessage("Accept all required API partner policies.");
      return;
    }

    const payload: ApiPartnerRegistrationPayload = {
      email: registrationForm.email.trim().toLowerCase(),
      password: registrationForm.password,
      companyName: registrationForm.companyName.trim(),
      contactName: registrationForm.contactName.trim(),
      acceptedPolicies: registrationForm.acceptedPolicies,
    };

    setIsRegistering(true);

    try {
      await apiPost<unknown, ApiPartnerRegistrationPayload>(
        API_ROUTES.auth.registerApiPartner,
        payload,
      );

      setSuccessMessage(
        "Your API partner account has been created. Check your email for the verification link, then sign in to complete the application.",
      );
      setRegistrationForm(INITIAL_REGISTRATION_FORM);
    } catch (error) {
      if (
        isAsanchaApiError(error) &&
        (error.code === "conflict" || error.statusCode === 409)
      ) {
        const searchParams = new URLSearchParams({
          email: payload.email,
        });

        router.push(`/auth/resend-verification?${searchParams.toString()}`);
        return;
      }

      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsRegistering(false);
    }
  }

  async function saveStageOne(): Promise<void> {
    if (
      applicationForm.companyName.trim().length < 2 ||
      applicationForm.website.trim().length < 8 ||
      applicationForm.businessUseCase.trim().length < 50
    ) {
      setErrorMessage(
        "Complete the company name, website, country, and business use case.",
      );
      return;
    }

    setIsSavingStage(true);
    setErrorMessage(null);

    const payload: ApiPartnerApplicationPayload = {
      companyName: applicationForm.companyName.trim(),
      website: applicationForm.website.trim(),
      country: applicationForm.country.trim(),
      businessUseCase: applicationForm.businessUseCase.trim(),
    };

    try {
      await authApiPost<unknown, ApiPartnerApplicationPayload>(
        API_ROUTES.apiPartner.applications,
        payload,
      );
      setSuccessMessage("Company and use-case information saved.");
      setActiveStage(2);
      await loadApplication();
    } catch (error) {
      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsSavingStage(false);
    }
  }

  async function saveStageTwo(): Promise<void> {
    if (
      !isValidEmail(applicationForm.businessContactEmail) ||
      !isValidEmail(applicationForm.technicalContactEmail) ||
      applicationForm.businessContactName.trim().length < 2 ||
      applicationForm.technicalContactName.trim().length < 2
    ) {
      setErrorMessage("Complete both business and technical contacts.");
      return;
    }

    setIsSavingStage(true);
    setErrorMessage(null);

    const payload: ApiPartnerContactsPayload = {
      businessContact: {
        name: applicationForm.businessContactName.trim(),
        email: applicationForm.businessContactEmail.trim().toLowerCase(),
        phoneNumber: applicationForm.businessContactPhone.trim(),
      },
      technicalContact: {
        name: applicationForm.technicalContactName.trim(),
        email: applicationForm.technicalContactEmail.trim().toLowerCase(),
        phoneNumber: applicationForm.technicalContactPhone.trim(),
      },
    };

    try {
      await authApiPatch<unknown, ApiPartnerContactsPayload>(
        API_ROUTES.apiPartner.applicationContacts,
        payload,
      );
      setSuccessMessage("Partner contacts saved.");
      setActiveStage(3);
      await loadApplication();
    } catch (error) {
      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsSavingStage(false);
    }
  }

  async function saveStageThree(): Promise<void> {
    if (
      applicationForm.companyRegistrationDocumentPublicId.trim().length < 2 ||
      applicationForm.intendedUsage.trim().length < 30 ||
      !applicationForm.complianceConfirmation ||
      !applicationForm.dataProcessingConfirmation
    ) {
      setErrorMessage(
        "Complete the verification document reference, intended usage, and confirmations.",
      );
      return;
    }

    setIsSavingStage(true);
    setErrorMessage(null);

    const payload: ApiPartnerCompliancePayload = {
      companyRegistrationDocumentPublicId:
        applicationForm.companyRegistrationDocumentPublicId.trim(),
      intendedUsage: applicationForm.intendedUsage.trim(),
      complianceConfirmation: applicationForm.complianceConfirmation,
      dataProcessingConfirmation:
        applicationForm.dataProcessingConfirmation,
    };

    try {
      await authApiPatch<unknown, ApiPartnerCompliancePayload>(
        API_ROUTES.apiPartner.applicationComplianceVerification,
        payload,
      );
      setSuccessMessage("Compliance and verification details saved.");
      setActiveStage(4);
      await loadApplication();
    } catch (error) {
      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsSavingStage(false);
    }
  }

  async function saveStageFour(): Promise<void> {
    const estimatedMonthlyApiCalls = Number(
      applicationForm.estimatedMonthlyApiCalls,
    );

    if (
      !Number.isFinite(estimatedMonthlyApiCalls) ||
      estimatedMonthlyApiCalls < 1 ||
      applicationForm.requestedPlan.trim().length < 2 ||
      applicationForm.requestedScopes.length === 0 ||
      !isValidEmail(applicationForm.billingEmail) ||
      !applicationForm.apiAcceptableUsePolicyAccepted ||
      !applicationForm.apiBillingTermsAccepted
    ) {
      setErrorMessage(
        "Complete the commercial setup, requested scopes, billing email, and API policy confirmations.",
      );
      return;
    }

    setIsSavingStage(true);
    setErrorMessage(null);

    const payload: ApiPartnerCommercialPayload = {
      estimatedMonthlyApiCalls,
      requestedPlan: applicationForm.requestedPlan.trim(),
      requestedScopes: applicationForm.requestedScopes,
      billingEmail: applicationForm.billingEmail.trim().toLowerCase(),
      apiAcceptableUsePolicyAccepted:
        applicationForm.apiAcceptableUsePolicyAccepted,
      apiBillingTermsAccepted: applicationForm.apiBillingTermsAccepted,
    };

    try {
      await authApiPatch<unknown, ApiPartnerCommercialPayload>(
        API_ROUTES.apiPartner.applicationCommercialSetup,
        payload,
      );
      setSuccessMessage("Commercial setup saved.");
      setActiveStage(5);
      await loadApplication();
    } catch (error) {
      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsSavingStage(false);
    }
  }

  async function submitApplication(): Promise<void> {
    setIsSavingStage(true);
    setErrorMessage(null);
    setShowSubmitModal(false);

    const payload: ApiPartnerSubmitPayload = {
      confirmAccuracy: true,
      submitForReview: true,
    };

    try {
      await authApiPost<unknown, ApiPartnerSubmitPayload>(
        API_ROUTES.apiPartner.submitApplication,
        payload,
      );
      setSuccessMessage(
        "Your API partner application has been submitted for review.",
      );
      setApplicationSubmitted(true);
      setActiveStage(5);
    } catch (error) {
      setErrorMessage(getSafeErrorMessage(error));
    } finally {
      setIsSavingStage(false);
    }
  }

  function renderRegistration() {
    return (
      <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--primary)]">
            <LockKeyhole aria-hidden="true" size={20} />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
              API partner registration
            </p>
            <h2 className="text-2xl font-bold">Create partner account</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
          Register the company account first. After email verification, sign in
          here to complete the API partner application.
        </p>

        <form className="mt-6 grid gap-5" onSubmit={handleRegister}>
          <Input
            autoComplete="organization"
            label="Company name"
            onChange={(event) =>
              updateRegistrationField("companyName", event.target.value)
            }
            required
            value={registrationForm.companyName}
          />

          <Input
            autoComplete="name"
            label="Contact name"
            onChange={(event) =>
              updateRegistrationField("contactName", event.target.value)
            }
            required
            value={registrationForm.contactName}
          />

          <Input
            autoComplete="email"
            label="Email address"
            onChange={(event) =>
              updateRegistrationField("email", event.target.value)
            }
            required
            type="email"
            value={registrationForm.email}
          />

          <Input
            autoComplete="new-password"
            helpText="Use a strong password with letters, numbers, and a symbol."
            label="Password"
            onChange={(event) =>
              updateRegistrationField("password", event.target.value)
            }
            required
            rightElement={
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={17} />
                ) : (
                  <Eye aria-hidden="true" size={17} />
                )}
              </button>
            }
            type={showPassword ? "text" : "password"}
            value={registrationForm.password}
          />

          <Input
            autoComplete="new-password"
            label="Confirm password"
            onChange={(event) =>
              updateRegistrationField("confirmPassword", event.target.value)
            }
            required
            rightElement={
              <button
                aria-label={
                  showConfirmPassword
                    ? "Hide password confirmation"
                    : "Show password confirmation"
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                type="button"
              >
                {showConfirmPassword ? (
                  <EyeOff aria-hidden="true" size={17} />
                ) : (
                  <Eye aria-hidden="true" size={17} />
                )}
              </button>
            }
            type={showConfirmPassword ? "text" : "password"}
            value={registrationForm.confirmPassword}
          />

          <fieldset className="grid gap-4">
            <legend className="text-sm font-bold">
              Required agreements
            </legend>

            {REQUIRED_API_PARTNER_POLICIES.map((policy) => (
              <Checkbox
                checked={acceptedPolicySet.has(policy.policyType)}
                description={policy.description}
                key={policy.policyType}
                label={<PolicyLabel href={policy.href} title={policy.title} />}
                onChange={(event) =>
                  togglePolicy(policy.policyType, event.target.checked)
                }
                required
              />
            ))}
          </fieldset>

          <Button
            isLoading={isRegistering}
            loadingLabel="Creating account"
            type="submit"
          >
            Create API partner account
          </Button>
        </form>
      </section>
    );
  }

  function renderApplicationForm() {
    if (mode === "registration") {
      if (
        authSession.status === "idle" ||
        authSession.status === "loading"
      ) {
        return (
          <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted-foreground)] shadow-sm sm:p-8">
            Checking your account session...
          </section>
        );
      }

      if (authSession.isAuthenticated && isApiPartner) {
        return (
          <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">
              Continue your API partner application
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Your API partner account is already signed in. Continue to the
              application page to complete your API partner application.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-5 py-2 text-sm font-bold text-[var(--background)] hover:bg-[var(--foreground)]/80"
              href="/api-partner/apply"
            >
              Continue application
            </Link>
          </section>
        );
      }

      if (authSession.isAuthenticated) {
        return (
          <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">
              API partner registration is separate
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Sign out of the current account before registering a new API
              partner account.
            </p>
          </section>
        );
      }

      return renderRegistration();
    }

    if (
      authSession.status === "idle" ||
      authSession.status === "loading"
    ) {
      return (
        <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted-foreground)] shadow-sm sm:p-8">
          Checking your account session...
        </section>
      );
    }

    if (!authSession.isAuthenticated) {
      return (
        <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">Sign in to continue</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            Verify your API partner email first, then sign in to complete the
            application.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-5 py-2 text-sm font-bold text-[var(--background)] hover:bg-[var(--foreground)]/80"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </section>
      );
    }

    if (!isApiPartner) {
      return (
        <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">API partner account required</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            Sign in with an API partner account to complete this application.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-5 py-2 text-sm font-bold text-[var(--background)] hover:bg-[var(--foreground)]/80"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </section>
      );
    }

    return (
      <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
              Partner application
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Complete your API partner application
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              Submit company, contact, compliance, and commercial details for
              review. API access is issued only after approval.
            </p>
          </div>

        </div>

        {isLoadingApplication ? (
          <div className="mt-6 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
            Loading your application...
          </div>
        ) : null}

        {applicationSubmitted ? (
          <div className="mt-6 rounded-[var(--asancha-radius-lg)] border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 text-green-700" size={20} />
              <div>
                <h3 className="font-bold text-green-900">
                  Application submitted
                </h3>
                <p className="mt-1 text-sm leading-6 text-green-800">
                  Your application has been sent for review. Approval and API
                  access will be shown in the API partner dashboard when they
                  are available.
                </p>
                <Link
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-5 py-2 text-sm font-bold text-[var(--background)] hover:bg-[var(--foreground)]/80"
                  href="/api-partner/dashboard"
                >
                  View application status
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <StageProgress activeStage={activeStage} stages={stages} />

          <div>
            {activeStage === 1 ? (
              <div className="grid gap-5">
                <Input
                  label="Company name"
                  onChange={(event) =>
                    updateApplicationField("companyName", event.target.value)
                  }
                  required
                  value={applicationForm.companyName}
                />
                <Input
                  label="Website"
                  onChange={(event) =>
                    updateApplicationField("website", event.target.value)
                  }
                  required
                  type="url"
                  value={applicationForm.website}
                />
                <Input
                  label="Country"
                  onChange={(event) =>
                    updateApplicationField("country", event.target.value)
                  }
                  required
                  value={applicationForm.country}
                />
                <TextareaField
                  label="Business use case"
                  onChange={(value) =>
                    updateApplicationField("businessUseCase", value)
                  }
                  required
                  value={applicationForm.businessUseCase}
                />
                <Button
                  isLoading={isSavingStage}
                  loadingLabel="Saving"
                  onClick={() => void saveStageOne()}
                >
                  Save and continue
                </Button>
              </div>
            ) : null}

            {activeStage === 2 ? (
              <div className="grid gap-5">
                <h3 className="text-xl font-bold">Contacts</h3>
                <Input
                  label="Business contact name"
                  onChange={(event) =>
                    updateApplicationField(
                      "businessContactName",
                      event.target.value,
                    )
                  }
                  required
                  value={applicationForm.businessContactName}
                />
                <Input
                  label="Business contact email"
                  onChange={(event) =>
                    updateApplicationField(
                      "businessContactEmail",
                      event.target.value,
                    )
                  }
                  required
                  type="email"
                  value={applicationForm.businessContactEmail}
                />
                <Input
                  label="Business contact phone"
                  onChange={(event) =>
                    updateApplicationField(
                      "businessContactPhone",
                      event.target.value,
                    )
                  }
                  required
                  value={applicationForm.businessContactPhone}
                />
                <Input
                  label="Technical contact name"
                  onChange={(event) =>
                    updateApplicationField(
                      "technicalContactName",
                      event.target.value,
                    )
                  }
                  required
                  value={applicationForm.technicalContactName}
                />
                <Input
                  label="Technical contact email"
                  onChange={(event) =>
                    updateApplicationField(
                      "technicalContactEmail",
                      event.target.value,
                    )
                  }
                  required
                  type="email"
                  value={applicationForm.technicalContactEmail}
                />
                <Input
                  label="Technical contact phone"
                  onChange={(event) =>
                    updateApplicationField(
                      "technicalContactPhone",
                      event.target.value,
                    )
                  }
                  required
                  value={applicationForm.technicalContactPhone}
                />
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button onClick={() => setActiveStage(1)} variant="secondary">
                    Back
                  </Button>
                  <Button
                    isLoading={isSavingStage}
                    loadingLabel="Saving"
                    onClick={() => void saveStageTwo()}
                  >
                    Save and continue
                  </Button>
                </div>
              </div>
            ) : null}

            {activeStage === 3 ? (
              <div className="grid gap-5">
                <h3 className="text-xl font-bold">
                  Compliance & verification
                </h3>
                <Input
                  helpText="Enter the saved document public ID."
                  label="Company registration document public ID"
                  onChange={(event) =>
                    updateApplicationField(
                      "companyRegistrationDocumentPublicId",
                      event.target.value,
                    )
                  }
                  required
                  value={applicationForm.companyRegistrationDocumentPublicId}
                />
                <TextareaField
                  label="Intended usage"
                  onChange={(value) =>
                    updateApplicationField("intendedUsage", value)
                  }
                  required
                  value={applicationForm.intendedUsage}
                />
                <Checkbox
                  checked={applicationForm.complianceConfirmation}
                  label="I confirm that the integration will follow Asancha API compliance requirements."
                  onChange={(event) =>
                    updateApplicationField(
                      "complianceConfirmation",
                      event.target.checked,
                    )
                  }
                  required
                />
                <Checkbox
                  checked={applicationForm.dataProcessingConfirmation}
                  label="I confirm that our organisation accepts the data processing responsibilities."
                  onChange={(event) =>
                    updateApplicationField(
                      "dataProcessingConfirmation",
                      event.target.checked,
                    )
                  }
                  required
                />
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button onClick={() => setActiveStage(2)} variant="secondary">
                    Back
                  </Button>
                  <Button
                    isLoading={isSavingStage}
                    loadingLabel="Saving"
                    onClick={() => void saveStageThree()}
                  >
                    Save and continue
                  </Button>
                </div>
              </div>
            ) : null}

            {activeStage === 4 ? (
              <div className="grid gap-5">
                <h3 className="text-xl font-bold">Commercial setup</h3>
                <Input
                  label="Estimated monthly API calls"
                  min={1}
                  onChange={(event) =>
                    updateApplicationField(
                      "estimatedMonthlyApiCalls",
                      event.target.value,
                    )
                  }
                  required
                  type="number"
                  value={applicationForm.estimatedMonthlyApiCalls}
                />
                <Input
                  label="Requested plan"
                  onChange={(event) =>
                    updateApplicationField("requestedPlan", event.target.value)
                  }
                  required
                  value={applicationForm.requestedPlan}
                />
                <Input
                  label="Billing email"
                  onChange={(event) =>
                    updateApplicationField("billingEmail", event.target.value)
                  }
                  required
                  type="email"
                  value={applicationForm.billingEmail}
                />

                <fieldset className="grid gap-3">
                  <legend className="font-bold">
                    <RequiredLabel>Requested scopes</RequiredLabel>
                  </legend>
                  {API_SCOPE_OPTIONS.map((scope) => (
                    <Checkbox
                      checked={applicationForm.requestedScopes.includes(scope)}
                      key={scope}
                      label={scope}
                      onChange={(event) =>
                        toggleScope(scope, event.target.checked)
                      }
                    />
                  ))}
                </fieldset>

                <Checkbox
                  checked={applicationForm.apiAcceptableUsePolicyAccepted}
                  label={
                    <PolicyLabel
                      href="/api-partners"
                      title="API Acceptable Use Policy"
                    />
                  }
                  onChange={(event) =>
                    updateApplicationField(
                      "apiAcceptableUsePolicyAccepted",
                      event.target.checked,
                    )
                  }
                  required
                />
                <Checkbox
                  checked={applicationForm.apiBillingTermsAccepted}
                  label={
                    <PolicyLabel href="/pricing" title="API Billing Terms" />
                  }
                  onChange={(event) =>
                    updateApplicationField(
                      "apiBillingTermsAccepted",
                      event.target.checked,
                    )
                  }
                  required
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button onClick={() => setActiveStage(3)} variant="secondary">
                    Back
                  </Button>
                  <Button
                    isLoading={isSavingStage}
                    loadingLabel="Saving"
                    onClick={() => void saveStageFour()}
                  >
                    Save and continue
                  </Button>
                </div>
              </div>
            ) : null}

            {activeStage >= 5 ? (
              <div className="grid gap-5">
                <div className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--muted)] p-5">
                  <div className="flex items-start gap-3">
                    <FileCheck2
                      aria-hidden="true"
                      className="mt-1 text-[var(--primary)]"
                      size={20}
                    />
                    <div>
                      <h3 className="text-xl font-bold">Review & submit</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        Confirm the application details are accurate before
                        submitting for review.
                      </p>
                    </div>
                  </div>
                </div>

                <dl className="grid gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4 text-sm">
                  {[
                    ["Company", applicationForm.companyName],
                    ["Website", applicationForm.website],
                    ["Country", applicationForm.country],
                    ["Business contact", applicationForm.businessContactEmail],
                    ["Technical contact", applicationForm.technicalContactEmail],
                    ["Requested plan", applicationForm.requestedPlan],
                    [
                      "Requested scopes",
                      applicationForm.requestedScopes.join(", "),
                    ],
                    ["Billing email", applicationForm.billingEmail],
                  ].map(([label, value]) => (
                    <div
                      className="grid gap-1 border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[12rem_minmax(0,1fr)]"
                      key={label}
                    >
                      <dt className="font-bold">{label}</dt>
                      <dd className="text-[var(--muted-foreground)]">
                        {value || "Not provided"}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button onClick={() => setActiveStage(4)} variant="secondary">
                    Back
                  </Button>
                  <Button
                    disabled={applicationSubmitted}
                    isLoading={isSavingStage}
                    loadingLabel="Submitting"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    {applicationSubmitted ? "Submitted" : "Submit for review"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div>
          <Link
            className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            href="/"
          >
            Asancha
          </Link>

          <header className="mt-8">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
              API partners
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              {mode === "registration"
                ? "Register for controlled API partner access."
                : "Complete your API partner application."}
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-[var(--muted-foreground)]">
              {mode === "registration"
                ? "Create the API partner account first. After email verification, sign in to complete the application."
                : "Complete the company, contacts, compliance, and commercial application stages after signing in."}
            </p>
          </header>

          {errorMessage ? (
            <div
              className="mt-6 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm font-semibold text-[var(--destructive)]"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-6 rounded-[var(--asancha-radius-md)] bg-green-50 p-4 text-sm font-semibold leading-6 text-green-800">
              {successMessage}
            </div>
          ) : null}

          <div className="mt-8">{renderApplicationForm()}</div>
        </div>
      </div>

      {showSubmitModal ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-[var(--asancha-radius-xl)] bg-[var(--card)] p-6 shadow-xl">
            <h2 className="text-xl font-bold">Submit application?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Are you sure you want to submit this API partner application for
              review? You can go back if you need to check the details.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={() => setShowSubmitModal(false)}
                type="button"
                variant="secondary"
              >
                Go back
              </Button>
              <Button
                isLoading={isSavingStage}
                loadingLabel="Submitting"
                onClick={() => void submitApplication()}
                type="button"
              >
                Yes, submit
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
