"use client";

// File: src/components/ui/tabs/tabs.tsx

/**
 * Asancha Tabs Component
 *
 * Purpose:
 * Provides accessible tab navigation for Asancha Web Public.
 *
 * Main responsibilities:
 * - Support keyboard navigation
 * - Connect tabs to tab panels
 * - Keep tab content controlled by frontend state while backend remains source of truth
 *
 * Security note:
 * Hiding content behind tabs is not a permission boundary.
 * Backend authorization remains final.
 */

import { useId, useState } from "react";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: readonly TabItem[];
  defaultValue?: string;
  label: string;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Renders accessible tabs with keyboard support.
 */
export function Tabs({ defaultValue, items, label }: TabsProps) {
  const baseId = useId();
  const firstEnabledItem = items.find((item) => !item.disabled);
  const initialValue = defaultValue ?? firstEnabledItem?.value ?? "";
  const [activeValue, setActiveValue] = useState(initialValue);

  const activeItem = items.find((item) => item.value === activeValue);

  function focusTabByIndex(index: number) {
    const button = document.getElementById(
      `${baseId}-tab-${items[index]?.value}`,
    );

    if (button) {
      button.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const enabledItems = items.filter((item) => !item.disabled);
    const currentIndex = enabledItems.findIndex(
      (item) => item.value === activeValue,
    );

    if (currentIndex < 0) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextItem = enabledItems[(currentIndex + 1) % enabledItems.length];

      if (nextItem) {
        setActiveValue(nextItem.value);
        focusTabByIndex(
          items.findIndex((item) => item.value === nextItem.value),
        );
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previousItem =
        enabledItems[
          (currentIndex - 1 + enabledItems.length) % enabledItems.length
        ];

      if (previousItem) {
        setActiveValue(previousItem.value);
        focusTabByIndex(
          items.findIndex((item) => item.value === previousItem.value),
        );
      }
    }
  }

  return (
    <div>
      <div
        aria-label={label}
        className="flex gap-2 overflow-x-auto border-b border-gray-200"
        onKeyDown={handleKeyDown}
        role="tablist"
      >
        {items.map((item) => {
          const selected = item.value === activeValue;

          return (
            <button
              aria-controls={`${baseId}-panel-${item.value}`}
              aria-selected={selected}
              className={joinClassNames(
                "min-h-11 rounded-t-lg px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue-100",
                selected
                  ? "border-b-2 border-gray-950 text-gray-950"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-950",
                item.disabled && "cursor-not-allowed opacity-50",
              )}
              disabled={item.disabled}
              id={`${baseId}-tab-${item.value}`}
              key={item.value}
              onClick={() => setActiveValue(item.value)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          aria-labelledby={`${baseId}-tab-${item.value}`}
          hidden={item.value !== activeItem?.value}
          id={`${baseId}-panel-${item.value}`}
          key={item.value}
          role="tabpanel"
          tabIndex={0}
        >
          {item.value === activeItem?.value ? (
            <div className="pt-5">{item.content}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
