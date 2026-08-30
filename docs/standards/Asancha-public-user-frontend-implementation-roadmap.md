# Asancha Public/User Frontend Implementation Roadmap

**Version:** v1.0 - Developer Implementation Draft  
**Frontend App:** `asancha-web`  
**Domain:** `https://asancha.co.uk`  
**Framework:** Next.js App Router  
**Validation:** Zod + React Hook Form  
**Styling:** Tailwind CSS + CSS Modules  
**Package Manager:** npm  
**Audience:** guest, investor, property_owner, property_agent, property_sourcer, service_provider, api_partner  
**Excluded Audience:** super_admin, admin, customer_care_rep  

---

## 1. Purpose

This document defines the implementation roadmap for building the Asancha public/user frontend application.

This roadmap is for:

```txt
asancha-web
```

It is not for:

```txt
asancha-admin
asancha-api
asancha-worker
```

The purpose is to guide the manual implementation of the public/user frontend in a controlled build order so that the application is implemented cleanly, safely, and in alignment with the approved Asancha frontend rules, route map, screen behaviour, onboarding rules, backend endpoint rules, and business rules.

The frontend must guide users clearly, but it must not become the final security or business-rule authority. Backend enforcement remains final for authentication, authorization, profile checks, policy checks, verification checks, payment validation, reservation rules, booking rules, conversations, API partner rules, admin permissions, and audit rules.

---

## 2. Source-of-Truth Rule

When documents conflict, follow this order:

```txt
1. Functional Business Rules Master Document
2. Database Schema Rules
3. API Endpoint Rules
4. Onboarding Rules
5. UX Business Rules
6. Frontend Screen Behaviour
7. Engineering Code Standards
8. Email Templates
9. Notification Events and Templates
10. Event and Background Jobs
11. Audit Log and Compliance Traceability
12. Revised Project Structure
13. Web Route & Navigation Map
14. Web Frontend Project Structure
15. This Public/User Frontend Implementation Roadmap
```

This roadmap explains the execution order. It does not override the approved business rules.

---

## 3. Implementation Philosophy

Build `asancha-web` as a serious public/user frontend, not as a simple landing page.

Follow these principles:

```txt
1. Build the foundation first.
2. Do not start from dashboard screens before layout, API client, auth, and route protection are ready.
3. Keep asancha-web separate from asancha-admin.
4. Do not create admin/staff routes in asancha-web.
5. Public signup must remain one route: /auth/sign-up.
6. /auth/sign-up/role and /auth/sign-up/account must not exist as separate routes.
7. Business Profiles must be modal-first through the Active Business Profile Switcher.
8. Existing users must add additional business profiles without registering again.
9. Use public IDs and slugs in frontend routes.
10. Do not expose MongoDB ObjectIds.
11. Use backend dashboard-state for locked/unlocked/pending actions.
12. Show locked actions with clear reasons and next steps.
13. Dashboard access does not mean full action approval.
14. Payment proof submission does not mean payment approval.
15. AI recommendations must not imply guaranteed financial, legal, investment, rental, resale, or completion outcomes.
16. API partner access must remain controlled and separate from ordinary signup.
17. Frontend route protection guides UX only; backend enforcement remains final.
```

---

## 4. High-Level Implementation Order

Implement the public/user frontend in this order:

