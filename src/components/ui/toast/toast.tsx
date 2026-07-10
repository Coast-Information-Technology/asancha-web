"use client";

// File: src/components/ui/toast/toast.tsx

/**
 * Asancha Toast Component
 *
 * Purpose:
 * Provides safe operational toast notifications for Asancha Web Public.
 *
 * Main responsibilities:
 * - Show short user-facing status messages
 * - Support success, info, warning, and error variants
 * - Avoid exposing raw backend errors or sensitive internal details
 *
 * Important Asancha Web Public rule:
 * Toasts should be operational, not marketing-heavy.
 *
 * Security note:
 * Toast messages must not expose stack traces, ObjectIds, private KYC notes,
 * internal admin notes, API keys, webhook secrets, or payment provider secrets.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export interface CreateToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toasts: readonly ToastMessage[];
  showToast: (toast: CreateToastInput) => string;
  dismissToast: (toastId: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClassNames: Record<ToastVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-950",
  success: "border-green-200 bg-green-50 text-green-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-950",
};

function createToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Provides toast state to Asancha Web Public components.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  }, []);

  const showToast = useCallback(
    (toast: CreateToastInput) => {
      const toastId = createToastId();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id: toastId,
          title: toast.title,
          description: toast.description,
          variant: toast.variant ?? "info",
        },
      ]);

      window.setTimeout(() => {
        dismissToast(toastId);
      }, 5000);

      return toastId;
    },
    [dismissToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      dismissToast,
      showToast,
      toasts,
    }),
    [dismissToast, showToast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

/**
 * Reads the toast context.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}

/**
 * Renders the toast viewport.
 */
export function ToastViewport() {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-relevant="additions removals"
      className="fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      role="status"
    >
      {context.toasts.map((toast) => (
        <div
          className={`rounded-xl border p-4 shadow-lg ${variantClassNames[toast.variant ?? "info"]}`}
          key={toast.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm leading-5">{toast.description}</p>
              ) : null}
            </div>

            <button
              aria-label="Dismiss notification"
              className="rounded-md px-2 py-1 text-lg leading-none hover:bg-white/60 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={() => context.dismissToast(toast.id)}
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
