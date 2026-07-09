asancha-web/
├─ app/
│ ├─ layout.tsx
│ ├─ page.tsx
│ ├─ loading.tsx
│ ├─ error.tsx
│ ├─ not-found.tsx
│ ├─ global-error.tsx
│ │
│ ├─ (public)/
│ │ ├─ layout.tsx
│ │ ├─ about/page.tsx
│ │ ├─ how-it-works/page.tsx
│ │ ├─ marketplace/
│ │ │ ├─ page.tsx
│ │ │ └─ [listingSlug]/page.tsx
│ │ ├─ solutions/
│ │ │ ├─ investors/page.tsx
│ │ │ ├─ property-owners/page.tsx
│ │ │ ├─ property-agents/page.tsx
│ │ │ ├─ property-sourcers/page.tsx
│ │ │ └─ service-providers/page.tsx
│ │ ├─ api-partners/page.tsx
│ │ ├─ pricing/page.tsx
│ │ ├─ contact/page.tsx
│ │ ├─ support/page.tsx
│ │ ├─ faqs/page.tsx
│ │ ├─ legal/
│ │ │ ├─ page.tsx
│ │ │ ├─ terms/page.tsx
│ │ │ ├─ privacy/page.tsx
│ │ │ ├─ platform-rules/page.tsx
│ │ │ └─ data-processing/page.tsx
│ │ └─ cookies/page.tsx
│ │
│ ├─ auth/
│ │ ├─ layout.tsx
│ │ ├─ sign-up/
│ │ │ ├─ page.tsx
│ │ │ └─ \_components/
│ │ │ ├─ signup-flow.tsx
│ │ │ ├─ role-selection-step.tsx
│ │ │ ├─ account-details-step.tsx
│ │ │ ├─ email-verification-step.tsx
│ │ │ └─ policy-checkbox-list.tsx
│ │ ├─ sign-in/page.tsx
│ │ ├─ forgot-password/page.tsx
│ │ ├─ reset-password/page.tsx
│ │ ├─ verify-email/page.tsx
│ │ ├─ google/page.tsx
│ │ ├─ google/callback/page.tsx
│ │ ├─ suspended/page.tsx
│ │ └─ unauthorized/page.tsx
│ │
│ ├─ onboarding/
│ │ ├─ layout.tsx
│ │ ├─ page.tsx
│ │ ├─ general-profile/page.tsx
│ │ ├─ investor/page.tsx
│ │ ├─ property-owner/page.tsx
│ │ ├─ property-agent/page.tsx
│ │ ├─ property-sourcer/page.tsx
│ │ ├─ service-provider/page.tsx
│ │ ├─ api-partner/page.tsx
│ │ ├─ status/page.tsx
│ │ ├─ pending-verification/page.tsx
│ │ └─ correction-required/page.tsx
│ │
│ ├─ dashboard/
│ │ ├─ layout.tsx
│ │ ├─ page.tsx
│ │ │
│ │ ├─ investor/
│ │ │ ├─ page.tsx
│ │ │ ├─ opportunities/page.tsx
│ │ │ ├─ opportunities/recommended/page.tsx
│ │ │ ├─ opportunities/recent/page.tsx
│ │ │ ├─ saved/page.tsx
│ │ │ ├─ recommendations/page.tsx
│ │ │ ├─ ai-insights/page.tsx
│ │ │ ├─ reservations/page.tsx
│ │ │ ├─ bookings/page.tsx
│ │ │ ├─ payments/page.tsx
│ │ │ ├─ payments/history/page.tsx
│ │ │ ├─ documents/page.tsx
│ │ │ ├─ verification/page.tsx
│ │ │ └─ preferences/
│ │ │ ├─ page.tsx
│ │ │ ├─ investment/page.tsx
│ │ │ └─ locations/page.tsx
│ │ │
│ │ ├─ property-owner/
│ │ │ ├─ page.tsx
│ │ │ ├─ properties/page.tsx
│ │ │ ├─ properties/new/page.tsx
│ │ │ ├─ properties/[propertyPublicId]/page.tsx
│ │ │ ├─ properties/[propertyPublicId]/edit/page.tsx
│ │ │ ├─ listings/page.tsx
│ │ │ ├─ documents/page.tsx
│ │ │ ├─ verification/page.tsx
│ │ │ ├─ bookings/page.tsx
│ │ │ ├─ conversations/page.tsx
│ │ │ └─ payments/page.tsx
│ │ │
│ │ ├─ property-agent/
│ │ │ ├─ page.tsx
│ │ │ ├─ company/page.tsx
│ │ │ ├─ company/verification/page.tsx
│ │ │ ├─ company/contacts/page.tsx
│ │ │ ├─ properties/page.tsx
│ │ │ ├─ properties/new/page.tsx
│ │ │ ├─ properties/[propertyPublicId]/page.tsx
│ │ │ ├─ listings/page.tsx
│ │ │ ├─ authority-documents/page.tsx
│ │ │ ├─ documents/page.tsx
│ │ │ ├─ verification/page.tsx
│ │ │ ├─ bookings/page.tsx
│ │ │ ├─ conversations/page.tsx
│ │ │ └─ payments/page.tsx
│ │ │
│ │ ├─ property-sourcer/
│ │ │ ├─ page.tsx
│ │ │ ├─ deals/page.tsx
│ │ │ ├─ deals/new/page.tsx
│ │ │ ├─ deals/[listingPublicId]/page.tsx
│ │ │ ├─ deals/[listingPublicId]/edit/page.tsx
│ │ │ ├─ deal-packs/page.tsx
│ │ │ ├─ deal-packs/new/page.tsx
│ │ │ ├─ compliance/page.tsx
│ │ │ ├─ compliance/declarations/page.tsx
│ │ │ ├─ compliance/listing-standards/page.tsx
│ │ │ ├─ documents/page.tsx
│ │ │ ├─ verification/page.tsx
│ │ │ ├─ bookings/page.tsx
│ │ │ ├─ conversations/page.tsx
│ │ │ ├─ payments/page.tsx
│ │ │ ├─ payments/history/page.tsx
│ │ │ └─ performance/
│ │ │ ├─ page.tsx
│ │ │ ├─ views/page.tsx
│ │ │ └─ conversions/page.tsx
│ │ │
│ │ └─ service-provider/
│ │ ├─ page.tsx
│ │ ├─ profile/page.tsx
│ │ ├─ profile/service-areas/page.tsx
│ │ ├─ profile/availability/page.tsx
│ │ ├─ services/page.tsx
│ │ ├─ services/new/page.tsx
│ │ ├─ services/[servicePublicId]/page.tsx
│ │ ├─ bookings/page.tsx
│ │ ├─ documents/page.tsx
│ │ ├─ verification/page.tsx
│ │ ├─ conversations/page.tsx
│ │ └─ payments/page.tsx
│ │
│ ├─ account/
│ │ ├─ layout.tsx
│ │ ├─ page.tsx
│ │ ├─ profile/page.tsx
│ │ ├─ policies/page.tsx
│ │ ├─ security/page.tsx
│ │ ├─ notifications/page.tsx
│ │ ├─ status/page.tsx
│ │ ├─ support/page.tsx
│ │ └─ business-profiles/
│ │ ├─ add/page.tsx
│ │ └─ [profilePublicId]/page.tsx
│ │
│ ├─ documents/
│ │ ├─ page.tsx
│ │ ├─ upload/page.tsx
│ │ └─ [documentPublicId]/
│ │ ├─ page.tsx
│ │ └─ replace/page.tsx
│ │
│ ├─ verification/
│ │ ├─ page.tsx
│ │ └─ [verificationReviewPublicId]/
│ │ ├─ page.tsx
│ │ └─ respond/page.tsx
│ │
│ ├─ payments/
│ │ ├─ page.tsx
│ │ ├─ [paymentPublicId]/page.tsx
│ │ └─ references/[paymentReference]/
│ │ ├─ page.tsx
│ │ └─ submit-proof/page.tsx
│ │
│ ├─ reservations/
│ │ ├─ page.tsx
│ │ └─ [reservationPublicId]/page.tsx
│ │
│ ├─ bookings/
│ │ ├─ page.tsx
│ │ ├─ new/page.tsx
│ │ └─ [bookingPublicId]/
│ │ ├─ page.tsx
│ │ └─ reschedule/page.tsx
│ │
│ ├─ conversations/
│ │ ├─ page.tsx
│ │ └─ [conversationPublicId]/page.tsx
│ │
│ ├─ notifications/
│ │ ├─ page.tsx
│ │ └─ preferences/page.tsx
│ │
│ ├─ recommendations/
│ │ ├─ page.tsx
│ │ └─ [recommendationPublicId]/
│ │ ├─ page.tsx
│ │ └─ feedback/page.tsx
│ │
│ └─ api-partner/
│ ├─ layout.tsx
│ ├─ page.tsx
│ ├─ apply/page.tsx
│ ├─ application-status/page.tsx
│ ├─ dashboard/page.tsx
│ ├─ client/page.tsx
│ ├─ keys/
│ │ ├─ page.tsx
│ │ ├─ new/page.tsx
│ │ └─ activity/page.tsx
│ ├─ usage/page.tsx
│ ├─ webhooks/
│ │ ├─ page.tsx
│ │ ├─ new/page.tsx
│ │ ├─ deliveries/page.tsx
│ │ └─ [webhookPublicId]/page.tsx
│ ├─ docs/page.tsx
│ ├─ billing/page.tsx
│ ├─ payments/page.tsx
│ └─ support/page.tsx
│
├─ src/
│ ├─ components/
│ │ ├─ ui/
│ │ │ ├─ button/
│ │ │ │ ├─ button.tsx
│ │ │ │ └─ button.module.css
│ │ │ ├─ input/
│ │ │ │ ├─ input.tsx
│ │ │ │ └─ input.module.css
│ │ │ ├─ select/select.tsx
│ │ │ ├─ checkbox/checkbox.tsx
│ │ │ ├─ dialog/dialog.tsx
│ │ │ ├─ drawer/drawer.tsx
│ │ │ ├─ modal/modal.tsx
│ │ │ ├─ table/table.tsx
│ │ │ ├─ badge/badge.tsx
│ │ │ ├─ card/card.tsx
│ │ │ ├─ tabs/tabs.tsx
│ │ │ ├─ toast/toast.tsx
│ │ │ └─ skeleton/skeleton.tsx
│ │ │
│ │ ├─ layout/
│ │ │ ├─ public-header/
│ │ │ │ ├─ public-header.tsx
│ │ │ │ └─ public-header.module.css
│ │ │ ├─ public-footer/public-footer.tsx
│ │ │ ├─ dashboard-top-bar/dashboard-top-bar.tsx
│ │ │ ├─ dashboard-sidebar/dashboard-sidebar.tsx
│ │ │ ├─ mobile-dashboard-drawer/mobile-dashboard-drawer.tsx
│ │ │ ├─ mobile-bottom-bar/mobile-bottom-bar.tsx
│ │ │ └─ page-shell/page-shell.tsx
│ │ │
│ │ ├─ business-profiles/
│ │ │ ├─ business-profile-switcher.tsx
│ │ │ ├─ business-profiles-modal.tsx
│ │ │ ├─ add-business-profile-drawer.tsx
│ │ │ ├─ business-profile-card.tsx
│ │ │ └─ business-profiles.module.css
│ │ │
│ │ ├─ marketplace/
│ │ ├─ dashboard/
│ │ ├─ forms/
│ │ ├─ documents/
│ │ ├─ payments/
│ │ ├─ bookings/
│ │ ├─ conversations/
│ │ ├─ notifications/
│ │ └─ ai/
│ │
│ ├─ features/
│ │ ├─ auth/
│ │ │ ├─ api/auth.api.ts
│ │ │ ├─ schemas/sign-up.schema.ts
│ │ │ ├─ hooks/use-auth-session.ts
│ │ │ ├─ types/auth.types.ts
│ │ │ └─ constants/auth.constants.ts
│ │ ├─ onboarding/
│ │ │ ├─ api/onboarding.api.ts
│ │ │ ├─ schemas/investor-onboarding.schema.ts
│ │ │ ├─ hooks/use-onboarding.ts
│ │ │ ├─ types/onboarding.types.ts
│ │ │ └─ constants/onboarding.constants.ts
│ │ ├─ account/
│ │ │ ├─ api/account.api.ts
│ │ │ ├─ schemas/business-profile.schema.ts
│ │ │ ├─ hooks/use-account.ts
│ │ │ ├─ types/account.types.ts
│ │ │ └─ constants/account.constants.ts
│ │ ├─ dashboard/
│ │ │ ├─ api/dashboard.api.ts
│ │ │ ├─ schemas/dashboard.schema.ts
│ │ │ ├─ hooks/use-dashboard.ts
│ │ │ ├─ types/dashboard.types.ts
│ │ │ └─ constants/dashboard-navigation.constants.ts
│ │ ├─ marketplace/
│ │ │ ├─ api/marketplace.api.ts
│ │ │ ├─ schemas/marketplace-filters.schema.ts
│ │ │ ├─ hooks/use-marketplace.ts
│ │ │ ├─ types/marketplace.types.ts
│ │ │ └─ constants/marketplace.constants.ts
│ │ ├─ properties/
│ │ │ ├─ api/properties.api.ts
│ │ │ ├─ schemas/property-create.schema.ts
│ │ │ ├─ hooks/use-properties.ts
│ │ │ ├─ types/properties.types.ts
│ │ │ └─ constants/properties.constants.ts
│ │ ├─ listings/
│ │ │ ├─ api/listings.api.ts
│ │ │ ├─ schemas/listing-create.schema.ts
│ │ │ ├─ hooks/use-listings.ts
│ │ │ ├─ types/listings.types.ts
│ │ │ └─ constants/listings.constants.ts
│ │ ├─ documents/
│ │ │ ├─ api/documents.api.ts
│ │ │ ├─ schemas/document-upload.schema.ts
│ │ │ ├─ hooks/use-documents.ts
│ │ │ ├─ types/documents.types.ts
│ │ │ └─ constants/documents.constants.ts
│ │ ├─ verification/
│ │ │ ├─ api/verification.api.ts
│ │ │ ├─ schemas/verification-response.schema.ts
│ │ │ ├─ hooks/use-verification.ts
│ │ │ ├─ types/verification.types.ts
│ │ │ └─ constants/verification.constants.ts
│ │ ├─ payments/
│ │ │ ├─ api/payments.api.ts
│ │ │ ├─ schemas/payment-proof.schema.ts
│ │ │ ├─ hooks/use-payments.ts
│ │ │ ├─ types/payments.types.ts
│ │ │ └─ constants/payments.constants.ts
│ │ ├─ reservations/
│ │ │ ├─ api/reservations.api.ts
│ │ │ ├─ schemas/reservation.schema.ts
│ │ │ ├─ hooks/use-reservations.ts
│ │ │ ├─ types/reservations.types.ts
│ │ │ └─ constants/reservations.constants.ts
│ │ ├─ bookings/
│ │ │ ├─ api/bookings.api.ts
│ │ │ ├─ schemas/booking-create.schema.ts
│ │ │ ├─ hooks/use-bookings.ts
│ │ │ ├─ types/bookings.types.ts
│ │ │ └─ constants/bookings.constants.ts
│ │ ├─ conversations/
│ │ │ ├─ api/conversations.api.ts
│ │ │ ├─ schemas/message-create.schema.ts
│ │ │ ├─ hooks/use-conversations.ts
│ │ │ ├─ types/conversations.types.ts
│ │ │ └─ constants/conversations.constants.ts
│ │ ├─ notifications/
│ │ │ ├─ api/notifications.api.ts
│ │ │ ├─ schemas/notification-preferences.schema.ts
│ │ │ ├─ hooks/use-notifications.ts
│ │ │ ├─ types/notifications.types.ts
│ │ │ └─ constants/notifications.constants.ts
│ │ ├─ recommendations/
│ │ │ ├─ api/recommendations.api.ts
│ │ │ ├─ schemas/recommendation-feedback.schema.ts
│ │ │ ├─ hooks/use-recommendations.ts
│ │ │ ├─ types/recommendations.types.ts
│ │ │ └─ constants/recommendations.constants.ts
│ │ └─ api-partner/
│ │ ├─ api/api-partner.api.ts
│ │ ├─ schemas/api-partner-application.schema.ts
│ │ ├─ hooks/use-api-partner.ts
│ │ ├─ types/api-partner.types.ts
│ │ └─ constants/api-partner.constants.ts
│ │
│ ├─ lib/
│ │ ├─ api/
│ │ │ ├─ api-client.ts
│ │ │ ├─ api-error.ts
│ │ │ ├─ api-response.ts
│ │ │ ├─ api-routes.ts
│ │ │ └─ auth-fetch.ts
│ │ ├─ auth/
│ │ │ ├─ auth-session.ts
│ │ │ ├─ auth-cookies.ts
│ │ │ ├─ auth-guards.ts
│ │ │ └─ role-guards.ts
│ │ ├─ env/
│ │ │ ├─ env.ts
│ │ │ └─ env.schema.ts
│ │ ├─ zod/
│ │ │ ├─ zod-error-map.ts
│ │ │ └─ form-resolver.ts
│ │ ├─ navigation/
│ │ │ ├─ public-navigation.ts
│ │ │ ├─ account-navigation.ts
│ │ │ ├─ dashboard-navigation.ts
│ │ │ ├─ investor-navigation.ts
│ │ │ ├─ property-owner-navigation.ts
│ │ │ ├─ property-agent-navigation.ts
│ │ │ ├─ property-sourcer-navigation.ts
│ │ │ ├─ service-provider-navigation.ts
│ │ │ └─ api-partner-navigation.ts
│ │ ├─ formatters/
│ │ ├─ utils/
│ │ └─ constants/
│ │
│ ├─ styles/
│ ├─ types/
│ ├─ hooks/
│ ├─ store/
│ └─ middleware/
│
├─ public/
│ ├─ favicon.ico
│ ├─ icons/
│ ├─ images/
│ ├─ logo/
│ └─ robots.txt
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
