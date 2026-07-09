# Asancha Web

Asancha Web is the public/user frontend application for the Asancha platform.

It handles the public website, public marketplace, authentication, onboarding, public user dashboards, active business profile switching, account management, documents, verification, payments, reservations, bookings, conversations, notifications, AI recommendations, API partner application, and API partner dashboard.

This repository is for the public/user frontend only.

Admin and staff functionality belongs in the separate `asancha-admin` application.

---

## Application Identity

| Item              | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| Repository        | `asancha-web`                                                 |
| App Type          | Public/User Frontend                                          |
| Framework         | Next.js App Router                                            |
| Language          | TypeScript                                                    |
| Styling           | Tailwind CSS + CSS Modules                                    |
| Validation        | Zod + React Hook Form                                         |
| Package Manager   | npm                                                           |
| Production Domain | Public production domain configured in deployment environment |
| Hosting           | Vercel                                                        |

---

## Supported Users

This frontend supports:

```txt
guest
investor
property_owner
property_agent
property_sourcer
service_provider
api_partner
```

This frontend must not support staff/admin dashboard access.

Staff users belong in `asancha-admin`:

```txt
super_admin
admin
customer_care_rep
```

---

## Product Architecture

Asancha follows a 3-tier product architecture:

```txt
Frontend Layer
Backend API Layer
Database Layer
```

This repository belongs to the frontend layer.

The frontend guides users, displays state, shows progress, explains locked actions, and sends requests to the backend.

The backend remains the final authority for:

```txt
authentication
authorization
profile checks
policy checks
onboarding checks
verification checks
payment validation
reservation rules
booking rules
conversation access
API partner access
admin/staff permissions
audit rules
```

No important business rule should exist only on the frontend.

---

## Frontend Separation Rule

Asancha has two separate frontend applications:

```txt
asancha-web     -> public/user frontend
asancha-admin   -> admin/staff frontend
```

Do not combine them into one repository.

Do not create admin or staff routes inside `asancha-web`.

---

## Public Signup Rule

Public signup must use one route only:

```txt
/auth/sign-up
```

Do not create these routes:

```txt
/auth/sign-up/role
/auth/sign-up/account
```

Role selection, account details, and policy acceptance must be internal steps/components inside `/auth/sign-up`.

### Signup Flow

```txt
Step 1: Role Selection
Step 2: Account Details + Required Policy Acceptance + Submit
Step 3: Continue to Email Verification
```

### Allowed Public Signup Roles

```txt
investor
property_owner
property_agent
property_sourcer
service_provider
```

### Disallowed Signup Roles

```txt
guest
api_partner as ordinary signup
admin
customer_care_rep
super_admin
```

API partners must use the controlled API partner application flow:

```txt
/api-partner/apply
```

---

## Route Groups

The public/user frontend should be organised around these route groups:

```txt
/
public pages

/auth
authentication

/onboarding
user setup and role-specific onboarding

/dashboard
authenticated role dashboards

/account
authenticated account management

/marketplace
public marketplace and listing preview

/documents
authenticated document management

/verification
authenticated verification status and correction flow

/payments
authenticated payment reference and proof flow

/reservations
authenticated reservation flow

/bookings
authenticated booking flow

/conversations
authenticated conversations

/notifications
authenticated notification inbox

/recommendations
authenticated AI recommendations

/api-partner
API partner application and dashboard

/support
public/authenticated support entry
```

---

## Public Website Routes

```txt
/
/about
/how-it-works
/marketplace
/marketplace/[listingSlug]
/solutions/investors
/solutions/property-owners
/solutions/property-agents
/solutions/property-sourcers
/solutions/service-providers
/api-partners
/pricing
/contact
/support
/faqs
/legal
/legal/terms
/legal/privacy
/legal/platform-rules
/legal/data-processing
/cookies
```

---

## Authentication Routes

```txt
/auth/sign-up
/auth/sign-in
/auth/forgot-password
/auth/reset-password
/auth/verify-email
/auth/google
/auth/google/callback
/auth/suspended
/auth/unauthorized
```

