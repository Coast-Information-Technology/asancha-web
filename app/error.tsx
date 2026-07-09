"use client";

// File: app/error.tsx

/**
 * Asancha Root Error Boundary
 *
 * Purpose:
 * Provides a safe recoverable error screen for Asancha Web Public routes.
 *
 * Main responsibilities:
 * - Show a safe user-facing error message
 * - Provide a retry action
 * - Avoid exposing stack traces, backend internals, ObjectIds, or sensitive data
 *
 * Important Asancha Web Public rule:
 * Frontend errors must be safe and must not reveal admin/staff details,
 * private KYC notes, internal admin notes, restricted document URLs,
 * payment provider secrets, webhook secrets, or API keys.
 *
 * Security note:
 * This component intentionally does not render raw error.message because
 * runtime errors can contain sensitive implementation details.
 */

import { useEffect } from "react";

interface RootErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

/**
 * Renders a safe recoverable error screen.
 */
export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error("Asancha public route error boundary triggered.", {
      digest: error.digest,
    });
  }, [error.digest]);

  return (
    <section className="asancha-screen-center">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Something went wrong
        </p>

        <h1 className="mt-3 text-2xl font-bold text-gray-950">
          We could not load this page.
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Please try again. If the issue continues, contact Asancha support
          through the public support page or your account support page.
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
      </div>
    </section>
  );
}
