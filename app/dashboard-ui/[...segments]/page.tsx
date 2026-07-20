// File: app/dashboard-ui/[...segments]/page.tsx

/**
 * Dashboard UI Preview Catch-All Page
 *
 * Purpose:
 * Provides a dummy, unprotected UI surface for dashboard subpages that still
 * depend on protected backend data. Real /dashboard routes remain protected.
 */

import type { Metadata } from "next";
import Link from "next/link";

interface DashboardUiCatchAllPageProps {
    params: Promise<{
        segments: string[];
    }>;
}

const ROLE_LABEL_BY_SEGMENT: Record<string, string> = {
    investor: "Investor",
    "property-owner": "Property Owner",
    "property-agent": "Property Agent",
    "property-sourcer": "Property Sourcer",
    "service-provider": "Service Provider",
};

const SAMPLE_ROWS = [
    {
        title: "North Quarter townhouse",
        status: "Under review",
        owner: "Asancha Preview",
        updatedAt: "Today",
    },
    {
        title: "Riverside apartment pack",
        status: "Published",
        owner: "Portfolio Team",
        updatedAt: "Yesterday",
    },
    {
        title: "Compliance documents",
        status: "Action needed",
        owner: "Operations",
        updatedAt: "2 days ago",
    },
];

function toTitleCase(value: string): string {
    return value
        .replace(/-/g, " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

function getPageTitle(segments: string[]): string {
    const pageSegments = segments.slice(1);

    if (pageSegments.length === 0) {
        return "Dashboard";
    }

    return pageSegments.map(toTitleCase).join(" / ");
}

export async function generateMetadata({
    params,
}: DashboardUiCatchAllPageProps): Promise<Metadata> {
    const { segments } = await params;

    return {
        title: `${getPageTitle(segments)} UI Preview`,
    };
}

export default async function DashboardUiCatchAllPage({
    params,
}: DashboardUiCatchAllPageProps) {
    const { segments } = await params;
    const roleSegment = segments[0] ?? "investor";
    const roleLabel =
        ROLE_LABEL_BY_SEGMENT[roleSegment] ??
        toTitleCase(roleSegment);
    const pageTitle = getPageTitle(segments);
    const roleHomeHref = `/dashboard-ui/${roleSegment}`;

    return (
        <main className="px-4 py-8 sm:px-6 lg:px-8">
            <header className="rounded-[var(--asancha-radius-xl)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] opacity-80">
                    {roleLabel} UI preview
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {pageTitle}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 opacity-90">
                    Dummy page data for designing this dashboard section while
                    the authenticated backend endpoint is not ready.
                </p>

                <Link
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--card)] px-5 py-2 text-sm font-semibold text-[var(--card-foreground)]"
                    href={roleHomeHref}
                >
                    Back to role overview
                </Link>
            </header>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                    ["Open items", "12"],
                    ["Pending review", "4"],
                    ["Completed", "28"],
                ].map(([label, value]) => (
                    <article
                        className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                        key={label}
                    >
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {label}
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {value}
                        </p>
                    </article>
                ))}
            </section>

            <section className="mt-6 overflow-hidden rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)]">
                <div className="border-b border-[var(--border)] p-5">
                    <h2 className="text-lg font-bold">
                        Preview records
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[42rem] text-left text-sm">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                            <tr>
                                <th className="px-5 py-3 font-semibold">
                                    Title
                                </th>
                                <th className="px-5 py-3 font-semibold">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-semibold">
                                    Owner
                                </th>
                                <th className="px-5 py-3 font-semibold">
                                    Updated
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {SAMPLE_ROWS.map((row) => (
                                <tr key={row.title}>
                                    <td className="px-5 py-4 font-semibold">
                                        {row.title}
                                    </td>
                                    <td className="px-5 py-4">
                                        {row.status}
                                    </td>
                                    <td className="px-5 py-4">
                                        {row.owner}
                                    </td>
                                    <td className="px-5 py-4">
                                        {row.updatedAt}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
