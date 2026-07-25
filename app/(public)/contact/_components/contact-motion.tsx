"use client";

// File: app/(public)/contact/_components/contact-motion.tsx

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
      whileInView="show"
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      whileInView="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerOl({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.ol
      className={className}
      initial="hidden"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      whileInView="show"
    >
      {children}
    </motion.ol>
  );
}

export function RevealItem({ children }: { children: ReactNode }) {
  return <motion.div variants={itemReveal}>{children}</motion.div>;
}
