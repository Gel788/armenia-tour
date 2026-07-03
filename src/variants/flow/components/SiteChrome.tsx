import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent } from "motion/react";
import { useActiveSection, useScrollProgress } from "../../../hooks/useScrollProgress";
import { contact } from "../../../data/tour";
import { PrimaryCta } from "./FlowEffects";

const NAV = [
  { href: "#program", label: "Программа" },
  { href: "#day-1", label: "01" },
  { href: "#day-2", label: "02" },
  { href: "#day-3", label: "03" },
  { href: "#day-4", label: "04" },
  { href: "#gallery", label: "Фото" },
  { href: "#included", label: "Включено" },
] as const;

const SECTION_IDS = [
  "hero",
  "program",
  "day-1",
  "day-2",
  "day-3",
  "day-4",
  "gallery",
  "included",
  "outro",
] as const;

export function FlowNav() {
  const active = useActiveSection([...SECTION_IDS], "hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollYProgress = useScrollProgress();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrolled(v > 0.04);
  });

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-[padding,background] duration-500 ${
          scrolled ? "py-3" : "py-5 md:py-6"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-500 md:px-10 ${
            scrolled
              ? "rounded-full border border-line/50 bg-ink/88 py-2.5 pl-5 pr-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] md:mx-8 lg:mx-auto"
              : ""
          }`}
        >
          <a
            href="#hero"
            className="font-display text-lg tracking-[0.12em] text-paper md:text-xl"
          >
            ARMENIA
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Навигация">
            {NAV.map((item) => {
              const id = item.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-paper-muted hover:text-paper"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <PrimaryCta href="#outro" className="hidden !px-5 !py-2.5 sm:inline-flex">
              Забронировать
            </PrimaryCta>
            <button
              type="button"
              className="rounded-full border border-line/60 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-paper lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
            >
              Меню
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/97 lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-display text-xl text-paper">ARMENIA</span>
              <button
                type="button"
                className="text-sm text-paper-muted"
                onClick={() => setOpen(false)}
              >
                Закрыть
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center px-8">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-line py-5 font-display text-3xl text-paper"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#outro"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center text-[11px] uppercase tracking-[0.2em] text-accent"
              >
                Забронировать тур →
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function StickyBookBar() {
  const [visible, setVisible] = useState(false);
  const scrollYProgress = useScrollProgress();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setVisible(v > 0.08 && v < 0.92);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-line/60 bg-ink/95 p-4 sm:hidden"
        >
          <div className="flex gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="flex flex-1 items-center justify-center rounded-full border border-line py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-paper"
            >
              Email
            </a>
            <a
              href="#outro"
              className="flex flex-[2] items-center justify-center rounded-full bg-accent py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink"
            >
              Забронировать
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