```txt
0. Repository preparation and developer documentation
1. Frontend foundation and configuration
2. Shared UI primitives and styling foundation
3. API client, response handling, auth session, and route guards
4. Public layout, public pages, header, footer, and SEO foundation
5. Authentication screens and signup flow
6. Email verification, password reset, and suspended/unauthorized screens
7. Onboarding shell and general profile setup
8. Role-specific onboarding flows
9. Dashboard shell, dashboard-state, top bar, sidebar, mobile drawer
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

---

## 5. Implementation Block 0 - Repository Preparation and Developer Documentation

### Goal

Prepare the `asancha-web` repository so the approved frontend direction is documented before implementation starts.

### Tasks

```txt
1. Create or confirm the asancha-web repository.
2. Add README.md with project purpose.
3. Add docs/ folder.
4. Add docs/project/PROJECT_STATE.md.
5. Add docs/project/IMPLEMENTATION_RULES.md.
6. Add docs/project/IMPLEMENTATION_PRIORITY.md.
7. Add docs/standards/ for frontend business rules and route maps.
8. Add the approved Web Route & Navigation Map.
9. Add the approved Web Frontend Project Structure.
10. Add note that admin/staff routes must never be created in asancha-web.
```

### Files/Folders

```txt
asancha-web/
├─ docs/
│  ├─ project/
│  │  ├─ PROJECT_STATE.md
│  │  ├─ IMPLEMENTATION_RULES.md
│  │  └─ IMPLEMENTATION_PRIORITY.md
│  └─ standards/
│     ├─ frontend-functional-business-rules.md
│     ├─ web-route-navigation-map.md
│     ├─ web-screen-behaviour.md
│     └─ web-frontend-project-structure.md
```

### Developer Checkpoint

```txt
- asancha-web exists as a separate repo.
- README.md states this is the public/user frontend.
- docs/project/PROJECT_STATE.md exists.
- docs/project/IMPLEMENTATION_RULES.md exists.
- No admin/staff route appears in the project.
- /auth/sign-up/role and /auth/sign-up/account are not created.
```

---

## 6. Implementation Block 1 - Frontend Foundation and Configuration

### Goal

Create the Next.js project foundation with TypeScript, Tailwind CSS, CSS Modules, Zod, React Hook Form, and npm.

### Tasks

```txt
1. Initialise Next.js App Router project.
2. Configure TypeScript.
3. Configure Tailwind CSS.
4. Configure CSS Modules usage.
5. Configure ESLint and Prettier.
6. Add Zod.
7. Add React Hook Form.
8. Add @hookform/resolvers.
9. Add clsx and tailwind-merge.
10. Add lucide-react.
11. Add date-fns.
12. Add optional TanStack Query or chosen request-state approach.
13. Add optional Zustand if global client state is needed.
14. Add environment variable validation.
15. Add root error/loading/not-found/global-error files.
```

### Required Dependencies

```bash
npm install zod react-hook-form @hookform/resolvers
npm install clsx tailwind-merge
npm install lucide-react
npm install date-fns
```

Optional:

```bash
npm install @tanstack/react-query
npm install zustand
```

### Root Files

```txt
asancha-web/
├─ app/
├─ src/
├─ public/
├─ .env.example
├─ .gitignore
├─ .eslintrc.cjs
├─ .prettierrc
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
├─ README.md
└─ middleware.ts
```

### Environment Variables

```env
NEXT_PUBLIC_APP_NAME=Asancha
NEXT_PUBLIC_APP_URL=https://asancha.co.uk
NEXT_PUBLIC_API_BASE_URL=https://api.asancha.co.uk/api/v1
NEXT_PUBLIC_ADMIN_APP_URL=https://admin.asancha.co.uk
NEXT_PUBLIC_ENVIRONMENT=production
```

### Safety Rule

Never expose secrets through `NEXT_PUBLIC_*`.

The frontend must not expose JWT secrets, database URLs, Stripe secret keys, webhook secrets, API key hashes, admin bootstrap secrets, mail provider secrets, storage secrets, full API keys after initial reveal, or private document URLs.

---

## 7. Implementation Block 2 - Shared UI Primitives and Styling Foundation

### Goal

Build the reusable UI layer before building feature screens.

### Tasks

```txt
1. Create shared UI components.
2. Create layout shell components.
3. Create form components.
4. Create status badges.
5. Create loading/skeleton components.
6. Create modal and drawer primitives.
7. Create toast/alert primitives.
8. Create empty-state and error-state components.
9. Create locked-action component.
10. Create accessible file upload primitive.
```

### Files/Folders

```txt
src/components/ui/
├─ button/
├─ input/
├─ select/
├─ checkbox/
├─ dialog/
├─ drawer/
├─ modal/
├─ table/
├─ badge/
├─ card/
├─ tabs/
├─ toast/
├─ alert/
├─ skeleton/
├─ empty-state/
├─ error-state/
└─ locked-action/
```

### Styling Rule

Use Tailwind for:

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

### Developer Checkpoint

```txt
- Shared UI components exist before feature screens.
- Components use accessible labels.
- Modals and drawers support keyboard escape/close behaviour.
- Status badges do not rely on colour alone.
- Empty and error state components exist.
```

---

## 8. Implementation Block 3 - API Client, Auth Session, and Route Guards

### Goal

Create a safe frontend API layer before connecting pages.

### Tasks

```txt
1. Create api-client.ts.
2. Create api-error.ts.
3. Create api-response.ts.
4. Create auth-fetch.ts.
5. Create safe redirect utility.
6. Create route constants.
7. Create auth session helpers.
8. Create role/profile route guards.
9. Create onboarding redirect helpers.
10. Create dashboard-state fetch hook.
```

### Files/Folders

```txt
src/lib/api/
├─ api-client.ts
├─ api-error.ts
├─ api-response.ts
├─ api-routes.ts
└─ auth-fetch.ts

