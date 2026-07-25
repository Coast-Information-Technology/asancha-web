"use client";

// File: app/(public)/contact/_components/contact-form.tsx

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";

interface ContactFormErrors {
  accountStatus?: string;
  email?: string;
  enquiryCategory?: string;
  fullName?: string;
  message?: string;
  privacyAcknowledged?: string;
  relatedPublicReference?: string;
  subject?: string;
}

const enquiryCategories = [
  "Property sourcing",
  "Property submission",
  "Property agent enquiry",
  "Property sourcer enquiry",
  "Service provider enquiry",
  "API partnership",
  "Existing account support",
  "Payment or reservation enquiry",
  "Verification or document enquiry",
  "Business or general enquiry",
  "Other",
] as const;

const accountStatusOptions = [
  "No",
  "Yes",
  "Application in progress",
  "Not sure",
] as const;

const preferredContactMethods = [
  "Email",
  "Phone",
  "Either email or phone",
] as const;

const publicReferencePattern = /^[A-Za-z0-9][A-Za-z0-9_.:-]{2,120}$/;

/**
 * Renders a safe public contact form.
 */
export function ContactForm() {
  const [form, setForm] = useState({
    accountStatus: "",
    email: "",
    enquiryCategory: "",
    fullName: "",
    marketingConsent: false,
    message: "",
    phoneNumber: "",
    preferredContactMethod: "Email",
    privacyAcknowledged: false,
    relatedPublicReference: "",
    subject: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<TField extends keyof typeof form>(
    field: TField,
    value: (typeof form)[TField],
  ): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ContactFormErrors = {};
    const reference = form.relatedPublicReference.trim();

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.enquiryCategory) {
      nextErrors.enquiryCategory =
        "Choose the option that best describes your enquiry.";
    }

    if (!form.accountStatus) {
      nextErrors.accountStatus =
        "Tell us whether you already have an Asancha account.";
    }

    if (reference && !publicReferencePattern.test(reference)) {
      nextErrors.relatedPublicReference =
        "Enter a valid Asancha public reference or leave this field blank.";
    }

    if (form.subject.trim().length < 2) {
      nextErrors.subject = "Enter a subject for your enquiry.";
    }

    if (form.message.trim().length < 20) {
      nextErrors.message =
        form.message.trim().length === 0
          ? "Tell us how we can help."
          : "Please provide a little more information about your enquiry.";
    }

    if (!form.privacyAcknowledged) {
      nextErrors.privacyAcknowledged =
        "Please confirm that you have read the Privacy Policy information before submitting your enquiry.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl border border-border bg-muted/70 p-6"
        role="status"
      >
        <h3 className="text-xl font-extrabold text-foreground">
          Your enquiry has been received
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Thank you for contacting Asancha. Your enquiry has been submitted
          successfully. We will review the information provided and respond
          using your preferred contact method where appropriate.
        </p>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Keep your enquiry reference in case you need to contact us about this
          message.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setSubmitted(false)} type="button">
            Send another enquiry
          </Button>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 py-2 text-sm font-bold text-foreground hover:bg-muted"
            href="/marketplace"
          >
            Explore Properties
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 py-2 text-sm font-bold text-foreground hover:bg-muted"
            href="/auth/sign-up"
          >
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" id="contact-form" onSubmit={handleSubmit}>
      <Input
        autoComplete="name"
        errorMessage={errors.fullName}
        label="Full name"
        onChange={(event) => updateField("fullName", event.target.value)}
        placeholder="Enter your full name"
        required
        value={form.fullName}
      />

      <Input
        autoComplete="email"
        errorMessage={errors.email}
        label="Email address"
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="Enter your email address"
        required
        type="email"
        value={form.email}
      />

      <Input
        autoComplete="tel"
        helpText="Provide a phone number if you would like us to contact you by telephone."
        label="Phone number"
        onChange={(event) => updateField("phoneNumber", event.target.value)}
        placeholder="Include your country code"
        type="tel"
        value={form.phoneNumber}
      />

      <div>
        <label
          className="mb-2 block text-sm font-bold text-foreground"
          htmlFor="contact-enquiry-category"
        >
          What can we help you with?{" "}
          <span className="text-destructive">*</span>
        </label>
        <select
          aria-describedby={
            errors.enquiryCategory
              ? "contact-enquiry-category-error"
              : undefined
          }
          aria-invalid={Boolean(errors.enquiryCategory)}
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-4 focus:ring-primary/20"
          id="contact-enquiry-category"
          onChange={(event) =>
            updateField("enquiryCategory", event.target.value)
          }
          required
          value={form.enquiryCategory}
        >
          <option value="">Choose a category</option>
          {enquiryCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.enquiryCategory ? (
          <p
            className="mt-2 text-sm font-semibold text-destructive"
            id="contact-enquiry-category-error"
            role="alert"
          >
            {errors.enquiryCategory}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold text-foreground"
          htmlFor="contact-account-status"
        >
          Do you already have an Asancha account?{" "}
          <span className="text-destructive">*</span>
        </label>
        <select
          aria-describedby={
            errors.accountStatus ? "contact-account-status-error" : undefined
          }
          aria-invalid={Boolean(errors.accountStatus)}
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-4 focus:ring-primary/20"
          id="contact-account-status"
          onChange={(event) => updateField("accountStatus", event.target.value)}
          required
          value={form.accountStatus}
        >
          <option value="">Choose account status</option>
          {accountStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.accountStatus ? (
          <p
            className="mt-2 text-sm font-semibold text-destructive"
            id="contact-account-status-error"
            role="alert"
          >
            {errors.accountStatus}
          </p>
        ) : null}
      </div>

      <Input
        errorMessage={errors.relatedPublicReference}
        label="Relevant reference"
        onChange={(event) =>
          updateField("relatedPublicReference", event.target.value)
        }
        placeholder="For example, a payment, listing, reservation or verification reference"
        helpText="Only enter an Asancha public reference. Do not enter passwords, tokens, API keys, bank details, card numbers, or internal database identifiers."
        value={form.relatedPublicReference}
      />

      <Input
        errorMessage={errors.subject}
        label="Subject"
        onChange={(event) => updateField("subject", event.target.value)}
        placeholder="Briefly describe your enquiry"
        required
        value={form.subject}
      />

      <div>
        <label
          className="mb-2 block text-sm font-bold text-foreground"
          htmlFor="contact-message"
        >
          How can we help? <span className="text-destructive">*</span>
        </label>
        <textarea
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-message-help"
          }
          aria-invalid={Boolean(errors.message)}
          className="min-h-40 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-4 focus:ring-primary/20"
          id="contact-message"
          maxLength={3000}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Provide the details of your enquiry"
          required
          value={form.message}
        />
        {errors.message ? (
          <p
            className="mt-2 text-sm font-semibold text-destructive"
            id="contact-message-error"
            role="alert"
          >
            {errors.message}
          </p>
        ) : (
          <p
            className="mt-2 text-xs leading-5 text-muted-foreground"
            id="contact-message-help"
          >
            Do not include passwords, API keys, payment secrets, private
            document URLs, identity numbers, or verification tokens.
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold text-foreground"
          htmlFor="contact-preferred-method"
        >
          How would you prefer us to respond?{" "}
          <span className="text-destructive">*</span>
        </label>
        <select
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-4 focus:ring-primary/20"
          id="contact-preferred-method"
          onChange={(event) =>
            updateField("preferredContactMethod", event.target.value)
          }
          required
          value={form.preferredContactMethod}
        >
          {preferredContactMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <label className="flex gap-3 rounded-xl border border-border bg-muted/60 p-4 text-sm leading-6 text-foreground">
        <input
          checked={form.privacyAcknowledged}
          className="mt-1"
          onChange={(event) =>
            updateField("privacyAcknowledged", event.target.checked)
          }
          required
          type="checkbox"
        />
        <span>
          I understand that Asancha will use the information provided to review
          and respond to my enquiry in accordance with its{" "}
          <Link
            className="font-bold text-primary hover:text-primary-hover"
            href="/legal/privacy"
          >
            Privacy Policy
          </Link>
          .
          {errors.privacyAcknowledged ? (
            <span
              className="mt-2 block font-semibold text-destructive"
              role="alert"
            >
              {errors.privacyAcknowledged}
            </span>
          ) : null}
        </span>
      </label>

      <label className="flex gap-3 rounded-xl border border-border p-4 text-sm leading-6 text-muted-foreground">
        <input
          checked={form.marketingConsent}
          className="mt-1"
          onChange={(event) =>
            updateField("marketingConsent", event.target.checked)
          }
          type="checkbox"
        />
        <span>
          I would like to receive relevant Asancha property and platform
          updates.
        </span>
      </label>

      <Button fullWidth type="submit">
        Send Your Enquiry
      </Button>
    </form>
  );
}
