"use client";

// File: app/account/_components/account-security-page.tsx

/**
 * Asancha Account Security Page
 *
 * Purpose:
 * Handles password changes, email-change requests, active sessions, login
 * activity, and security notifications.
 *
 * Security notes:
 * - Never display raw tokens, session secrets, full IP addresses, password
 *   hashes, reset tokens, or private device fingerprints.
 * - Backend authentication and re-authentication remain authoritative.
 */

import Link from "next/link";
import {
    useRouter,
} from "next/navigation";
import {
    Eye,
    EyeOff,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    authApiDelete,
    authApiGet,
    authApiPost,
} from "../../../src/lib/api/auth-fetch";
import {
    useToast,
} from "../../../src/components/ui/toast/toast";
import type {
    AccountLoginActivity,
    AccountSecurityNotification,
    AccountSecurityResponse,
    AccountSession,
    ChangePasswordPayload,
    RequestEmailChangePayload,
} from "../_types/account.types";

const FALLBACK_SECURITY_RESPONSE: AccountSecurityResponse = {
    summary: {
        email: "",
        emailVerificationStatus: "unknown",
        passwordConfigured: true,
        activeSessionCount: 0,
        recentFailedLoginCount: 0,
        securityNotificationCount: 0,
        canChangePassword: true,
        canRequestEmailChange: true,
        safeUserMessage: null,
    },
    sessions: [],
    loginActivity: [],
    securityNotifications: [],
};

function normalizeSecurityResponse(
    value:
        | Partial<AccountSecurityResponse>
        | null
        | undefined,
): AccountSecurityResponse {
    return {
        summary: {
            ...FALLBACK_SECURITY_RESPONSE.summary,
            ...(value?.summary ?? {}),
        },
        sessions: Array.isArray(value?.sessions)
            ? value.sessions
            : [],
        loginActivity: Array.isArray(
            value?.loginActivity,
        )
            ? value.loginActivity
            : [],
        securityNotifications:
            Array.isArray(
                value?.securityNotifications,
            )
                ? value.securityNotifications
                : [],
    };
}

interface PasswordVisibilityButtonProps {
    isVisible: boolean;
    label: string;
    onToggle: () => void;
}

function PasswordVisibilityButton({
    isVisible,
    label,
    onToggle,
}: PasswordVisibilityButtonProps) {
    const Icon = isVisible ? EyeOff : Eye;

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onToggle}
            className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20"
        >
            <Icon
                aria-hidden="true"
                className="size-4"
            />
        </button>
    );
}

async function refreshBrowserSessionAfterCredentialChange(): Promise<boolean> {
    const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
            "X-Asancha-Client": "asancha-web",
        },
    });

    return response.ok;
}

