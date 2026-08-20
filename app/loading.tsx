// File: app/loading.tsx

/**
 * Asancha Root Loading State
 *
 * Purpose:
 * Provides a safe global loading fallback for Asancha Web Public routes.
 *
 * Main responsibilities:
 * - Show a simple loading state during route transitions and async rendering
 * - Avoid exposing internal route details or backend implementation details
 * - Keep loading messaging accessible and understandable
 *
 * Important Asancha Web Public rule:
 * Loading states should be clear and should not imply that protected actions
 * are approved or unlocked before backend state confirms them.
 *
 * Security note:
 * Loading UI must not reveal private data, internal notes, ObjectIds,
 * API keys, document URLs, payment internals, or verification internals.
 */

/**
 * Renders the root loading fallback.
 */
export default function Loading() {
  return (
    <div aria-live="polite" className="asancha-screen-center" role="status">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"
        />

        <p className="mt-5 text-lg font-semibold text-gray-950">
          Loading Asancha
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Please wait while we prepare this page.
        </p>
      </div>
    </div>
  );
}
