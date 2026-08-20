// File: app/not-found.tsx

/**
 * Asancha Not Found Page
 *
 * Purpose:
 * Provides a safe 404 page for Asancha Web Public.
 *
 * Main responsibilities:
 * - Tell users when a page cannot be found
 * - Offer safe public navigation back to supported routes
 * - Avoid exposing internal route names, ObjectIds, private data, or backend errors
 *
 * Important Asancha Web Public rule:
 * Unknown admin/staff, private, or internal routes must not be explained in
 * detail inside the public app.
 *
 * Security note:
 * This page must not reveal whether a private record, private document,
 * internal review, payment resource, or verification resource exists.
 */

import Link from "next/link";

/**
 * Renders the public 404 page.
 */
export default function NotFound() {
  return (
    <main className="asancha-screen-center" id="main-content" tabIndex={-1}>
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          404
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-950">
          We could not find that page.
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          The page may have moved, may no longer be available, or may require a
          different route.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            href="/"
          >
            Go home
          </Link>

          <Link
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:border-gray-400 hover:bg-gray-50"
            href="/marketplace"
          >
            Browse marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
