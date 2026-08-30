// File: app/(public)/marketplace/_components/marketplace-page-experience.tsx

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { MarketplaceBrowser } from "@/src/components/marketplace/marketplace-browser";
import type { MarketplaceFilters } from "@/src/features/marketplace/types/marketplace.types";

/**
 * Renders a task-focused public property discovery experience.
 *
 * Public-safe browsing remains available without an account. Protected data
 * and actions continue to rely on backend access rules and are explained only
 * when they become relevant.
 */
export function MarketplacePageExperience({
  initialFilters,
}: {
  initialFilters?: Partial<MarketplaceFilters>;
}) {
  return (
    <main className="bg-muted/45" id="main-content">
      <section
        aria-labelledby="marketplace-heading"
        className="border-b border-border"
      >
        <div className="asancha-page-container py-10 sm:py-12 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Find Properties
            </p>
            <h1
              className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl"
              id="marketplace-heading"
            >
              Find Property Opportunities
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Discover UK property opportunities that match your location,
              budget and investment strategy.
            </p>
          </div>

          <MarketplaceBrowser initialFilters={initialFilters} />

          <aside
            aria-label="Protected property information"
            className="mt-10 flex flex-col gap-4 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-center"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <ShieldCheck aria-hidden="true" size={19} strokeWidth={2.5} />
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              Some property information is protected. Sign in and complete the
              required verification to access eligible deal information.{" "}
              <Link
                className="font-bold text-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                href="/how-it-works"
              >
                Learn More
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
