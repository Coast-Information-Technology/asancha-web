"use client";

// File: src/components/ui/button/button.tsx

/**
 * Asancha Button Component
 *
 * Purpose:
 * Provides a reusable accessible button component for Asancha Web Public.
 *
 * Main responsibilities:
 * - Support semantic button behaviour
 * - Support visual variants and sizes
 * - Support loading state with screen-reader text
 * - Avoid using links for actions
 *
 * Security note:
 * Button visibility is only frontend guidance.
 * Backend authorization and business-rule enforcement remain final.
 */

import { forwardRef } from "react";

import styles from "./button.module.css";

export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "danger" | "link";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders an accessible Asancha button.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      fullWidth = false,
      isLoading = false,
      loadingLabel = "Loading",
      size = "md",
      type = "button",
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        aria-busy={isLoading || undefined}
        className={joinClassNames(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isLoading && styles.loading,
          className,
        )}
        disabled={isDisabled}
        ref={ref}
        type={type}
        {...props}
      >
        {isLoading ? (
          <>
            <span aria-hidden="true" className={styles.spinner} />
            <span>{loadingLabel}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
