"use client";

// File: app/api-partner/_components/api-partner-shell.tsx

/**
 * Purpose:
 * Renders the dedicated API partner workspace shell.
 *
 * Responsibilities:
 * - Desktop and mobile navigation
 * - Active route highlighting
 * - Escape-key and route-change drawer closing
 *
 * Security notes:
 * Navigation visibility is UX guidance only; backend authorization remains final.
 */

import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  Gauge,
  Headphones,
  KeyRound,
  LogOut,
  Menu,
  PanelLeft,
  ReceiptText,
  ServerCog,
  ShieldCheck,
  UserCircle,
  UserRound,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { apiPartnerNavigation } from "../_config/api-partner-navigation.config";
import {
  clearAuthTokens,
  getAccessToken,
} from "../../../src/features/auth/lib/auth-token-store";
import { clearBrowserSessionHint } from "../../../src/lib/auth/auth-cookies";
import styles from "./api-partner.module.css";

const navigationIcons = new Map<string, LucideIcon>([
  ["/api-partner/dashboard", Gauge],
  ["/api-partner/apps", ServerCog],
  ["/api-partner/client", ServerCog],
  ["/api-partner/keys", KeyRound],
  ["/api-partner/usage", BarChart3],
  ["/api-partner/webhooks", Webhook],
  ["/api-partner/docs", BookOpen],
  ["/api-partner/billing", ReceiptText],
  ["/api-partner/payments", CreditCard],
  ["/api-partner/support", Headphones],
]);

const accountMenuItems = [
  {
    label: "Profile",
    href: "/api-partner/account/profile",
    icon: UserRound,
  },
  {
    label: "Security",
    href: "/api-partner/account/security",
    icon: ShieldCheck,
  },
  {
    label: "Notifications",
    href: "/api-partner/account/notifications",
    icon: Bell,
  },
  {
    label: "Support",
    href: "/api-partner/account/support",
    icon: Headphones,
  },
] as const;

export function ApiPartnerShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPathname = pathname ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setMobileOpen(false);
      setAccountMenuOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        accountMenuRef.current?.contains(target)
      ) {
        return;
      }

      setAccountMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [accountMenuOpen]);

  async function handleSignOut(allDevices = false): Promise<void> {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      const accessToken = getAccessToken();
      const headers = new Headers();

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      await fetch(
        allDevices ? "/api/auth/logout-all-devices" : "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
          headers,
        },
      );
    } finally {
      clearAuthTokens();
      clearBrowserSessionHint();
      setAccountMenuOpen(false);
      router.replace("/auth/sign-in");
      router.refresh();
    }
  }

  const navigation = (
    <nav className={styles.nav} aria-label="API partner navigation">
      {apiPartnerNavigation.map((item) => {
        const Icon = navigationIcons.get(item.href) ?? PanelLeft;
        const active =
          currentPathname === item.href ||
          (item.href !== "/api-partner/dashboard" &&
            currentPathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            <Icon aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/api-partner/dashboard">
          <span className={styles.brandMark}>
            <Image
              alt="Asancha"
              height={30}
              src="/logo.png"
              style={{ height: "auto", width: "30px" }}
              width={30}
            />
          </span>
          <span className={styles.brandText}>
            Asancha
            <span>API partner</span>
          </span>
        </Link>
        <button
          className={styles.mobileButton}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="api-partner-mobile-navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <Menu aria-hidden="true" size={18} />
          Menu
        </button>
        <div className={styles.actions}>
          <div className={styles.accountMenu} ref={accountMenuRef}>
            <button
              aria-expanded={accountMenuOpen}
              aria-haspopup="menu"
              aria-label="Open account menu"
              className={styles.avatarButton}
              onClick={() => setAccountMenuOpen((value) => !value)}
              type="button"
            >
              <UserCircle aria-hidden="true" size={21} strokeWidth={2.4} />
            </button>

            {accountMenuOpen ? (
              <div className={styles.accountDropdown} role="menu">
                <div className={styles.accountDropdownHeader}>
                  <p>Account</p>
                  <span>Profile, security, notifications, and support</span>
                </div>

                <nav
                  aria-label="Account navigation"
                  className={styles.accountDropdownNav}
                >
                  {accountMenuItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                      currentPathname === item.href ||
                      currentPathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={`${styles.accountDropdownLink} ${
                          active ? styles.accountDropdownLinkActive : ""
                        }`}
                        href={item.href}
                        key={item.href}
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <Icon aria-hidden="true" size={16} strokeWidth={2.4} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className={styles.accountDropdownFooter}>
                  <button
                    className={styles.accountDropdownButton}
                    disabled={isSigningOut}
                    onClick={() => {
                      void handleSignOut(false);
                    }}
                    type="button"
                  >
                    <LogOut aria-hidden="true" size={16} strokeWidth={2.4} />
                    <span>Logout</span>
                  </button>

                  <button
                    className={`${styles.accountDropdownButton} ${styles.accountDropdownButtonDanger}`}
                    disabled={isSigningOut}
                    onClick={() => {
                      void handleSignOut(true);
                    }}
                    type="button"
                  >
                    <ShieldCheck
                      aria-hidden="true"
                      size={16}
                      strokeWidth={2.4}
                    />
                    <span>Logout from all devices</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarPanel}>
            <div className={styles.workspaceCard}>
              <span className={styles.workspaceLabel}>Partner console</span>
              <p>
                Manage API access, keys, usage, and integration readiness from
                one focused workspace.
              </p>
            </div>
            {navigation}
          </div>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>

      {mobileOpen ? (
        <div className={styles.mobilePanel} onClick={() => setMobileOpen(false)}>
          <div
            id="api-partner-mobile-navigation"
            className={styles.mobileNav}
            onClick={(event) => event.stopPropagation()}
          >
            {navigation}
          </div>
        </div>
      ) : null}
    </div>
  );
}
