// File: app/(public)/contact/page.tsx

/**
 * Asancha Contact Page
 *
 * Purpose:
 * Provides a public contact page with contact form, map, contact details, and
 * social links for Asancha Web Public.
 *
 * Security note:
 * This page must not expose internal support queues, staff routes,
 * private contact channels, backend URLs, or sensitive operational details.
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

import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact Asancha",
  description:
    "Contact Asancha by form, email, phone, address, map, or social media for public marketplace, property workflow, service provider, or API partner enquiries.",
  alternates: {
    canonical: "/contact",
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
        <section className="asancha-page-container py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Contact Asancha
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Talk to us about your property workflow.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Send a general enquiry, ask about marketplace discovery, role
                setup, service-provider access, or API partner applications.
                For account-specific support, sign in before sharing details.
              </p>

              <div className="mt-8 grid gap-4">
                <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-primary"
                    >
                      <Mail size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-foreground">
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

                <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-primary"
                    >
                      <Phone size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-foreground">
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

                <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-primary"
                    >
                      <MapPin size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-foreground">
                        Address
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {contactDetails.address}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-primary"
                    >
                      <Clock size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-foreground">
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
                        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
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

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
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
          aria-labelledby="contact-map-heading"
          className="border-y border-border bg-muted/60"
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
                  The map is provided for public orientation. Replace the
                  address constant with the final registered office or customer
                  contact location before production.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
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
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Need account-specific help?
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Sign in before asking about private documents, verification,
                payment references, bookings, or profile-specific actions.
              </p>
            </div>

            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
              href="/auth/sign-in?next=/account/support"
            >
              Sign in for support
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
