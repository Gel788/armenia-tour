import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger } from "../hooks/useSmoothScroll";

const NAV_ITEMS = [
  { href: "#program", label: "Программа", num: "—" },
  { href: "#day-1", label: "День 1", num: "01" },
  { href: "#day-2", label: "День 2", num: "02" },
  { href: "#day-3", label: "День 3", num: "03" },
  { href: "#day-4", label: "День 4", num: "04" },
] as const;

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    const ctx = gsap.context(() => {
      const tween = { scaleX: 1, ease: "none" as const };
      gsap.to(barRef.current, {
        ...tween,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
      gsap.to(glowRef.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px]"
      role="progressbar"
      aria-label="Прогресс прокрутки"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="absolute inset-0 bg-line/30" />
      <div
        ref={barRef}
        className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
      <div
        ref={glowRef}
        className="absolute inset-y-0 left-0 w-full origin-left opacity-0 glow-nature"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
        aria-hidden
      />
    </div>
  );
}

function NavLink({
  href,
  label,
  num,
  active,
  heroMode,
}: {
  href: string;
  label: string;
  num: string;
  active: boolean;
  heroMode: boolean;
}) {
  return (
    <a
      href={href}
      className={`group relative flex items-center gap-3 rounded-full px-3 py-2 transition-colors duration-300 ${heroMode ? "hover:bg-paper/[0.06]" : ""}`}
      aria-current={active ? "true" : undefined}
    >
      <span
        className={`font-display text-base tabular-nums transition-colors duration-300 md:text-lg ${active ? "text-accent" : "text-paper-muted/50 group-hover:text-accent/70"}`}
      >
        {num}
      </span>
      <span className="relative overflow-hidden">
        <span
          className={`block text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 md:text-[11px] ${active ? "text-paper" : "text-paper-muted group-hover:text-paper"}`}
        >
          {label}
        </span>
        <span
          className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-500 ease-out ${active ? "w-full" : "w-0 group-hover:w-full"}`}
        />
      </span>
    </a>
  );
}

export function SiteNav() {
  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const heroMode = !scrolled;

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });

      for (const item of NAV_ITEMS) {
        const id = item.href.slice(1);
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveDay(id),
          onEnterBack: () => setActiveDay(id),
        });
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 1.1, defaults: { ease: "power4.out" } })
        .from(headerRef.current, { y: -80, opacity: 0, duration: 1 })
        .from(logoRef.current, { x: -30, opacity: 0, duration: 0.8 }, "-=0.7")
        .from(
          innerRef.current?.querySelectorAll("[data-nav-item]") ?? [],
          { y: -20, opacity: 0, stagger: 0.07, duration: 0.55 },
          "-=0.55",
        )
        .from(ctaRef.current, { scale: 0.85, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          heroLineRef.current,
          { scaleX: 0, duration: 1.2, ease: "power3.inOut" },
          "-=0.8",
        );
    }, headerRef);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTop = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ease-out ${heroMode ? "pt-0" : "pt-3"}`}
      >
        <div
          className={`transition-all duration-700 ease-out ${
            heroMode
              ? "w-full px-5 md:px-12 lg:px-20"
              : "mx-auto max-w-[calc(100%-2rem)] px-4 md:max-w-6xl md:px-6 lg:px-10"
          }`}
        >
          <div
            ref={innerRef}
            className={`relative flex items-center justify-between transition-all duration-700 ease-out ${
              heroMode
                ? "border-b border-line/40 bg-ink/20 px-0 py-5 backdrop-blur-md md:py-6"
                : "rounded-full border border-line/70 bg-ink/80 px-5 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:px-8"
            }`}
          >
            {!heroMode && (
              <div
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-accent/[0.05] via-transparent to-sky/[0.04]"
                aria-hidden
              />
            )}

            <a
              ref={logoRef}
              href="#"
              onClick={scrollTop}
              className="group relative z-10 flex items-center gap-3 md:gap-4"
            >
              <span
                className={`flex items-center justify-center rounded-full border border-accent/35 bg-accent/8 transition-all duration-500 group-hover:border-accent/55 group-hover:bg-accent/12 group-hover:glow-nature ${heroMode ? "h-11 w-11 md:h-12 md:w-12" : "h-9 w-9"}`}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`text-accent transition-transform duration-500 group-hover:scale-110 ${heroMode ? "h-5 w-5" : "h-4 w-4"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                  <path d="M12 22V12M4 7l8 5 8-5" />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <span
                  className={`font-display font-semibold tracking-[0.14em] text-paper transition-colors group-hover:text-accent ${heroMode ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
                >
                  ARMENIA
                </span>
                <span className="mt-1.5 text-[9px] uppercase tracking-[0.38em] text-paper-muted transition-colors group-hover:text-accent/80">
                  Tour · 3 days
                </span>
              </span>
            </a>

            <nav
              className="relative z-10 hidden items-center gap-2 md:flex lg:gap-4"
              aria-label="Разделы тура"
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.href} data-nav-item>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    num={item.num}
                    active={activeDay === item.href.slice(1)}
                    heroMode={heroMode}
                  />
                </div>
              ))}
            </nav>

            <div className="relative z-10 flex items-center gap-3">
              <a
                ref={ctaRef}
                href="#outro"
                className={`group relative hidden overflow-hidden rounded-full md:inline-flex ${
                  heroMode
                    ? "bg-accent px-7 py-3 glow-nature"
                    : "border border-accent/40 px-6 py-2.5"
                }`}
              >
                {!heroMode && (
                  <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                )}
                <span
                  className={`relative z-10 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 ${heroMode ? "text-ink" : "text-accent group-hover:text-ink"}`}
                >
                  Забронировать
                </span>
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className={`relative flex items-center justify-center rounded-full border border-line/70 backdrop-blur-sm transition-colors hover:border-accent/40 ${heroMode ? "h-11 w-11 bg-ink/30" : "h-10 w-10 bg-surface/50"} md:hidden`}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              >
                <div className="flex w-4 flex-col gap-1.5">
                  <motion.span
                    animate={
                      menuOpen
                        ? { rotate: 45, y: 5, width: "100%" }
                        : { rotate: 0, y: 0, width: "75%" }
                    }
                    className="ml-auto block h-px origin-center bg-paper"
                    transition={{ duration: 0.35 }}
                  />
                  <motion.span
                    animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    className="block h-px w-full bg-paper"
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    animate={
                      menuOpen
                        ? { rotate: -45, y: -5, width: "100%" }
                        : { rotate: 0, y: 0, width: "50%" }
                    }
                    className="block h-px origin-center bg-paper"
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </button>
            </div>
          </div>

          {heroMode && (
            <div
              ref={heroLineRef}
              className="mx-auto mt-0 h-px max-w-7xl origin-left bg-gradient-to-r from-transparent via-accent/50 to-transparent"
              style={{ transform: "scaleX(0)" }}
              aria-hidden
            />
          )}
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="flex h-full flex-col justify-center px-10"
              aria-label="Мобильная навигация"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className="group border-b border-line py-6"
                >
                  <span className="font-display text-5xl font-semibold text-paper/20 transition-colors group-hover:text-accent">
                    {item.num}
                  </span>
                  <span className="mt-1 block text-sm uppercase tracking-[0.3em] text-paper">
                    {item.label}
                  </span>
                </motion.a>
              ))}

              <motion.a
                href="#outro"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink"
              >
                Забронировать тур
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
