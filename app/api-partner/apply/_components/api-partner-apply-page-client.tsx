"use client";

// File: app/api-partner/apply/_components/api-partner-apply-page-client.tsx

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Checkbox } from "@/src/components/ui/checkbox/checkbox";
import { Input } from "@/src/components/ui/input/input";
import { useAuthSession } from "@/src/features/auth/hooks/use-auth-session";
import { isAsanchaApiError } from "@/src/lib/api/api-error";
import { apiPost } from "@/src/lib/api/api-client";
import { API_ROUTES } from "@/src/lib/api/api-routes";
import { authApiPatch, authApiPost } from "@/src/lib/api/auth-fetch";

type ApiPartnerPolicyType =
  | "terms_of_use"
  | "privacy_policy"
  | "platform_rules"
  | "api_acceptable_use_policy"
  | "api_billing_terms"
  | "data_processing_consent";

interface RegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  contactName: string;
  acceptedPolicies: ApiPartnerPolicyType[];
}

interface RegistrationPayload extends Record<string, unknown> {
  email: string;
  password: string;
  companyName: string;
  contactName: string;
  acceptedPolicies: ApiPartnerPolicyType[];
}

interface ApplicationForm {
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

const REQUIRED_POLICIES: ReadonlyArray<{
  policyType: ApiPartnerPolicyType;
  title: string;
  href: string;
}> = [
  { policyType: "terms_of_use", title: "Terms of Use", href: "/legal/terms" },
  {
    policyType: "privacy_policy",
    title: "Privacy Policy",
    href: "/legal/privacy",
  },
  {
    policyType: "platform_rules",
    title: "Platform Rules",
    href: "/legal/platform-rules",
  },
  {
    policyType: "api_acceptable_use_policy",
    title: "API Acceptable Use Policy",
    href: "/api-partners",
  },
  {
    policyType: "api_billing_terms",
    title: "API Billing Terms",
    href: "/pricing",
  },
  {
    policyType: "data_processing_consent",
    title: "Data Processing Consent",
    href: "/legal/data-processing",
  },
];

const SCOPE_OPTIONS = [
  "sandbox:read",
  "properties:read",
  "listings:read",
  "marketplace:read",
] as const;

const INITIAL_REGISTRATION_FORM: RegistrationForm = {
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  contactName: "",
  acceptedPolicies: [],
};

const INITIAL_APPLICATION_FORM: ApplicationForm = {
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

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not complete that request. Please try again.";
}

function PolicyLabel({ href, title }: { href: string; title: string }) {
  return (
    <span>
      I accept the{" "}
      <Link
        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
        href={href}
      >
        {title}
        <ExternalLink aria-hidden="true" size={14} />
      </Link>
      .
    </span>
  );
}

function TextareaField({
  label,
  onChange,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span>
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      <textarea
        className="min-h-32 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none focus:ring-4 focus:ring-[var(--primary)]/15"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}

function FieldGroup({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="grid gap-5 rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
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
  const [registrationForm, setRegistrationForm] = useState(
    INITIAL_REGISTRATION_FORM,
  );
  const [applicationForm, setApplicationForm] = useState(INITIAL_APPLICATION_FORM);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const acceptedPolicies = useMemo(
    () => new Set(registrationForm.acceptedPolicies),
    [registrationForm.acceptedPolicies],
  );

  function updateRegistration<TKey extends keyof RegistrationForm>(
    key: TKey,
    value: RegistrationForm[TKey],
  ) {
    setRegistrationForm((current) => ({ ...current, [key]: value }));
  }

  function updateApplication<TKey extends keyof ApplicationForm>(
    key: TKey,
    value: ApplicationForm[TKey],
  ) {
    setApplicationForm((current) => ({ ...current, [key]: value }));
  }

  function togglePolicy(policyType: ApiPartnerPolicyType, checked: boolean) {
    setRegistrationForm((current) => {
      const next = new Set(current.acceptedPolicies);

      if (checked) next.add(policyType);
      else next.delete(policyType);

      return { ...current, acceptedPolicies: Array.from(next) };
    });
  }

  function toggleScope(scope: string, checked: boolean) {
    setApplicationForm((current) => {
      const next = new Set(current.requestedScopes);

      if (checked) next.add(scope);
      else next.delete(scope);

      return { ...current, requestedScopes: Array.from(next) };
    });
  }

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

    if (
      REQUIRED_POLICIES.some(
        (policy) => !acceptedPolicies.has(policy.policyType),
      )
    ) {
      setErrorMessage("Accept all required API partner policies.");
      return;
    }

    const payload: RegistrationPayload = {
      email: registrationForm.email.trim().toLowerCase(),
      password: registrationForm.password,
      companyName: registrationForm.companyName.trim(),
      contactName: registrationForm.contactName.trim(),
      acceptedPolicies: registrationForm.acceptedPolicies,
    };

    setIsSubmitting(true);

    try {
      await apiPost<unknown, RegistrationPayload>(
        API_ROUTES.auth.registerApiPartner,
        payload,
      );
      setRegistrationForm(INITIAL_REGISTRATION_FORM);
      setSuccessMessage(
        "Your API partner account has been created. Check your email for the verification link, then sign in to complete the application.",
      );
    } catch (error) {
      if (
        isAsanchaApiError(error) &&
        (error.code === "conflict" || error.statusCode === 409)
      ) {
        router.push(
          `/auth/resend-verification?${new URLSearchParams({
            email: payload.email,
          }).toString()}`,
        );
        return;
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveCurrentStep() {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (step === 1) {
        await authApiPost(API_ROUTES.apiPartner.applications, {
          companyName: applicationForm.companyName.trim(),
          website: applicationForm.website.trim(),
          country: applicationForm.country.trim(),
          businessUseCase: applicationForm.businessUseCase.trim(),
        });
        setStep(2);
      } else if (step === 2) {
        await authApiPatch(API_ROUTES.apiPartner.applicationContacts, {
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
        });
        setStep(3);
      } else if (step === 3) {
        await authApiPatch(
          API_ROUTES.apiPartner.applicationComplianceVerification,
          {
            companyRegistrationDocumentPublicId:
              applicationForm.companyRegistrationDocumentPublicId.trim(),
            intendedUsage: applicationForm.intendedUsage.trim(),
            complianceConfirmation: applicationForm.complianceConfirmation,
            dataProcessingConfirmation:
              applicationForm.dataProcessingConfirmation,
          },
        );
        setStep(4);
      } else if (step === 4) {
        await authApiPatch(API_ROUTES.apiPartner.applicationCommercialSetup, {
          estimatedMonthlyApiCalls: Number(
            applicationForm.estimatedMonthlyApiCalls,
          ),
          requestedPlan: applicationForm.requestedPlan.trim(),
          requestedScopes: applicationForm.requestedScopes,
          billingEmail: applicationForm.billingEmail.trim().toLowerCase(),
          apiAcceptableUsePolicyAccepted:
            applicationForm.apiAcceptableUsePolicyAccepted,
          apiBillingTermsAccepted: applicationForm.apiBillingTermsAccepted,
        });
        setStep(5);
      } else {
        await authApiPost(API_ROUTES.apiPartner.submitApplication, {
          confirmAccuracy: true,
          submitForReview: true,
        });
        setSuccessMessage(
          "Your API partner application has been submitted for review.",
        );
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderRegistration() {
    return (
      <form className="grid gap-5" onSubmit={handleRegister}>
        <Input
          label="Company name"
          onChange={(event) =>
            updateRegistration("companyName", event.target.value)
          }
          required
          value={registrationForm.companyName}
        />
        <Input
          label="Contact name"
          onChange={(event) =>
            updateRegistration("contactName", event.target.value)
          }
          required
          value={registrationForm.contactName}
        />
        <Input
          label="Email address"
          onChange={(event) => updateRegistration("email", event.target.value)}
          required
          type="email"
          value={registrationForm.email}
        />
        <Input
          label="Password"
          onChange={(event) =>
            updateRegistration("password", event.target.value)
          }
          required
          rightElement={
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
          type={showPassword ? "text" : "password"}
          value={registrationForm.password}
        />
        <Input
          label="Confirm password"
          onChange={(event) =>
            updateRegistration("confirmPassword", event.target.value)
          }
          required
          rightElement={
            <button
              aria-label={
                showConfirmPassword
                  ? "Hide password confirmation"
                  : "Show password confirmation"
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
              type="button"
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
          type={showConfirmPassword ? "text" : "password"}
          value={registrationForm.confirmPassword}
        />
        <fieldset className="grid gap-3">
          <legend className="font-bold">Required agreements</legend>
          {REQUIRED_POLICIES.map((policy) => (
            <Checkbox
              checked={acceptedPolicies.has(policy.policyType)}
              key={policy.policyType}
              label={<PolicyLabel href={policy.href} title={policy.title} />}
              onChange={(event) =>
                togglePolicy(policy.policyType, event.target.checked)
              }
              required
            />
          ))}
        </fieldset>
        <Button isLoading={isSubmitting} loadingLabel="Creating account" type="submit">
          Create API partner account
        </Button>
      </form>
    );
  }

  function renderApplication() {
    if (
      authSession.status === "idle" ||
      authSession.status === "loading"
    ) {
      return <p className="text-sm text-[var(--muted-foreground)]">Checking your account session...</p>;
    }

    if (!authSession.isAuthenticated) {
      return (
        <FieldGroup title="Sign in to continue">
          <p className="text-sm text-[var(--muted-foreground)]">
            Verify your API partner email first, then sign in to complete the
            application.
          </p>
          <Link className="inline-flex font-bold text-[var(--primary)]" href="/auth/sign-in">
            Sign in
          </Link>
        </FieldGroup>
      );
    }

    return (
      <div className="grid gap-5">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <button
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                item === step
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
              key={item}
              onClick={() => setStep(item)}
              type="button"
            >
              Step {item}
            </button>
          ))}
        </div>

        {step === 1 ? (
          <FieldGroup title="Company and use case">
            <Input label="Company name" onChange={(event) => updateApplication("companyName", event.target.value)} required value={applicationForm.companyName} />
            <Input label="Website" onChange={(event) => updateApplication("website", event.target.value)} required type="url" value={applicationForm.website} />
            <Input label="Country" onChange={(event) => updateApplication("country", event.target.value)} required value={applicationForm.country} />
            <TextareaField label="Business use case" onChange={(value) => updateApplication("businessUseCase", value)} required value={applicationForm.businessUseCase} />
          </FieldGroup>
        ) : null}

        {step === 2 ? (
          <FieldGroup title="Contacts">
            <Input label="Business contact name" onChange={(event) => updateApplication("businessContactName", event.target.value)} required value={applicationForm.businessContactName} />
            <Input label="Business contact email" onChange={(event) => updateApplication("businessContactEmail", event.target.value)} required type="email" value={applicationForm.businessContactEmail} />
            <Input label="Business contact phone" onChange={(event) => updateApplication("businessContactPhone", event.target.value)} required value={applicationForm.businessContactPhone} />
            <Input label="Technical contact name" onChange={(event) => updateApplication("technicalContactName", event.target.value)} required value={applicationForm.technicalContactName} />
            <Input label="Technical contact email" onChange={(event) => updateApplication("technicalContactEmail", event.target.value)} required type="email" value={applicationForm.technicalContactEmail} />
            <Input label="Technical contact phone" onChange={(event) => updateApplication("technicalContactPhone", event.target.value)} required value={applicationForm.technicalContactPhone} />
          </FieldGroup>
        ) : null}

        {step === 3 ? (
          <FieldGroup title="Compliance & verification">
            <Input label="Company registration document public ID" onChange={(event) => updateApplication("companyRegistrationDocumentPublicId", event.target.value)} required value={applicationForm.companyRegistrationDocumentPublicId} />
            <TextareaField label="Intended usage" onChange={(value) => updateApplication("intendedUsage", value)} required value={applicationForm.intendedUsage} />
            <Checkbox checked={applicationForm.complianceConfirmation} label="I confirm the integration will follow API compliance requirements." onChange={(event) => updateApplication("complianceConfirmation", event.target.checked)} required />
            <Checkbox checked={applicationForm.dataProcessingConfirmation} label="I confirm the data processing responsibilities." onChange={(event) => updateApplication("dataProcessingConfirmation", event.target.checked)} required />
          </FieldGroup>
        ) : null}

        {step === 4 ? (
          <FieldGroup title="Commercial setup">
            <Input label="Estimated monthly API calls" onChange={(event) => updateApplication("estimatedMonthlyApiCalls", event.target.value)} required type="number" value={applicationForm.estimatedMonthlyApiCalls} />
            <Input label="Requested plan" onChange={(event) => updateApplication("requestedPlan", event.target.value)} required value={applicationForm.requestedPlan} />
            <Input label="Billing email" onChange={(event) => updateApplication("billingEmail", event.target.value)} required type="email" value={applicationForm.billingEmail} />
            {SCOPE_OPTIONS.map((scope) => (
              <Checkbox checked={applicationForm.requestedScopes.includes(scope)} key={scope} label={scope} onChange={(event) => toggleScope(scope, event.target.checked)} />
            ))}
            <Checkbox checked={applicationForm.apiAcceptableUsePolicyAccepted} label={<PolicyLabel href="/api-partners" title="API Acceptable Use Policy" />} onChange={(event) => updateApplication("apiAcceptableUsePolicyAccepted", event.target.checked)} required />
            <Checkbox checked={applicationForm.apiBillingTermsAccepted} label={<PolicyLabel href="/pricing" title="API Billing Terms" />} onChange={(event) => updateApplication("apiBillingTermsAccepted", event.target.checked)} required />
          </FieldGroup>
        ) : null}

        {step === 5 ? (
          <FieldGroup title="Review & submit">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Review your API partner application details and submit for review.
            </p>
          </FieldGroup>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))} type="button" variant="secondary">
            Back
          </Button>
          <Button isLoading={isSubmitting} loadingLabel="Saving" onClick={() => void saveCurrentStep()} type="button">
            {step === 5 ? "Submit for review" : "Save and continue"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]" href="/">
        Asancha
      </Link>
      <header>
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--primary)]">
            <LockKeyhole aria-hidden="true" size={20} />
          </span>
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
            API partners
          </p>
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          {mode === "registration"
            ? "Register for controlled API partner access."
            : "Complete your API partner application."}
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-[var(--muted-foreground)]">
          {mode === "registration"
            ? "Create the API partner account first. After email verification, sign in to complete the application."
            : "Complete the company, contacts, compliance, and commercial stages after signing in."}
        </p>
      </header>

      {errorMessage ? (
        <div className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm font-semibold text-[var(--destructive)]">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-[var(--asancha-radius-md)] bg-green-50 p-4 text-sm font-semibold leading-6 text-green-800">
          {successMessage}
        </div>
      ) : null}

      <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        {mode === "registration" ? renderRegistration() : renderApplication()}
      </section>
    </div>
  );
}