src/lib/auth/
├─ auth-session.ts
├─ auth-cookies.ts
├─ auth-guards.ts
└─ role-guards.ts

src/lib/utils/
├─ routes.ts
├─ safe-redirect.ts
├─ public-id.ts
└─ permissions.ts
```

### Required Behaviour

The frontend must use backend-provided state for important decisions.

Key state includes:

```txt
account status
email verification status
general profile status
active business profile
onboarding status
verification status
document status
policy acceptance
payment status
locked actions
unlocked actions
pending actions
available business profiles
```

### Developer Checkpoint

```txt
- API client wraps the Asancha response envelope.
- Backend errors are displayed safely.
- No raw stack trace is rendered.
- No MongoDB ObjectId is shown in user-facing UI.
- Route guards do not replace backend enforcement.
```

---

## 9. Implementation Block 4 - Public Layout, Header, Footer, and Public Pages

### Goal

Build the public website foundation.

### Routes

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

### Tasks

```txt
1. Create public layout.
2. Create public header.
3. Create public footer.
4. Create homepage sections.
5. Create role solution pages.
6. Create API partners public page.
7. Create legal/policy pages.
8. Create support/contact pages.
9. Add public SEO metadata.
10. Add public loading and not-found states.
```

### Public Header

Launch version:

```txt
Logo
Marketplace
How It Works
Solutions
API Partners
Contact
Sign In
Get Started
```

If pricing is ready:

```txt
Logo
Marketplace
How It Works
Solutions
API Partners
Pricing
Contact
Sign In
Get Started
```

### Do Not Add to Primary Header

```txt
Trust & Verification
AI Property Intelligence
FAQs
Legal
Support
Resources
Case Studies
```

These may appear in the footer or relevant page sections, but not as primary header items.

### Developer Checkpoint

```txt
- Public header is lean.
- Role pages are under Solutions.
- Guests cannot see dashboard/account links.
- Public pages do not expose private documents, private deal packs, API keys, admin tools, or audit logs.
```

---

## 10. Implementation Block 5 - Authentication Screens and Signup Flow

### Goal

Implement public authentication correctly.

### Routes

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

### Critical Signup Rule

Public signup is one route only:

```txt
/auth/sign-up
```

Do not create:

```txt
/auth/sign-up/role
/auth/sign-up/account
```

Those are internal components inside `/auth/sign-up`, not routes.

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

### API Partner Separation

API partner must use:

```txt
/api-partner/apply
```

not:

```txt
/auth/sign-up with selectedRole = api_partner
```

### Files/Folders

```txt
app/auth/sign-up/
├─ page.tsx
└─ _components/
   ├─ signup-flow.tsx
   ├─ role-selection-step.tsx
   ├─ account-details-step.tsx
   ├─ email-verification-step.tsx
   └─ policy-checkbox-list.tsx

