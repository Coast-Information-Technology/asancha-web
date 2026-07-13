// File: src/features/reservations/schemas/reservation.schema.ts

/**
 * Asancha Reservation Schemas
 *
 * Purpose:
 * Provides client-side Zod validation for reservation request and cancellation
 * forms.
 *
 * Responsibilities:
 * - Validate listing public IDs.
 * - Require reservation, accuracy, and payment acknowledgements.
 * - Validate safe cancellation reasons.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend listing publication, availability, investor profile, onboarding,
 *   verification, proof-of-funds, payment, duplicate, and lifecycle checks
 *   remain authoritative.
 * - A valid request does not guarantee confirmation.
 */

import { z } from "zod";

const publicIdSchema = z
    .string()
    .trim()
    .min(3, "Choose a valid listing.")
    .max(120, "The listing identifier is too long.")
    .regex(
        /^[A-Za-z0-9_-]+$/,
        "The listing identifier contains invalid characters.",
    );

export const createReservationSchema = z.object({
    listingPublicId: publicIdSchema,

    reservationTermsAccepted: z.literal(true, {
        error:
            "Accept the reservation terms before continuing.",
    }),

    informationAccurateConfirmed: z.literal(true, {
        error:
            "Confirm that your reservation information is accurate.",
    }),

    paymentRequirementAcknowledged: z.literal(true, {
        error:
            "Acknowledge that payment may be required before confirmation.",
    }),
});

export const cancelReservationSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(
            10,
            "Provide a short reason for cancelling the reservation.",
        )
        .max(
            500,
            "Cancellation reason must contain no more than 500 characters.",
        ),

    cancellationConfirmed: z.literal(true, {
        error:
            "Confirm that you want to cancel this reservation.",
    }),
});

export type CreateReservationFormInput = z.input<
    typeof createReservationSchema
>;

export type CreateReservationFormValues = z.output<
    typeof createReservationSchema
>;

export type CancelReservationFormInput = z.input<
    typeof cancelReservationSchema
>;

export type CancelReservationFormValues = z.output<
    typeof cancelReservationSchema
>;
