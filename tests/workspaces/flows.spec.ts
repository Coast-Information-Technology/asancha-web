import { test, expect } from "@playwright/test";
import {
  collection,
  conversation,
  fail,
  message,
  mockWorkspace,
  ok,
  pagination,
  payment,
  review,
  timestamp,
} from "./fixtures";

// All data-changing requests are intercepted; these tests never send user messages or payments.
test("shared workspaces require sign-in", async ({ page }) => {
  for (const path of [
    "/conversations",
    "/verification",
    "/payments/payment_test",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/auth\/sign-in\?redirect=/);
  }
});

test("conversation filters, read tracking, failed-send recovery and closure", async ({
  page,
}) => {
  let thread = structuredClone(conversation);
  const messages = [structuredClone(message)];
  let failNextSend = true;
  let read = 0;
  let sent = 0;
  await mockWorkspace(page, async (route, path) => {
    const method = route.request().method();
    if (path === "/conversations/me") {
      await ok(route, collection([thread]));
      return true;
    }
    if (path === "/conversations/conv_test") {
      await ok(route, thread);
      return true;
    }
    if (path.endsWith("/read")) {
      read++;
      await ok(route, {
        conversationPublicId: "conv_test",
        unreadMessageCount: 0,
        markedRead: true,
      });
      return true;
    }
    if (path === "/conversations/conv_test/messages" && method === "GET") {
      await ok(route, { items: messages, pagination });
      return true;
    }
    if (path === "/conversations/conv_test/messages" && method === "POST") {
      sent++;
      if (failNextSend) {
        failNextSend = false;
        await fail(route, 503);
        return true;
      }
      const body = route.request().postDataJSON();
      expect(body.data.body).toBe("The address is 12 Example Road.");
      const reply = {
        ...message,
        messagePublicId: "reply_test",
        safeBody: body.data.body,
        senderDisplayName: "Test owner",
        isCurrentUserSender: true,
        messageType: "user_message",
        status: "sent",
      };
      messages.push(reply as typeof message);
      await ok(route, { conversation: thread, message: reply, sent: true });
      return true;
    }
    if (path.endsWith("/close")) {
      expect(route.request().postDataJSON().data.closureConfirmed).toBe(true);
      thread = {
        ...thread,
        canSendMessage: false,
        canClose: false,
        status: "closed",
      };
      await ok(route, {
        conversation: thread,
        closed: true,
        message: "Conversation closed.",
      });
      return true;
    }
  });
  await page.goto("/conversations");
  await expect(
    page.getByRole("link", { name: "Help with my property" }),
  ).toBeVisible();
  await page.getByLabel("Conversation status").selectOption("waiting_for_user");
  const query = page.waitForRequest(
    (r) =>
      r.url().includes("/conversations/me?") &&
      r.url().includes("statuses=waiting_for_user"),
  );
  await page.getByRole("button", { name: "Apply filters" }).click();
  await query;
  await page.getByRole("link", { name: "Help with my property" }).click();
  await expect(page.getByText(message.safeBody)).toBeVisible();
  expect(read).toBeGreaterThan(0);
  await page
    .getByLabel("Reply", { exact: true })
    .fill("The address is 12 Example Road.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Reply", { exact: true })).toHaveValue(
    "The address is 12 Example Road.",
  );
  await page.getByRole("button", { name: "Refresh conversation" }).click();
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("The address is 12 Example Road.", { exact: true }),
  ).toBeVisible();
  expect(sent).toBe(2);
  await page
    .getByRole("button", { name: "Close conversation", exact: true })
    .click();
  await page.getByLabel("I want to close this conversation.").check();
  await page.getByRole("button", { name: "Confirm closure" }).click();
  await expect(
    page.getByText("Replies are unavailable for this conversation."),
  ).toBeVisible();
});