src/features/auth/
├─ api/auth.api.ts
├─ schemas/sign-up.schema.ts
├─ schemas/sign-in.schema.ts
├─ schemas/forgot-password.schema.ts
├─ schemas/reset-password.schema.ts
├─ hooks/use-sign-up.ts
├─ hooks/use-sign-in.ts
└─ types/auth.types.ts
```

### Developer Checkpoint

```txt
- Signup route is only /auth/sign-up.
- Signup role/account/policy are internal components.
- Policy checkboxes are not pre-selected.
- Account creation cannot submit without required policies.
- API Partner appears as a separate CTA.
- Google signup does not silently select a role.
```

---

## 11. Implementation Block 6 - Email Verification, Password Reset, Suspended, and Unauthorized Screens

### Goal

Complete the authentication support screens.

### Tasks

```txt
1. Build verify email screen.
2. Build resend verification action.
3. Build forgot password screen.
4. Build reset password screen.
5. Build suspended account screen.
6. Build unauthorized screen.
7. Add safe auth error messages.
8. Add backend-state redirect handling after sign-in.
```

### Redirect Logic After Sign-In

```txt
email not verified -> /auth/verify-email
general profile incomplete -> /onboarding/general-profile
role-specific onboarding incomplete -> relevant /onboarding/[role]
minimum setup complete -> /dashboard
suspended -> /auth/suspended or /account/status
```

### Developer Checkpoint

```txt
- Forgot password does not reveal whether email exists.
- Reset password handles invalid/expired token safely.
- Verify email screen allows resend.
- Suspended screen gives safe next steps.
- Unauthorized screen does not reveal hidden resources.
```

---

## 12. Implementation Block 7 - Onboarding Shell and General Profile Setup

### Goal

Implement onboarding structure and the general profile setup before role-specific onboarding.

### Routes

```txt
/onboarding
/onboarding/general-profile
/onboarding/status
/onboarding/pending-verification
/onboarding/correction-required
```

### Tasks

```txt
1. Create onboarding layout.
2. Create onboarding route resolver.
3. Build general profile setup form.
4. Add Zod schema for general profile.
5. Add save/continue behaviour.
6. Add onboarding status page.
7. Add pending verification screen.
8. Add correction required screen.
9. Add safe backend error display.
```

### General Profile Fields

```txt
firstName
lastName
displayName
phoneNumber
preferredContactMethod
profileImageUrl optional
residentialAddress where required
nationality where required
dateOfBirth where required
```

### Developer Checkpoint

```txt
- General profile is separate from role-specific business profile.
- Email verification happens before full onboarding.
- User understands this is not business-role setup.
- Pending verification does not block basic dashboard access where backend permits.
```

---

## 13. Implementation Block 8 - Role-Specific Onboarding Flows

### Goal

Implement onboarding for public business profile types.

### Routes

```txt
/onboarding/investor
/onboarding/property-owner
/onboarding/property-agent
/onboarding/property-sourcer
/onboarding/service-provider
/onboarding/api-partner
```

### Tasks

```txt
1. Build investor onboarding.
2. Build property owner onboarding.
3. Build property agent onboarding.
4. Build property sourcer onboarding.
5. Build service provider onboarding.
6. Build API partner onboarding/application context.
7. Add Zod schemas for each onboarding form.
8. Add policy acceptance support where needed.
9. Add document-needed explanation.
10. Add submit and pending-verification behaviour.
```

### Important Rule

Onboarding completion must not say:

```txt
Your account is fully approved.
```

Correct message:

```txt
Your setup has been submitted. You can access your dashboard while verification continues.
```

### Developer Checkpoint

```txt
- Onboarding completion does not equal verification approval.
- Role-specific forms do not overload general profile setup.
- API partner flow remains controlled.
- Profile-level policy acceptance is supported where required.
```

---

## 14. Implementation Block 9 - Dashboard Shell and Dashboard State

### Goal

Build authenticated dashboard layout and connect it to backend dashboard-state.

### Routes

```txt
/dashboard
/dashboard/investor
/dashboard/property-owner
/dashboard/property-agent
/dashboard/property-sourcer
/dashboard/service-provider
/dashboard/api-partner
```

### Dashboard Resolver

```txt
/dashboard
```

Resolves to:

```txt
active investor profile -> /dashboard/investor
active property_owner profile -> /dashboard/property-owner
active property_agent profile -> /dashboard/property-agent
active property_sourcer profile -> /dashboard/property-sourcer
active service_provider profile -> /dashboard/service-provider
active api_partner profile -> /api-partner/dashboard
no complete profile -> /onboarding
```

### Dashboard Layout

```txt
Desktop Dashboard
├─ Top Bar
├─ Role-Specific Sidebar
└─ Main Content

