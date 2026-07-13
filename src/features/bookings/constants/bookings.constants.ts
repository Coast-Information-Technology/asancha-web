// File: src/features/bookings/constants/bookings.constants.ts

/**
 * Asancha Booking Constants
 *
 * Purpose:
 * Defines current-user booking endpoints, routes, form options, default
 * filters, pagination values, and safe user-facing messages.
 *
 * Security notes:
 * - Admin confirmation and review routes must not appear here.
 * - Meeting URLs must only come from safe backend responses.
 * - Frontend constants do not grant booking permissions.
 */

import type {
    BookingChannel,
    BookingFilters,
    BookingStatus,
    BookingTargetType,
    BookingType,
} from "../types/bookings.types";

export const BOOKINGS_API_ENDPOINTS = {
    create: "/bookings",
    mine: "/bookings/me",

    booking: (bookingPublicId: string): string =>
        `/ bookings / ${encodeURIComponent(
            bookingPublicId,
        )
        } `,

    cancel: (bookingPublicId: string): string =>
        `/ bookings / ${encodeURIComponent(
            bookingPublicId,
        )
        }/cancel`,

    requestReschedule: (
        bookingPublicId: string,
    ): string =>
        `/bookings/${encodeURIComponent(
            bookingPublicId,
        )}/reschedule`,
} as const;

export const BOOKING_PAGE_ROUTES = {
    root: "/bookings",
    create: "/bookings/new",

    detail: (bookingPublicId: string): string =>
        `/bookings/${encodeURIComponent(
            bookingPublicId,
        )}`,

    reschedule: (
        bookingPublicId: string,
    ): string =>
        `/bookings/${encodeURIComponent(
            bookingPublicId,
        )}/reschedule`,

    marketplace: "/marketplace",

    listing: (listingSlug: string): string =>
        `/marketplace/${encodeURIComponent(
            listingSlug,
        )}`,

    reservation: (
        reservationPublicId: string,
    ): string =>
        `/reservations/${encodeURIComponent(
            reservationPublicId,
        )}`,

    payment: (paymentPublicId: string): string =>
        `/payments/${encodeURIComponent(
            paymentPublicId,
        )}`,
} as const;

export const BOOKING_TYPE_OPTIONS = [
    {
        value: "property_viewing",
        label: "Property viewing",
    },
    {
        value: "investment_consultation",
        label: "Investment consultation",
    },
    {
        value: "property_consultation",
        label: "Property consultation",
    },
    {
        value: "service_consultation",
        label: "Service consultation",
    },
    {
        value: "deal_review",
        label: "Deal review",
    },
    {
        value: "document_review",
        label: "Document review",
    },
    {
        value: "verification_call",
        label: "Verification call",
    },
    {
        value: "support_call",
        label: "Support call",
    },
    {
        value: "other",
        label: "Other booking",
    },
] as const satisfies ReadonlyArray<{
    value: BookingType;
    label: string;
}>;

export const BOOKING_STATUS_OPTIONS = [
    { value: "requested", label: "Requested" },
    {
        value: "pending_payment",
        label: "Payment required",
    },
    {
        value: "payment_submitted",
        label: "Payment submitted",
    },
    {
        value: "under_review",
        label: "Under review",
    },
    { value: "confirmed", label: "Confirmed" },
    {
        value: "reschedule_requested",
        label: "Reschedule requested",
    },
    { value: "rescheduled", label: "Rescheduled" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
    { value: "no_show", label: "No show" },
    { value: "expired", label: "Expired" },
    { value: "failed", label: "Failed" },
] as const satisfies ReadonlyArray<{
    value: BookingStatus;
    label: string;
}>;

export const BOOKING_CHANNEL_OPTIONS = [
    {
        value: "in_person",
        label: "In person",
    },
    {
        value: "phone",
        label: "Phone call",
    },
    {
        value: "video",
        label: "Video meeting",
    },
    {
        value: "calendly",
        label: "Calendly scheduling",
    },
    {
        value: "manual_url",
        label: "Online meeting link",
    },
] as const satisfies ReadonlyArray<{
    value: BookingChannel;
    label: string;
}>;

export const BOOKING_TARGET_TYPE_OPTIONS = [
    { value: "listing", label: "Listing" },
    { value: "property", label: "Property" },
    {
        value: "reservation",
        label: "Reservation",
    },
    {
        value: "service_provider",
        label: "Service provider",
    },
    { value: "service", label: "Service" },
    {
        value: "verification_review",
        label: "Verification review",
    },
    { value: "support", label: "Support" },
    { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
    value: BookingTargetType;
    label: string;
}>;

export const BOOKING_SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    {
        value: "updated_recently",
        label: "Recently updated",
    },
    {
        value: "scheduled_soonest",
        label: "Scheduled soonest",
    },
    {
        value: "scheduled_latest",
        label: "Scheduled latest",
    },
    { value: "status", label: "Status" },
] as const;

export const BOOKING_PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
    50,
] as const;

export const BOOKING_MAX_PAGE_SIZE = 50;

export const DEFAULT_BOOKING_FILTERS: BookingFilters = {
    search: "",
    statuses: [],
    bookingTypes: [],
    channels: [],
    targetTypes: [],

    targetPublicId: null,
    listingPublicId: null,
    reservationPublicId: null,

    upcoming: null,
    requiresAction: null,

    sort: "scheduled_soonest",
    page: 1,
    pageSize: 20,
};

export const INITIAL_BOOKING_CREATE_VALUES = {
    bookingType: "property_viewing",
    customBookingType: null,

    targetType: "listing",
    targetPublicId: "",

    listingPublicId: null,
    propertyPublicId: null,
    reservationPublicId: null,
    serviceProviderProfilePublicId: null,

    title: "",
    purpose: null,
    notesForBooking: null,

    requestedStartAt: "",
    requestedEndAt: "",
    timezone: "Europe/London",

    preferredChannel: "in_person",

    bookingTermsAccepted: false,
    informationAccurateConfirmed: false,
    paymentRequirementAcknowledged: false,
} as const;

export const BOOKING_SAFE_MESSAGES = {
    loadError:
        "We could not load your bookings. Please refresh the page.",

    detailLoadError:
        "We could not load this booking. It may not exist or may not be available to your active profile.",

    createError:
        "We could not create the booking request. Review the target, schedule, availability, and account requirements.",

    created:
        "Your booking request has been submitted.",

    paymentGenerated:
        "Your booking request has been created and a payment requirement has been generated.",

    cancellationError:
        "We could not cancel this booking. Its current state may not allow cancellation.",

    cancelled:
        "The booking has been cancelled.",

    rescheduleError:
        "We could not submit the reschedule request. Review the proposed schedule and try again.",

    rescheduleRequested:
        "Your reschedule request has been submitted for review.",

    pendingPayment:
        "Complete and verify the required payment before this booking can be confirmed.",

    underReview:
        "Your booking request is being reviewed.",

    confirmed:
        "Your booking has been confirmed.",

    meetingDetailsRestricted:
        "Meeting details become available only after the booking is confirmed.",

    confirmationControlled:
        "Booking requests require backend review and do not become confirmed automatically.",

    calendarIntegrationUnavailable:
        "External calendar synchronisation is not currently available. Use the confirmed booking details shown by Asancha.",
} as const;

export function getBookingStatusLabel(
    status: BookingStatus,
): string {
    return (
        BOOKING_STATUS_OPTIONS.find(
            (option) => option.value === status,
        )?.label ?? status
    );
}