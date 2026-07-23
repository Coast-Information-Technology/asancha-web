# Asancha Web Project Structure Proposed Auth Route Updates

This note proposes route-structure updates for email verification without
editing `Asancha-web-project-structure.md`.

## Proposed Auth Route Change

Replace the old auth verification page entry:

```text
app/auth/verify-email/page.tsx
```

with:

```text
app/auth/resend-verification/page.tsx
```

Purpose:
- `/auth/resend-verification` is the user-facing page for requesting a fresh
  verification email.
- It collects an email address and calls the backend resend endpoint:
  `/auth/resend-verification`.
- It must use generic success copy to avoid account enumeration.

## Proposed Root Verification Callback Route

Add this root-level callback route:

```text
app/verify-email/page.tsx
app/verify-email/_components/email-verify-status.tsx
```

Purpose:
- `/verify-email?token=...` is the email-link callback route sent by the
  backend.
- It receives the opaque verification token from the URL.
- It calls the backend verification endpoint:
  `/auth/verify-email`.
- It must never render, log, store, or expose the verification token.

## Route Responsibility Split

Use these route meanings going forward:

```text
/verify-email?token=...
```

Email verification callback from backend email links.

```text
/auth/resend-verification
```

Resend verification email page.

## Routes To Avoid Reintroducing

Do not reintroduce:

```text
/auth/email-verify
/auth/verify-email
```

as frontend pages.

Reason:
- `/auth/email-verify` duplicated the verification callback responsibility.
- `/auth/verify-email` was ambiguous because the backend API endpoint already
  uses `/auth/verify-email`.

## Backend Endpoint Constants

The frontend route cleanup should not change backend endpoint constants:

```text
AUTH_API_ENDPOINTS.verifyEmail = "/auth/verify-email"
AUTH_API_ENDPOINTS.resendVerification = "/auth/resend-verification"
```

These are backend API paths, not app page routes.
