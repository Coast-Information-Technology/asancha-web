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
 * and uses keyboard-operable disclosure buttons for navigation dropdowns.
 *
 * Security note:
 * Navigation is frontend guidance only.
 * Backend authentication, authorization, profile, payment, verification,
 * document, API partner, and resource checks remain final.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "lucide-react";

import {
  PUBLIC_GUEST_ACTIONS,
  PUBLIC_HEADER_NAVIGATION,
  isActiveNavigationItem,
  type NavigationItem,
} from "@/src/lib/navigation/public-navigation";

import styles from "./public-header.module.css";

interface PublicHeaderProps {
  isAuthenticated?: boolean;
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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive =
    isActiveNavigationItem(item, pathname) ||
    Boolean(
      item.children?.some((child) => isActiveNavigationItem(child, pathname)),
    );
  const itemId = item.href.replace(/[^a-z0-9]/gi, "-");
  const triggerId = `desktop-navigation-trigger-${itemId}`;
  const panelId = `desktop-navigation-panel-${itemId}`;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent): void {
      if (
        isOpen &&
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        if (closeTimerRef.current !== null) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);

      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isOpen]);

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

  function clearCloseTimer(): void {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openDropdown(): void {
    clearCloseTimer();
    setIsOpen(true);
  }

  function scheduleDropdownClose(): void {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 180);
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearCloseTimer();
      setIsOpen(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !isOpen) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    clearCloseTimer();
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div
      className={styles.dropdown}
      data-open={isOpen}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleDropdownClose}
      ref={dropdownRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={`${styles.navItem} ${styles.dropdownTrigger} ${
          isActive ? styles.navItemActive : ""
        }`}
        id={triggerId}
        onClick={() => {
          clearCloseTimer();
          setIsOpen((current) => !current);
        }}
        ref={triggerRef}
        type="button"
      >
        <span>{item.label}</span>
        <span aria-hidden="true" className={styles.dropdownChevron}>
          {"\u25be"}
        </span>
      </button>

      <div
        aria-labelledby={triggerId}
        className={styles.dropdownPanel}
        id={panelId}
      >
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
                  onClick={() => setIsOpen(false)}
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
    </div>
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
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    <div
      className={styles.mobileNavGroup}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        aria-controls={childNavigationId}
        aria-expanded={isOpen}
        className={`${styles.navItem} ${styles.mobileNavTrigger} ${
          isActive ? styles.navItemActive : ""
        }`}
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
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

      <ul
        className={styles.mobileChildNav}
        hidden={!isOpen}
        id={childNavigationId}
      >
        {item.children?.map((child) => {
          const childActive = isActiveNavigationItem(child, pathname);

          return (
            <li key={child.href}>
              <Link
                aria-current={childActive ? "page" : undefined}
                className={`${styles.mobileChildNavItem} ${
                  childActive ? styles.mobileChildNavItemActive : ""
                }`}
                href={child.href}
                onClick={onNavigate}
              >
                {child.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Renders the public Asancha header.
 */
export function PublicHeader({ isAuthenticated = false }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
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
        if (!ignoreResult) {
          setDashboardHref(null);
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
            alt=""
            className={styles.logoImage}
            fetchPriority="low"
            height={80}
            loading="eager"
            src="/logo.png"
            style={{ height: "auto" }}
            width={80}
          />
        </Link>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          <ul className={styles.desktopNavList}>
            {PUBLIC_HEADER_NAVIGATION.map((item) => (
              <li key={item.href}>
                <DesktopNavigationItem item={item} pathname={pathname} />
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account actions" className={styles.actions}>
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
        </nav>

        <button
          aria-controls="asancha-mobile-public-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className={styles.mobileButton}
          onClick={() => setMobileMenuOpen((current) => !current)}
          ref={mobileMenuButtonRef}
          type="button"
        >
          <span aria-hidden="true">{mobileMenuOpen ? "×" : <MenuIcon />}</span>
        </button>
      </div>

      {mobileMenuOpen ? (
        <div
          className={styles.mobilePanel}
          id="asancha-mobile-public-navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setMobileMenuOpen(false);
              mobileMenuButtonRef.current?.focus();
            }
          }}
        >
          <div className={styles.mobilePanelInner}>
            <nav
              aria-label="Mobile primary navigation"
              className={styles.mobileNav}
            >
              <ul className={styles.mobileNavList}>
                {PUBLIC_HEADER_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <MobileNavigationItem
                      item={item}
                      onNavigate={closeMobileMenu}
                      pathname={pathname}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              aria-label="Mobile account actions"
              className={styles.mobileActions}
            >
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
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
