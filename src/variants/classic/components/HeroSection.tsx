import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "../../../hooks/useSmoothScroll";
import { GrainOverlay, ScrollCue } from "./ui/SlideEffects";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  body: string;
  image: string;
  gallery?: string[];
};

const HERO_STATS = [
  { value: "3", label: "дня тура" },
  { value: "9", label: "локаций" },
  { value: "100%", label: "природа" },
];

export function HeroSection({
  title,
  subtitle,
  body,
  image,
  gallery = [],
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        revealRef.current,
        { scaleY: 1 },
        { scaleY: 0, duration: 1.3, ease: "power3.inOut", transformOrigin: "top" },
      )
        .fromTo(
          imageInnerRef.current,
          { scale: 1.35, filter: "brightness(0.4)" },
          { scale: 1, filter: "brightness(1)", duration: 2.4, ease: "power2.out" },
          "-=0.9",
        )
        .from(
          titleRef.current?.querySelectorAll("[data-char]") ?? [],
          { y: "130%", opacity: 0, rotateX: -55, stagger: 0.045, duration: 1.15 },
          "-=1.6",
        )
        .from(
          contentRef.current?.querySelectorAll("[data-hero-item]") ?? [],
          { y: 40, opacity: 0, stagger: 0.1, duration: 0.85 },
          "-=0.7",
        )
        .from(
          galleryRef.current?.children ?? [],
          { y: 80, opacity: 0, rotate: 6, stagger: 0.12, duration: 1, ease: "power3.out" },
          "-=0.5",
        );

      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden"
      aria-label="Главный экран"
    >
      {/* Opening curtain */}
      <div
        ref={revealRef}
        className="pointer-events-none absolute inset-0 z-30 origin-top bg-ink"
        aria-hidden
      />

      {/* Background layers */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <div ref={imageInnerRef} className="absolute inset-0 will-change-transform">
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.35] saturate-125"
            aria-hidden
          />
          <img
            src={image}
            alt="Панорама Армении"
            className="relative h-[118%] w-full object-cover object-[center_30%]"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_15%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,color-mix(in_srgb,var(--color-sky)_12%,transparent),transparent_45%)]" />
        <GrainOverlay />

        {/* Frame lines */}
        <div className="pointer-events-none absolute inset-6 border border-paper/[0.06] md:inset-10 lg:inset-14" aria-hidden />
        <div className="pointer-events-none absolute left-6 top-1/2 hidden h-24 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-accent/40 to-transparent md:block lg:left-14" aria-hidden />
      </div>

      {/* Giant watermark */}
      <div
        className="pointer-events-none absolute bottom-[12%] left-1/2 z-[1] -translate-x-1/2 select-none font-display text-[clamp(6rem,22vw,18rem)] font-semibold leading-none tracking-[-0.04em] text-paper/[0.03]"
        aria-hidden
      >
        {title}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-10 pt-32 md:px-12 md:pb-16 lg:px-20 lg:pb-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div ref={contentRef}>
            {subtitle && (
              <p
                data-hero-item
                className="mb-5 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.4em] text-accent"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {subtitle}
              </p>
            )}

            <h1
              ref={titleRef}
              className="relative font-display text-[clamp(3.5rem,13vw,10rem)] font-semibold leading-[0.82] tracking-[-0.03em] text-paper perspective-[700px]"
            >
              {title.split("").map((char, i) => (
                <span
                  key={i}
                  data-char
                  className="inline-block origin-bottom"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {char}
                </span>
              ))}
            </h1>

            <p
              data-hero-item
              className="mt-7 max-w-lg text-balance text-base leading-[1.8] text-paper-muted md:mt-8 md:text-lg"
            >
              {body}
            </p>

            {/* Stats */}
            <div
              data-hero-item
              className="mt-10 flex flex-wrap gap-8 border-t border-line/80 pt-8 md:gap-12"
            >
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-paper md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-paper-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div data-hero-item className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#day-1"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-shadow duration-500 hover:glow-nature"
              >
                Начать путешествие
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  aria-hidden
                >
                  →
                </motion.span>
              </a>
              <a
                href="#outro"
                className="inline-flex items-center gap-3 rounded-full border border-paper/20 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper transition-all duration-300 hover:border-accent/50 hover:text-accent"
              >
                Забронировать
              </a>
            </div>
          </div>

          {/* Gallery fan */}
          {gallery.length > 0 && (
            <div
              ref={galleryRef}
              className="hidden shrink-0 lg:flex lg:flex-col lg:items-end lg:gap-3 lg:pb-2"
            >
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-paper-muted">
                Маршрут в кадрах
              </p>
              <div className="relative h-[340px] w-[280px]">
                {gallery.slice(0, 4).map((src, i) => (
                  <motion.div
                    key={src}
                    whileHover={{ y: -6, zIndex: 10, rotate: 0 }}
                    className="slide-frame absolute overflow-hidden rounded-sm shadow-2xl transition-shadow duration-500 hover:glow-nature"
                    style={{
                      width: 200 - i * 8,
                      top: i * 28,
                      right: i * 14,
                      rotate: `${(i - 1.5) * 4}deg`,
                      zIndex: 4 - i,
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile gallery strip */}
        {gallery.length > 0 && (
          <div className="mt-10 flex gap-3 overflow-x-auto pb-2 lg:hidden">
            {gallery.slice(0, 4).map((src) => (
              <div
                key={src}
                className="slide-frame h-24 w-20 shrink-0 overflow-hidden rounded-sm"
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto mt-12 flex w-full max-w-7xl justify-center md:mt-16 md:justify-end">
          <ScrollCue />
        </div>
      </div>
    </section>
  );
}
