"use client";

import { useCallback, useEffect, useState } from "react";
import { documentsApi } from "@/src/features/documents/api/documents.api";
import type { DocumentSummary } from "@/src/features/documents/types/documents.types";
import { dateLabel, Feedback, secondaryClass } from "./workspace-ui";

/** Select authorised, current-profile documents without asking users to copy public IDs. */
export function DocumentPicker({
  selected,
  onChange,
  proofOnly = false,
  disabled = false,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  proofOnly?: boolean;
  disabled?: boolean;
}) {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const load = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError(null);
      try {
        const result = await documentsApi.getDocuments({
          isLatestVersion: true,
          ...(proofOnly
            ? { documentTypes: ["proof_of_payment" as const] }
            : {}),
          page: nextPage,
          pageSize: 20,
        });
        setDocuments((current) =>
          nextPage === 1
            ? result.items
            : [
                ...current,
                ...result.items.filter(
                  (item) =>
                    !current.some(
                      (d) => d.documentPublicId === item.documentPublicId,
                    ),
                ),
              ],
        );
        setHasNext(result.pagination.hasNextPage);
        setPage(nextPage);
      } catch {
        setError("We could not load your documents. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [proofOnly],
  );
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
  return (
    <fieldset disabled={disabled} className="space-y-3">
      <legend className="mb-3 text-sm font-bold">
        {proofOnly
          ? "Proof of payment document (optional)"
          : "Attach supporting documents (optional)"}
      </legend>
      <Feedback error={error} />
      {documents.map((document) => (
        <label
          className="flex gap-3 rounded-lg border border-border p-3 text-sm"
          key={document.documentPublicId}
        >
          <input
            type="checkbox"
            className="mt-1 accent-primary"
            checked={selected.includes(document.documentPublicId)}
            onChange={(e) =>
              onChange(
                e.target.checked
                  ? proofOnly
                    ? [document.documentPublicId]
                    : [...selected, document.documentPublicId]
                  : selected.filter((id) => id !== document.documentPublicId),
              )
            }
          />
          <span>
            {document.displayName}
            <span className="block text-xs text-muted-foreground">
              Uploaded {dateLabel(document.uploadedAt)}
            </span>
          </span>
        </label>
      ))}
      {loading && (
        <p role="status" className="text-sm">
          Loading documents…
        </p>
      )}
      {!loading && !error && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No documents available yet. Upload a document, then refresh this list.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={secondaryClass}
          disabled={loading}
          onClick={() => void load()}
        >
          Refresh documents
        </button>
        {hasNext && (
          <button
            type="button"
            className={secondaryClass}
            disabled={loading}
            onClick={() => void load(page + 1)}
          >
            More documents
          </button>
        )}
      </div>
    </fieldset>
  );
}
