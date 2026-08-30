"use client";

// File: src/components/marketplace/marketplace-filter-panel.tsx

/**
 * Asancha Marketplace Filter Panel
 *
 * Purpose:
 * Renders public marketplace discovery filters for desktop and mobile.
 *
 * Responsibilities:
 * - Capture price, location, property, strategy, occupancy, and metric filters.
 * - Maintain accessible labels and field grouping.
 * - Apply or reset filter selections.
 *
 * Security notes:
 * - Filters provide discovery preferences only.
 * - They must not expose or infer private listing records.
 * - Backend query validation and publication rules remain final.
 */

import type {
  MarketplaceFilterConfiguration,
  MarketplaceFilters,
} from "@/src/features/marketplace/types/marketplace.types";
import { useEffect, useRef } from "react";

import styles from "./marketplace-browser.module.css";

interface MarketplaceFilterPanelProps {
  filterConfiguration: MarketplaceFilterConfiguration | null;
  filters: MarketplaceFilters;
  isOpen: boolean;
  onApply: () => void;
  onChange: (filters: Partial<MarketplaceFilters>) => void;
  onClose: () => void;
  onReset: () => void;
}

interface MultiSelectOption {
  value: string;
  label: string;
  count?: number | null;
}

function toOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function toggleArrayValue<TValue extends string>(
  values: TValue[],
  value: TValue,
): TValue[] {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

interface CheckboxGroupProps<TValue extends string> {
  legend: string;
  options: ReadonlyArray<MultiSelectOption & { value: TValue }>;
  values: TValue[];
  onChange: (values: TValue[]) => void;
}

function CheckboxGroup<TValue extends string>({
  legend,
  options,
  values,
  onChange,
}: CheckboxGroupProps<TValue>) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset className={styles.filterFieldset}>
      <legend className={styles.filterLegend}>{legend}</legend>

      <div className={styles.checkboxList}>
        {options.map((option) => (
          <label className={styles.checkboxLabel} key={option.value}>
            <input
              checked={values.includes(option.value)}
              className={styles.checkbox}
              onChange={() => onChange(toggleArrayValue(values, option.value))}
              type="checkbox"
            />

            <span>{option.label}</span>

            {typeof option.count === "number" ? (
              <span className={styles.optionCount}>{option.count}</span>
            ) : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Renders marketplace filters.
 */
export function MarketplaceFilterPanel({
  filterConfiguration,
  filters,
  isOpen,
  onApply,
  onChange,
  onClose,
  onReset,
}: MarketplaceFilterPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const propertyTypeOptions = filterConfiguration?.propertyTypes ?? [];

  const tenureTypeOptions = filterConfiguration?.tenureTypes ?? [];

  const listingTypeOptions = filterConfiguration?.listingTypes ?? [];

  const listingCategoryOptions = filterConfiguration?.listingCategories ?? [];

  const strategyOptions = filterConfiguration?.strategies ?? [];

  const occupancyOptions = filterConfiguration?.occupancyStatuses ?? [];

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <button
          aria-label="Close property filters"
          className={styles.filterBackdrop}
          onClick={onClose}
          type="button"
        />
      ) : null}

      <aside
        aria-hidden={!isOpen}
        aria-labelledby="marketplace-filter-title"
        aria-modal="true"
        className={`${styles.filterPanel} ${
          isOpen ? styles.filterPanelOpen : ""
        }`}
        inert={!isOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
        role="dialog"
      >
        <div className={styles.filterHeader}>
          <div>
            <p className={styles.filterEyebrow}>Refine property results</p>

            <h2 className={styles.filterTitle} id="marketplace-filter-title">
              More Filters
            </h2>
          </div>

          <button
            className={styles.mobileCloseButton}
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            Close
          </button>
        </div>

        <div className={styles.filterBody}>
          <CheckboxGroup
            legend="Property type"
            onChange={(propertyTypes) =>
              onChange({
                propertyTypes,
              })
            }
            options={propertyTypeOptions}
            values={filters.propertyTypes}
          />

          <CheckboxGroup
            legend="Tenure"
            onChange={(tenureTypes) =>
              onChange({
                tenureTypes,
              })
            }
            options={tenureTypeOptions}
            values={filters.tenureTypes}
          />

          <CheckboxGroup
            legend="Listing type"
            onChange={(listingTypes) =>
              onChange({
                listingTypes,
              })
            }
            options={listingTypeOptions}
            values={filters.listingTypes}
          />

          <CheckboxGroup
            legend="Opportunity type"
            onChange={(listingCategories) =>
              onChange({
                listingCategories,
              })
            }
            options={listingCategoryOptions}
            values={filters.listingCategories}
          />

          <div className={styles.filterFieldset}>
            <h3 className={styles.filterLegend}>Price</h3>

            <div className={styles.rangeGrid}>
              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-minimum-price"
                >
                  Minimum
                </label>

                <input
                  className={styles.input}
                  id="marketplace-minimum-price"
                  inputMode="numeric"
                  min={0}
                  onChange={(event) =>
                    onChange({
                      minimumPrice: toOptionalNumber(event.target.value),
                    })
                  }
                  placeholder="£0"
                  type="number"
                  value={filters.minimumPrice ?? ""}
                />
              </div>

              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-maximum-price"
                >
                  Maximum
                </label>

                <input
                  className={styles.input}
                  id="marketplace-maximum-price"
                  inputMode="numeric"
                  min={0}
                  onChange={(event) =>
                    onChange({
                      maximumPrice: toOptionalNumber(event.target.value),
                    })
                  }
                  placeholder="No maximum"
                  type="number"
                  value={filters.maximumPrice ?? ""}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterFieldset}>
            <h3 className={styles.filterLegend}>Bedrooms</h3>

            <div className={styles.rangeGrid}>
              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-minimum-bedrooms"
                >
                  Minimum
                </label>

                <input
                  className={styles.input}
                  id="marketplace-minimum-bedrooms"
                  min={0}
                  onChange={(event) =>
                    onChange({
                      minimumBedrooms: toOptionalNumber(event.target.value),
                    })
                  }
                  type="number"
                  value={filters.minimumBedrooms ?? ""}
                />
              </div>

              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-maximum-bedrooms"
                >
                  Maximum
                </label>

                <input
                  className={styles.input}
                  id="marketplace-maximum-bedrooms"
                  min={0}
                  onChange={(event) =>
                    onChange({
                      maximumBedrooms: toOptionalNumber(event.target.value),
                    })
                  }
                  type="number"
                  value={filters.maximumBedrooms ?? ""}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterFieldset}>
            <h3 className={styles.filterLegend}>Bathrooms</h3>

            <div className={styles.rangeGrid}>
              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-minimum-bathrooms"
                >
                  Minimum
                </label>

                <input
                  className={styles.input}
                  id="marketplace-minimum-bathrooms"
                  min={0}
                  onChange={(event) =>
                    onChange({
                      minimumBathrooms: toOptionalNumber(event.target.value),
                    })
                  }
                  type="number"
                  value={filters.minimumBathrooms ?? ""}
                />
              </div>

              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-maximum-bathrooms"
                >
                  Maximum
                </label>

                <input
                  className={styles.input}
                  id="marketplace-maximum-bathrooms"
                  min={0}
                  onChange={(event) =>
                    onChange({
                      maximumBathrooms: toOptionalNumber(event.target.value),
                    })
                  }
                  type="number"
                  value={filters.maximumBathrooms ?? ""}
                />
              </div>
            </div>
          </div>

          <CheckboxGroup
            legend="Investment strategy"
            onChange={(strategies) =>
              onChange({
                strategies,
              })
            }
            options={strategyOptions}
            values={filters.strategies}
          />

          <CheckboxGroup
            legend="Occupancy"
            onChange={(occupancyStatuses) =>
              onChange({
                occupancyStatuses,
              })
            }
            options={occupancyOptions}
            values={filters.occupancyStatuses}
          />

          <div className={styles.filterFieldset}>
            <h3 className={styles.filterLegend}>Investment metrics</h3>

            <div className={styles.metricFields}>
              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-minimum-bmv"
                >
                  Minimum BMV discount
                </label>

                <div className={styles.suffixField}>
                  <input
                    className={styles.input}
                    id="marketplace-minimum-bmv"
                    max={100}
                    min={0}
                    onChange={(event) =>
                      onChange({
                        minimumBmvDiscountPercent: toOptionalNumber(
                          event.target.value,
                        ),
                      })
                    }
                    type="number"
                    value={filters.minimumBmvDiscountPercent ?? ""}
                  />

                  <span aria-hidden="true">%</span>
                </div>
              </div>

              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-minimum-yield"
                >
                  Minimum gross yield
                </label>

                <div className={styles.suffixField}>
                  <input
                    className={styles.input}
                    id="marketplace-minimum-yield"
                    max={100}
                    min={0}
                    onChange={(event) =>
                      onChange({
                        minimumGrossYieldPercent: toOptionalNumber(
                          event.target.value,
                        ),
                      })
                    }
                    type="number"
                    value={filters.minimumGrossYieldPercent ?? ""}
                  />

                  <span aria-hidden="true">%</span>
                </div>
              </div>

              <div>
                <label
                  className={styles.filterLabel}
                  htmlFor="marketplace-minimum-rent"
                >
                  Minimum estimated monthly rent
                </label>

                <div className={styles.prefixField}>
                  <span aria-hidden="true">£</span>
                  <input
                    className={styles.input}
                    id="marketplace-minimum-rent"
                    min={0}
                    onChange={(event) =>
                      onChange({
                        minimumEstimatedMonthlyRent: toOptionalNumber(
                          event.target.value,
                        ),
                      })
                    }
                    type="number"
                    value={filters.minimumEstimatedMonthlyRent ?? ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button
            className={styles.resetButton}
            onClick={onReset}
            type="button"
          >
            Clear filters
          </button>

          <button
            className={styles.applyButton}
            onClick={onApply}
            type="button"
          >
            Apply filters
          </button>
        </div>
      </aside>
    </>
  );
}
