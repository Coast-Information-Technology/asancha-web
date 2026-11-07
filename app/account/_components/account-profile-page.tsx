"use client";

// File: app/account/_components/account-profile-page.tsx

/**
 * Asancha Account Profile Page
 *
 * Purpose:
 * Displays and updates the authenticated user's general profile.
 *
 * Security notes:
 * - Client-side validation is UX guidance only.
 * - Backend account ownership and profile rules remain authoritative.
 */

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

import { documentsApi } from "../../../src/features/documents/api/documents.api";
import {
    authApiGet,
    authApiPatch,
} from "../../../src/lib/api/auth-fetch";
import type {
    AccountGeneralProfile,
    AccountGeneralProfileFormValues,
    UpdateAccountGeneralProfilePayload,
} from "../_types/account.types";

const GENERAL_PROFILE_ENDPOINT =
    "/profiles/me/general";

const PROFILE_IMAGE_ACCEPTED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

function getFileSizeLabel(sizeInBytes: number): string {
    return `${(
        sizeInBytes /
        (1024 * 1024)
    ).toFixed(0)} MB`;
}

function profileToFormValues(
    profile: AccountGeneralProfile,
): AccountGeneralProfileFormValues {
    return {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        displayName: profile.displayName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        preferredContactMethod:
            profile.preferredContactMethod ??
            "email",
        profileImageDocumentPublicId:
            profile.profileImageDocumentPublicId ?? "",
        informationAccurateConfirmed:
            false,
    };
}

