"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useConversations } from "../hooks/use-conversations";
import {
  CONVERSATION_STATUS_OPTIONS,
  CONVERSATION_TYPE_OPTIONS,
  CONVERSATION_TARGET_TYPE_OPTIONS,
  CONVERSATION_MAX_MESSAGE_LENGTH,
} from "../constants/conversations.constants";
import {
  createConversationSchema,
  sendMessageSchema,
  closeConversationSchema,
} from "../schemas/message-create.schema";
import type {
  ConversationStatus,
  ConversationType,
  ConversationTargetType,
} from "../types/conversations.types";
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

export function ConversationList() {
  const {
    conversations,
    loadConversations,
    pagination,
    isLoading,
    errorMessage,
    unreadMessageCount,
  } = useConversations();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ConversationStatus | "">("");
  const [type, setType] = useState<ConversationType | "">("");
  const [unread, setUnread] = useState(false);
  const load = (page = 1) =>
    loadConversations({
      search,
      statuses: status ? [status] : [],
      conversationTypes: type ? [type] : [],
      unreadOnly: unread || null,
      page,
    });
  useEffect(() => {
    void Promise.resolve().then(() => loadConversations());
  }, [loadConversations]);
  return (
    <WorkspacePage
      title="Messages"
      description="Conversations about your properties, bookings, payments, verification and support."
      actions={
        <Link className={buttonClass} href="/conversations/new">
          New conversation
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground">
        {unreadMessageCount} unread messages
      </p>
      <form
        className={`${panelClass} grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4`}
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <Field label="Search conversations">
          <input
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field label="Conversation status">
          <select
            className={inputClass}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ConversationStatus | "")
            }
          >
            <option value="">All statuses</option>
            {CONVERSATION_STATUS_OPTIONS.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Conversation type">
          <select
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as ConversationType | "")}
          >
            <option value="">All types</option>
            {CONVERSATION_TYPE_OPTIONS.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="space-y-3">
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={unread}
              onChange={(e) => setUnread(e.target.checked)}
            />
            Unread only
          </label>
          <button className={buttonClass} disabled={isLoading}>
            Apply filters
          </button>
        </div>
      </form>
      <Feedback error={errorMessage} />
      {isLoading && <Loading />}
      {!isLoading && !errorMessage && !conversations.length && (
        <Empty>
          No conversations match these filters. Start a conversation when you
          need help.
        </Empty>
      )}
      <ul className="space-y-3">
        {conversations.map((item) => (
          <li key={item.conversationPublicId} className={panelClass}>
            <div className="flex flex-wrap justify-between gap-3">
              <Link
                className="text-lg font-bold text-primary! hover:underline"
                href={`/conversations/${encodeURIComponent(item.conversationPublicId)}`}
              >
                {item.subject}
              </Link>
              <Status value={item.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {label(item.conversationType)} ·{" "}
              {dateLabel(item.lastMessageAt ?? item.createdAt)}
              {item.hasUnreadMessages
                ? ` · ${item.unreadMessageCount} unread`
                : ""}
            </p>
            {item.latestMessage && (
              <p className="mt-3 break-words text-sm">
                {item.latestMessage.safePreview}
              </p>
            )}
          </li>
        ))}
      </ul>
      <Pagination
        pagination={pagination}
        busy={isLoading}
        onPage={(p) => void loadConversations({ page: p })}
      />
    </WorkspacePage>
  );
}

