"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useVerification } from "../hooks/use-verification";
import {
  VERIFICATION_STATUS_OPTIONS,
  VERIFICATION_TYPE_OPTIONS,
  VERIFICATION_RESPONSE_TYPE_OPTIONS,
} from "../constants/verification.constants";
import { verificationResponseSchema } from "../schemas/verification-response.schema";
import type {
  VerificationReviewStatus,
  VerificationType,
} from "../types/verification.types";
import { DocumentPicker } from "@/src/components/workspace/document-picker";
import { useDashboardState } from "@/app/dashboard/_components/dashboard-state-context";
import {
  AllowedActions,
  buttonClass,
  Confirm,
  dateLabel,
  Empty,
  Feedback,
  Field,
  inputClass,
  label,
  Loading,
  panelClass,
  Pagination,
  ResourceLink,
  secondaryClass,
  Status,
  WorkspacePage,
} from "@/src/components/workspace/workspace-ui";

const onboardingTypes: VerificationType[] = [
  "identity",
  "address",
  "business_profile",
  "company",
  "property_sourcer",
  "service_provider",
  "api_partner",
];
const propertyTypes: VerificationType[] = [
  "property_ownership",
  "authority_to_represent",
  "listing_compliance",
];

export function VerificationList() {
  const searchParams = useSearchParams();
  const initialGroup = searchParams.get("category") ?? "all";
  const {
    reviews,
    loadVerificationReviews,
    pagination,
    isLoading,
    errorMessage,
  } = useVerification();
  const { dashboardState } = useDashboardState();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VerificationReviewStatus | "">("");
  const [type, setType] = useState<VerificationType | "">("");
  const [group, setGroup] = useState(initialGroup);
  const [corrections, setCorrections] = useState(false);
  const load = (page = 1) =>
    loadVerificationReviews({
      search,
      statuses: status ? [status] : [],
      verificationTypes: type
        ? [type]
        : group === "onboarding"
          ? onboardingTypes
          : group === "property"
            ? propertyTypes
            : [],
      correctionRequired: corrections || null,
      page,
    });
  useEffect(() => {
    void Promise.resolve().then(() =>
      loadVerificationReviews({
        verificationTypes:
          initialGroup === "onboarding"
            ? onboardingTypes
            : initialGroup === "property"
              ? propertyTypes
              : [],
      }),
    );
  }, [loadVerificationReviews, initialGroup]);
  return (
    <WorkspacePage
      title="Verification centre"
      description="Track onboarding checks, property verification, required documents and correction requests."
      actions={
        <ResourceLink
          href={dashboardState?.activeBusinessProfile?.continueSetupPath}
        >
          Continue profile setup
        </ResourceLink>
      }
    >
      <nav
        aria-label="Verification categories"
        className="flex flex-wrap gap-3"
      >
        {[
          { value: "all", title: "All reviews" },
          { value: "onboarding", title: "Onboarding" },
          { value: "property", title: "Property" },
        ].map((item) => (
          <button
            type="button"
            key={item.value}
            className={group === item.value ? buttonClass : secondaryClass}
            aria-pressed={group === item.value}
            onClick={() => {
              setGroup(item.value);
              setType("");
              void loadVerificationReviews({
                search,
                statuses: status ? [status] : [],
                verificationTypes:
                  item.value === "onboarding"
                    ? onboardingTypes
                    : item.value === "property"
                      ? propertyTypes
                      : [],
                correctionRequired: corrections || null,
                page: 1,
              });
            }}
          >
            {item.title}
          </button>
        ))}
        <Link className={secondaryClass} href="/payments?requiresAction=true">
          Payment transfers
        </Link>
      </nav>
      <form
        className={`${panelClass} grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4`}
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <Field label="Search reviews">
          <input
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field label="Review status">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as VerificationReviewStatus | "")
            }
            className={inputClass}
          >
            <option value="">All statuses</option>
            {VERIFICATION_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Verification type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as VerificationType | "")}
            className={inputClass}
          >
            <option value="">All types in category</option>
            {VERIFICATION_TYPE_OPTIONS.filter(
              (o) =>
                group === "all" ||
                (group === "property"
                  ? propertyTypes
                  : onboardingTypes
                ).includes(o.value),
            ).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="space-y-3">
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={corrections}
              onChange={(e) => setCorrections(e.target.checked)}
            />
            Corrections required
          </label>
          <button className={buttonClass} disabled={isLoading}>
            Apply filters
          </button>
        </div>
      </form>
      <Feedback error={errorMessage} />
      {isLoading && <Loading />}
      {!isLoading && !errorMessage && !reviews.length && (
        <Empty>
          No verification reviews match these filters. Reviews appear when the
          relevant onboarding or property submission enters verification.
        </Empty>
      )}
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li className={panelClass} key={review.verificationReviewPublicId}>
            <div className="flex flex-wrap justify-between gap-3">
              <Link
                className="text-lg font-bold text-primary! hover:underline"
                href={`/verification/${encodeURIComponent(review.verificationReviewPublicId)}`}
              >
                {label(review.verificationType)} — {review.subject.displayName}
              </Link>
              <Status value={review.status} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {review.verificationReference} · Updated{" "}
              {dateLabel(review.updatedAt)}
            </p>
            <p className="mt-2 text-sm">
              {review.requirementSummary.completed} of{" "}
              {review.requirementSummary.total} requirements complete
              {review.correctionRequired
                ? ` · ${review.correctionCount} corrections requested`
                : ""}
            </p>
            {review.safeUserMessage && (
              <p className="mt-3 text-sm">{review.safeUserMessage}</p>
            )}
          </li>
        ))}
      </ul>
      <Pagination
        pagination={pagination}
        busy={isLoading}
        onPage={(p) => void loadVerificationReviews({ page: p })}
      />
    </WorkspacePage>
  );
}