---

## Authenticated User Routes

```txt
/dashboard
/dashboard/investor
/dashboard/property-owner
/dashboard/property-agent
/dashboard/property-sourcer
/dashboard/service-provider
/dashboard/api-partner

/account
/account/profile
/account/policies
/account/security
/account/notifications
/account/status
/account/support
/account/business-profiles/add
/account/business-profiles/[profilePublicId]

/documents
/documents/upload
/documents/[documentPublicId]
/documents/[documentPublicId]/replace

/verification
/verification/[verificationReviewPublicId]
/verification/[verificationReviewPublicId]/respond

/payments
/payments/[paymentPublicId]
/payments/references/[paymentReference]
/payments/references/[paymentReference]/submit-proof

/reservations
/reservations/[reservationPublicId]

/bookings
/bookings/new
/bookings/[bookingPublicId]
/bookings/[bookingPublicId]/reschedule

/conversations
/conversations/[conversationPublicId]

/notifications
/notifications/preferences

/recommendations
/recommendations/[recommendationPublicId]
/recommendations/[recommendationPublicId]/feedback
```

---

## API Partner Routes

```txt
/api-partner
/api-partner/apply
/api-partner/application-status
/api-partner/dashboard
/api-partner/client
/api-partner/keys
/api-partner/usage
/api-partner/webhooks
/api-partner/webhooks/new
/api-partner/webhooks/[webhookPublicId]
/api-partner/docs
/api-partner/billing
/api-partner/payments
/api-partner/support
```

API partner access must remain separate from ordinary public signup.

API keys must not be available before API partner approval.

Full API keys must not be repeatedly displayed after initial reveal.

---

## Dynamic Segment Naming Rules

Use public-safe identifiers in frontend routes.

Correct:

```txt
/marketplace/[listingSlug]
/documents/[documentPublicId]
/verification/[verificationReviewPublicId]
/payments/[paymentPublicId]
/payments/references/[paymentReference]
/reservations/[reservationPublicId]
/bookings/[bookingPublicId]
/conversations/[conversationPublicId]
/notifications/[notificationPublicId]
/recommendations/[recommendationPublicId]
/api-partner/webhooks/[webhookPublicId]
/account/business-profiles/[profilePublicId]
```

Avoid:

```txt
/[id]
/[_id]
/[mongoId]
/[objectId]
```

MongoDB `_id` must remain internal.

---

## Environment Variables

Create `.env.example` with browser-safe keys only.

```env
NEXT_PUBLIC_APP_NAME=Asancha
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_ADMIN_APP_URL=
NEXT_PUBLIC_ENVIRONMENT=production
```

Do not document sensitive, internal, or security-relevant production URLs directly in this public README.

Actual deployment values should be configured only inside the deployment environment.

Never expose secrets through `NEXT_PUBLIC_*`.

The frontend must not expose:

```txt
JWT secrets
database URLs
Stripe secret keys
webhook secrets
API key hashes
admin bootstrap secrets
mail provider secrets
storage secrets
full API keys after initial reveal
private document URLs
private KYC notes
internal admin notes
```

---

## Recommended Project Structure