function formatStatus(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function AccountProfilePage() {
    const fileInputRef =
        useRef<HTMLInputElement | null>(null);
    const profileImagePreviewUrlRef =
        useRef<string | null>(null);

    const [profile, setProfile] =
        useState<AccountGeneralProfile | null>(
            null,
        );

    const [values, setValues] =
        useState<AccountGeneralProfileFormValues | null>(
            null,
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

    const [
        profileImagePreviewUrl,
        setProfileImagePreviewUrl,
    ] = useState<string | null>(null);

    const replaceProfileImagePreview = useCallback(
        (file: File | null): void => {
            if (profileImagePreviewUrlRef.current) {
                URL.revokeObjectURL(
                    profileImagePreviewUrlRef.current,
                );
            }

            const nextPreviewUrl = file
                ? URL.createObjectURL(file)
                : null;

            profileImagePreviewUrlRef.current =
                nextPreviewUrl;
            setProfileImagePreviewUrl(nextPreviewUrl);
        },
        [],
    );

    useEffect(() => {
        return (): void => {
            if (profileImagePreviewUrlRef.current) {
                URL.revokeObjectURL(
                    profileImagePreviewUrlRef.current,
                );
            }
        };
    }, []);

    const loadProfile =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AccountGeneralProfile>(
                        GENERAL_PROFILE_ENDPOINT,
                    );

                setProfile(result);
                setValues(
                    profileToFormValues(result),
                );
            } catch {
                setErrorMessage(
                    "We could not load your profile.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        void Promise.resolve().then(loadProfile);
    }, [loadProfile]);

    const updateRoot = <
        TKey extends keyof AccountGeneralProfileFormValues,
    >(
        key: TKey,
        value: AccountGeneralProfileFormValues[TKey],
    ): void => {
        setValues((current) =>
            current
                ? {
                      ...current,
                      [key]: value,
                  }
                : current,
        );

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
                `Choose an image smaller than ${getFileSizeLabel(
                    PROFILE_IMAGE_MAX_BYTES,
                )}.`,
            );
            return;
        }

        setIsUploadingImage(true);
        setImageUploadError(null);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result =
                await documentsApi.uploadDocument({
                    data: {
                        documentType: "profile_image",
                        customDocumentType: null,
                        relatedType: "general_profile",
                        relatedPublicId:
                            profile?.publicId ?? null,
                        displayName:
                            file.name ||
                            "Profile image",
                        description:
                            "Profile image uploaded from account settings.",
                        file,
                        informationAccurateConfirmed:
                            true,
                        uploadAuthorityConfirmed: true,
                    },
                });

            updateRoot(
                "profileImageDocumentPublicId",
                result.documentPublicId,
            );
            replaceProfileImagePreview(file);
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

    const removeProfileImage = (): void => {
        updateRoot(
            "profileImageDocumentPublicId",
            "",
        );
        replaceProfileImagePreview(null);
        setImageUploadError(null);
    };

    const handleImageDrop = (
        event: DragEvent<HTMLDivElement>,
    ): void => {
        event.preventDefault();
        setIsDraggingImage(false);
        void uploadProfileImage(
            event.dataTransfer.files.item(0),
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!values) {
            return;
        }

        const firstName =
            values.firstName.trim();
        const lastName =
            values.lastName.trim();
        const displayName =
            values.displayName.trim();
        const phoneNumber =
            values.phoneNumber.trim();
        const profileImageDocumentPublicId =
            values.profileImageDocumentPublicId.trim();

        if (
            !firstName ||
            !lastName ||
            !displayName
        ) {
            setErrorMessage(
                "Enter your first name, last name, and display name.",
            );
            return;
        }

        if (!phoneNumber) {
            setErrorMessage(
                "Enter your phone number.",
            );
            return;
        }

        if (
            !values
                .informationAccurateConfirmed
        ) {
            setErrorMessage(
                "Confirm that your profile information is accurate.",
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            UpdateAccountGeneralProfilePayload = {
            firstName,
            lastName,
            displayName,
            phoneNumber,
            preferredContactMethod:
                values.preferredContactMethod,
            profileImageDocumentPublicId:
                profileImageDocumentPublicId.length > 0
                    ? profileImageDocumentPublicId
                    : null,
        };

        try {
            const result =
                await authApiPatch<
                    AccountGeneralProfile,
                    UpdateAccountGeneralProfilePayload
                >(
                    GENERAL_PROFILE_ENDPOINT,
                    payload,
                );

            setProfile(result);
            setValues(
                profileToFormValues(result),
            );

            setSuccessMessage(
                "Your profile has been updated.",
            );
        } catch {
            setErrorMessage(
                "We could not update your profile.",
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

    if (!profile || !values) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Your profile is unavailable."}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Personal information
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Account profile
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Maintain the general profile details
                    shared across your Asancha account
                    and business workspaces.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Profile status:{" "}
                <strong className="text-[var(--foreground)]">
                    {formatStatus(
                        profile.profileCompletionStatus,
                    )}
                </strong>
            </div>

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
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Identity
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="text-sm font-semibold"
                            >
                                First name
                            </label>

                            <input
                                id="firstName"
                                required
                                disabled={isSaving}
                                value={values.firstName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "firstName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lastName"
                                className="text-sm font-semibold"
                            >
                                Last name
                            </label>

                            <input
                                id="lastName"
                                required
                                disabled={isSaving}
                                value={values.lastName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "lastName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="displayName"
                                className="text-sm font-semibold"
                            >
                                Display name
                            </label>

                            <input
                                id="displayName"
                                required
                                disabled={isSaving}
                                value={values.displayName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "displayName",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
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
                                Upload a clear image to help
                                identify your account across
                                your workspaces.
                            </p>
                        </div>

                        {values.profileImageDocumentPublicId ? (
                            <button
                                type="button"
                                disabled={
                                    isSaving ||
                                    isUploadingImage
                                }
                                onClick={removeProfileImage}
                                className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:border-[var(--destructive)] hover:text-[var(--destructive)] disabled:cursor-not-allowed disabled:opacity-60"
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
                                {profileImagePreviewUrl ? (
                                    // This object URL is a temporary preview of the locally selected image.
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={
                                            profileImagePreviewUrl
                                        }
                                        alt="Selected profile preview"
                                        className="h-full w-full object-cover"
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
                            className={`rounded-[var(--asancha-radius-xl)] border border-dashed p-5 transition ${
                                isDraggingImage
                                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                    : "border-[var(--border)] bg-[var(--background)]"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                id="profileImageFile"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={
                                    isSaving ||
                                    isUploadingImage
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    void uploadProfileImage(
                                        event.target.files?.item(
                                            0,
                                        ),
                                    )
                                }
                                className="sr-only"
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
                                    <h3 className="font-bold">
                                        Drop your image here
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                        JPG, PNG, or WebP.
                                        Maximum{" "}
                                        {getFileSizeLabel(
                                            PROFILE_IMAGE_MAX_BYTES,
                                        )}
                                        .
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        isSaving ||
                                        isUploadingImage
                                    }
                                    onClick={(): void =>
                                        fileInputRef.current?.click()
                                    }
                                    className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                                >
                                    <ImagePlus
                                        aria-hidden="true"
                                        size={16}
                                        strokeWidth={2.4}
                                    />
                                    {values.profileImageDocumentPublicId
                                        ? "Change image"
                                        : "Choose image"}
                                </button>
                            </div>

                            {imageUploadError ? (
                                <p
                                    role="alert"
                                    className="mt-4 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm leading-6 text-[var(--destructive)]"
                                >
                                    {imageUploadError}
                                </p>
                            ) : null}

                            {values.profileImageDocumentPublicId &&
                            !imageUploadError ? (
                                <p
                                    role="status"
                                    className="mt-4 rounded-[var(--asancha-radius-md)] border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3 text-sm leading-6"
                                >
                                    {profileImagePreviewUrl
                                        ? "Profile image uploaded and ready to save."
                                        : "A profile image is attached to your account."}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Contact
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="text-sm font-semibold"
                            >
                                Phone number
                            </label>

                            <input
                                id="phoneNumber"
                                type="tel"
                                required
                                disabled={isSaving}
                                value={values.phoneNumber}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    updateRoot(
                                        "phoneNumber",
                                        event.target.value,
                                    )
                                }
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="preferredContactMethod"
                                className="text-sm font-semibold"
                            >
                                Preferred contact method
                            </label>

                            <select
                                id="preferredContactMethod"
                                required
                                disabled={isSaving}
                                value={
                                    values.preferredContactMethod
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    updateRoot(
                                        "preferredContactMethod",
                                        event.target
                                            .value as AccountGeneralProfileFormValues["preferredContactMethod"],
                                    )
                                }
                                className={fieldClassName}
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
                            type="checkbox"
                            checked={
                                values.informationAccurateConfirmed
                            }
                            disabled={isSaving}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                updateRoot(
                                    "informationAccurateConfirmed",
                                    event.target.checked,
                                )
                            }
                            className="mt-1 h-4 w-4 accent-[var(--primary)]"
                        />

                        <span className="text-sm leading-6">
                            I confirm that this profile
                            information is accurate.
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={
                            isSaving ||
                            isUploadingImage
                        }
                        className="mt-5 min-h-11 cursor-pointer rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save profile"}
                    </button>
                </section>
            </form>
        </main>
    );
}
