import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variants;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-6% 0px -6% 0px" }}
      variants={variant}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-accent">
      {children}
    </p>
  );
}

export function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export function PrimaryCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink shadow-[0_8px_32px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)] ${className}`}
    >
      {children}
    </motion.a>
  );
}

export function GhostCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full border border-paper/15 bg-paper/[0.04] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent ${className}`}
    >
      {children}
    </a>
  );
}
