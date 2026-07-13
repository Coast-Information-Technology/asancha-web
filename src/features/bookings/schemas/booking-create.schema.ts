// File: src/features/bookings/schemas/booking-create.schema.ts

/**
 * Asancha Booking Schemas
 *
 * Purpose:
 * Provides client-side validation for booking creation, cancellation, and
 * reschedule requests.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend target visibility, access, payment, conflict, and lifecycle rules
 *   remain authoritative.
 */

import { z } from "zod";

import {
    BOOKING_CHANNEL_OPTIONS,
    BOOKING_TARGET_TYPE_OPTIONS,
    BOOKING_TYPE_OPTIONS,
} from "../constants/bookings.constants";

const bookingTypeValues =
    BOOKING_TYPE_OPTIONS.map(
        (option) => option.value,
    );

const channelValues =
    BOOKING_CHANNEL_OPTIONS.map(
        (option) => option.value,
    );

const targetTypeValues =
    BOOKING_TARGET_TYPE_OPTIONS.map(
        (option) => option.value,
    );

function enumFromValues<TValue extends string>(
    values: readonly TValue[],
) {
    return z.enum(
        values as [TValue, ...TValue[]],
    );
}

const publicIdSchema = z
    .string()
    .trim()
    .min(3, "Choose a valid booking target.")
    .max(120, "The public identifier is too long.")
    .regex(
        /^[A-Za-z0-9_-]+$/,
        "The public identifier contains invalid characters.",
    );

const optionalPublicIdSchema = z
    .union([
        publicIdSchema,
        z.literal(""),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => value || null);

const optionalTextSchema = (
    maximumLength: number,
) =>
    z
        .union([
            z.string(),
            z.null(),
            z.undefined(),
        ])
        .transform((value) => {
            const normalized = value?.trim();

            return normalized || null;
        })
        .pipe(
            z
                .string()
                .max(
                    maximumLength,
                    `Enter no more than ${maximumLength} characters.`,
                )
                .nullable(),
        );

const dateTimeSchema = z
    .string()
    .trim()
    .min(1, "Choose a date and time.")
    .refine(
        (value) =>
            !Number.isNaN(Date.parse(value)),
        "Enter a valid date and time.",
    );

const scheduleSchema = z
    .object({
        requestedStartAt: dateTimeSchema,
        requestedEndAt: dateTimeSchema,

        timezone: z
            .string()
            .trim()
            .min(3, "Choose a valid timezone.")
            .max(100, "Timezone is too long."),
    })
    .superRefine((values, context) => {
        const startTime = Date.parse(
            values.requestedStartAt,
        );

        const endTime = Date.parse(
            values.requestedEndAt,
        );

        if (
            !Number.isNaN(startTime) &&
            startTime <= Date.now()
        ) {
            context.addIssue({
                code: "custom",
                path: ["requestedStartAt"],
                message:
                    "Booking time must be in the future.",
            });
        }

        if (
            !Number.isNaN(startTime) &&
            !Number.isNaN(endTime) &&
            endTime <= startTime
        ) {
            context.addIssue({
                code: "custom",
                path: ["requestedEndAt"],
                message:
                    "End time must be after the start time.",
            });
        }

        if (
            !Number.isNaN(startTime) &&
            !Number.isNaN(endTime) &&
            endTime - startTime >
            8 * 60 * 60 * 1000
        ) {
            context.addIssue({
                code: "custom",
                path: ["requestedEndAt"],
                message:
                    "A booking window cannot exceed 8 hours.",
            });
        }
    });

export const bookingCreateSchema = z
    .object({
        bookingType: enumFromValues(
            bookingTypeValues,
        ),

        customBookingType:
            optionalTextSchema(120),

        targetType: enumFromValues(
            targetTypeValues,
        ),

        targetPublicId: publicIdSchema,

        listingPublicId: optionalPublicIdSchema,
        propertyPublicId: optionalPublicIdSchema,
        reservationPublicId:
            optionalPublicIdSchema,
        serviceProviderProfilePublicId:
            optionalPublicIdSchema,

        title: z
            .string()
            .trim()
            .min(
                5,
                "Booking title must contain at least 5 characters.",
            )
            .max(
                160,
                "Booking title must contain no more than 160 characters.",
            ),

        purpose: optionalTextSchema(500),

        notesForBooking:
            optionalTextSchema(2_000),

        requestedStartAt: dateTimeSchema,
        requestedEndAt: dateTimeSchema,

        timezone: z
            .string()
            .trim()
            .min(3, "Choose a valid timezone.")
            .max(100, "Timezone is too long."),

        preferredChannel: enumFromValues(
            channelValues,
        ),

        bookingTermsAccepted: z.literal(true, {
            error:
                "Accept the booking terms before continuing.",
        }),

        informationAccurateConfirmed:
            z.literal(true, {
                error:
                    "Confirm that the booking information is accurate.",
            }),

        paymentRequirementAcknowledged:
            z.literal(true, {
                error:
                    "Acknowledge that payment may be required.",
            }),
    })
    .superRefine((values, context) => {
        const scheduleResult =
            scheduleSchema.safeParse({
                requestedStartAt:
                    values.requestedStartAt,
                requestedEndAt:
                    values.requestedEndAt,
                timezone: values.timezone,
            });

        if (!scheduleResult.success) {
            for (const issue of scheduleResult.error.issues) {
                context.addIssue({
                    code: "custom",
                    path: issue.path,
                    message: issue.message,
                });
            }
        }

        if (
            values.bookingType === "other" &&
            values.customBookingType === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["customBookingType"],
                message:
                    "Describe the booking type.",
            });
        }

        if (
            values.targetType === "listing" &&
            values.listingPublicId === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["listingPublicId"],
                message: "Choose a listing.",
            });
        }

        if (
            values.targetType === "property" &&
            values.propertyPublicId === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["propertyPublicId"],
                message: "Choose a property.",
            });
        }

        if (
            values.targetType === "reservation" &&
            values.reservationPublicId === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["reservationPublicId"],
                message: "Choose a reservation.",
            });
        }

        if (
            values.targetType ===
            "service_provider" &&
            values.serviceProviderProfilePublicId ===
            null
        ) {
            context.addIssue({
                code: "custom",
                path: [
                    "serviceProviderProfilePublicId",
                ],
                message:
                    "Choose a service provider.",
            });
        }
    });

export const cancelBookingSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(
            10,
            "Provide a short cancellation reason.",
        )
        .max(
            500,
            "Cancellation reason must contain no more than 500 characters.",
        ),

    cancellationConfirmed: z.literal(true, {
        error:
            "Confirm that you want to cancel this booking.",
    }),
});

export const requestBookingRescheduleSchema =
    scheduleSchema.extend({
        reason: z
            .string()
            .trim()
            .min(
                10,
                "Provide a short reason for rescheduling.",
            )
            .max(
                500,
                "Reschedule reason must contain no more than 500 characters.",
            ),

        rescheduleConfirmed: z.literal(true, {
            error:
                "Confirm that you want to request this schedule.",
        }),
    });

export type BookingCreateFormInput = z.input<
    typeof bookingCreateSchema
>;

export type BookingCreateFormValues = z.output<
    typeof bookingCreateSchema
>;

export type CancelBookingFormValues = z.output<
    typeof cancelBookingSchema
>;

export type RequestBookingRescheduleFormValues =
    z.output<
        typeof requestBookingRescheduleSchema
    >;