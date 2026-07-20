// File: app/dashboard-ui/support/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support UI Preview",
};

export default function SupportUiPreviewPage() {
    return (
        <main className="px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
                    UI preview
                </p>
                <h1 className="mt-2 text-2xl font-bold">
                    Support
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                    Dummy support surface for dashboard UX work.
                </p>
            </section>
        </main>
    );
}