export function AccountSecurityPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [response, setResponse] =
        useState<AccountSecurityResponse | null>(
            null,
        );

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmNewPassword,
        setConfirmNewPassword,
    ] = useState("");

    const [newEmail, setNewEmail] =
        useState("");

    const [
        emailChangePassword,
        setEmailChangePassword,
    ] = useState("");

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        showEmailChangePassword,
        setShowEmailChangePassword,
    ] = useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        isChangingPassword,
        setIsChangingPassword,
    ] = useState(false);

    const [
        isRequestingEmailChange,
        setIsRequestingEmailChange,
    ] = useState(false);

    const [
        revokingSessionPublicId,
        setRevokingSessionPublicId,
    ] = useState<string | null>(null);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const loadSecurity =
        useCallback(async (): Promise<void> => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result =
                    await authApiGet<AccountSecurityResponse>(
                        "/me/security",
                    );

                setResponse(
                    normalizeSecurityResponse(
                        result,
                    ),
                );
            } catch {
                setResponse(
                    FALLBACK_SECURITY_RESPONSE,
                );
                setErrorMessage(
                    "We could not load your full security summary. Password and email settings are still available.",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect((): void => {
        queueMicrotask(() => {
            void loadSecurity();
        });
    }, [loadSecurity]);

    const handlePasswordChange = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (
            !currentPassword ||
            !newPassword ||
            !confirmNewPassword
        ) {
            setErrorMessage(
                "Complete all password fields.",
            );
            return;
        }

        if (
            newPassword !==
            confirmNewPassword
        ) {
            setErrorMessage(
                "The new passwords do not match.",
            );
            return;
        }

        setIsChangingPassword(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            ChangePasswordPayload = {
            currentPassword,
            newPassword,
        };

        try {
            await authApiPost(
                "/auth/change-password",
                payload,
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            setSuccessMessage(
                "Your password has been changed.",
            );

            const refreshed =
                await refreshBrowserSessionAfterCredentialChange();

            if (refreshed) {
                await loadSecurity();
            } else {
                setSuccessMessage(
                    "Your password has been changed. Sign in again to continue.",
                );
                showToast({
                    title:
                        "Password changed successfully",
                    description:
                        "Please sign in again to continue.",
                    variant: "success",
                });

                window.setTimeout(() => {
                    router.replace(
                        "/auth/sign-in",
                    );
                }, 1500);
            }
        } catch {
            setErrorMessage(
                "We could not change your password.",
            );
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleEmailChangeRequest = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!newEmail.trim()) {
            setErrorMessage(
                "Enter the new email address.",
            );
            return;
        }

        if (!emailChangePassword) {
            setErrorMessage(
                "Enter your current password.",
            );
            return;
        }

        setIsRequestingEmailChange(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload:
            RequestEmailChangePayload = {
            newEmail:
                newEmail.trim(),
            password:
                emailChangePassword,
        };

        try {
            await authApiPost(
                "/auth/change-email",
                payload,
            );

            setNewEmail("");
            setEmailChangePassword("");

            setSuccessMessage(
                "Your email-change request has been submitted. Follow the confirmation instructions sent by Asancha.",
            );
        } catch {
            setErrorMessage(
                "We could not submit your email-change request.",
            );
        } finally {
            setIsRequestingEmailChange(
                false,
            );
        }
    };

    const revokeSession = async (
        sessionPublicId: string,
    ): Promise<void> => {
        setRevokingSessionPublicId(
            sessionPublicId,
        );

        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await authApiDelete(
    `/me/sessions/${encodeURIComponent(
        sessionPublicId,
    )}`,
);

            setSuccessMessage(
                "The session has been revoked.",
            );

            await loadSecurity();
        } catch {
            setErrorMessage(
                "We could not revoke this session.",
            );
        } finally {
            setRevokingSessionPublicId(
                null,
            );
        }
    };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!response) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "Security information is unavailable."}
                </div>
            </main>
        );
    }

    const inputClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm";
    const passwordInputClassName = `${inputClassName} pr-12`;
    const securitySummary =
        response.summary;

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Account protection
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Security
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Manage your password, email address,
                    active sessions, login activity, and
                    security notifications.
                </p>
            </header>

            {securitySummary.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    {
                        securitySummary
                            .safeUserMessage
                    }
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

            <section className="mt-6 grid gap-6 xl:grid-cols-2">
                <form
                    onSubmit={
                        handlePasswordChange
                    }
                    className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-bold">
                        Password
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        Changing your password may revoke
                        other sessions according to
                        platform security policy.
                    </p>

                    <div className="mt-5 grid gap-4">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="text-sm font-semibold"
                            >
                                Current password
                            </label>

                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        setCurrentPassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className={
                                        passwordInputClassName
                                    }
                                />

                                <PasswordVisibilityButton
                                    isVisible={
                                        showCurrentPassword
                                    }
                                    label={
                                        showCurrentPassword
                                            ? "Hide current password"
                                            : "Show current password"
                                    }
                                    onToggle={() =>
                                        setShowCurrentPassword(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="text-sm font-semibold"
                            >
                                New password
                            </label>

                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        setNewPassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className={
                                        passwordInputClassName
                                    }
                                />

                                <PasswordVisibilityButton
                                    isVisible={
                                        showNewPassword
                                    }
                                    label={
                                        showNewPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                    onToggle={() =>
                                        setShowNewPassword(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmNewPassword"
                                className="text-sm font-semibold"
                            >
                                Confirm new password
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmNewPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    value={
                                        confirmNewPassword
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        setConfirmNewPassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className={
                                        passwordInputClassName
                                    }
                                />

                                <PasswordVisibilityButton
                                    isVisible={
                                        showConfirmPassword
                                    }
                                    label={
                                        showConfirmPassword
                                            ? "Hide confirmed password"
                                            : "Show confirmed password"
                                    }
                                    onToggle={() =>
                                        setShowConfirmPassword(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            isChangingPassword ||
                            !securitySummary
                                .canChangePassword
                        }
                        className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {isChangingPassword
                            ? "Changing…"
                            : "Change password"}
                    </button>
                </form>

                <form
                    onSubmit={
                        handleEmailChangeRequest
                    }
                    className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-bold">
                        Email address
                    </h2>

                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Current email:{" "}
                        <strong className="text-[var(--foreground)]">
                            {
                                securitySummary
                                    .email
                            }
                        </strong>
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        Verification:{" "}
                        {
                            securitySummary
                                .emailVerificationStatus
                        }
                    </p>

                    <div className="mt-5 grid gap-4">
                        <div>
                            <label
                                htmlFor="newEmail"
                                className="text-sm font-semibold"
                            >
                                New email address
                            </label>

                            <input
                                id="newEmail"
                                type="email"
                                autoComplete="email"
                                value={newEmail}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ): void =>
                                    setNewEmail(
                                        event.target.value,
                                    )
                                }
                                className={inputClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="emailChangePassword"
                                className="text-sm font-semibold"
                            >
                                Current password
                            </label>

                            <div className="relative">
                                <input
                                    id="emailChangePassword"
                                    name="emailChangePasswordConfirmation"
                                    type={
                                        showEmailChangePassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="off"
                                    data-1p-ignore="true"
                                    data-lpignore="true"
                                    value={
                                        emailChangePassword
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        setEmailChangePassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className={
                                        passwordInputClassName
                                    }
                                />

                                <PasswordVisibilityButton
                                    isVisible={
                                        showEmailChangePassword
                                    }
                                    label={
                                        showEmailChangePassword
                                            ? "Hide password for email change"
                                            : "Show password for email change"
                                    }
                                    onToggle={() =>
                                        setShowEmailChangePassword(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            isRequestingEmailChange ||
                            !securitySummary
                                .canRequestEmailChange
                        }
                        className="mt-5 min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {isRequestingEmailChange
                            ? "Submitting…"
                            : "Request email change"}
                    </button>
                </form>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Active sessions
                </h2>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {response.sessions.map(
                        (
                            session:
                                AccountSession,
                        ): ReactNode => (
                            <article
                                key={
                                    session.sessionPublicId
                                }
                                className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold">
                                            {
                                                session.deviceName
                                            }
                                        </h3>

                                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                            {[
                                                session.browserName,
                                                session.operatingSystem,
                                            ]
                                                .filter(
                                                    Boolean,
                                                )
                                                .join(
                                                    " · ",
                                                )}
                                        </p>
                                    </div>

                                    {session.current ? (
                                        <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                            Current
                                        </span>
                                    ) : null}
                                </div>

                                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                    {session.approximateLocation ??
                                        "Location unavailable"}
                                </p>

                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                    Last used:{" "}
                                    {new Date(
                                        session.lastUsedAt,
                                    ).toLocaleString(
                                        "en-GB",
                                    )}
                                </p>

                                {session.canRevoke &&
                                !session.current ? (
                                    <button
                                        type="button"
                                        disabled={
                                            revokingSessionPublicId ===
                                            session.sessionPublicId
                                        }
                                        onClick={(): void => {
                                            void revokeSession(
                                                session.sessionPublicId,
                                            );
                                        }}
                                        className="mt-4 text-sm font-semibold text-[var(--destructive)] hover:underline disabled:opacity-60"
                                    >
                                        {revokingSessionPublicId ===
                                        session.sessionPublicId
                                            ? "Revoking…"
                                            : "Revoke session"}
                                    </button>
                                ) : null}
                            </article>
                        ),
                    )}
                </div>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Login activity
                </h2>

                <div className="mt-4 overflow-x-auto rounded-[var(--asancha-radius-xl)] border border-[var(--border)]">
                    <table className="w-full min-w-[42rem] border-collapse text-sm">
                        <thead className="bg-[var(--muted)] text-left">
                            <tr>
                                <th className="p-4">
                                    Event
                                </th>
                                <th className="p-4">
                                    Device
                                </th>
                                <th className="p-4">
                                    Location
                                </th>
                                <th className="p-4">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {response.loginActivity.map(
                                (
                                    activity:
                                        AccountLoginActivity,
                                ): ReactNode => (
                                    <tr
                                        key={
                                            activity.activityPublicId
                                        }
                                        className="border-t border-[var(--border)]"
                                    >
                                        <td className="p-4 font-semibold">
                                            {
                                                activity.eventType
                                            }
                                        </td>

                                        <td className="p-4">
                                            {[
                                                activity.deviceName,
                                                activity.browserName,
                                            ]
                                                .filter(
                                                    Boolean,
                                                )
                                                .join(
                                                    " · ",
                                                ) ||
                                                "Unavailable"}
                                        </td>

                                        <td className="p-4">
                                            {activity.approximateLocation ??
                                                "Unavailable"}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                activity.occurredAt,
                                            ).toLocaleString(
                                                "en-GB",
                                            )}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-bold">
                    Security notifications
                </h2>

                {response.securityNotifications
                    .length ? (
                    <div className="mt-4 grid gap-4">
                        {response.securityNotifications.map(
                            (
                                notification:
                                    AccountSecurityNotification,
                            ): ReactNode => (
                                <article
                                    key={
                                        notification.notificationPublicId
                                    }
                                    className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <h3 className="font-bold">
                                        {
                                            notification.title
                                        }
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                        {
                                            notification.message
                                        }
                                    </p>

                                    {notification.actionLabel &&
                                    notification.actionPath ? (
                                        <Link
                                            href={
                                                notification.actionPath
                                            }
                                            className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                        >
                                            {
                                                notification.actionLabel
                                            }
                                        </Link>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                        No security notifications are
                        available.
                    </p>
                )}
            </section>
        </main>
    );
}
