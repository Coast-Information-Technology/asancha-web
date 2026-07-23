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
 * - Render public navigation dropdowns from PUBLIC_HEADER_NAVIGATION children
 * - Render guest/authenticated public actions
 * - Support mobile navigation
 * - Keep admin/staff navigation out of asancha-web
 *
 * Accessibility note:
 * Uses semantic header/nav markup, exposes mobile menu expanded state,
 * and uses native details/summary for keyboard-friendly desktop dropdowns.
 *
 * Security note:
 * Navigation is frontend guidance only.
 * Backend authentication, authorization, profile, payment, verification,
 * document, API partner, and resource checks remain final.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import {
  PUBLIC_GUEST_ACTIONS,
  PUBLIC_HEADER_NAVIGATION,
  isActiveNavigationItem,
  type NavigationItem,
} from "@/src/lib/navigation/public-navigation";
import { authApiGet } from "@/src/lib/api/auth-fetch";
import {
  getDashboardPathForBusinessProfile,
  isBusinessProfileType,
  type BusinessProfileType,
} from "@/src/lib/auth/role-guards";

import styles from "./public-header.module.css";
import { MenuIcon } from "lucide-react";

interface PublicHeaderProps {
  isAuthenticated?: boolean;
}

interface PublicActiveBusinessProfileSummary {
  activeBusinessProfile: {
    profileType: BusinessProfileType;
  } | null;
}

interface PublicGeneralProfileSummary {
  profileCompletionStatus: "not_started" | "in_progress" | "completed";
  activeBusinessProfileType: BusinessProfileType | null;
}

interface PublicAuthSessionAction {
  authenticated: boolean;
  dashboardHref: string | null;
}

interface DesktopNavigationItemProps {
  item: NavigationItem;
  pathname: string;
}

/**
 * Renders one desktop navigation item, including dropdown children when present.
 */
