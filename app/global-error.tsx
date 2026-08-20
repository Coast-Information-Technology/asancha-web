"use client";

// File: app/global-error.tsx

/**
 * Asancha Global Error Boundary
 *
 * Purpose:
 * Provides the highest-level safe error boundary for Asancha Web Public.
 *
 * Main responsibilities:
 * - Catch root layout/rendering failures
 * - Show a safe fallback document
 * - Avoid exposing raw runtime error details to users
 *
 * Important Asancha Web Public rule:
 * This global error boundary is for asancha-web only.
 * It must not mention or expose admin/staff app routes, private backend URLs,
 * restricted resources, or internal operational details.
 *
 * Security note:
 * This component must not render raw error.message, stack traces, ObjectIds,
 * API keys, webhook secrets, provider payloads, private KYC notes,
 * internal admin notes, or restricted document URLs.
 */

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

/**
 * Renders the root-level global error fallback.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Asancha public global error boundary triggered.", {
      digest: error.digest,
    });
  }, [error.digest]);

  return (
    <html lang="en-GB">
      <body>
        <main className="asancha-screen-center" id="main-content" tabIndex={-1}>
          <section className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              Application error
            </p>

            <h1 className="mt-3 text-2xl font-bold text-gray-950">
              Asancha could not continue safely.
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Please try again. If the issue continues, restart the page or
              contact Asancha support.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                onClick={reset}
                type="button"
              >
                Try again
              </button>

              <a
                className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:border-gray-400 hover:bg-gray-50"
                href="/support"
              >
                Contact support
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
