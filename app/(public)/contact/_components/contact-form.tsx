"use client";

// File: app/(public)/contact/_components/contact-form.tsx

/**
 * Asancha Contact Form
 *
 * Purpose:
 * Provides a public contact form UI until the backend contact endpoint is
 * connected.
 *
 * Security note:
 * This form must not request passwords, API keys, payment secrets,
 * verification tokens, or private document URLs.
 */

import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";

interface ContactFormErrors {
  fullName?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const contactTopics = [
  "Marketplace enquiry",
  "Property workflow",
  "Service provider access",
  "API partner access",
  "Account support",
  "General enquiry",
] as const;

/**
 * Renders a safe public contact form.
 */
export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ContactFormErrors = {};

    if (fullName.trim().length < 2) {
      nextErrors.fullName = "Enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!topic) {
      nextErrors.topic = "Choose a topic.";
    }

    if (message.trim().length < 20) {
      nextErrors.message = "Add a little more detail.";
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
        className="rounded-lg border border-border bg-muted/70 p-6"
        role="status"
      >
        <h2 className="text-xl font-extrabold text-foreground">
          Message prepared
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The contact endpoint is not connected yet. Your message details are
          ready for the integration step.
        </p>
        <Button
          className="mt-5"
          onClick={() => setSubmitted(false)}
          type="button"
          variant="secondary"
        >
          Edit message
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        autoComplete="name"
        errorMessage={errors.fullName}
        label="Full name"
        onChange={(event) => setFullName(event.target.value)}
        required
        value={fullName}
      />

      <Input
        autoComplete="email"
        errorMessage={errors.email}
        label="Email address"
        onChange={(event) => setEmail(event.target.value)}
        required
        type="email"
        value={email}
      />

      <div>
        <label
          className="mb-2 block text-sm font-bold text-foreground"
          htmlFor="contact-topic"
        >
          Topic <span className="text-destructive">*</span>
        </label>
        <select
          aria-describedby={errors.topic ? "contact-topic-error" : undefined}
          aria-invalid={Boolean(errors.topic)}
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-4 focus:ring-primary/20"
          id="contact-topic"
          onChange={(event) => setTopic(event.target.value)}
          required
          value={topic}
        >
          <option value="">Choose a topic</option>
          {contactTopics.map((currentTopic) => (
            <option key={currentTopic} value={currentTopic}>
              {currentTopic}
            </option>
          ))}
        </select>
        {errors.topic ? (
          <p
            className="mt-2 text-sm font-semibold text-destructive"
            id="contact-topic-error"
            role="alert"
          >
            {errors.topic}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold text-foreground"
          htmlFor="contact-message"
        >
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-message-help"
          }
          aria-invalid={Boolean(errors.message)}
          className="min-h-36 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-4 focus:ring-primary/20"
          id="contact-message"
          onChange={(event) => setMessage(event.target.value)}
          required
          value={message}
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

      <Button fullWidth type="submit">
        Send message
      </Button>
    </form>
  );
}