export function VerificationReview({
  id,
  respondOnly = false,
}: {
  id: string;
  respondOnly?: boolean;
}) {
  const {
    selectedReview: review,
    loadVerificationReview,
    submitVerificationResponse,
    isLoading,
    isResponding,
    errorMessage,
    successMessage,
  } = useVerification();
  const [documents, setDocuments] = useState<string[]>([]);
  const [validation, setValidation] = useState<string | null>(null);
  useEffect(() => {
    void Promise.resolve().then(() => loadVerificationReview(id));
  }, [id, loadVerificationReview]);
  async function respond(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!review?.canRespond || isResponding) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = verificationResponseSchema.safeParse({
      responseType: data.get("responseType"),
      message: data.get("message"),
      relatedDocumentPublicIds: documents,
      informationAccurateConfirmed: data.get("accurate") === "on",
      responseAuthorityConfirmed: data.get("authority") === "on",
    });
    if (!parsed.success) {
      setValidation(parsed.error.issues[0].message);
      return;
    }
    setValidation(null);
    try {
      await submitVerificationResponse(id, { data: parsed.data });
      form.reset();
      setDocuments([]);
    } catch {
      /* hook displays safe error and retains the response */
    }
  }
  return (
    <WorkspacePage
      title={
        review
          ? `${label(review.verificationType)} review`
          : "Verification review"
      }
      back={{ href: "/verification", label: "Verification centre" }}
      actions={
        <button
          type="button"
          className={secondaryClass}
          disabled={isLoading || isResponding}
          onClick={() => void loadVerificationReview(id)}
        >
          Refresh review
        </button>
      }
    >
      <Feedback error={validation ?? errorMessage} success={successMessage} />
      {!review && isLoading && <Loading />}
      {review && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Status value={review.status} />
            <span className="text-sm text-muted-foreground">
              {review.verificationReference} · {review.subject.displayName}
            </span>
          </div>
          {review.safeUserMessage && (
            <p className={panelClass}>{review.safeUserMessage}</p>
          )}
          {review.description && (
            <p className="leading-7">{review.description}</p>
          )}
          <AllowedActions actions={review.actions ?? []} />
          {review.relatedResource && (
            <ResourceLink href={review.relatedResource.detailPath}>
              {review.relatedResource.displayLabel}
            </ResourceLink>
          )}
          {review.correctionRequests.length > 0 && (
            <section className={`${panelClass} space-y-4`}>
              <h2 className="text-xl font-bold">Correction requests</h2>
              {review.correctionRequests.map((item) => (
                <article
                  key={item.correctionKey}
                  className="space-y-2 border-t border-border pt-4"
                >
                  <h3 className="font-semibold">
                    {item.title} {item.resolved ? "— resolved" : ""}
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {item.message}
                  </p>
                  {!item.resolved && (
                    <ResourceLink href={item.actionPath}>
                      {item.actionLabel ?? "Make correction"}
                    </ResourceLink>
                  )}
                </article>
              ))}
            </section>
          )}
          <section className={`${panelClass} space-y-4`}>
            <h2 className="text-xl font-bold">Document requirements</h2>
            {!review.documentRequirements.length && (
              <p className="text-sm text-muted-foreground">
                No documents requested for this review.
              </p>
            )}
            {review.documentRequirements.map((item) => (
              <article
                key={item.requirementKey}
                className="flex flex-wrap items-start justify-between gap-4 border-t border-border pt-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.title}
                    {item.required ? " (required)" : ""}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.safeUserMessage && (
                    <p className="mt-2 text-sm">{item.safeUserMessage}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4">
                    {item.documentPublicId && (
                      <Link
                        className="text-sm font-semibold text-primary! hover:underline"
                        href={`/documents/${encodeURIComponent(item.documentPublicId)}`}
                      >
                        View document
                      </Link>
                    )}
                    <ResourceLink href={item.uploadPath}>
                      Upload document
                    </ResourceLink>
                    <ResourceLink href={item.replacementPath}>
                      Replace document
                    </ResourceLink>
                  </div>
                </div>
                <Status value={item.status} />
              </article>
            ))}
          </section>
          {review.canRespond ? (
            <section id="respond" className={`${panelClass} space-y-5`}>
              <h2 className="text-xl font-bold">Respond to this review</h2>
              <p className="text-sm text-muted-foreground">
                Upload supporting documents through the document centre, then
                select them below.
              </p>
              <ResourceLink
                href={`/documents/upload?relatedType=verification_review&relatedPublicId=${encodeURIComponent(id)}`}
              >
                Upload supporting document
              </ResourceLink>
              <form onSubmit={respond}>
                <fieldset disabled={isResponding} className="space-y-5">
                  <Field label="Response type">
                    <select
                      className={inputClass}
                      name="responseType"
                      defaultValue="correction"
                    >
                      {VERIFICATION_RESPONSE_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Your response">
                    <textarea
                      rows={5}
                      name="message"
                      className={inputClass}
                      maxLength={2000}
                    />
                  </Field>
                  <DocumentPicker
                    selected={documents}
                    onChange={setDocuments}
                    disabled={isResponding}
                  />
                  <Confirm name="accurate">
                    I confirm that this information is accurate.
                  </Confirm>
                  <Confirm name="authority">
                    I am authorised to provide this response.
                  </Confirm>
                  <button
                    className={buttonClass}
                    disabled={isLoading || Boolean(errorMessage)}
                  >
                    {isResponding ? "Submitting…" : "Submit response"}
                  </button>
                </fieldset>
              </form>
            </section>
          ) : (
            <Empty>
              {respondOnly
                ? "A response is not currently permitted for this review."
                : "No response is currently required or permitted."}
            </Empty>
          )}
          {!!review.userResponses.length && (
            <section className={`${panelClass} space-y-4`}>
              <h2 className="text-xl font-bold">Your responses</h2>
              {review.userResponses.map((item) => (
                <article
                  className="border-t border-border pt-4"
                  key={item.responsePublicId}
                >
                  <h3 className="font-semibold">{label(item.responseType)}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                    {item.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {dateLabel(item.submittedAt)}
                  </p>
                  {item.relatedDocumentPublicIds.map((documentId) => (
                    <Link
                      className="mr-4 text-sm text-primary! hover:underline"
                      href={`/documents/${encodeURIComponent(documentId)}`}
                      key={documentId}
                    >
                      Supporting document
                    </Link>
                  ))}
                </article>
              ))}
            </section>
          )}
          <section className={`${panelClass} space-y-4`}>
            <h2 className="text-xl font-bold">Review timeline</h2>
            {!review.timeline.length && (
              <p className="text-sm text-muted-foreground">
                No timeline events yet.
              </p>
            )}
            <ol className="space-y-4">
              {review.timeline.map((item) => (
                <li
                  key={item.eventPublicId}
                  className="border-l-2 border-primary pl-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm">{item.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dateLabel(item.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </WorkspacePage>
  );
}
