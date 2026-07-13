// File: app/onboarding/_components/onboarding-state-page.tsx

/**
 * Asancha Onboarding State Page
 *
 * Purpose:
 * Provides a reusable status screen for onboarding completion, pending
 * verification, and correction-required states.
 *
 * Security notes:
 * - Only backend-safe messages should be passed to this component.
 * - Internal review notes, risk information and private verification details
 *   must not be rendered.
 */

import Link from "next/link";

export type OnboardingStateTone =
    | "neutral"
    | "pending"
    | "success"
    | "attention";

export interface OnboardingStateAction {
    label: string;
    href: string;
    primary?: boolean;
}

export interface OnboardingStatePageProps {
    eyebrow: string;
    title: string;
    description: string;

    tone: OnboardingStateTone;

    items: Array<{
        title: string;
        description: string;
    }>;

    actions: OnboardingStateAction[];

    referenceLabel?: string;
    referenceValue?: string | null;
}

function getToneClasses(
    tone: OnboardingStateTone,
): string {
    switch (tone) {
        case "success":
            return "bg-[var(--secondary)] text-[var(--secondary-foreground)]";

        case "attention":
            return "bg-[var(--destructive)] text-[var(--destructive-foreground)]";

        case "pending":
            return "bg-[var(--primary)] text-[var(--primary-foreground)]";

        default:
            return "bg-[var(--muted)] text-[var(--foreground)]";
    }
}

export function OnboardingStatePage({
    eyebrow,
    title,
    description,
    tone,
    items,
    actions,
    referenceLabel,
    referenceValue,
}: OnboardingStatePageProps) {
    return (
        <main className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-sm">
                <div
                    className={`p-6 sm:p-8 ${getToneClasses(
                        tone,
                    )}`}
                >
                    <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">
                        {eyebrow}
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        {title}
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 opacity-90">
                        {description}
                    </p>
                </div>

                <div className="grid gap-6 p-6 sm:p-8">
                    {referenceLabel && referenceValue ? (
                        <div className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                                {referenceLabel}
                            </p>

                            <p className="mt-1 break-all font-mono text-sm font-semibold">
                                {referenceValue}
                            </p>
                        </div>
                    ) : null}

                    <ul className="grid gap-4">
                        {items.map((item) => (
                            <li
                                key={item.title}
                                className="flex gap-3 rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]"
                                >
                                    ✓
                                </span>

                                <div>
                                    <h2 className="font-semibold">
                                        {item.title}
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {item.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row">
                        {actions.map((action) => (
                            <Link
                                key={`${action.href}-${action.label}`}
                                href={action.href}
                                className={
                                    action.primary
                                        ? "inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                                        : "inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
                                }
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}