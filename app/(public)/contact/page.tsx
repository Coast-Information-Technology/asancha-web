// File: app/(public)/contact/page.tsx

/**
 * Asancha Contact Page
 *
 * Purpose:
 * Provides a public contact page with contact form, contact details, map,
 * and social links for Asancha Web Public.
 *
 * Main responsibilities:
 * - Provide public-safe contact options
 * - Route visitors toward the correct support or enquiry flow
 * - Remind users not to submit sensitive information through public contact
 * - Render safe ContactPage and BreadcrumbList JSON-LD
 *
 * Accessibility note:
 * Uses one H1, semantic sections, descriptive links, labelled contact
 * sections, and an accessible iframe title.
 *
 * Security note:
 * This page must not expose internal support queues, staff routes,
 * private contact channels, backend URLs, private documents, payment data,
 * restricted user information, API keys, webhook secrets, or sensitive
 * operational details.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createContactPageJsonLd,
} from "@/src/lib/seo/json-ld";
import { PublicPageHero } from "../_components/public-page-hero";

import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact Asancha",
  description:
    "Contact Asancha by form, email, phone, address, map, or social media for public marketplace, property workflow, service provider, or API partner enquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Asancha",
    description:
      "Reach Asancha for public marketplace, property workflow, service provider, support, or API partner enquiries.",
    url: "/contact",
    type: "website",
  },
};

const contactDetails = {
  email: "hello@asancha.com",
  phone: "+44 20 0000 0000",
  address: "Asancha, United Kingdom",
  hours: "Monday to Friday, 9:00-17:30 UK time",
  mapQuery: "Asancha United Kingdom",
} as const;

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/asancha",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/asancha",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/asancha",
  },
] as const;

const enquiryTypes = [
  "Marketplace discovery",
  "Investor, owner, agent, sourcer, or service provider setup",
  "Listing, booking, document, or verification guidance",
  "API partner applications",
  "General public support",
] as const;

const sensitiveInformationExamples = [
  "Payment card details",
  "Full identity documents",
  "Private deal packs",
  "API keys or webhook secrets",
  "Private account passwords",
  "Confidential legal or financial documents",
] as const;

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  contactDetails.mapQuery,
)}&output=embed`;

/**
 * Renders the public contact page.
 */
export default function ContactPage() {
  const jsonLd = [
    createContactPageJsonLd(),
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="contact-json-ld" />

      <main>
        <PublicPageHero
          description="Send a general enquiry, ask about marketplace discovery, role setup, service provider access, or API partner applications."
          eyebrow="Contact Asancha"
          primaryAction={{ label: "Visit support", href: "/support" }}
          secondaryAction={{
            label: "Sign in for account support",
            href: "/auth/sign-in?next=/account/support",
          }}
          secondaryDescription="For account-specific support, sign in before sharing private details. Public contact is best for general questions."
          title="Talk to us about your property workflow."
        />

        <section className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Contact details
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Reach the right public contact route.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Public contact is best for general questions. Private documents,
                verification issues, payment references, bookings, and
                account-specific records should be handled through protected
                signed-in workflows.
              </p>

              <div className="mt-8 grid gap-4">
                <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"
                    >
                      <Mail size={18} strokeWidth={2.5} />
                    </span>

                    <div>
                      <h2 className="text-base font-extrabold text-card-foreground">
                        Email
                      </h2>

                      <a
                        className="mt-1 inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                        href={`mailto:${contactDetails.email}`}
                      >
                        {contactDetails.email}
                      </a>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"
                    >
                      <Phone size={18} strokeWidth={2.5} />
                    </span>

                    <div>
                      <h2 className="text-base font-extrabold text-card-foreground">
                        Phone
                      </h2>

                      <a
                        className="mt-1 inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                        href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}
                      >
                        {contactDetails.phone}
                      </a>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"
                    >
                      <MapPin size={18} strokeWidth={2.5} />
                    </span>

                    <div>
                      <h2 className="text-base font-extrabold text-card-foreground">
                        Address
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {contactDetails.address}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"
                    >
                      <Clock size={18} strokeWidth={2.5} />
                    </span>

                    <div>
                      <h2 className="text-base font-extrabold text-card-foreground">
                        Office hours
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {contactDetails.hours}
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              <div className="mt-8">
                <h2 className="text-base font-extrabold text-foreground">
                  Social media
                </h2>

                <div className="mt-3 flex flex-wrap gap-3">
                  {socialLinks.map((socialLink) => {
                    return (
                      <a
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
                        href={socialLink.href}
                        key={socialLink.label}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Share2
                          aria-hidden="true"
                          size={16}
                          strokeWidth={2.5}
                        />

                        {socialLink.label}

                        <ExternalLink
                          aria-hidden="true"
                          size={14}
                          strokeWidth={2.5}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-card-foreground">
                Send a message
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                We will route your message to the right public-user workflow.
                Keep sensitive information out of this form.
              </p>

              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-enquiry-types-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Enquiry types
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="contact-enquiry-types-heading"
                >
                  We can help route public enquiries to the right place.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Use this page for general questions about Asancha, marketplace
                  discovery, public user roles, service provider workflows, and
                  API partner applications.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {enquiryTypes.map((item) => (
                  <li
                    className="rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-sensitive-info-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="rounded-3xl border border-accent bg-accent p-6 shadow-sm lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-primary">
                    Public form safety
                  </p>

                  <h2
                    className="mt-3 text-3xl font-extrabold tracking-tight text-accent-foreground"
                    id="contact-sensitive-info-heading"
                  >
                    Keep sensitive information out of the public contact form.
                  </h2>

                  <p className="mt-4 text-base leading-7 text-accent-foreground">
                    For private account, payment, verification, booking,
                    document, or partner-specific issues, sign in and use the
                    protected support workflow when available.
                  </p>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {sensitiveInformationExamples.map((item) => (
                    <li
                      className="rounded-xl bg-background/70 p-4 text-sm font-bold text-foreground"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-map-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-14">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Find us
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="contact-map-heading"
                >
                  Asancha on Google Maps
                </h2>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Use the map for public orientation and general contact
                  context.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <iframe
                  className="block h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                  title="Asancha location on Google Maps"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="asancha-page-container py-12">
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-card-foreground">
                Need account-specific help?
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Sign in before asking about private documents, verification,
                payment references, bookings, API partner settings, or
                profile-specific actions.
              </p>
            </div>

            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
              href="/auth/sign-in?next=/account/support"
            >
              Sign in for Support
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
