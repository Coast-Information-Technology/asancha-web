// File: src/components/ui/badge/badge.tsx

/**
 * Asancha Badge Component
 *
 * Purpose:
 * Provides accessible status and label badges for Asancha Web Public.
 *
 * Main responsibilities:
 * - Show consistent status labels
 * - Avoid relying on colour alone
 * - Support screen-reader labels for status context
 *
 * Security note:
 * Badge text must reflect backend-provided state for sensitive workflows.
 */

export type BadgeVariant =
  "neutral" | "info" | "success" | "warning" | "danger" | "locked";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  screenReaderPrefix?: string;
}

const variantClassNames: Record<BadgeVariant, string> = {
  neutral: "border-gray-200 bg-gray-100 text-gray-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  locked: "border-gray-300 bg-gray-100 text-gray-700",
};

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders an accessible badge.
 */
export function Badge({
  children,
  className,
  screenReaderPrefix,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={joinClassNames(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold leading-none",
        variantClassNames[variant],
        className,
      )}
      {...props}
    >
      {screenReaderPrefix ? (
        <span className="sr-only">{screenReaderPrefix}: </span>
      ) : null}
      {children}
    </span>
  );
}
