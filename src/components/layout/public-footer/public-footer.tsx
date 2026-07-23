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

import { PUBLIC_FOOTER_NAVIGATION } from "@/src/lib/navigation/public-navigation";

/**
 * Renders the public Asancha footer.
 */
export function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="asancha-page-container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <section aria-labelledby="public-footer-brand-heading">
            <Link
              aria-label="Asancha home"
              className="inline-flex rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300"
              href="/"
            >
              <Image
                alt="Asancha logo"
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
                        className="text-sm text-gray-300 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
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
