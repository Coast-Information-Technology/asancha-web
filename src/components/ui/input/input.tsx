"use client";

// File: src/components/ui/input/input.tsx

/**
 * Asancha Input Component
 *
 * Purpose:
 * Provides an accessible text input primitive for Asancha Web Public forms.
 *
 * Main responsibilities:
 * - Connect labels, help text, and error messages to the input
 * - Support required field indication
 * - Avoid relying on colour alone for error state
 *
 * Security note:
 * Frontend validation improves UX only.
 * Backend validation and business-rule enforcement remain final.
 */

import { forwardRef, useId } from "react";

import styles from "./input.module.css";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  requiredIndicator?: boolean;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders an accessible Asancha input field.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      errorMessage,
      helpText,
      id,
      label,
      required,
      requiredIndicator = true,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helpTextId = helpText ? `${inputId}-help` : undefined;
    const errorMessageId = errorMessage ? `${inputId}-error` : undefined;
    const describedBy = [helpTextId, errorMessageId].filter(Boolean).join(" ");

    return (
      <div className={styles.field}>
        {label ? (
          <label className={styles.label} htmlFor={inputId}>
            <span>{label}</span>
            {required && requiredIndicator ? (
              <span aria-hidden="true" className={styles.requiredMark}>
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <input
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(errorMessage)}
          className={joinClassNames(
            styles.input,
            errorMessage && styles.inputError,
            className,
          )}
          id={inputId}
          ref={ref}
          required={required}
          {...props}
        />

        {helpText ? (
          <p className={styles.helpText} id={helpTextId}>
            {helpText}
          </p>
        ) : null}

        {errorMessage ? (
          <p className={styles.errorText} id={errorMessageId} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
