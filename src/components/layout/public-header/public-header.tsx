"use client";

// File: src/components/layout/public-header/public-header.tsx

/**
 * Asancha Public Header
 *
 * Purpose:
 * Provides the public website header for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render public navigation
 * - Render guest/authenticated public actions
 * - Support mobile navigation
 * - Keep admin/staff navigation out of asancha-web
 *
 * Accessibility note:
 * Uses semantic header/nav markup and exposes menu expanded state.
 *
 * Security note:
 * Navigation is frontend guidance only.
 * Backend authentication, authorization, profile, payment, verification,
 * document, API partner, and resource checks remain final.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  PUBLIC_GUEST_ACTIONS,
  PUBLIC_HEADER_NAVIGATION,
  isActiveNavigationItem,
} from "@/src/lib/navigation/public-navigation";

import styles from "./public-header.module.css";
import Image from "next/image";

interface PublicHeaderProps {
  isAuthenticated?: boolean;
}

/**
 * Renders the public Asancha header.
 */
export function PublicHeader({ isAuthenticated = false }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const actionItems = isAuthenticated
    ? [
        {
          label: "Dashboard",
          href: "/dashboard",
          description: "Go to your dashboard.",
          access: "authenticated" as const,
        },
      ]
    : PUBLIC_GUEST_ACTIONS;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          aria-label="Asancha home"
          className={styles.logoLink}
          href="/"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image src="/logo.png" alt="Asancha logo" width={80} height={80} />
        </Link>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          {PUBLIC_HEADER_NAVIGATION.map((item) => (
            <Link
              aria-current={
                isActiveNavigationItem(item, pathname) ? "page" : undefined
              }
              className={`${styles.navItem} ${
                isActiveNavigationItem(item, pathname)
                  ? styles.navItemActive
                  : ""
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {actionItems.map((item, index) => (
            <Link
              className={
                index === actionItems.length - 1
                  ? `${styles.actionLink} ${styles.actionLinkPrimary}`
                  : `${styles.actionLink} ${styles.actionLinkSecondary}`
              }
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          aria-controls="asancha-mobile-public-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className={styles.mobileButton}
          onClick={() => setMobileMenuOpen((current) => !current)}
          type="button"
        >
          <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {mobileMenuOpen ? (
        <div
          className={styles.mobilePanel}
          id="asancha-mobile-public-navigation"
        >
          <div className={styles.mobilePanelInner}>
            <nav
              aria-label="Mobile primary navigation"
              className={styles.mobileNav}
            >
              {PUBLIC_HEADER_NAVIGATION.map((item) => (
                <Link
                  aria-current={
                    isActiveNavigationItem(item, pathname) ? "page" : undefined
                  }
                  className={`${styles.navItem} ${
                    isActiveNavigationItem(item, pathname)
                      ? styles.navItemActive
                      : ""
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.mobileActions}>
              {actionItems.map((item) => (
                <Link
                  className={`${styles.actionLink} ${styles.actionLinkPrimary} ${styles.mobileActionLink}`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
