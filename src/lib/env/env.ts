// File: src/lib/env/env.ts

/**
 * Asancha Public Environment
 *
 * Purpose:
 * Provides a single validated environment object for Asancha Web Public.
 *
 * Main responsibilities:
 * - Parse browser-safe public environment variables with Zod
 * - Export typed runtime configuration
 * - Provide small helpers for environment checks
 * - Keep sensitive configuration out of the public frontend bundle
 *
 * Important Asancha Web Public rule:
 * Do not hardcode sensitive production backend/admin URLs in source files.
 * Production values should be supplied through deployment environment
 * variables and must not include secrets.
 *
 * Security note:
 * NEXT_PUBLIC_* values are visible in the browser.
 * Never place JWT secrets, database URLs, Stripe secret keys, webhook
 * secrets, API key hashes, admin bootstrap secrets, mail provider secrets,
 * storage secrets, full API keys, private document URLs, private KYC notes,
 * internal admin values, or admin/staff portal URLs in this file.
 */

import { PublicEnv, parsePublicEnv } from "./env.schema";

const rawPublicEnv = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_SUPPORT_URL: process.env.NEXT_PUBLIC_SUPPORT_URL,
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  NEXT_PUBLIC_MAINTENANCE_BANNER_ENABLED:
    process.env.NEXT_PUBLIC_MAINTENANCE_BANNER_ENABLED,
} satisfies Record<string, string | undefined>;

export const env: PublicEnv = parsePublicEnv(rawPublicEnv);

export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  appUrl: env.NEXT_PUBLIC_APP_URL,
  apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL,
  environment: env.NEXT_PUBLIC_ENVIRONMENT,
  supportUrl: env.NEXT_PUBLIC_SUPPORT_URL || null,
  analyticsEnabled: env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  maintenanceBannerEnabled:
    env.NEXT_PUBLIC_MAINTENANCE_BANNER_ENABLED === "true",
} as const;

/**
 * Checks whether the current public app environment is production.
 */
export function isProductionEnvironment(): boolean {
  return env.NEXT_PUBLIC_ENVIRONMENT === "production";
}

/**
 * Checks whether the current public app environment is development.
 */
export function isDevelopmentEnvironment(): boolean {
  return env.NEXT_PUBLIC_ENVIRONMENT === "development";
}

/**
 * Checks whether the current public app environment is staging.
 */
export function isStagingEnvironment(): boolean {
  return env.NEXT_PUBLIC_ENVIRONMENT === "staging";
}

/**
 * Checks whether the current public app environment is test.
 */
export function isTestEnvironment(): boolean {
  return env.NEXT_PUBLIC_ENVIRONMENT === "test";
}

/**
 * Returns the public app base URL.
 */
export function getAppUrl(): string {
  return appConfig.appUrl;
}

/**
 * Returns the public API base URL.
 *
 * This value comes from deployment-controlled public environment variables.
 */
export function getApiBaseUrl(): string {
  return appConfig.apiBaseUrl;
}

/**
 * Returns the configured public support URL when available.
 */
export function getSupportUrl(): string | null {
  return appConfig.supportUrl;
}

/**
 * Checks whether browser-safe analytics can run.
 */
export function canRunPublicAnalytics(): boolean {
  return appConfig.analyticsEnabled && isProductionEnvironment();
}

/**
 * Checks whether the public maintenance banner should be visible.
 */
export function shouldShowMaintenanceBanner(): boolean {
  return appConfig.maintenanceBannerEnabled;
}
