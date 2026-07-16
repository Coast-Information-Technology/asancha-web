// File: app/account/layout.tsx

/**
 * Asancha Account Layout
 *
 * Purpose:
 * Wraps authenticated account routes with the account navigation shell.
 */

import type {
    ReactNode,
} from "react";

import { AccountShell } from "./_components/account-shell";

export interface AccountLayoutProps {
    children: ReactNode;
}

export default function AccountLayout({
    children,
}: AccountLayoutProps) {
    return (
        <AccountShell>
            {children}
        </AccountShell>
    );
}