```txt
asancha-web/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ loading.tsx
│  ├─ error.tsx
│  ├─ not-found.tsx
│  ├─ global-error.tsx
│  │
│  ├─ (public)/
│  ├─ auth/
│  ├─ onboarding/
│  ├─ dashboard/
│  ├─ account/
│  ├─ documents/
│  ├─ verification/
│  ├─ payments/
│  ├─ reservations/
│  ├─ bookings/
│  ├─ conversations/
│  ├─ notifications/
│  ├─ recommendations/
│  └─ api-partner/
│
├─ src/
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ layout/
│  │  ├─ business-profiles/
│  │  ├─ marketplace/
│  │  ├─ dashboard/
│  │  ├─ forms/
│  │  ├─ documents/
│  │  ├─ payments/
│  │  ├─ bookings/
│  │  ├─ conversations/
│  │  ├─ notifications/
│  │  └─ ai/
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ onboarding/
│  │  ├─ account/
│  │  ├─ dashboard/
│  │  ├─ marketplace/
│  │  ├─ properties/
│  │  ├─ listings/
│  │  ├─ documents/
│  │  ├─ verification/
│  │  ├─ payments/
│  │  ├─ reservations/
│  │  ├─ bookings/
│  │  ├─ conversations/
│  │  ├─ notifications/
│  │  ├─ recommendations/
│  │  └─ api-partner/
│  │
│  ├─ lib/
│  │  ├─ api/
│  │  ├─ auth/
│  │  ├─ env/
│  │  ├─ zod/
│  │  ├─ navigation/
│  │  ├─ formatters/
│  │  ├─ utils/
│  │  └─ constants/
│  │
│  ├─ styles/
│  ├─ types/
│  ├─ hooks/
│  ├─ store/
│  └─ middleware/
│
├─ public/
│  ├─ favicon.ico
│  ├─ icons/
│  ├─ images/
│  ├─ logo/
│  └─ robots.txt
│
├─ docs/
│  └─ standards/
│
├─ .env.example
├─ .env.local.example
├─ .gitignore
├─ .eslintrc.cjs
├─ .prettierrc
├─ components.json
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
├─ README.md
└─ middleware.ts
```

---

## Styling Rules

Use Tailwind CSS for:

```txt
layout
spacing
grid
flex
responsive behaviour
common utilities
simple visual states
```

Use CSS Modules for:

```txt
dashboard layout details
sidebar transitions
mobile drawer behaviour
modals
complex cards
marketplace listing polish
animation-heavy components
```

Example:

```txt
src/components/layout/dashboard-sidebar/
├─ dashboard-sidebar.tsx
└─ dashboard-sidebar.module.css
```

---

## API and Backend State Rules

The frontend must use backend-provided state for important decisions.

Important backend-driven state includes:

```txt
accountStatus
emailVerificationStatus
generalProfileStatus
activeBusinessProfileType
activeBusinessProfileStatus
onboardingStatus
verificationStatus
documentStatusSummary
policyAcceptanceStatus
paymentStatusSummary
lockedActions
unlockedActions
pendingActions
availableBusinessProfiles
activeBusinessProfileSummary
notificationSummary
recommendationSummary
```

The frontend may guide and redirect users, but it must not replace backend enforcement.

---

## Marketplace Safety Rules

Marketplace listing cards may show:

```txt
title
location summary
property type
price where public
cover image
listing category
safe high-level metrics
basic status
save action where logged in
view details action
```

Marketplace listing cards must not show:

```txt
private deal pack
seller private details
investor private data
sensitive documents
internal notes
restricted AI analysis
private payment data
```

---

## Payment Safety Rule

Payment proof submission does not mean payment approval.

Use safe wording such as:

```txt
Your payment proof has been submitted for review. This does not mean the payment has been approved yet.
```

---

## AI Safety Rule

AI recommendations are guidance only.

Use safe wording such as:

```txt
AI recommendations are for guidance only. They do not guarantee rental income, capital growth, financing approval, legal outcome, refurb cost, or sale completion.
```

---

## Middleware Protection Groups

Recommended middleware route groups:

```txt
/dashboard/:path*
/account/:path*
/documents/:path*
/verification/:path*
/payments/:path*
/reservations/:path*
/bookings/:path*
/conversations/:path*
/notifications/:path*
/recommendations/:path*
/api-partner/dashboard/:path*
/api-partner/client/:path*
/api-partner/keys/:path*
/api-partner/usage/:path*
/api-partner/webhooks/:path*
/api-partner/billing/:path*
/api-partner/payments/:path*
```

Middleware may guide redirects, but backend enforcement remains final.

---

## Error and Empty State Rules

The app should support:

```txt
404 Not Found
403 Forbidden
401 Unauthorized
500 Server Error
Network Error
Maintenance Mode
Session Expired
```

Safe messages:

```txt
We could not find that page.
You do not have permission to view this page.
Your session has expired. Please sign in again.
Something went wrong. Please try again.
We could not connect to Asancha. Please check your connection and try again.
```

