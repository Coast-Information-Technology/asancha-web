"use client";

// File: src/components/ui/checkbox/checkbox.tsx

/**
 * Asancha Checkbox Component
 *
 * Purpose:
 * Provides an accessible checkbox primitive for Asancha Web Public forms.
 *
 * Main responsibilities:
 * - Support policy acceptance and preference-style checkboxes
 * - Ensure labels and error messages are connected accessibly
 * - Prevent pre-selected policy checkboxes from being required by the component itself
 *
 * Security note:
 * Policy acceptance state must be submitted to and verified by the backend.
 */

import { forwardRef, useId } from "react";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: string;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders an accessible checkbox field.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, description, errorMessage, id, label, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorMessageId = errorMessage ? `${checkboxId}-error` : undefined;
    const describedBy = [descriptionId, errorMessageId]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            aria-describedby={describedBy || undefined}
            aria-invalid={Boolean(errorMessage)}
            className={joinClassNames(
              "mt-1 h-4 w-4 rounded border-gray-300 text-gray-950 focus:ring-4 focus:ring-blue-100",
              errorMessage && "border-red-700",
              className,
            )}
            id={checkboxId}
            ref={ref}
            type="checkbox"
            {...props}
          />

          <div>
            <label
              className="cursor-pointer text-sm font-semibold leading-6 text-gray-950"
              htmlFor={checkboxId}
            >
              {label}
            </label>

            {description ? (
              <p
                className="mt-1 text-xs leading-5 text-gray-600"
                id={descriptionId}
              >
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <p
            className="mt-2 text-xs font-semibold leading-5 text-red-700"
            id={errorMessageId}
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