Mobile Dashboard
├─ Mobile Top Bar
├─ Main Content
├─ Mobile Navigation Drawer
└─ Optional Bottom Quick Bar
```

### Desktop Top Bar

```txt
Logo
Marketplace
Active Business Profile Switcher
Search
Notifications
Help / Support
Account Avatar Menu
```

### Mobile Top Bar

```txt
Logo
Active Business Profile Switcher
Notifications Bell
Menu Button
```

### Developer Checkpoint

```txt
- /dashboard resolves by active business profile.
- Sidebar changes by active role.
- Mobile drawer replaces desktop sidebar.
- Backend dashboard-state powers locked/unlocked/pending actions.
- Dashboard access does not mean full action approval.
```

---

## 15. Implementation Block 10 - Business Profile Switcher Modal and Add Business Profile Drawer

### Goal

Implement active business profile switching and additional profile creation UX.

### Main UX

```txt
Top Bar
└─ Active Business Profile Switcher
   └─ Business Profiles Modal
      └─ Add New Business Profile
         └─ Add Business Profile Drawer
```

### Add Route

```txt
/account/business-profiles/add
```

Optional fallback/detail route:

```txt
/account/business-profiles/[profilePublicId]
```

### Modal Shows

```txt
business profile image/logo/avatar
business profile type
business profile name
verification status
onboarding status
active marker
switch button
continue setup button where needed
add new business profile button
```

### Drawer Options

```txt
Investor
Property Owner
Property Agent
Property Sourcer
Service Provider
API Partner where permitted
```

### Developer Checkpoint

```txt
- Business Profiles is not a normal account menu page.
- Modal opens from Active Business Profile Switcher.
- Add New Business Profile opens drawer first.
- Existing users are not sent back to registration.
- Selected profile type routes to /account/business-profiles/add.
```

---

## 16. Implementation Block 11 - Account Screens

### Goal

Implement core account management.

### Routes

```txt
/account
/account/profile
/account/policies
/account/security
/account/notifications
/account/status
/account/support
/account/business-profiles/add
/account/business-profiles/[profilePublicId]
```

### My Account Menu

```txt
Profile
Policies
Security
Notification Preferences
Account Status
Support
Logout
```

### Security Page

Single route:

```txt
/account/security
```

Cards:

```txt
Password
Email address
Active sessions
Login activity
Security notifications
```

### Developer Checkpoint

```txt
- Email change is handled inside /account/security.
- Password change is handled inside /account/security.
- Business Profiles is not a normal menu item.
- Account screens do not expose internal IDs, private KYC notes, or admin notes.
```

---

## 17. Implementation Block 12 - Marketplace and Public Listing Detail

### Goal

Implement safe public marketplace browsing.

### Routes

```txt
/marketplace
/marketplace/[listingSlug]
```

### Marketplace Must Show

```txt
search
filters
listing cards
sort
pagination or infinite loading
empty state
restricted-data explanation
```

### Listing Card May Show

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

### Listing Card Must Not Show

```txt
private deal pack
seller private details
investor private data
sensitive documents
internal notes
restricted AI analysis
private payment data
```

### Developer Checkpoint

```txt
- Guests can browse safe listing previews.
- Sensitive sections are gated.
- Listing detail uses listingSlug, not MongoDB _id.
- Restricted sections show safe explanations.
```

---

## 18. Implementation Block 13 - Role Dashboard Overview Screens

### Goal

Build the first dashboard page for each role.

### Routes

```txt
/dashboard/investor
/dashboard/property-owner
/dashboard/property-agent
/dashboard/property-sourcer
/dashboard/service-provider
```

### Shared Dashboard Cards

```txt
active profile card
onboarding status
verification status
document status summary
policy status
payment status
pending actions
locked actions
recent notifications
recent activity where relevant
quick actions
```

### Developer Checkpoint

```txt
- Every dashboard clearly shows active business profile.
- Locked actions explain why and what to do next.
- Pending verification users can still see dashboard where backend permits.
- No dashboard exposes admin-only information.
```

---

## 19. Implementation Block 14 - Role-Specific Workspace Modules

### Goal

Build each public role’s sidebar pages.

### Investor

```txt
Overview
Opportunities
Saved Properties
AI Recommendations
Reservations
Bookings
Payments
Documents
Verification
Preferences
```

### Property Owner

```txt
Overview
My Properties
My Listings
Documents
Verification
Bookings
Conversations
Payments
```

### Property Agent

```txt
Overview
Company
Properties
Listings
Authority Documents
Documents
Verification
Bookings
Conversations
Payments
```

### Property Sourcer

```txt
Overview
Deals
Deal Packs
Compliance
Documents
Verification
Bookings
Conversations
Payments
Performance
```

### Service Provider

```txt
Overview
Service Profile
Services
Bookings
Documents
Verification
Conversations
Payments
```

### Developer Checkpoint

```txt
- Sidebar is role-specific.
- Pages are scoped to active business profile.
- Users cannot access another profile’s private workspace data.
- Empty states exist for every list screen.
```

---

## 20. Implementation Block 15 - Documents and Verification

### Goal

Implement document upload, replacement, verification status, and correction flow.

### Routes

```txt
/documents
/documents/upload
/documents/[documentPublicId]
/documents/[documentPublicId]/replace