test("a new support conversation sends validated plain text", async ({
  page,
}) => {
  let created = false;
  await mockWorkspace(page, async (route, path) => {
    if (path === "/conversations" && route.request().method() === "POST") {
      const data = route.request().postDataJSON().data;
      expect(data.subject).toBe("Help with verification");
      expect(data.informationAccurateConfirmed).toBe(true);
      expect(data.targetType).toBe("support");
      created = true;
      await ok(route, {
        conversation,
        initialMessage: message,
        created: true,
        nextPath: "/conversations/conv_test",
        message: "Created.",
      });
      return true;
    }
    if (path === "/conversations/conv_test") {
      await ok(route, conversation);
      return true;
    }
    if (path.endsWith("/messages")) {
      await ok(route, { items: [message], pagination });
      return true;
    }
    if (path.endsWith("/read")) {
      await ok(route, { markedRead: true, unreadMessageCount: 0 });
      return true;
    }
  });
  await page.goto("/conversations/new");
  await page
    .getByLabel("Subject", { exact: true })
    .fill("Help with verification");
  await page
    .getByLabel("Your message")
    .fill("Please explain which evidence is needed.");
  await page.getByLabel("I confirm that this information is accurate.").check();
  await page.getByRole("button", { name: "Start conversation" }).click();
  await expect(page).toHaveURL(/\/conversations\/conv_test$/);
  expect(created).toBe(true);
});

test("verification categories and corrections use the current review permissions", async ({
  page,
}) => {
  let responded = false;
  await mockWorkspace(page, async (route, path) => {
    if (path === "/verification-reviews/me") {
      await ok(route, collection([review]));
      return true;
    }
    if (path === "/verification-reviews/review_test") {
      await ok(route, review);
      return true;
    }
    if (path === "/documents") {
      await ok(
        route,
        collection([
          {
            documentPublicId: "document_new",
            displayName: "Updated ownership evidence",
            uploadedAt: timestamp,
          },
        ]),
      );
      return true;
    }
    if (path.endsWith("/respond")) {
      const data = route.request().postDataJSON().data;
      expect(data.relatedDocumentPublicIds).toEqual(["document_new"]);
      expect(data.message).toBe("I have replaced the outdated document.");
      responded = true;
      await ok(route, {
        verificationReview: {
          ...review,
          status: "in_review",
          canRespond: false,
          userResponses: [
            {
              responsePublicId: "response_test",
              responseType: "correction",
              message: data.message,
              relatedDocumentPublicIds: ["document_new"],
              submittedAt: timestamp,
            },
          ],
        },
        response: {},
        submitted: true,
        nextPath: "/verification/review_test",
        message: "Response submitted.",
      });
      return true;
    }
  });
  await page.goto("/verification");
  await expect(
    page.getByRole("link", { name: /Property Ownership/ }),
  ).toBeVisible();
  const query = page.waitForRequest((r) =>
    r.url().includes("verificationTypes=property_ownership"),
  );
  await page.getByRole("button", { name: "Property", exact: true }).click();
  await query;
  await page.getByRole("link", { name: /Property Ownership/ }).click();
  await expect(
    page.getByRole("link", { name: "Replace ownership evidence" }),
  ).toHaveAttribute("href", "/documents/document_test/replace");
  await page
    .getByLabel("Your response", { exact: true })
    .fill("I have replaced the outdated document.");
  await page.getByLabel(/Updated ownership evidence/).check();
  await page.getByLabel("I confirm that this information is accurate.").check();
  await page.getByLabel("I am authorised to provide this response.").check();
  await page.getByRole("button", { name: "Submit response" }).click();
  await expect(
    page.getByRole("heading", { name: "Your responses" }),
  ).toBeVisible();
  expect(responded).toBe(true);
  await expect(
    page.getByRole("button", { name: "Submit response" }),
  ).toHaveCount(0);
});

