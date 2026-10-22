"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { usePayments } from "../hooks/use-payments";
import { paymentsApi } from "../api/payments.api";
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_PURPOSE_OPTIONS,
} from "../constants/payments.constants";
import { externalPaymentSubmissionSchema } from "../schemas/payment-proof.schema";
import type {
  PaymentDetail,
  PaymentPurpose,
  PaymentStatus,
} from "../types/payments.types";
import { documentsApi } from "@/src/features/documents/api/documents.api";
import { documentUploadSchema } from "@/src/features/documents/schemas/document-upload.schema";
import { DOCUMENT_ACCEPT_ATTRIBUTE } from "@/src/features/documents/constants/documents.constants";
import { DocumentPicker } from "@/src/components/workspace/document-picker";
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
  money,
  panelClass,
  Pagination,
  ResourceLink,
  secondaryClass,
  Status,
  WorkspacePage,
} from "@/src/components/workspace/workspace-ui";

export function PaymentList() {
  const searchParams = useSearchParams();
  const requiresAction = searchParams.get("requiresAction") === "true";
  const { payments, loadPayments, pagination, isLoading, errorMessage } =
    usePayments();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [purpose, setPurpose] = useState<PaymentPurpose | "">("");
  const [actionOnly, setActionOnly] = useState(requiresAction);
  const load = (page = 1) =>
    loadPayments({
      search,
      statuses: status ? [status] : [],
      purposes: purpose ? [purpose] : [],
      requiresAction: actionOnly || null,
      page,
    });
  useEffect(() => {
    void Promise.resolve().then(() =>
      loadPayments({ requiresAction: requiresAction || null }),
    );
  }, [loadPayments, requiresAction]);
  return (
    <WorkspacePage
      title="Payments"
      description="Track payment references, transfer submissions and review outcomes."
    >
      <form
        className={`${panelClass} grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4`}
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <Field label="Search payments">
          <input
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field label="Payment status">
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus | "")}
          >
            <option value="">All statuses</option>
            {PAYMENT_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Payment purpose">
          <select
            className={inputClass}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as PaymentPurpose | "")}
          >
            <option value="">All purposes</option>
            {PAYMENT_PURPOSE_OPTIONS.map((o) => (
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
              checked={actionOnly}
              onChange={(e) => setActionOnly(e.target.checked)}
            />
            Action required only
          </label>
          <button className={buttonClass} disabled={isLoading}>
            Apply filters
          </button>
        </div>
      </form>
      <Feedback error={errorMessage} />
      {isLoading && <Loading />}
      {!isLoading && !errorMessage && !payments.length && (
        <Empty>
          No payments match these filters. Payment references appear when a
          service or transaction requires payment.
        </Empty>
      )}
      <ul className="space-y-4">
        {payments.map((payment) => (
          <li className={panelClass} key={payment.paymentPublicId}>
            <div className="flex flex-wrap justify-between gap-3">
              <Link
                className="text-lg font-bold text-primary! hover:underline"
                href={`/payments/${encodeURIComponent(payment.paymentPublicId)}`}
              >
                {payment.purposeLabel || label(payment.purpose)}
              </Link>
              <Status value={payment.status} />
            </div>
            <p className="mt-3 font-semibold">
              {money(payment.expectedAmount, payment.currency)}
            </p>
            <p className="mt-2 break-words text-sm text-muted-foreground">
              Reference: {payment.paymentReference} · Transfer review:{" "}
              {label(payment.reviewStatus)}
            </p>
            {payment.safeUserMessage && (
              <p className="mt-3 text-sm">{payment.safeUserMessage}</p>
            )}
          </li>
        ))}
      </ul>
      <Pagination
        pagination={pagination}
        busy={isLoading}
        onPage={(p) => void loadPayments({ page: p })}
      />
    </WorkspacePage>
  );
}

function PaymentProofForm({
  payment,
  busy,
  blocked,
  submit,
}: {
  payment: PaymentDetail;
  busy: boolean;
  blocked: boolean;
  submit: (
    values: ReturnType<typeof externalPaymentSubmissionSchema.parse>,
  ) => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || blocked || uploading || !payment.canSubmitExternalPayment)
      return;
    const form = new FormData(e.currentTarget);
    const parsed = externalPaymentSubmissionSchema.safeParse({
      paymentReference: payment.paymentReference,
      amountPaid: Number(form.get("amountPaid")),
      currency: payment.currency,
      paymentMethod: form.get("paymentMethod"),
      payerName: form.get("payerName"),
      bankTransactionCode: form.get("bankTransactionCode"),
      bankSessionId: form.get("bankSessionId"),
      paymentDescriptionUsed: form.get("paymentDescriptionUsed"),
      paidAt: form.get("paidAt"),
      proofOfPaymentDocumentPublicId: selected[0] ?? null,
      informationAccurateConfirmed: form.get("accurate") === "on",
      narrationReferenceConfirmed: form.get("referenceConfirmed") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const upload =
      file && payment.canUploadProof
        ? documentUploadSchema.safeParse({
            documentType: "proof_of_payment",
            customDocumentType: null,
            relatedType: "payment",
            relatedPublicId: payment.paymentPublicId,
            displayName: file.name,
            description: null,
            file,
            informationAccurateConfirmed: form.get("accurate") === "on",
            uploadAuthorityConfirmed: form.get("uploadAuthority") === "on",
          })
        : null;
    if (upload && !upload.success) {
      setError(upload.error.issues[0].message);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      let proofId = parsed.data.proofOfPaymentDocumentPublicId;
      if (upload?.success) {
        const result = await documentsApi.uploadDocument({ data: upload.data });
        proofId = result.documentPublicId;
        setSelected([proofId]);
        setUploadedName(file?.name ?? "Payment proof");
        setFile(null);
      }
      await submit({
        ...parsed.data,
        paidAt: new Date(parsed.data.paidAt).toISOString(),
        proofOfPaymentDocumentPublicId: proofId,
      });
    } catch {
      setError(
        "Your payment submission could not be completed. Your payment remains unconfirmed. Refresh the payment details before trying again.",
      );
    } finally {
      setUploading(false);
    }
  }
  return (
    <section id="submit-proof" className={`${panelClass} space-y-5`}>
      <h2 className="text-xl font-bold">Submit transfer details</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Use the Asancha reference in your payment narration. Submitting a
        receipt starts a review; it does not confirm settlement.
      </p>
      <Feedback error={error} />
      <form onSubmit={onSubmit}>
        <fieldset disabled={busy || uploading} className="grid gap-5">
          <Field label="Asancha payment reference">
            <input
              className={inputClass}
              value={payment.paymentReference}
              readOnly
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Amount paid (GBP)">
              <input
                className={inputClass}
                type="number"
                name="amountPaid"
                min="0.01"
                step="0.01"
                defaultValue={payment.expectedAmount}
                required
              />
            </Field>
            <Field label="Payment method">
              <select
                name="paymentMethod"
                className={inputClass}
                defaultValue="bank_transfer"
              >
                <option value="bank_transfer">Bank transfer</option>
                <option value="card">Card (external)</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <Field label="Payer name">
            <input
              className={inputClass}
              name="payerName"
              minLength={2}
              maxLength={160}
              defaultValue={
                payment.payer.submittedPayerName ??
                payment.payer.expectedPayerName ??
                ""
              }
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Bank transaction code">
              <input
                className={inputClass}
                name="bankTransactionCode"
                maxLength={160}
              />
            </Field>
            <Field label="Bank session ID">
              <input
                className={inputClass}
                name="bankSessionId"
                maxLength={160}
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            For bank transfers, provide a transaction code or session ID.
          </p>
          <Field label="Payment narration used">
            <input
              className={inputClass}
              name="paymentDescriptionUsed"
              minLength={8}
              maxLength={240}
              defaultValue={payment.paymentReference}
              required
            />
          </Field>
          <Field label="Payment date and time (your local time)">
            <input
              className={inputClass}
              type="datetime-local"
              name="paidAt"
              required
            />
          </Field>
          {payment.canUploadProof && (
            <>
              <DocumentPicker
                selected={selected}
                onChange={(ids) => {
                  setSelected(ids);
                  setUploadedName(null);
                }}
                proofOnly
                disabled={busy || uploading}
              />
              {uploadedName && (
                <p className="text-sm">
                  Uploaded proof selected: {uploadedName}
                </p>
              )}
              <Field label="Or upload a new receipt (PDF, JPG, PNG or WebP; up to 10 MB)">
                <input
                  type="file"
                  accept={DOCUMENT_ACCEPT_ATTRIBUTE}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className={inputClass}
                />
              </Field>
              {file && (
                <Confirm name="uploadAuthority">
                  I am authorised to upload this payment proof.
                </Confirm>
              )}
            </>
          )}
          <Confirm name="accurate">
            I confirm the payment details and any attached evidence are
            accurate.
          </Confirm>
          <Confirm name="referenceConfirmed">
            I used this Asancha reference in the payment narration.
          </Confirm>
          <button
            className={`${buttonClass} justify-self-start`}
            disabled={blocked}
          >
            {uploading || busy ? "Submitting…" : "Submit transfer for review"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}

export function PaymentView({
  id,
  proofOnly = false,
}: {
  id: string;
  proofOnly?: boolean;
}) {
  const {
    selectedPayment: payment,
    loadPayment,
    submitExternalPayment,
    startStripeCheckout,
    isLoading,
    isSubmittingExternalPayment,
    isStartingCheckout,
    errorMessage,
    successMessage,
  } = usePayments();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const query = useSearchParams();
  useEffect(() => {
    void Promise.resolve().then(() => loadPayment(id));
  }, [id, loadPayment]);
  async function checkout() {
    if (
      !payment?.canStartStripeCheckout ||
      !payment.stripeCheckoutAvailable ||
      isStartingCheckout
    )
      return;
    setCheckoutError(null);
    try {
      const path = `/payments/${encodeURIComponent(id)}`;
      const result = await startStripeCheckout(id, {
        data: {
          successPath: `${path}?checkout=returned`,
          cancelPath: `${path}?checkout=cancelled`,
        },
      });
      const target = new URL(result.checkoutUrl);
      if (
        target.protocol !== "https:" ||
        !["checkout.stripe.com", "billing.stripe.com"].includes(
          target.hostname,
        ) ||
        target.username ||
        target.password
      ) {
        setCheckoutError(
          "The checkout link could not be verified. Refresh this payment or contact support.",
        );
        return;
      }
      window.location.assign(target.href);
    } catch {
      setCheckoutError("Checkout could not be started. Please try again.");
    }
  }
  return (
    <WorkspacePage
      title={
        payment
          ? `${payment.purposeLabel || label(payment.purpose)}`
          : "Payment details"
      }
      back={{ href: "/payments", label: "Payments" }}
      actions={
        <button
          type="button"
          className={secondaryClass}
          disabled={
            isLoading || isSubmittingExternalPayment || isStartingCheckout
          }
          onClick={() => void loadPayment(id)}
        >
          Refresh payment
        </button>
      }
    >
      <Feedback
        error={checkoutError ?? errorMessage}
        success={successMessage}
      />
      {!payment && isLoading && <Loading />}
      {payment && (
        <>
          {query.get("checkout") === "returned" &&
            payment.status !== "paid" && (
              <p role="status" className={panelClass}>
                You have returned from checkout. Payment confirmation is still
                pending. Refresh to check the latest status.
              </p>
            )}
          {query.get("checkout") === "cancelled" && (
            <p role="status" className={panelClass}>
              Checkout was cancelled. No payment confirmation has been recorded
              by this page.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Status value={payment.status} />
            <Status value={payment.reviewStatus} />
            <span className="break-all text-sm font-semibold">
              {payment.paymentReference}
            </span>
          </div>
          <dl className={`${panelClass} grid gap-6 sm:grid-cols-3`}>
            {[
              [
                "Expected amount",
                money(payment.expectedAmount, payment.currency),
              ],
              [
                "Submitted amount",
                payment.submittedAmount === null
                  ? "Not submitted"
                  : money(payment.submittedAmount, payment.currency),
              ],
              [
                "Paid amount",
                payment.paidAmount === null
                  ? "Not confirmed"
                  : money(payment.paidAmount, payment.currency),
              ],
              ["Reference status", label(payment.referenceStatus)],
              ["Expires", dateLabel(payment.expiresAt)],
              ["Paid at", dateLabel(payment.paidAt)],
            ].map(([title, value]) => (
              <div key={title}>
                <dt className="text-sm text-muted-foreground">{title}</dt>
                <dd className="mt-2 break-words font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          {payment.description && (
            <p className="leading-7">{payment.description}</p>
          )}
          {payment.safeUserMessage && (
            <p className={panelClass}>{payment.safeUserMessage}</p>
          )}
          {(payment.rejectionReason || payment.failureReason) && (
            <Feedback
              error={payment.rejectionReason ?? payment.failureReason}
            />
          )}
          {payment.relatedResource && (
            <ResourceLink href={payment.relatedResource.detailPath}>
              {payment.relatedResource.displayLabel}
            </ResourceLink>
          )}
          <AllowedActions actions={payment.actions ?? []} />
          {payment.nextActionPath && (
            <ResourceLink href={payment.nextActionPath}>
              {payment.nextActionLabel ?? "Next step"}
            </ResourceLink>
          )}
          {payment.proofOfPayment && (
            <section className={`${panelClass} space-y-3`}>
              <h2 className="text-xl font-bold">Submitted payment proof</h2>
              <p>{payment.proofOfPayment.displayName}</p>
              <Status value={payment.proofOfPayment.reviewStatus} />
              <div>
                <ResourceLink
                  href={
                    payment.proofOfPayment.detailPath ??
                    `/documents/${encodeURIComponent(payment.proofOfPayment.documentPublicId)}`
                  }
                >
                  View payment proof
                </ResourceLink>
              </div>
            </section>
          )}
          {payment.canStartStripeCheckout &&
            payment.stripeCheckoutAvailable && (
              <button
                type="button"
                className={`${buttonClass} justify-self-start`}
                disabled={
                  isStartingCheckout || isLoading || Boolean(errorMessage)
                }
                onClick={() => void checkout()}
              >
                {isStartingCheckout
                  ? "Opening checkout…"
                  : "Pay securely with Stripe"}
              </button>
            )}
          {payment.canSubmitExternalPayment ? (
            <PaymentProofForm
              payment={payment}
              busy={isSubmittingExternalPayment || isLoading}
              blocked={Boolean(errorMessage)}
              submit={async (data) => {
                await submitExternalPayment(id, { data });
              }}
            />
          ) : (
            <Empty>
              {proofOnly
                ? "Transfer submission is not available for this payment."
                : "No transfer submission is currently required or permitted."}
            </Empty>
          )}
          <Link
            className="text-sm font-semibold text-primary! hover:underline"
            href={`/conversations/new?conversationType=payment&targetType=payment&targetPublicId=${encodeURIComponent(id)}`}
          >
            Ask about this payment
          </Link>
        </>
      )}
    </WorkspacePage>
  );
}

export function PaymentByReference({
  reference,
  proofOnly = false,
}: {
  reference: string;
  proofOnly?: boolean;
}) {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void paymentsApi
      .getPayments({ paymentReference: reference, page: 1, pageSize: 20 })
      .then((result) => {
        if (!active) return;
        const payment = result.items.find(
          (item) =>
            item.paymentReference.toUpperCase() === reference.toUpperCase(),
        );
        if (payment) setPaymentId(payment.paymentPublicId);
        else
          setError(
            "This payment reference was not found in your available payments.",
          );
      })
      .catch(() => {
        if (active)
          setError(
            "We could not load this payment reference. Please try again.",
          );
      });
    return () => {
      active = false;
    };
  }, [reference, attempt]);
  return paymentId ? (
    <PaymentView key={paymentId} id={paymentId} proofOnly={proofOnly} />
  ) : (
    <WorkspacePage
      title="Payment reference"
      back={{ href: "/payments", label: "Payments" }}
    >
      <Feedback error={error} />
      {error ? (
        <button
          type="button"
          className={secondaryClass}
          onClick={() => {
            setError(null);
            setAttempt((v) => v + 1);
          }}
        >
          Try again
        </button>
      ) : (
        <Loading />
      )}
    </WorkspacePage>
  );
}