export function NewConversation() {
  const router = useRouter();
  const search = useSearchParams();
  const { createConversation, isCreating, errorMessage } = useConversations();
  const [validation, setValidation] = useState<string | null>(null);
  const [type, setType] = useState(search.get("conversationType") ?? "support");
  const [target, setTarget] = useState(search.get("targetType") ?? "support");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isCreating) return;
    const values = new FormData(e.currentTarget);
    const result = createConversationSchema.safeParse({
      conversationType: type,
      subject: values.get("subject"),
      description: values.get("description"),
      targetType: target,
      targetPublicId: values.get("targetPublicId"),
      initialMessage: values.get("initialMessage"),
      informationAccurateConfirmed: values.get("accurate") === "on",
    });
    if (!result.success) {
      setValidation(result.error.issues[0].message);
      return;
    }
    setValidation(null);
    try {
      const response = await createConversation({ data: result.data });
      router.push(
        `/conversations/${encodeURIComponent(response.conversation.conversationPublicId)}`,
      );
    } catch {
      /* hook renders safe error */
    }
  }
  return (
    <WorkspacePage
      title="New conversation"
      back={{ href: "/conversations", label: "Messages" }}
      description="Tell the team what you need help with."
    >
      <Feedback error={validation ?? errorMessage} />
      <form onSubmit={submit} className={panelClass}>
        <fieldset disabled={isCreating} className="grid gap-5">
          <Field label="Conversation type">
            <select
              className={inputClass}
              value={type}
              onChange={(e) => {
                const v = e.target.value as ConversationType;
                setType(v);
                const targets: Partial<
                  Record<ConversationType, ConversationTargetType>
                > = {
                  support: "support",
                  listing_enquiry: "listing",
                  reservation: "reservation",
                  booking: "booking",
                  property: "property",
                  payment: "payment",
                  verification: "verification_review",
                  service: "service_provider",
                  api_partner: "api_partner_application",
                  general: "other",
                };
                setTarget(targets[v] ?? "other");
              }}
            >
              {CONVERSATION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subject">
            <input
              name="subject"
              className={inputClass}
              minLength={5}
              maxLength={160}
              required
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              name="description"
              className={inputClass}
              rows={2}
              maxLength={2000}
            />
          </Field>
          <Field label="Related item type">
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={inputClass}
            >
              {CONVERSATION_TARGET_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          {!["support", "other"].includes(target) && (
            <Field label="Related item reference">
              <input
                name="targetPublicId"
                defaultValue={search.get("targetPublicId") ?? ""}
                className={inputClass}
                required
              />
              <span className="text-xs text-muted-foreground">
                Use the public reference shown on the related item.
              </span>
            </Field>
          )}
          <Field label="Your message">
            <textarea
              name="initialMessage"
              rows={6}
              className={inputClass}
              maxLength={CONVERSATION_MAX_MESSAGE_LENGTH}
              required
            />
          </Field>
          <Confirm name="accurate">
            I confirm that this information is accurate.
          </Confirm>
          <button className={`${buttonClass} justify-self-start`}>
            {isCreating ? "Creating…" : "Start conversation"}
          </button>
        </fieldset>
      </form>
    </WorkspacePage>
  );
}

export function ConversationThread({ id }: { id: string }) {
  const {
    selectedConversation: conversation,
    messages,
    loadConversation,
    loadMessages,
    sendMessage,
    closeConversation,
    markConversationRead,
    updateConversation,
    isLoading,
    isSending,
    isClosing,
    isUpdating,
    errorMessage,
    successMessage,
    messagePagination,
  } = useConversations();
  const [body, setBody] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const load = useCallback(async () => {
    const review = await loadConversation(id);
    if (!review) return;
    const result = await loadMessages(id, 1);
    if (result && review.canMarkRead) {
      try {
        await markConversationRead(id);
      } catch {
        /* hook renders read error */
      }
    }
    setMessagePage(1);
  }, [id, loadConversation, loadMessages, markConversationRead]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  // Refresh open threads while visible without sending or clearing a draft.
  const canRefresh =
    Boolean(conversation) &&
    !["closed", "archived", "blocked"].includes(conversation?.status ?? "");
  useEffect(() => {
    if (!canRefresh) return;
    const timer = window.setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        !isLoading &&
        !isSending &&
        !isClosing &&
        !isUpdating &&
        messagePage === 1
      )
        void load();
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [
    canRefresh,
    isLoading,
    isSending,
    isClosing,
    isUpdating,
    messagePage,
    load,
  ]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!conversation?.canSendMessage || isSending || errorMessage) return;
    const parsed = sendMessageSchema.safeParse({ body });
    if (!parsed.success) {
      setValidation(parsed.error.issues[0].message);
      return;
    }
    setValidation(null);
    try {
      await sendMessage(id, { data: parsed.data });
      setBody("");
      await loadMessages(id, 1);
      setMessagePage(1);
    } catch {
      /* preserve message draft on failure */
    }
  }
  async function close(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!conversation?.canClose || isClosing || errorMessage) return;
    const form = new FormData(e.currentTarget);
    const parsed = closeConversationSchema.safeParse({
      reason: form.get("reason"),
      closureConfirmed: form.get("confirmed") === "on",
    });
    if (!parsed.success) {
      setValidation(parsed.error.issues[0].message);
      return;
    }
    setValidation(null);
    try {
      await closeConversation(id, { data: parsed.data });
      setClosing(false);
    } catch {
      /* hook renders error */
    }
  }
  async function edit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!conversation?.canUpdate || isUpdating || errorMessage) return;
    const { updateConversationSchema } =
      await import("../schemas/message-create.schema");
    const parsed = updateConversationSchema.safeParse({
      subject: new FormData(e.currentTarget).get("subject"),
    });
    if (!parsed.success) {
      setValidation(parsed.error.issues[0].message);
      return;
    }
    setValidation(null);
    try {
      await updateConversation(id, { data: parsed.data });
      setEditing(false);
    } catch {
      /* hook renders error */
    }
  }
  return (
    <WorkspacePage
      title={conversation?.subject ?? "Conversation"}
      back={{ href: "/conversations", label: "Messages" }}
      actions={
        <button
          type="button"
          className={secondaryClass}
          disabled={isLoading || isSending || isClosing || isUpdating}
          onClick={() => void load()}
        >
          Refresh conversation
        </button>
      }
    >
      <Feedback error={validation ?? errorMessage} success={successMessage} />
      {!conversation && isLoading && <Loading />}
      {conversation && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Status value={conversation.status} />
            <span className="text-sm text-muted-foreground">
              {conversation.conversationReference} ·{" "}
              {label(conversation.conversationType)}
            </span>
            {conversation.target && (
              <ResourceLink href={conversation.target.detailPath}>
                {conversation.target.displayLabel}
              </ResourceLink>
            )}
          </div>
          {conversation.safeUserMessage && (
            <p className={panelClass}>{conversation.safeUserMessage}</p>
          )}
          <AllowedActions actions={conversation.actions ?? []} />
          <div className="flex flex-wrap gap-3">
            {conversation.canUpdate && (
              <button
                className={secondaryClass}
                type="button"
                onClick={() => setEditing((v) => !v)}
              >
                Edit subject
              </button>
            )}
            {conversation.canClose && (
              <button
                className={secondaryClass}
                type="button"
                onClick={() => setClosing((v) => !v)}
              >
                Close conversation
              </button>
            )}
          </div>
          {editing && (
            <form onSubmit={edit} className={`${panelClass} space-y-4`}>
              <Field label="Conversation subject">
                <input
                  name="subject"
                  defaultValue={conversation.subject}
                  minLength={5}
                  maxLength={160}
                  className={inputClass}
                  required
                />
              </Field>
              <button className={buttonClass} disabled={isUpdating}>
                Save subject
              </button>
            </form>
          )}
          {closing && (
            <form onSubmit={close} className={`${panelClass} space-y-4`}>
              <Field label="Reason for closing (optional)">
                <textarea
                  name="reason"
                  className={inputClass}
                  maxLength={500}
                />
              </Field>
              <Confirm name="confirmed">
                I want to close this conversation.
              </Confirm>
              <button className={buttonClass} disabled={isClosing}>
                {isClosing ? "Closing…" : "Confirm closure"}
              </button>
            </form>
          )}
          <section
            aria-label="Conversation messages"
            className="space-y-4"
            aria-live="polite"
          >
            {!messages.length && !isLoading && (
              <Empty>No messages are available yet.</Empty>
            )}
            {[...messages]
              .sort((a, b) => Date.parse(a.sentAt) - Date.parse(b.sentAt))
              .map((message) => (
                <article
                  key={message.messagePublicId}
                  className={`${panelClass} max-w-3xl ${message.isCurrentUserSender ? "ml-auto bg-accent" : "mr-auto"}`}
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-bold">{message.senderDisplayName}</p>
                    <Status value={message.status} />
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">
                    {message.safeBody}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {dateLabel(message.sentAt)}
                  </p>
                </article>
              ))}
          </section>
          <Pagination
            pagination={messagePagination}
            busy={isLoading}
            onPage={(page) => {
              setMessagePage(page);
              void loadMessages(id, page);
            }}
          />
          {conversation.canSendMessage ? (
            <form className={`${panelClass} space-y-4`} onSubmit={submit}>
              <Field label="Reply">
                <textarea
                  className={inputClass}
                  rows={4}
                  maxLength={CONVERSATION_MAX_MESSAGE_LENGTH}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
              </Field>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className={buttonClass}
                  disabled={isSending || isLoading || Boolean(errorMessage)}
                >
                  {isSending ? "Sending…" : "Send message"}
                </button>
                {messagePage > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Sending a reply returns you to the latest messages.
                  </p>
                )}
              </div>
            </form>
          ) : (
            <Empty>Replies are unavailable for this conversation.</Empty>
          )}
        </>
      )}
    </WorkspacePage>
  );
}
