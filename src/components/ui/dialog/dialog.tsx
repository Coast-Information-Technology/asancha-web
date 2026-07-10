"use client";

// File: src/components/ui/dialog/dialog.tsx

/**
 * Asancha Dialog Component
 *
 * Purpose:
 * Provides an accessible controlled dialog primitive for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render keyboard-closeable dialog content
 * - Connect title and description for screen readers
 * - Provide safe modal UX for confirmations and guided actions
 *
 * Security note:
 * Dialog visibility must not be used as the only security layer.
 * Backend permission checks remain final.
 */

import { useEffect, useId } from "react";

export interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  closeLabel?: string;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders a controlled accessible dialog.
 */
export function Dialog({
  children,
  closeLabel = "Close dialog",
  description,
  footer,
  onClose,
  open,
  title,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-gray-950/60 p-4"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-950" id={titleId}>
              {title}
            </h2>

            {description ? (
              <p
                className="mt-1 text-sm leading-6 text-gray-600"
                id={descriptionId}
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            aria-label={closeLabel}
            className={joinClassNames(
              "rounded-lg px-2 py-1 text-xl leading-none text-gray-600",
              "hover:bg-gray-100 hover:text-gray-950",
              "focus:outline-none focus:ring-4 focus:ring-blue-100",
            )}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer ? (
          <div className="border-t border-gray-200 p-5">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
