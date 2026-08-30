// File: app/(public)/contact/page.tsx

/**
 * Asancha Contact Page
 *
 * Purpose:
 * Provides verified public contact information, enquiry routing guidance, a
 * safe public contact form, contact FAQs, and ContactPage JSON-LD.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createContactPageJsonLd } from "@/src/lib/seo/json-ld";
import { PublicPageHero } from "../_components/public-page-hero";

import { ContactForm } from "./_components/contact-form";
import {
  Reveal,
  RevealItem,
  Stagger,
  StaggerOl,
} from "./_components/contact-motion";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Contact Asancha | Property Sourcing and Platform Enquiries",
  },
  description:
    "Contact Asancha about UK property sourcing, property submissions, investor requirements, professional services, account support, or approved API partnerships.",
  keywords: [
    "contact Asancha",
    "Asancha contact number",
    "Asancha email address",
    "Asancha office address",
    "property sourcing enquiry UK",
    "UK property sourcing contact",
    "property investment enquiry",
    "property submission enquiry",
    "property sourcer contact",
    "property agent enquiry UK",
    "property investor support",
    "property platform support",
    "AI property intelligence enquiry",
    "Asancha API partnership",
    "property service provider enquiry",
    "Rushden property sourcing",
    "Northamptonshire property company",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/contact",
    siteName: "Asancha",
    title: "Contact Asancha | Property Sourcing and Platform Enquiries",
    description:
      "Contact Asancha about UK property sourcing, property submissions, investor requirements, professional services, account support, or approved API partnerships.",
    images: [
      {
        url: "/images/og/asancha-contact-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Asancha for property sourcing, platform support and API partnership enquiries",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Asancha | Property Sourcing and Platform Enquiries",
    description:
      "Contact Asancha about property sourcing, property submissions, account support, professional services, or approved API access.",
    images: [
      {
        url: "/images/og/asancha-contact-og.jpg",
        alt: "Contact Asancha for property sourcing and property-platform enquiries",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "content-language": "en-GB",
    "geo.region": "GB",
    telephone: "+44 7404 799254",
  },
};

const contactDetails = {
  phone: {
    display: "+44 7404 799254",
    href: "tel:+447404799254",
  },
  email: {
    display: "info@asancha.co.uk",
    href: "mailto:info@asancha.co.uk",
  },
  address: {
    formatted: [
      "28 Bedford Road",
      "Rushden",
      "Northamptonshire",
      "NN10 0NB",
      "United Kingdom",
    ],
  },
  website: {
    display: "asancha.co.uk",
    href: "https://asancha.co.uk",
  },
} as const;

const contactOptions = [
  {
    title: "Speak With the Asancha Team",
    description:
      "Call us to discuss a property enquiry, property sourcing requirement, property submission, or general question.",
    action: "Call Asancha",
    href: contactDetails.phone.href,
    value: contactDetails.phone.display,
    note: "Phone availability may vary. When we cannot answer immediately, please leave a message or submit the contact form.",
    icon: Phone,
  },
  {
    title: "Send Us an Email",
    description:
      "For general enquiries, property sourcing questions, partnership enquiries, and non-urgent support.",
    action: "Email Asancha",
    href: contactDetails.email.href,
    value: contactDetails.email.display,
    note: "Do not send passwords, authentication codes, full payment-card information, API secrets, or highly sensitive identity documents through ordinary email unless a secure submission method has been provided.",
    icon: Mail,
  },
  {
    title: "Asancha Office",
    description:
      "Please arrange an appointment before visiting. Do not attend the address expecting an unscheduled property consultation, document review, or account-support meeting.",
    action: "View website",
    href: contactDetails.website.href,
    value: contactDetails.address.formatted.join(", "),
    note: "Use the address for verified company-location context and pre-arranged visits only.",
    icon: MapPin,
  },
] as const;

const enquiryCategories = [
  {
    title: "Property Sourcing",
    heading: "Looking for a Property Opportunity?",
    description:
      "Tell us your preferred locations, budget range, property type, investment strategy, occupancy preference, refurbishment appetite, funding readiness, and target purchase timeline.",
    action: "Create an Investor Account",
    href: "/auth/sign-up",
  },
  {
    title: "Property Submission",
    heading: "Do You Own or Control a Property?",
    description:
      "Contact Asancha if you want to discuss submitting a property for review. Do not upload sensitive ownership records or identity documents through a public form.",
    action: "Create a Property Owner Account",
    href: "/auth/sign-up",
  },
  {
    title: "Property Agent Enquiry",
    heading: "Are You Representing an Owner, Landlord or Developer?",
    description:
      "Agents may contact Asancha to discuss property submissions, inventory, representation, company participation, and platform access.",
    action: "Create a Property Agent Account",
    href: "/auth/sign-up",
  },
  {
    title: "Property Sourcer Enquiry",
    heading: "Do You Source Investment-Focused Opportunities?",
    description:
      "Property sourcers may contact Asancha about submitting structured property deals, sourcing requirements, and investor opportunity presentation.",
    action: "Create a Property Sourcer Account",
    href: "/auth/sign-up",
  },
  {
    title: "Service Provider Enquiry",
    heading: "Do You Provide Property-Related Services?",
    description:
      "Contact Asancha if you provide services connected to legal support, finance, surveys, inspections, refurbishment, management, architecture, planning, accounting, insurance, or other approved property services.",
    action: "Create a Service Provider Account",
    href: "/auth/sign-up",
  },
  {
    title: "API Partnership",
    heading: "Do You Want to Connect Your Product to Asancha?",
    description:
      "Technology companies, property platforms, data providers, and approved integration partners can enquire about controlled API access.",
    action: "Apply for API Access",
    href: "/api-partner/apply",
  },
] as const;

const nextSteps = [
  [
    "We Receive Your Message",
    "Your enquiry is recorded with the category and contact details you provide.",
  ],
  [
    "We Review the Information",
    "The Asancha team reviews your message and determines which workflow should handle it.",
  ],
  [
    "We May Request More Information",
    "Where required, we may ask for clarification or direct you to a secure account, onboarding, document, verification, payment, or API application process.",
  ],
  [
    "We Respond",
    "We respond through the contact method you selected, where appropriate.",
  ],
] as const;

const safetyItems = [
  "Passwords",
  "One-time passcodes",
  "Verification tokens",
  "Password-reset links",
  "Full API keys or API-key secrets",
  "Webhook secrets",
  "Full payment-card information",
  "Online banking credentials",
  "Cryptocurrency wallet credentials",
  "Full identity-document numbers",
  "Highly sensitive document files",
  "Internal administrator notes",
  "MongoDB identifiers",
  "Private document URLs",
] as const;

const faqs = [
  {
    question: "Can I browse properties without contacting Asancha?",
    answer:
      "Yes. Public visitors can find and browse safe property opportunity previews. Some information and actions may require an account, completed profile, verification, payment, or approval.",
    href: "/marketplace",
    action: "Find Properties",
  },
  {
    question: "Do I need an account before making an enquiry?",
    answer:
      "No. You may submit a general enquiry without creating an account. Creating an account is recommended when you want to set preferences, save properties, submit property, complete onboarding, or track documents and verification.",
    href: "/auth/sign-up",
    action: "Create account",
  },
  {
    question: "Can I send property documents through the contact form?",
    answer:
      "The general contact form should not be used for sensitive property or identity documents. Create an account or follow secure document-submission instructions provided by Asancha.",
  },
  {
    question: "How do I apply for API access?",
    answer:
      "API partners should use the controlled API application route and should not apply through ordinary public account registration.",
    href: "/api-partner/apply",
    action: "Apply for API Access",
  },
  {
    question: "How do I contact Asancha about an existing payment?",
    answer:
      "Select Payment or reservation enquiry and include the Asancha payment reference or reservation public reference where available. Do not provide full card numbers, bank login credentials, or payment-provider secrets.",
  },
  {
    question: "Can I visit the Asancha office?",
    answer:
      "Contact Asancha and arrange an appointment before visiting. The public address is 28 Bedford Road, Rushden, Northamptonshire, NN10 0NB, United Kingdom.",
  },
] as Array<{
  question: string;
  answer: string;
  href?: string;
  action?: string;
}>;

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  contactDetails.address.formatted.join(", "),
)}&output=embed`;

export default function ContactPage() {
  const jsonLd = createContactPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="contact-json-ld" />

      <main>
        <PublicPageHero
          description="Whether you are looking for a property opportunity, submitting a property, representing a client, sourcing investment-focused deals, offering a professional service, or exploring an API partnership, the Asancha team is here to help."
          eyebrow="Contact Asancha"
          primaryAction={{ label: "Send Your Enquiry", href: "#contact-form" }}
          secondaryAction={{
            label: "Create an Account",
            href: "/auth/sign-up",
          }}
          secondaryDescription="For questions about an existing account, document review, verification, payment, reservation, or application, include the relevant public reference where available. Do not submit passwords, API keys, bank login details, full card details, or other account secrets through the contact form."
          title="Let's Talk About Your Property Goals"
        />

        <section className="asancha-page-container py-16">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              How to Reach Us
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
              Choose the Contact Method That Works for You
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              You can contact Asancha by phone, email, or through the enquiry
              form. For the fastest and most accurate response, select the
              enquiry category that best describes what you need.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 lg:grid-cols-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <RevealItem key={option.title}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                      <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-card-foreground">
                      {option.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {option.description}
                    </p>
                    <p className="mt-4 text-sm font-bold text-foreground">
                      {option.value}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      {option.note}
                    </p>
                    <Link
                      className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold !text-white hover:bg-primary/80"
                      href={option.href}
                      rel={
                        option.href.startsWith("http")
                          ? "noreferrer"
                          : undefined
                      }
                      target={
                        option.href.startsWith("http") ? "_blank" : undefined
                      }
                    >
                      {option.action}
                      {option.href.startsWith("http") ? (
                        <ExternalLink aria-hidden="true" size={15} />
                      ) : null}
                    </Link>
                  </article>
                </RevealItem>
              );
            })}
          </Stagger>
        </section>

        <section
          aria-labelledby="contact-category-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <Reveal className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Tell Us How We Can Help
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
                id="contact-category-heading"
              >
                Direct Your Enquiry to the Right Team
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Choose the option that most closely matches your reason for
                contacting Asancha.
              </p>
            </Reveal>

            <Stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {enquiryCategories.map((category) => (
                <RevealItem key={category.title}>
                  <article className="h-full rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-sm font-bold uppercase tracking-wide text-primary">
                      {category.title}
                    </p>
                    <h3 className="mt-3 text-lg font-bold text-card-foreground">
                      {category.heading}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                    <Link
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover"
                      href={category.href}
                    >
                      {category.action}
                      <ArrowRight aria-hidden="true" size={15} />
                    </Link>
                  </article>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Send a Message
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
                Tell Us What You Need
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Complete the form and provide enough information for the Asancha
                team to understand your enquiry. Fields marked as required must
                be completed before the message can be submitted.
              </p>
            </div>
            <Reveal className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="contact-next-heading"
          className="border-y border-border bg-card"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <Reveal>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  After You Contact Us
                </p>
                <h2
                  className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
                  id="contact-next-heading"
                >
                  What to Expect After Sending an Enquiry
                </h2>
              </Reveal>
              <StaggerOl className="relative grid gap-0 before:absolute before:left-5 before:top-5 before:h-[calc(100%-2.5rem)] before:w-px before:bg-border">
                {nextSteps.map(([title, description], index) => (
                  <RevealItem key={title}>
                    <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 pb-7 last:pb-0">
                      <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-primary/25 bg-primary text-sm font-extrabold text-background shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground">
                          {title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </li>
                  </RevealItem>
                ))}
              </StaggerOl>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-safety-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <Reveal className="rounded-2xl border border-accent bg-accent p-6 shadow-sm lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                    <ShieldAlert aria-hidden="true" size={16} />
                    Contact Us Safely
                  </p>
                  <h2
                    className="mt-3 text-3xl font-extrabold tracking-normal text-accent-foreground sm:text-4xl"
                    id="contact-safety-heading"
                  >
                    Protect Your Information
                  </h2>
                  <p className="mt-4 text-base leading-7 text-accent-foreground">
                    The contact form is intended for general enquiries and
                    initial support information. If sensitive information or
                    documents are required, Asancha should direct you to the
                    appropriate secure platform workflow.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-bold !text-white hover:bg-primary/80"
                      href="/legal/privacy"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-accent-foreground/20 px-5 py-2 text-sm font-bold text-accent-foreground hover:bg-background/40"
                      href="/legal/data-processing"
                    >
                      Data Processing
                    </Link>
                  </div>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {safetyItems.map((item) => (
                    <li
                      className="rounded-xl bg-background/70 p-4 text-sm font-bold text-foreground"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="contact-questions-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <Reveal className="max-w-3xl">
              <h2
                className="text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
                id="contact-questions-heading"
              >
                Contact Questions
              </h2>
            </Reveal>
            <Stagger className="mt-10 grid gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <RevealItem key={faq.question}>
                  <article className="h-full rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-card-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                    {faq.href && faq.action ? (
                      <Link
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover"
                        href={faq.href}
                      >
                        {faq.action}
                        <ArrowRight aria-hidden="true" size={15} />
                      </Link>
                    ) : null}
                  </article>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section
          aria-labelledby="contact-map-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-14">
            <Reveal className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Find us
                </p>
                <h2
                  className="mt-3 text-3xl font-extrabold tracking-normal text-foreground"
                  id="contact-map-heading"
                >
                  Asancha on Google Maps
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Please arrange an appointment before visiting.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <iframe
                  className="block h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                  title="Asancha office location on Google Maps"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="contact-final-heading" className="bg-primary">
          <Reveal className="asancha-page-container py-16 text-primary-foreground">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                  <ShieldCheck aria-hidden="true" size={16} />
                  Start With the Right Route
                </p>
                <h2
                  className="mt-3 text-3xl font-extrabold tracking-normal sm:text-4xl"
                  id="contact-final-heading"
                >
                  Ready to Take the Next Step?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                  Send an enquiry for general help, or create an account to
                  begin a structured property sourcing, property submission,
                  service-provider, or property professional journey.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80"
                  href="#contact-form"
                >
                  Send Your Enquiry
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
                  href="/auth/sign-up"
                >
                  Create an Account
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
                  href="/api-partner/apply"
                >
                  Apply for API Access
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
