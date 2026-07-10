// File: src/components/layout/page-shell/page-shell.tsx

/**
 * Asancha Page Shell
 *
 * Purpose:
 * Provides reusable page layout structure for Asancha Web Public screens.
 *
 * Main responsibilities:
 * - Provide semantic page sections
 * - Support accessible page headings and descriptions
 * - Provide consistent spacing for public, auth, onboarding, dashboard, and account pages
 *
 * Important Asancha Web Public rule:
 * Page shell must not introduce admin/staff layout concerns.
 *
 * Security note:
 * Page shell only controls presentation. Backend permission checks remain final.
 */

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  constrained?: boolean;
}

interface PageSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Renders a standard page shell.
 */
export function PageShell({
  actions,
  children,
  constrained = true,
  description,
  eyebrow,
  title,
}: PageShellProps) {
  return (
    <div
      className={
        constrained ? "asancha-page-container py-8 lg:py-10" : "py-8 lg:py-10"
      }
    >
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-700">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 text-base leading-7 text-gray-600">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>

      {children}
    </div>
  );
}

/**
 * Renders a standard page section.
 */
export function PageSection({
  children,
  description,
  title,
}: PageSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {title || description ? (
        <header className="mb-5">
          {title ? (
            <h2 className="text-xl font-bold text-gray-950">{title}</h2>
          ) : null}

          {description ? (
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}

      {children}
    </section>
  );
}
