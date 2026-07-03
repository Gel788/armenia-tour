import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTourContent } from "../../../context/TourContentContext";
import { GhostCta, Grain, PrimaryCta } from "./FlowEffects";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  body: string;
  image: string;
  gallery?: string[];
};

export function HeroSection({
  title,
  subtitle,
  body,
  image,
}: HeroSectionProps) {
  const { content } = useTourContent();
  const heroStats = content.heroStats;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const letters = title.split("");

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Монастырь Хор Вирап и вид на гору Арарат, Армения"
          className="h-full w-full object-cover object-[center_45%] md:object-[center_42%]"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/35 to-transparent md:from-ink/82 md:via-ink/18" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_28%,transparent_0%,color-mix(in_srgb,var(--color-ink)_28%,transparent)_68%)]" />
        <Grain />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-10 pt-28 md:px-12 md:pb-16 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-20">
            <div className="hero-copy-panel max-w-xl lg:max-w-2xl">
              {subtitle && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="hero-eyebrow mb-7 flex items-center gap-4 md:mb-8"
                >
                  <span className="hero-eyebrow-line" aria-hidden />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-accent md:text-[11px]">
                    {subtitle}
                  </p>
                </motion.div>
              )}

              <motion.h1
                id="hero-title"
                initial={reduced ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="hero-title font-display font-semibold text-paper"
                aria-label={title}
              >
                <span className="sr-only">{title}</span>
                <span aria-hidden className="hero-title-track">
                  {letters.map((char, i) => (
                    <motion.span
                      key={`${char}-${i}`}
                      initial={reduced ? false : { opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.26 + i * 0.045,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={char === " " ? "hero-title-space" : "hero-title-char"}
                    >
                      {char === " " ? "\u00a0" : char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              <motion.div
                initial={reduced ? false : { opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.52 }}
                className="hero-title-rule mt-5 md:mt-6"
                aria-hidden
              />

              <motion.p
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.58 }}
                className="hero-tagline mt-5 font-display text-xl leading-[1.35] text-paper/92 md:mt-6 md:text-[1.65rem] md:leading-[1.32]"
              >
                Путешествие,{" "}
                <span className="italic text-paper/78">которое запомнится навсегда</span>
              </motion.p>

              <motion.p
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.68 }}
                className="hero-body mt-6 max-w-[26rem] text-[0.9375rem] leading-[1.9] tracking-[0.01em] text-paper-muted md:mt-7 md:text-base md:leading-[1.88]"
              >
                {body}
              </motion.p>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.78 }}
                className="mt-9 flex flex-wrap items-center gap-3 md:mt-10"
              >
                <PrimaryCta href="#program">Смотреть программу</PrimaryCta>
                <GhostCta href="#outro">Забронировать</GhostCta>
              </motion.div>
            </div>

            <motion.aside
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85 }}
              className="hero-stats-panel hidden lg:block"
              aria-label="Ключевые цифры тура"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-paper-muted">
                За 4 дня
              </p>
              <div className="mt-7 space-y-0">
                {heroStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`hero-stat-row flex items-end justify-between gap-6 py-6 ${
                      i < heroStats.length - 1 ? "border-b border-line/50" : ""
                    }`}
                  >
                    <span className="font-display text-[3.25rem] font-semibold leading-none tabular-nums tracking-[-0.03em] text-accent">
                      {stat.value}
                    </span>
                    <span className="max-w-[9rem] pb-1 text-right text-sm leading-snug text-paper-muted">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.9 }}
            className="hero-stats-mobile mt-10 lg:hidden"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="hero-stat-mobile text-center">
                <p className="font-display text-3xl font-semibold leading-none text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-paper-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:flex md:flex-col md:items-center md:gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        aria-hidden
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-paper-muted/80">
          Листайте
        </span>
        <div className="relative h-9 w-px overflow-hidden bg-paper/20">
          <div className="absolute inset-x-0 h-2.5 animate-[scroll-cue_2s_ease-in-out_infinite] bg-accent/80" />
        </div>
      </motion.div>
    </section>
  );
}
