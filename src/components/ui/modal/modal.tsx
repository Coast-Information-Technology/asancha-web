"use client";

// File: src/components/ui/modal/modal.tsx

/**
 * Asancha Modal Component
 *
 * Purpose:
 * Provides a simple accessible modal wrapper for Asancha Web Public.
 *
 * Main responsibilities:
 * - Reuse dialog behaviour for modal-style flows
 * - Support business profile switcher, confirmations, and guided actions
 * - Keep modal copy safe and user-facing
 *
 * Security note:
 * Modal state must not replace backend permission checks.
 */

import { Dialog } from "../dialog/dialog";

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  closeLabel?: string;
}

/**
 * Renders a controlled accessible modal.
 */
export function Modal(props: ModalProps) {
  return <Dialog {...props} />;
}