test("payment reference lookup, receipt upload and submission never mark a payment paid", async ({
  page,
}) => {
  let transferred = false;
  let uploaded = false;
  let uploadCount = 0;
  let transferCount = 0;
  await mockWorkspace(page, async (route, path) => {
    if (path === "/payments/me") {
      expect(
        new URL(route.request().url()).searchParams.get("paymentReference"),
      ).toBe(payment.paymentReference);
      await ok(route, collection([payment]));
      return true;
    }
    if (path === "/payments/payment_test") {
      await ok(route, payment);
      return true;
    }
    if (path === "/documents") {
      await ok(route, collection([]));
      return true;
    }
    if (path === "/documents/upload") {
      const body = route.request().postDataBuffer()?.toString() ?? "";
      expect(body).toContain("proof_of_payment");
      expect(body).toContain("receipt.pdf");
      uploaded = true;
      uploadCount++;
      await ok(route, {
        documentPublicId: "proof_new",
        documentType: "proof_of_payment",
        mimeType: "application/pdf",
      });
      return true;
    }
    if (path.endsWith("/submit-external")) {
      const data = route.request().postDataJSON().data;
      expect(data.paymentReference).toBe(payment.paymentReference);
      expect(data.proofOfPaymentDocumentPublicId).toBe("proof_new");
      expect(data.amountPaid).toBe(150);
      expect(data.narrationReferenceConfirmed).toBe(true);
      transferred = true;
      transferCount++;
      if (transferCount === 1) {
        await fail(route, 503);
        return true;
      }
      await ok(route, {
        payment: {
          ...payment,
          status: "submitted",
          reviewStatus: "pending_review",
          submittedAmount: 150,
          canSubmitExternalPayment: false,
        },
        submitted: true,
        nextPath: "/payments/payment_test",
        message: "Payment submitted for review.",
      });
      return true;
    }
  });
  await page.goto(
    `/payments/references/${payment.paymentReference}/submit-proof`,
  );
  await expect(
    page.getByRole("heading", { name: "Submit transfer details" }),
  ).toBeVisible();
  await page.getByLabel("Bank transaction code").fill("BANK-TRACE-123");
  await page
    .getByLabel("Payment date and time (your local time)")
    .fill("2026-01-02T10:00");
  await page.getByLabel(/Or upload a new receipt/).setInputFiles({
    name: "receipt.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 Test receipt"),
  });
  await page
    .getByLabel("I am authorised to upload this payment proof.")
    .check();
  await page
    .getByLabel(
      "I confirm the payment details and any attached evidence are accurate.",
    )
    .check();
  await page
    .getByLabel("I used this Asancha reference in the payment narration.")
    .check();
  await page.getByLabel("Payment narration used").fill("WRONG-REFERENCE");
  await page
    .getByRole("button", { name: "Submit transfer for review" })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "narration must include",
  );
  expect(uploaded).toBe(false);
  expect(transferred).toBe(false);
  await page
    .getByLabel("Payment narration used")
    .fill(payment.paymentReference);
  await page
    .getByRole("button", { name: "Submit transfer for review" })
    .click();
  await expect(
    page.getByText(/Your payment submission could not be completed/),
  ).toBeVisible();
  await expect(page.getByLabel("Bank transaction code")).toHaveValue(
    "BANK-TRACE-123",
  );
  await expect(page.getByLabel("Payment narration used")).toHaveValue(
    payment.paymentReference,
  );
  await page.getByRole("button", { name: "Refresh payment" }).click();
  await expect(
    page.getByRole("button", { name: "Submit transfer for review" }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Submit transfer for review" })
    .click();
  await expect(page.getByRole("main").getByRole("status")).toContainText(
    "Payment submitted for review",
  );
  expect(uploadCount).toBe(1);
  expect(transferCount).toBe(2);
  expect(uploaded).toBe(true);
  expect(transferred).toBe(true);
  await expect(page.getByText("Not confirmed", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit transfer for review" }),
  ).toHaveCount(0);
});

test("unavailable actions stay locked and untrusted checkout redirects are rejected", async ({
  page,
}) => {
  await mockWorkspace(page, async (route, path) => {
    if (path === "/payments/payment_locked") {
      await ok(route, {
        ...payment,
        paymentPublicId: "payment_locked",
        canSubmitExternalPayment: false,
        canStartStripeCheckout: false,
        canUploadProof: false,
        actions: [
          {
            action: "approve",
            allowed: false,
            reason: "Review is in progress.",
            actionLabel: "Review transfer",
            actionPath: "https://example.com",
          },
        ],
      });
      return true;
    }
    if (path === "/payments/payment_checkout") {
      await ok(route, {
        ...payment,
        paymentPublicId: "payment_checkout",
        canSubmitExternalPayment: false,
        canStartStripeCheckout: true,
        stripeCheckoutAvailable: true,
      });
      return true;
    }
    if (path.endsWith("/stripe-checkout")) {
      await ok(route, {
        checkoutUrl: "https://untrusted.example/checkout",
        started: true,
      });
      return true;
    }
  });
  await page.goto("/payments/payment_locked");
  await expect(
    page.getByText(
      "No transfer submission is currently required or permitted.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit transfer for review" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pay securely with Stripe" }),
  ).toHaveCount(0);
  await page.goto("/payments/payment_checkout?checkout=returned");
  await expect(page.getByRole("main").getByRole("status")).toContainText(
    "confirmation is still pending",
  );
  await page.getByRole("button", { name: "Pay securely with Stripe" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "checkout link could not be verified",
  );
  await expect(page).toHaveURL(/localhost.*payment_checkout/);
});

test("denied details and empty lists render actionable states at mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockWorkspace(page, async (route, path) => {
    if (path === "/conversations/me") {
      await ok(route, collection([]));
      return true;
    }
    if (path === "/verification-reviews/review_denied") {
      await fail(route);
      return true;
    }
    if (path === "/payments/payment_locked") {
      await ok(route, {
        ...payment,
        paymentReference: `ASANCHA-${"L".repeat(45)}`,
        canSubmitExternalPayment: false,
      });
      return true;
    }
  });
  await page.goto("/conversations");
  await expect(page.getByText(/No conversations match/)).toBeVisible();
  await page.goto("/verification/review_denied");
  await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit response" }),
  ).toHaveCount(0);
  await page.goto("/payments/payment_locked");
  await expect(
    page.getByText(
      "No transfer submission is currently required or permitted.",
    ),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

for (const [role, profileType] of [
  ["investor", "investor"],
  ["property-owner", "property_owner"],
  ["property-agent", "property_agent"],
  ["property-sourcer", "property_sourcer"],
  ["service-provider", "service_provider"],
]) {
  test(`${role} dashboard routes open the full shared workspaces`, async ({
    page,
  }) => {
    await mockWorkspace(
      page,
      async (route, path) => {
        if (
          path === "/conversations/me" ||
          path === "/verification-reviews/me" ||
          path === "/payments/me"
        ) {
          await ok(route, collection([]));
          return true;
        }
      },
      profileType,
    );
    for (const [path, heading] of [
      ["conversations", "Messages"],
      ["verification", "Verification centre"],
      ["payments", "Payments"],
    ]) {
      await page.goto(`/dashboard/${role}/${path}`);
      await expect(
        page
          .getByRole("main")
          .getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("dialog", {
          name: "Accept required profile policies before onboarding.",
        }),
      ).toHaveCount(0);
    }
  });
}

test("API partner payments leave the placeholder and open the connected centre", async ({
  page,
}) => {
  await mockWorkspace(
    page,
    async (route, path) => {
      if (
        path === "/payments/me" ||
        path === "/conversations/me" ||
        path === "/verification-reviews/me"
      ) {
        await ok(route, collection([]));
        return true;
      }
    },
    "api_partner",
  );
  await page.goto("/api-partner/payments");
  await expect(page).toHaveURL(/\/payments$/);
  await expect(
    page
      .getByRole("main")
      .getByRole("heading", { name: "Payments", exact: true }),
  ).toBeVisible();
  const nav = page.getByRole("navigation", { name: "API partner workspace" });
  await expect(
    nav.getByRole("link", { name: "Verification", exact: true }),
  ).toBeVisible();
  await nav.getByRole("link", { name: "Conversations", exact: true }).click();
  await expect(
    page
      .getByRole("main")
      .getByRole("heading", { name: "Messages", exact: true }),
  ).toBeVisible();
});

test("pagination retains applied filters until a new filter form is submitted", async ({
  page,
}) => {
  await mockWorkspace(page, async (route, path) => {
    if (path === "/payments/me") {
      const currentPage = Number(
        new URL(route.request().url()).searchParams.get("page") ?? 1,
      );
      await ok(route, {
        ...collection([payment]),
        pagination: {
          ...pagination,
          page: currentPage,
          totalPages: 2,
          totalItems: 2,
          hasNextPage: currentPage === 1,
          hasPreviousPage: currentPage === 2,
        },
      });
      return true;
    }
  });
  await page.goto("/payments");
  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await page.getByLabel("Payment status").selectOption("pending");
  const applied = page.waitForRequest(
    (r) =>
      r.url().includes("/payments/me?") &&
      new URL(r.url()).searchParams.get("statuses") === "pending",
  );
  await page.getByRole("button", { name: "Apply filters" }).click();
  await applied;
  await page.getByLabel("Search payments").fill("unsubmitted search");
  const next = page.waitForRequest(
    (r) =>
      r.url().includes("/payments/me?") &&
      new URL(r.url()).searchParams.get("page") === "2",
  );
  await page.getByRole("button", { name: "Next", exact: true }).click();
  const query = new URL((await next).url()).searchParams;
  expect(query.get("statuses")).toBe("pending");
  expect(query.get("search")).toBe(null);
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
});
