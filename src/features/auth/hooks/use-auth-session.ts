"use client";

// File: src/features/auth/hooks/use-auth-session.ts

/**
 * Purpose:
 * Provides reactive public-user authentication session state to client
 * components in asancha-web.
 *
 * Responsibilities:
 * - Loads the authenticated browser session.
 * - Shares one session snapshot across hook consumers.
 * - Prevents duplicate concurrent session requests.
 * - Exposes sign-in, sign-out, refresh, and safe error-reset actions.
 * - Never stores authentication tokens in browser storage.
 *
 * Security notes:
 * - Session cookies remain server-managed and inaccessible to this hook.
 * - Route protection provided by client components is UX guidance only.
 * - The backend remains the final authority for authentication and permissions.
 * - Raw API errors are never exposed directly to public UI.
 */

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { authApi } from "../api/auth.api";
import {
  AUTH_SAFE_MESSAGES,
  AUTH_SESSION_STALE_TIME_MS,
} from "../constants/auth.constants";
import type {
  AuthSessionResult,
  AuthSessionState,
  SignInPayload,
  SignInResult,
  UseAuthSessionResult,
} from "../types/auth.types";

interface UseAuthSessionOptions {
  loadOnMount?: boolean;
}

/**
 * Default unauthenticated session value.
 */
const ANONYMOUS_SESSION: AuthSessionResult = {
  authenticated: false,
  user: null,
};

/**
 * Shared module-level authentication snapshot.
 *
 * No token or secret is stored here. Only safe session data returned by the
 * backend is retained in memory.
 */
let authState: AuthSessionState = {
  status: "idle",
  session: null,
  user: null,
  isAuthenticated: false,
  errorMessage: null,
};

/**
 * Timestamp of the most recent successful session load.
 */
let lastLoadedAt = 0;

/**
 * Shared in-flight session request used to prevent duplicate calls.
 */
let pendingSessionRequest: Promise<AuthSessionResult> | null = null;

/**
 * Subscribers listening for authentication-state changes.
 */
const listeners = new Set<() => void>();

/**
 * Notifies every useAuthSession consumer that the shared state changed.
 */
function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Replaces the shared authentication state and notifies subscribers.
 */
function setAuthState(nextState: AuthSessionState): void {
  authState = nextState;
  emitChange();
}

/**
 * Applies a backend session result to the shared authentication state.
 */
function applySession(session: AuthSessionResult): void {
  lastLoadedAt = Date.now();

  if (session.authenticated) {
    setAuthState({
      status: "authenticated",
      session,
      user: session.user,
      isAuthenticated: true,
      errorMessage: null,
    });

    return;
  }

  setAuthState({
    status: "unauthenticated",
    session,
    user: null,
    isAuthenticated: false,
    errorMessage: null,
  });
}

/**
 * Converts an unknown API failure into a safe public-facing message.
 */
function getSafeSessionErrorMessage(): string {
  return AUTH_SAFE_MESSAGES.sessionError;
}

/**
 * Loads the authenticated session from the backend.
 *
 * Concurrent callers share the same pending request.
 */
async function loadSharedSession(force = false): Promise<AuthSessionResult> {
  const isFresh =
    authState.session !== null &&
    Date.now() - lastLoadedAt < AUTH_SESSION_STALE_TIME_MS;

  if (!force && isFresh) {
    return authState.session ?? ANONYMOUS_SESSION;
  }

  if (pendingSessionRequest) {
    return pendingSessionRequest;
  }

  setAuthState({
    ...authState,
    status: "loading",
    errorMessage: null,
  });

  pendingSessionRequest = authApi
    .getSession()
    .then((session) => {
      applySession(session);
      return session;
    })
    .catch(() => {
      const session = ANONYMOUS_SESSION;

      setAuthState({
        status: "error",
        session,
        user: null,
        isAuthenticated: false,
        errorMessage: getSafeSessionErrorMessage(),
      });

      return session;
    })
    .finally(() => {
      pendingSessionRequest = null;
    });

  return pendingSessionRequest;
}

/**
 * Subscribes a React component to the shared session store.
 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns the current client-side authentication snapshot.
 */
function getSnapshot(): AuthSessionState {
  return authState;
}

/**
 * Returns a stable server-rendering snapshot.
 *
 * The server snapshot is deliberately unauthenticated because secure cookie
 * evaluation belongs to server-side auth guards, not this client hook.
 */
const SERVER_AUTH_STATE: AuthSessionState =
  Object.freeze({
    status: "idle",
    session: null,
    user: null,
    isAuthenticated: false,
    errorMessage: null,
  });

function getServerSnapshot(): AuthSessionState {
  return SERVER_AUTH_STATE;
}

/**
 * Public authentication session hook.
 *
 * This hook may be consumed by public headers, dashboard shells, account menus,
 * and authentication forms. Sensitive route access must still be enforced by
 * backend endpoints and server-side guards.
 */
export function useAuthSession(
  options: UseAuthSessionOptions = {},
): UseAuthSessionResult {
  const { loadOnMount = true } = options;
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Loads the current session if it has not already been loaded recently.
   */
  const loadSession = useCallback(async (): Promise<AuthSessionResult> => {
    return loadSharedSession(false);
  }, []);

  /**
   * Forces a new session request.
   */
  const refreshSession = useCallback(async (): Promise<AuthSessionResult> => {
    const refreshResult = await authApi.refreshSession().catch(() => null);

    if (refreshResult) {
      applySession(refreshResult.session);
      return refreshResult.session;
    }

    return loadSharedSession(true);
  }, []);

  /**
   * Signs the user in and updates the shared browser session.
   */
  const signIn = useCallback(
    async (payload: SignInPayload): Promise<SignInResult> => {
      setAuthState({
        ...authState,
        status: "loading",
        errorMessage: null,
      });

      try {
        const result = await authApi.signIn(payload);
        applySession(result.session);

        return result;
      } catch {
        setAuthState({
          status: "unauthenticated",
          session: ANONYMOUS_SESSION,
          user: null,
          isAuthenticated: false,
          errorMessage: AUTH_SAFE_MESSAGES.invalidCredentials,
        });

        throw new Error(AUTH_SAFE_MESSAGES.invalidCredentials);
      }
    },
    [],
  );

  /**
   * Signs the current user out and clears all in-memory session state.
   */
  const signOut = useCallback(async (): Promise<void> => {
    setAuthState({
      ...authState,
      status: "loading",
      errorMessage: null,
    });

    try {
      await authApi.signOut();
    } finally {
      lastLoadedAt = 0;
      pendingSessionRequest = null;
      applySession(ANONYMOUS_SESSION);
    }
  }, []);

  /**
   * Removes the current public-safe authentication error.
   */
  const clearError = useCallback((): void => {
    setAuthState({
      ...authState,
      errorMessage: null,
      status: authState.isAuthenticated
        ? "authenticated"
        : authState.session
          ? "unauthenticated"
          : "idle",
    });
  }, []);

  /**
   * Loads the browser session when the first hook consumer mounts.
   */
  useEffect(() => {
    if (loadOnMount && authState.status === "idle") {
      void loadSharedSession(false);
    }
  }, [loadOnMount]);

  return {
    ...state,
    loadSession,
    refreshSession,
    signIn,
    signOut,
    clearError,
  };
}
