"use client";

// File: src/components/ui/drawer/drawer.tsx

/**
 * Asancha Drawer Component
 *
 * Purpose:
 * Provides an accessible controlled drawer primitive for Asancha Web Public.
 *
 * Main responsibilities:
 * - Support mobile navigation, filters, and add-profile flows
 * - Provide keyboard Escape close behaviour
 * - Keep drawer content labelled for assistive technology
 *
 * Security note:
 * Drawer visibility is frontend guidance only.
 * Backend authorization and permission checks remain final.
 */

import { useEffect, useId } from "react";

export type DrawerSide = "left" | "right" | "bottom";

export interface DrawerProps {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: DrawerSide;
  onClose: () => void;
  closeLabel?: string;
}

const sideClassNames: Record<DrawerSide, string> = {
  left: "left-0 top-0 h-full w-full max-w-md",
  right: "right-0 top-0 h-full w-full max-w-md",
  bottom: "bottom-0 left-0 w-full rounded-t-2xl",
};

/**
 * Renders a controlled accessible drawer.
 */
export function Drawer({
  children,
  closeLabel = "Close drawer",
  description,
  footer,
  onClose,
  open,
  side = "right",
  title,
}: DrawerProps) {
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
      className="fixed inset-0 z-50 bg-gray-950/60"
      role="dialog"
    >
      <aside className={`fixed bg-white shadow-xl ${sideClassNames[side]}`}>
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
            className="rounded-lg px-2 py-1 text-xl leading-none text-gray-600 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto p-5">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-gray-200 p-5">{footer}</div>
        ) : null}
      </aside>
    </div>
  );
}
