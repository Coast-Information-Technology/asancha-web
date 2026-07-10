// File: src/components/ui/table/table.tsx

/**
 * Asancha Table Components
 *
 * Purpose:
 * Provides accessible table primitives for Asancha Web Public.
 *
 * Main responsibilities:
 * - Preserve semantic table markup
 * - Support captions for screen-reader context
 * - Provide consistent public-safe table styling
 *
 * Security note:
 * Tables must not render private data unless backend permission allows it.
 */

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  caption?: string;
  captionClassName?: string;
  wrapperClassName?: string;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders a responsive table wrapper and semantic table.
 */
export function Table({
  caption,
  captionClassName,
  children,
  className,
  wrapperClassName,
  ...props
}: TableProps) {
  return (
    <div className={joinClassNames("w-full overflow-x-auto", wrapperClassName)}>
      <table
        className={joinClassNames(
          "w-full border-collapse text-left text-sm text-gray-700",
          className,
        )}
        {...props}
      >
        {caption ? (
          <caption
            className={joinClassNames(
              "mb-3 text-left text-sm text-gray-600",
              captionClassName,
            )}
          >
            {caption}
          </caption>
        ) : null}
        {children}
      </table>
    </div>
  );
}

/**
 * Renders a table header section.
 */
export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={joinClassNames(
        "border-b border-gray-200 bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a table body section.
 */
export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={joinClassNames("divide-y divide-gray-100", className)}
      {...props}
    />
  );
}

/**
 * Renders a table footer section.
 */
export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={joinClassNames(
        "border-t border-gray-200 bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a table row.
 */
export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={joinClassNames("align-middle", className)} {...props} />
  );
}

/**
 * Renders a table heading cell.
 */
export function TableHead({
  className,
  scope = "col",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={joinClassNames(
        "px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600",
        className,
      )}
      scope={scope}
      {...props}
    />
  );
}

/**
 * Renders a table data cell.
 */
export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={joinClassNames("px-4 py-3 text-sm text-gray-700", className)}
      {...props}
    />
  );
}