function DesktopNavigationItem({ item, pathname }: DesktopNavigationItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive =
    isActiveNavigationItem(item, pathname) ||
    Boolean(
      item.children?.some((child) => isActiveNavigationItem(child, pathname)),
    );

  if (!hasChildren) {
    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
        href={item.href}
      >
        {item.label}
      </Link>
    );
  }

  function preventDesktopToggle(
    event:
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLElement>,
  ) {
    event.preventDefault();
  }

  function handleBlur(event: React.FocusEvent<HTMLDetailsElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  return (
    <details
      className={styles.dropdown}
      onBlur={handleBlur}
      onFocus={() => setIsOpen(true)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      open={isOpen}
    >
      <summary
        aria-current={isActive ? "page" : undefined}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`${styles.navItem} ${styles.dropdownTrigger} ${
          isActive ? styles.navItemActive : ""
        }`}
        onClick={preventDesktopToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            preventDesktopToggle(event);
          }
        }}
      >
        <span>{item.label}</span>
        <span aria-hidden="true" className={styles.dropdownChevron}>
          {"\u25be"}
        </span>
      </summary>

      <div className={styles.dropdownPanel}>
        <div className={styles.dropdownHeader}>
          <p className={styles.dropdownTitle}>{item.label}</p>
          {item.description ? (
            <p className={styles.dropdownDescription}>{item.description}</p>
          ) : null}
        </div>

        <ul className={styles.dropdownList}>
          {item.children?.map((child) => {
            const childActive = isActiveNavigationItem(child, pathname);

            return (
              <li key={child.href}>
                <Link
                  aria-current={childActive ? "page" : undefined}
                  className={`${styles.dropdownItem} ${
                    childActive ? styles.dropdownItemActive : ""
                  }`}
                  href={child.href}
                >
                  <span className={styles.dropdownItemLabel}>
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className={styles.dropdownItemDescription}>
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}

interface MobileNavigationItemProps {
  item: NavigationItem;
  pathname: string;
  onNavigate: () => void;
}

/**
 * Renders one mobile navigation item, including nested children when present.
 */
function MobileNavigationItem({
  item,
  onNavigate,
  pathname,
}: MobileNavigationItemProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive =
    isActiveNavigationItem(item, pathname) ||
    Boolean(
      item.children?.some((child) => isActiveNavigationItem(child, pathname)),
    );
  const [isOpen, setIsOpen] = useState(isActive);
  const childNavigationId = `mobile-navigation-${item.href.replace(/[^a-z0-9]/gi, "-")}`;

  if (!hasChildren) {
    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
        href={item.href}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className={styles.mobileNavGroup}>
      <button
        aria-controls={childNavigationId}
        aria-current={isActive ? "page" : undefined}
        aria-expanded={isOpen}
        className={`${styles.navItem} ${styles.mobileNavTrigger} ${
          isActive ? styles.navItemActive : ""
        }`}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>{item.label}</span>
        <span
          aria-hidden="true"
          className={`${styles.mobileNavChevron} ${
            isOpen ? styles.mobileNavChevronOpen : ""
          }`}
        >
          {"\u25be"}
        </span>
      </button>

      {isOpen ? (
        <div className={styles.mobileChildNav} id={childNavigationId}>
          {item.children?.map((child) => {
            const childActive = isActiveNavigationItem(child, pathname);

            return (
              <Link
                aria-current={childActive ? "page" : undefined}
                className={`${styles.mobileChildNavItem} ${
                  childActive ? styles.mobileChildNavItemActive : ""
                }`}
                href={child.href}
                key={child.href}
                onClick={onNavigate}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Renders the public Asancha header.
 */
export function PublicHeader({ isAuthenticated = false }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardHref, setDashboardHref] = useState<string | null>(
    isAuthenticated ? "/dashboard" : null,
  );

  useEffect(() => {
    let ignoreResult = false;

    async function resolveDashboardAction(): Promise<void> {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });
        const envelope = (await response.json().catch(() => null)) as {
          success?: boolean;
          data?: PublicAuthSessionAction | null;
        } | null;

        if (ignoreResult) {
          return;
        }

        if (response.ok && envelope?.success && envelope.data?.authenticated) {
          setDashboardHref(envelope.data.dashboardHref ?? "/dashboard");
          return;
        }
      } catch {
        // Fall back to direct client checks below.
      }

      try {
        const activeProfile =
          await authApiGet<PublicActiveBusinessProfileSummary>(
            "/profiles/me/active-business-profile",
          );

        if (ignoreResult) {
          return;
        }

        const profileType = activeProfile.activeBusinessProfile?.profileType;

        setDashboardHref(
          profileType && isBusinessProfileType(profileType)
            ? getDashboardPathForBusinessProfile(profileType)
            : "/dashboard",
        );
      } catch {
        try {
          const generalProfile =
            await authApiGet<PublicGeneralProfileSummary>(
              "/profiles/me/general",
            );

          if (ignoreResult) {
            return;
          }

          if (generalProfile.profileCompletionStatus !== "completed") {
            setDashboardHref("/onboarding/general-profile");
            return;
          }

          const profileType = generalProfile.activeBusinessProfileType;

          setDashboardHref(
            profileType && isBusinessProfileType(profileType)
              ? getDashboardPathForBusinessProfile(profileType)
              : "/dashboard",
          );
        } catch {
          if (!ignoreResult) {
            setDashboardHref(null);
          }
        }
      }
    }

    void resolveDashboardAction();

    return () => {
      ignoreResult = true;
    };
  }, [pathname]);

  const actionItems = dashboardHref
    ? [
        {
          label: "Dashboard",
          href: dashboardHref,
          description: "Go to your dashboard.",
          access: "authenticated" as const,
        },
      ]
    : PUBLIC_GUEST_ACTIONS;

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          aria-label="Asancha home"
          className={styles.logoLink}
          href="/"
          onClick={closeMobileMenu}
        >
          <Image
            alt="Asancha logo"
            className={styles.logoImage}
            height={80}
            priority
            src="/logo.png"
            style={{ height: "auto" }}
            width={80}
          />
        </Link>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          {PUBLIC_HEADER_NAVIGATION.map((item) => (
            <Fragment key={item.href}>
              <DesktopNavigationItem item={item} pathname={pathname} />
            </Fragment>
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
          <span aria-hidden="true">{mobileMenuOpen ? "×" : <MenuIcon />}</span>
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
                <MobileNavigationItem
                  item={item}
                  key={item.href}
                  onNavigate={closeMobileMenu}
                  pathname={pathname}
                />
              ))}
            </nav>

            <div className={styles.mobileActions}>
              {actionItems.map((item) => (
                <Link
                  className={`${styles.actionLink} ${styles.actionLinkPrimary} ${styles.mobileActionLink}`}
                  href={item.href}
                  key={item.href}
                  onClick={closeMobileMenu}
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
