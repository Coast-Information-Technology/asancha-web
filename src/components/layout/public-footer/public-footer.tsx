// File: src/components/layout/public-footer/public-footer.tsx

/**
 * Asancha Public Footer
 *
 * Purpose:
 * Provides the public footer for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render grouped public footer links
 * - Keep legal, support, platform, solution, and API partner links discoverable
 * - Avoid admin/staff links and private URLs
 *
 * Accessibility note:
 * Uses semantic footer/nav markup with labelled navigation groups.
 *
 * Security note:
 * Footer links must not expose private backend URLs, admin/staff portals,
 * API keys, private document URLs, or internal platform routes.
 */

import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";

import { PUBLIC_FOOTER_NAVIGATION } from "@/src/lib/navigation/public-navigation";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M6.94 8.98H3.75V20h3.19V8.98ZM5.35 4a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7Zm14.9 9.96c0-3.18-1.7-5.23-4.45-5.23-1.27 0-2.18.7-2.55 1.36h-.04V8.98h-3.05V20h3.18v-5.45c0-1.44.27-2.83 2.05-2.83 1.76 0 1.78 1.65 1.78 2.92V20h3.18l-.1-6.04Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect height="18" rx="5" width="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M14.2 8.4V6.95c0-.7.46-.86.78-.86h2V3.02L14.23 3C11.18 3 10.5 5.28 10.5 6.74V8.4H8v3.15h2.5V21h3.7v-9.45h2.5l.33-3.15H14.2Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M13.9 10.47 21.35 2h-1.76l-6.47 7.35L7.96 2H2l7.82 11.13L2 22h1.76l6.84-7.77L16.06 22H22l-8.1-11.53Zm-2.42 2.75-.8-1.11-6.3-8.8h2.74l5.08 7.1.79 1.1 6.6 9.23h-2.73l-5.38-7.52Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/asancha",
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/asancha.co.uk",
    Icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/asancha.co.uk",
    Icon: FacebookIcon,
  },
  {
    label: "X",
    href: "https://x.com/asancha_co_uk",
    Icon: XIcon,
  },
] as const;

/**
 * Renders the public Asancha footer.
 */
export function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-gray-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/images/og/asancha-homepage-og.jpg')] bg-cover bg-[72%_center] sm:bg-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,7,18,0.86)_0%,rgba(3,7,18,0.93)_55%,rgba(3,7,18,0.96)_100%)]"
      />
      <div className="asancha-page-container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <section aria-labelledby="public-footer-brand-heading">
            <Link
              aria-label="Asancha home"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              href="/"
            >
              <Image
                alt=""
                className="h-auto w-20"
                height={80}
                src="/logo.png"
                style={{ height: "auto" }}
                width={80}
              />
            </Link>

            <h2 className="sr-only" id="public-footer-brand-heading">
              Asancha
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
              A UK-focused public property platform for investors, property
              owners, property agents, property sourcers, service providers, and
              approved API partners.
            </p>

            <nav aria-label="Asancha social media" className="mt-6">
              <ul className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                  <li key={label}>
                    <a
                      aria-label={`Asancha on ${label} (opens in a new tab)`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-primary hover:bg-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                      href={href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {PUBLIC_FOOTER_NAVIGATION.map((section) => (
              <nav aria-label={section.label} key={section.label}>
                <h3 className="text-sm font-bold text-white">
                  {section.label}
                </h3>

                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="rounded-sm text-sm text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Asancha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
