"use client";

// File: src/components/ui/select/select.tsx

/**
 * Asancha Select Component
 *
 * Purpose:
 * Provides an accessible native select primitive for Asancha Web Public forms.
 *
 * Main responsibilities:
 * - Use native select behaviour for keyboard and screen-reader support
 * - Connect label, help text, and error messages
 * - Keep role/profile choices and sensitive options controlled by feature code
 *
 * Security note:
 * Frontend select options are guidance only.
 * Backend validation remains final.
 */

import { forwardRef, useId } from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  requiredIndicator?: boolean;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders an accessible native select field.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      errorMessage,
      helpText,
      id,
      label,
      options,
      placeholder,
      required,
      requiredIndicator = true,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helpTextId = helpText ? `${selectId}-help` : undefined;
    const errorMessageId = errorMessage ? `${selectId}-error` : undefined;
    const describedBy = [helpTextId, errorMessageId].filter(Boolean).join(" ");

    return (
      <div className="w-full">
        {label ? (
          <label
            className="mb-1.5 inline-flex text-sm font-bold text-gray-950"
            htmlFor={selectId}
          >
            <span>{label}</span>
            {required && requiredIndicator ? (
              <span aria-hidden="true" className="ml-1 text-red-700">
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <select
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(errorMessage)}
          className={joinClassNames(
            "min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            errorMessage
              ? "border-red-700 focus:border-red-700 focus:ring-red-100"
              : "border-gray-300",
            className,
          )}
          id={selectId}
          ref={ref}
          required={required}
          {...props}
        >
          {placeholder ? (
            <option disabled value="">
              {placeholder}
            </option>
          ) : null}

          {options.map((option) => (
            <option
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {helpText ? (
          <p className="mt-1.5 text-xs leading-5 text-gray-600" id={helpTextId}>
            {helpText}
          </p>
        ) : null}

        {errorMessage ? (
          <p
            className="mt-1.5 text-xs font-semibold leading-5 text-red-700"
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

Select.displayName = "Select";
