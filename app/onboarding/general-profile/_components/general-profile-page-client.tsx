"use client";

// File: app/onboarding/general-profile/_components/general-profile-page-client.tsx

/**
 * Asancha General Profile Page Client
 *
 * Purpose:
 * Collects the authenticated user's non-role-specific identity and contact
 * details after email verification and sign-in.
 *
 * Security notes:
 * - Client validation is UX guidance only.
 * - Backend authentication, ownership, profile completion,
 *   active-profile, verification, and authorization checks remain final.
 * - This page must not expose tokens, ObjectIds, internal notes, or private
 *   profile-review data.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ImagePlus,
    Loader2,
    Trash2,
    UploadCloud,
    UserRound,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
} from "react";

import {
    authApiGet,
    authApiPatch,
    authApiPost,
} from "@/src/lib/api/auth-fetch";
import {
    getDashboardPathForBusinessProfile,
    isBusinessProfileType,
    type BusinessProfileType,
} from "@/src/lib/auth/role-guards";

type GeneralProfileCompletionStatus =
    | "not_started"
    | "in_progress"
    | "completed";

type PreferredContactMethod =
    | "email"
    | "phone"
    | "whatsapp"
    | "platform_message";

interface GeneralProfile {
    publicId: string;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    phoneNumber?: string | null;
    preferredContactMethod?: PreferredContactMethod | null;
    profileImageUrl?: string | null;
    profileCompletionStatus: GeneralProfileCompletionStatus;
    activeBusinessProfileType: BusinessProfileType | null;
    createdAt: string;
    updatedAt: string;
}

interface ActiveBusinessProfileSummary {
    activeBusinessProfile: {
        profileType: BusinessProfileType;
    } | null;
}

interface GeneralProfileFormValues {
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    preferredContactMethod: PreferredContactMethod;
    profileImageUrl: string;
    confirmCompletion: boolean;
}

interface UpdateGeneralProfilePayload {
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    preferredContactMethod: PreferredContactMethod;
    profileImageUrl: string | null;
}

interface CompleteGeneralProfilePayload {
    confirmCompletion: true;
}

interface CloudinaryUploadResponse {
    secure_url: string;
}

const GENERAL_PROFILE_ENDPOINT = "/profiles/me/general";
const COMPLETE_GENERAL_PROFILE_ENDPOINT =
    "/profiles/me/general/complete";
const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ??
    "dgrrexhst";
const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ??
    "";
const PROFILE_IMAGE_ACCEPTED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);
const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const EMPTY_FORM_VALUES: GeneralProfileFormValues = {
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    preferredContactMethod: "email",
    profileImageUrl: "",
    confirmCompletion: false,
};

function getDashboardDestination(
    profileType: BusinessProfileType | null | undefined,
): string {
    if (!profileType || !isBusinessProfileType(profileType)) {
        return "/dashboard";
    }

    return getDashboardPathForBusinessProfile(profileType);
}

function profileToFormValues(
    profile: GeneralProfile,
): GeneralProfileFormValues {
    return {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        displayName: profile.displayName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        preferredContactMethod:
            profile.preferredContactMethod ?? "email",
        profileImageUrl: profile.profileImageUrl ?? "",
        confirmCompletion: false,
    };
}

function buildDisplayName(
    firstName: string,
    lastName: string,
): string {
    return `${firstName.trim()} ${lastName.trim()}`
        .trim()
        .replace(/\s+/g, " ");
}

function isCloudinaryUploadResponse(
    value: unknown,
): value is CloudinaryUploadResponse {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as CloudinaryUploadResponse).secure_url ===
            "string"
    );
}

function getFileSizeLabel(sizeInBytes: number): string {
    if (sizeInBytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
    }

    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GeneralProfilePageClient() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [profile, setProfile] =
        useState<GeneralProfile | null>(null);
    const [values, setValues] =
        useState<GeneralProfileFormValues>(
            EMPTY_FORM_VALUES,
        );
    const [isLoading, setIsLoading] =
        useState(true);
    const [isSaving, setIsSaving] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);
    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);
    const [imageUploadError, setImageUploadError] =
        useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] =
        useState(false);
    const [isDraggingImage, setIsDraggingImage] =
        useState(false);

    const redirectToDashboard =
        useCallback(
            async (
                fallbackProfileType:
                    | BusinessProfileType
                    | null,
            ): Promise<void> => {
                try {
                    const activeProfile =
                        await authApiGet<ActiveBusinessProfileSummary>(
                            "/profiles/me/active-business-profile",
                        );

                    router.replace(
                        getDashboardDestination(
                            activeProfile
                                .activeBusinessProfile
                                ?.profileType ??
                                fallbackProfileType,
                        ),
                    );
                } catch {
                    router.replace(
                        getDashboardDestination(
                            fallbackProfileType,
                        ),
                    );
                }

                router.refresh();
            },
            [router],
        );

    const loadProfile =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<GeneralProfile>(
                        GENERAL_PROFILE_ENDPOINT,
                    );

                setProfile(result);
                setValues(profileToFormValues(result));

                if (
                    result.profileCompletionStatus ===
                    "completed"
                ) {
                    await redirectToDashboard(
                        result.activeBusinessProfileType,
                    );
                }
            } catch {
                setErrorMessage(
                    "We could not load your general profile. Refresh the page and try again.",
                );
            } finally {
                setIsLoading(false);
            }
        }, [redirectToDashboard]);

    useEffect((): void => {
        void Promise.resolve().then(loadProfile);
    }, [loadProfile]);

    const updateValue = <
        TKey extends keyof GeneralProfileFormValues,
    >(
        key: TKey,
        value: GeneralProfileFormValues[TKey],
    ): void => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleNameChange = (
        key: "firstName" | "lastName",
        value: string,
    ): void => {
        setValues((current) => {
            const nextValues = {
                ...current,
                [key]: value,
            };

            return {
                ...nextValues,
                displayName:
                    current.displayName ===
                        buildDisplayName(
                            current.firstName,
                            current.lastName,
                        ) ||
                    current.displayName.trim() === ""
                        ? buildDisplayName(
                              nextValues.firstName,
                              nextValues.lastName,
                          )
                        : current.displayName,
            };
        });

        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const uploadProfileImage = async (
        file: File | null | undefined,
    ): Promise<void> => {
        if (!file) {
            return;
        }

        if (!PROFILE_IMAGE_ACCEPTED_TYPES.has(file.type)) {
            setImageUploadError(
                "Upload a JPG, PNG, or WebP profile image.",
            );
            return;
        }

        if (file.size > PROFILE_IMAGE_MAX_BYTES) {
            setImageUploadError(
                "Choose an image smaller than 5 MB.",
            );
            return;
        }

        if (!CLOUDINARY_UPLOAD_PRESET) {
            setImageUploadError(
                "Image upload is not available right now. Please try again later.",
            );
            return;
        }

        setIsUploadingImage(true);
        setImageUploadError(null);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const formData = new FormData();
            formData.set("file", file);
            formData.set("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.set("folder", "asancha/profile-images");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );
            const body = (await response
                .json()
                .catch(() => null)) as unknown;

            if (
                !response.ok ||
                !isCloudinaryUploadResponse(body)
            ) {
                throw new Error("Upload failed");
            }

            updateValue("profileImageUrl", body.secure_url);
        } catch {
            setImageUploadError(
                "We could not upload that image. Please choose another image and try again.",
            );
        } finally {
            setIsUploadingImage(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleImageDrop = (
        event: DragEvent<HTMLDivElement>,
    ): void => {
        event.preventDefault();
        setIsDraggingImage(false);
        void uploadProfileImage(event.dataTransfer.files.item(0));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const firstName = values.firstName.trim();
        const lastName = values.lastName.trim();
        const displayName = values.displayName.trim();
        const phoneNumber = values.phoneNumber.trim();
        const profileImageUrl =
            values.profileImageUrl.trim();

        if (!firstName || !lastName || !displayName) {
            setErrorMessage(
                "Enter your first name, last name, and display name.",
            );
            return;
        }

        if (!phoneNumber) {
            setErrorMessage(
                "Enter a phone number for account contact and verification workflows.",
            );
            return;
        }

        if (!values.confirmCompletion) {
            setErrorMessage(
                "Confirm that your general profile is complete before continuing.",
            );
            return;
        }

        if (isUploadingImage) {
            setErrorMessage(
                "Wait for the profile image upload to finish before continuing.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload: UpdateGeneralProfilePayload = {
            firstName,
            lastName,
            displayName,
            phoneNumber,
            preferredContactMethod:
                values.preferredContactMethod,
            profileImageUrl:
                profileImageUrl.length > 0
                    ? profileImageUrl
                    : null,
        };

        try {
            const updatedProfile =
                await authApiPatch<
                    GeneralProfile,
                    UpdateGeneralProfilePayload
                >(GENERAL_PROFILE_ENDPOINT, payload);

            const completedProfile =
                await authApiPost<
                    GeneralProfile,
                    CompleteGeneralProfilePayload
                >(COMPLETE_GENERAL_PROFILE_ENDPOINT, {
                    confirmCompletion: true,
                });

            setProfile(completedProfile);
            setValues(
                profileToFormValues(completedProfile),
            );
            setSuccessMessage(
                "Your general profile has been completed.",
            );

            await redirectToDashboard(
                completedProfile.activeBusinessProfileType ??
                    updatedProfile.activeBusinessProfileType,
            );
        } catch {
            setErrorMessage(
                "We could not complete your general profile. Review your details and try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60";

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    General profile
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Complete your profile details
                </h1>

                <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                    Add your identity and contact details before entering your
                    role dashboard. Dashboard state will be checked again after
                    completion.
                </p>
            </header>

            {profile ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    Profile status:{" "}
                    <strong className="text-[var(--foreground)]">
                        {profile.profileCompletionStatus.replace(
                            /_/g,
                            " ",
                        )}
                    </strong>
                </div>
            ) : null}

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            <form
                className="mt-6 grid gap-6"
                onSubmit={handleSubmit}
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Personal details
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="firstName"
                            >
                                First name
                            </label>
                            <input
                                autoComplete="given-name"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="firstName"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    handleNameChange(
                                        "firstName",
                                        event.target.value,
                                    )
                                }
                                required
                                value={values.firstName}
                            />
                        </div>

                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="lastName"
                            >
                                Last name
                            </label>
                            <input
                                autoComplete="family-name"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="lastName"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    handleNameChange(
                                        "lastName",
                                        event.target.value,
                                    )
                                }
                                required
                                value={values.lastName}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="displayName"
                            >
                                Display name
                            </label>
                            <input
                                autoComplete="name"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="displayName"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "displayName",
                                        event.target.value,
                                    )
                                }
                                required
                                value={values.displayName}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-bold">
                                Profile image
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                                Add a clear profile photo so your account is
                                easier to recognise across your workspace.
                            </p>
                        </div>

                        {values.profileImageUrl ? (
                            <button
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--destructive)] hover:text-[var(--destructive)]"
                                disabled={isSaving || isUploadingImage}
                                onClick={(): void =>
                                    updateValue(
                                        "profileImageUrl",
                                        "",
                                    )
                                }
                                type="button"
                            >
                                <Trash2
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={2.4}
                                />
                                Remove image
                            </button>
                        ) : null}
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[13rem_1fr]">
                        <div className="flex items-center justify-center rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--muted)] p-5">
                            <div className="relative grid h-36 w-36 place-items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] shadow-sm">
                                {values.profileImageUrl ? (
                                    // Profile image URLs can come from an approved external storage provider.
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                        src={values.profileImageUrl}
                                    />
                                ) : (
                                    <UserRound
                                        aria-hidden="true"
                                        size={48}
                                        strokeWidth={1.8}
                                    />
                                )}

                                {isUploadingImage ? (
                                    <div className="absolute inset-0 grid place-items-center bg-[var(--background)]/80">
                                        <Loader2
                                            aria-hidden="true"
                                            className="animate-spin text-[var(--primary)]"
                                            size={28}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div
                            className={`rounded-[var(--asancha-radius-xl)] border border-dashed p-5 transition ${
                                isDraggingImage
                                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                    : "border-[var(--border)] bg-[var(--background)]"
                            }`}
                            onDragEnter={(
                                event: DragEvent<HTMLDivElement>,
                            ): void => {
                                event.preventDefault();
                                setIsDraggingImage(true);
                            }}
                            onDragLeave={(): void =>
                                setIsDraggingImage(false)
                            }
                            onDragOver={(
                                event: DragEvent<HTMLDivElement>,
                            ): void => event.preventDefault()}
                            onDrop={handleImageDrop}
                        >
                            <input
                                accept="image/jpeg,image/png,image/webp"
                                className="sr-only"
                                disabled={isSaving || isUploadingImage}
                                id="profileImageUrl"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    void uploadProfileImage(
                                        event.target.files?.item(0),
                                    )
                                }
                                ref={fileInputRef}
                                type="file"
                            />

                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <span
                                    aria-hidden="true"
                                    className="grid h-12 w-12 place-items-center rounded-[var(--asancha-radius-md)] bg-[var(--accent)] text-[var(--primary)]"
                                >
                                    <UploadCloud
                                        size={22}
                                        strokeWidth={2.4}
                                    />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-bold">
                                        Drop your image here
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                        JPG, PNG, or WebP. Maximum{" "}
                                        {getFileSizeLabel(
                                            PROFILE_IMAGE_MAX_BYTES,
                                        )}
                                        .
                                    </p>
                                </div>

                                <button
                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] hover:bg-[var(--foreground)]/80 disabled:cursor-wait disabled:opacity-60"
                                    disabled={
                                        isSaving || isUploadingImage
                                    }
                                    onClick={(): void =>
                                        fileInputRef.current?.click()
                                    }
                                    type="button"
                                >
                                    <ImagePlus
                                        aria-hidden="true"
                                        size={16}
                                        strokeWidth={2.4}
                                    />
                                    {values.profileImageUrl
                                        ? "Change image"
                                        : "Choose image"}
                                </button>
                            </div>

                            {imageUploadError ? (
                                <p
                                    className="mt-4 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm leading-6 text-[var(--destructive)]"
                                    role="alert"
                                >
                                    {imageUploadError}
                                </p>
                            ) : null}

                            {values.profileImageUrl &&
                            !imageUploadError ? (
                                <p className="mt-4 rounded-[var(--asancha-radius-md)] border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3 text-sm leading-6 text-[var(--foreground)]">
                                    Image uploaded and ready to save with
                                    your profile.
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Contact preferences
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="phoneNumber"
                            >
                                Phone number
                            </label>
                            <input
                                autoComplete="tel"
                                className={fieldClassName}
                                disabled={isSaving}
                                id="phoneNumber"
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateValue(
                                        "phoneNumber",
                                        event.target.value,
                                    )
                                }
                                required
                                type="tel"
                                value={values.phoneNumber}
                            />
                        </div>

                        <div>
                            <label
                                className="text-sm font-semibold"
                                htmlFor="preferredContactMethod"
                            >
                                Preferred contact method
                            </label>
                            <select
                                className={fieldClassName}
                                disabled={isSaving}
                                id="preferredContactMethod"
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateValue(
                                        "preferredContactMethod",
                                        event.target
                                            .value as PreferredContactMethod,
                                    )
                                }
                                required
                                value={
                                    values.preferredContactMethod
                                }
                            >
                                <option value="email">
                                    Email
                                </option>
                                <option value="phone">
                                    Phone
                                </option>
                                <option value="whatsapp">
                                    WhatsApp
                                </option>
                                <option value="platform_message">
                                    Platform message
                                </option>
                            </select>
                        </div>

                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <label className="flex items-start gap-3">
                        <input
                            checked={values.confirmCompletion}
                            className="mt-1 h-4 w-4 accent-[var(--primary)]"
                            disabled={isSaving}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateValue(
                                    "confirmCompletion",
                                    event.target.checked,
                                )
                            }
                            type="checkbox"
                        />

                        <span className="text-sm leading-6">
                            I confirm that my general profile details are
                            complete and accurate.
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                            href="/auth/sign-in"
                        >
                            Back to sign in
                        </Link>

                        <button
                            className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                            disabled={isSaving}
                            type="submit"
                        >
                            {isSaving
                                ? "Completing profile..."
                                : "Complete profile"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}