/verification
/verification/[verificationReviewPublicId]
/verification/[verificationReviewPublicId]/respond
```

### Document Statuses

```txt
pending
approved
rejected
on_hold
replacement_required
```

### Must Not Show

```txt
internal admin notes
private KYC notes
raw risk notes
private storage URLs
MongoDB ObjectIds
```

### Developer Checkpoint

```txt
- Document upload supports loading/success/error.
- Replacement required state is clear.
- Verification correction uses safe user-facing message.
- Internal admin notes never appear in user dashboard.
```

---

## 21. Implementation Block 16 - Payments and Payment References

### Goal

Implement payment reference display and proof submission.

### Routes

```txt
/payments
/payments/[paymentPublicId]
/payments/references/[paymentReference]
/payments/references/[paymentReference]/submit-proof
```

### Important Rule

Payment proof submission does not mean payment approval.

Safe message:

```txt
Your payment proof has been submitted for review. This does not mean the payment has been approved yet.
```

### Developer Checkpoint

```txt
- Payment references are shown clearly.
- Proof upload does not mark payment as paid.
- Payment status labels match backend state.
- Sensitive payment details are not exposed.
```

---

## 22. Implementation Block 17 - Reservations

### Goal

Implement reservation list and detail flow.

### Routes

```txt
/reservations
/reservations/[reservationPublicId]
```

### Reservation Statuses

```txt
pending
payment_pending
reserved
expired
cancelled
completed
```

### Locked Reasons

```txt
listing not published
deal already reserved
investor verification pending
proof of funds not approved
reservation payment required
payment not verified
account suspended
```

### Developer Checkpoint

```txt
- Reservation action depends on backend permission.
- Reservation cards show status, payment status, expiry, and next action.
- Expired/cancelled reservations are handled safely.
```

---

## 23. Implementation Block 18 - Bookings

### Goal

Implement user booking screens.

### Routes

```txt
/bookings
/bookings/new
/bookings/[bookingPublicId]
/bookings/[bookingPublicId]/reschedule
```

### Booking Screens Should Show

```txt
upcoming bookings
pending invitations
past bookings
cancelled bookings
booking detail
participants summary
location or meeting link
respond/reschedule/cancel actions where allowed
```

### Developer Checkpoint

```txt
- Booking participants are displayed safely.
- Private contact details are not shown unless allowed.
- Reschedule/cancel actions depend on backend permission.
```

---

## 24. Implementation Block 19 - Conversations

### Goal

Implement public/user conversations.

### Routes

```txt
/conversations
/conversations/[conversationPublicId]
```

### Conversation Types

```txt
deal
support
verification
api_partner
property_submission
reservation
payment
booking
document_review
```

### Must Not Show

```txt
internal admin notes
staff-only notes
private KYC notes
restricted documents
```

### Developer Checkpoint

```txt
- Conversation list shows type, related item, preview, status, and unread count.
- Conversation detail shows safe messages only.
- Access denied message is safe.
```

---

## 25. Implementation Block 20 - Notifications and Preferences

### Goal

Implement notification bell, inbox, filters, read/unread, dismiss, and preferences.

### Routes

```txt
/notifications
/notifications/preferences
/account/notifications
```

### Must Support

```txt
unread count
latest dropdown
all notifications
unread notifications
read notifications
category filter
priority filter
mark as read
mark as unread
dismiss
read all
open related item
preferences
```

### Developer Checkpoint

```txt
- Notifications use public IDs and safe URLs.
- Notifications do not expose private KYC notes, secrets, internal notes, restricted document URLs, or ObjectIds.
- Notification preferences are available in /account/notifications.
```

---

## 26. Implementation Block 21 - AI Recommendations and Feedback

### Goal

Implement AI recommendation screens safely.

### Routes

```txt
/recommendations
/recommendations/[recommendationPublicId]
/recommendations/[recommendationPublicId]/feedback
```

### Recommendation Card Should Show

```txt
listing summary
match score
confidence level
main reasons
warnings
recommended action
save button
dismiss button
feedback button
AI disclaimer
```

### Safe AI Message

```txt
AI recommendations are for guidance only. They do not guarantee rental income, capital growth, financing approval, legal outcome, refurb cost, or sale completion.
```

### Developer Checkpoint

```txt
- AI output is explainable.
- AI does not sound like financial/legal/investment advice.
- Feedback options are implemented.
- Locked recommendation actions show backend-provided reasons.
```

---

## 27. Implementation Block 22 - API Partner Application and Dashboard

### Goal

Implement API partner application and approved API partner workspace.

### Routes

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

### API Partner Rule

API Partner must not use ordinary public signup.

API access must be approved before API keys can be created.

### Must Not Show

```txt
admin documentation
staff endpoints
audit endpoints
internal payment review endpoints
internal verification review endpoints
internal document review endpoints
private user management endpoints
super admin operations
```

### Developer Checkpoint

```txt
- API partner apply route exists.
- API partner is not a normal signup role.
- API key screens are locked until approval.
- Full API key is not repeatedly displayed.
- Partner docs are partner-safe only.
```

---

## 28. Implementation Block 23 - Error, Empty, Locked, Loading, and Accessibility Hardening

### Goal

Make the app feel complete and safe.

### Required Error Screens

```txt
404 Not Found
403 Forbidden
401 Unauthorized
500 Server Error
Network Error
Maintenance Mode
Session Expired
```

### Form Behaviour

All forms should support:

```txt
required field validation
inline error messages
save progress where relevant
disabled submit while loading
clear success message
safe backend error display
unsaved changes warning where relevant
```

### Developer Checkpoint

```txt
- Every major list has empty state.
- Every form has safe validation errors.
- Every locked action explains reason and next step.
- Loading states exist for important async actions.
- Mobile navigation works.
- Keyboard navigation works.
- No colour-only status communication.
```

---

## 29. Implementation Block 24 - Testing and QA

### Goal

Add practical tests and checks before deployment.

### Test Areas

```txt
public header and footer
signup flow
sign-in redirects
email verification screen
onboarding route resolver
general profile form
role-specific onboarding forms
dashboard resolver
business profile switcher modal
add profile drawer
account security page
marketplace filters
listing detail restricted sections
documents upload/replace flow
verification correction flow
payment proof submission
reservation status display
booking list/detail
conversation list/detail
notification bell/inbox/preferences
AI recommendation disclaimer and feedback
API partner locked states
error and empty states
```

### Commands

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

### Developer Checkpoint

```txt
- npm run lint passes.
- npm run typecheck passes.
- npm run build passes.
- No admin/staff routes exist.
- No signup subroutes exist.
- No ObjectIds are displayed.
- Safe error states are present.
```

---

## 30. Implementation Block 25 - Vercel Deployment Preparation

### Goal

Prepare `asancha-web` for deployment to Vercel.

### Tasks

```txt
1. Confirm production environment variables.
2. Confirm NEXT_PUBLIC_API_BASE_URL.
3. Confirm admin app URL.
4. Confirm build command.
5. Confirm output is Vercel-compatible.
6. Confirm domain asancha.co.uk.
7. Confirm no secrets are exposed.
8. Confirm robots and metadata.
9. Confirm public pages render without auth.
10. Confirm authenticated routes redirect safely.
```

### Vercel Project

```txt
Vercel project: asancha-web
Production domain: https://asancha.co.uk
Framework: Next.js
```

### Build Commands

```bash
npm install
npm run build
```

---

## 31. Developer “Do Not Do” List

Do not:

```txt
1. Create admin/staff routes inside asancha-web.
2. Create /auth/sign-up/role.
3. Create /auth/sign-up/account.
4. Treat API Partner as ordinary signup role.
5. Treat guest as registered user role.
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
```

---

## 32. Completion Checklist

Before the public/user frontend is considered implementation-ready:

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
- npm run lint passes.
- npm run typecheck passes.
- npm run build passes.
```

---

## 33. Final Implementation Sequence Summary

```txt
0. Repository preparation and developer documentation
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

This is the developer-focused working direction for the Asancha Public/User Frontend Implementation Roadmap v1.0.