Never expose:

```txt
stack traces
MongoDB ObjectIds
raw backend errors
internal route names
provider payloads
secrets
private KYC notes
internal admin notes
```

---

## Required Commands

```bash
npm run lint
npm run typecheck
npm run build
```

If a test framework is added:

```bash
npm run test
npm run test:e2e
```

---

## Deployment

This app is intended to be deployed on Vercel.

Production domain should be configured in the Vercel project settings and environment variables.

Build command:

```bash
npm run build
```

Install command:

```bash
npm install
```

Before deployment, confirm:

```txt
production environment variables are configured
public app URL is configured in the deployment environment
API base URL is configured in the deployment environment
admin app URL is configured in the deployment environment
no sensitive production URLs are exposed in public documentation
no secrets are exposed
robots and metadata are correct
public pages render without auth
authenticated routes redirect safely
npm run lint passes
npm run typecheck passes
npm run build passes
```

---

## Do Not Do

Do not:

```txt
1. Create admin/staff routes inside asancha-web.
2. Create /auth/sign-up/role.
3. Create /auth/sign-up/account.
4. Treat API Partner as an ordinary signup role.
5. Treat guest as a registered user role.
6. Expose MongoDB ObjectIds.
7. Expose admin notes.
8. Expose private KYC notes.
9. Expose restricted document URLs.
10. Expose full API keys after initial reveal.
11. Store secrets in NEXT_PUBLIC_* variables.
12. Let frontend checks replace backend enforcement.
13. Hide locked actions without explanation where user guidance is needed.
14. Say onboarding completion means full verification approval.
15. Say payment proof means payment approval.
16. Present AI recommendations as guaranteed outcomes.
17. Build public routes inside asancha-admin.
18. Build staff routes inside asancha-web.
19. Reintroduce content/marketing modules as active frontend implementation scope.
20. Use broad agent wording for property_owner/property_agent/property_sourcer.
21. Document sensitive production URLs in public-facing project files.
```

---

## Completion Checklist

The public/user frontend is implementation-ready when:

```txt
- asancha-web repository exists.
- Next.js App Router is configured.
- Tailwind CSS is configured.
- CSS Modules are supported.
- Zod + React Hook Form are installed.
- API client is implemented.
- Auth screens are implemented.
- Signup is one-route multi-step.
- Public pages are implemented.
- Marketplace safe preview is implemented.
- Onboarding flow is implemented.
- Dashboard resolver is implemented.
- Role dashboards exist.
- Business profile switcher modal exists.
- Add business profile drawer exists.
- Account screens exist.
- Documents and verification screens exist.
- Payments screens exist.
- Reservations screens exist.
- Bookings screens exist.
- Conversations screens exist.
- Notifications screens exist.
- AI recommendations screens exist.
- API partner screens exist.
- Error/empty/loading/locked states exist.
- Mobile top bar and drawer exist.
- Public IDs/slugs are used in routes.
- No admin/staff route exists.
- No sensitive production URLs are exposed in public documentation.
- npm run lint passes.
- npm run typecheck passes.
- npm run build passes.
```

---

## Implementation Order

```txt
0. Repository preparation
1. Frontend foundation and configuration
2. Shared UI primitives and styling foundation
3. API client, response handling, auth session, and route guards
4. Public layout, public pages, header, footer, and SEO foundation
5. Authentication screens and signup flow
6. Email verification, password reset, suspended, and unauthorized screens
7. Onboarding shell and general profile setup
8. Role-specific onboarding flows
9. Dashboard shell and dashboard-state
10. Business Profile Switcher modal and Add Business Profile drawer
11. Account screens
12. Marketplace and public listing detail
13. Role dashboard overview screens
14. Role-specific workspace modules
15. Documents and verification
16. Payments and payment references
17. Reservations
18. Bookings
19. Conversations
20. Notifications and notification preferences
21. AI recommendations and feedback
22. API partner application and dashboard
23. Error, empty, locked, loading, and accessibility hardening
24. Testing and QA
25. Vercel deployment preparation
```
