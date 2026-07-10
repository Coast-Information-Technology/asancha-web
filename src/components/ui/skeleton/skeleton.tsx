// File: src/components/ui/skeleton/skeleton.tsx

/**
 * Asancha Skeleton Component
 *
 * Purpose:
 * Provides accessible loading placeholders for Asancha Web Public.
 *
 * Main responsibilities:
 * - Show safe loading placeholders
 * - Avoid pretending restricted data is available before backend confirms it
 * - Provide screen-reader context where needed
 *
 * Security note:
 * Skeletons must not leak private content shape beyond what the route may show.
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders a loading skeleton block.
 */
export function Skeleton({
  className,
  label = "Loading content",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-label={label}
      className={joinClassNames(
        "animate-pulse rounded-lg bg-gray-200",
        className,
      )}
      role="status"
      {...props}
    />
  );
}

/**
 * Renders a small group of skeleton rows.
 */
export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div aria-label="Loading content" className="space-y-3" role="status">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton className="h-4 w-full" key={`skeleton-row-${index}`} />
      ))}
    </div>
  );
}
