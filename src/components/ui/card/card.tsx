// File: src/components/ui/card/card.tsx

/**
 * Asancha Card Components
 *
 * Purpose:
 * Provides reusable card primitives for Asancha Web Public.
 *
 * Main responsibilities:
 * - Structure content clearly
 * - Support accessible headings and descriptions
 * - Keep layout consistent across public pages and dashboards
 *
 * Security note:
 * Cards must not expose private records unless backend permission allows it.
 */

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: "article" | "section" | "div";
}

/**
 * Renders a reusable card container.
 */
export function Card({
  as: Component = "article",
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={joinClassNames(
        "rounded-2xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a card header.
 */
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={joinClassNames("p-5 pb-3", className)} {...props} />;
}

/**
 * Renders a card title.
 */
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={joinClassNames("text-lg font-bold text-gray-950", className)}
      {...props}
    />
  );
}

/**
 * Renders a card description.
 */
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={joinClassNames(
        "mt-1 text-sm leading-6 text-gray-600",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders card body content.
 */
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={joinClassNames("p-5 pt-3", className)} {...props} />;
}

/**
 * Renders card footer content.
 */
export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={joinClassNames("border-t border-gray-100 p-5", className)}
      {...props}
    />
  );
}
