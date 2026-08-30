// File: src/components/marketplace/marketplace-pagination.tsx

/**
 * Asancha Marketplace Pagination
 *
 * Purpose:
 * Provides accessible page navigation for marketplace results.
 */

import type { MarketplacePagination as MarketplacePaginationType } from "@/src/features/marketplace/types/marketplace.types";

import styles from "./marketplace-browser.module.css";

interface MarketplacePaginationProps {
  pagination: MarketplacePaginationType | null;
  onPageChange: (page: number) => void;
}

function createPageNumbers(currentPage: number, totalPages: number): number[] {
  const firstPage = Math.max(1, currentPage - 2);
  const lastPage = Math.min(totalPages, currentPage + 2);

  return Array.from(
    {
      length: lastPage - firstPage + 1,
    },
    (_, index) => firstPage + index,
  );
}

/**
 * Renders marketplace pagination.
 */
export function MarketplacePagination({
  pagination,
  onPageChange,
}: MarketplacePaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const pageNumbers = createPageNumbers(pagination.page, pagination.totalPages);

  return (
    <nav aria-label="Property result pages" className={styles.pagination}>
      <button
        className={styles.paginationButton}
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.page - 1)}
        type="button"
      >
        Previous
      </button>

      <div className={styles.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            aria-current={page === pagination.page ? "page" : undefined}
            className={`${styles.pageButton} ${
              page === pagination.page ? styles.pageButtonActive : ""
            }`}
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={styles.paginationButton}
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.page + 1)}
        type="button"
      >
        Next
      </button>
    </nav>
  );
}
