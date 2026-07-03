import { useEffect, useRef } from "react";
import { gsap } from "../../hooks/useSmoothScroll";
import type { TourSection } from "../../data/tour";
import { highlightLabels } from "../../data/tour";
import { GrainOverlay, SectionLabel } from "../ui/SlideEffects";

type ProgramDayProps = {
  section: TourSection;
  index: number;
};

const highlightIcons: Record<string, string> = {
  meal: "◆",
  stay: "◇",
  evening: "✦",
  activity: "→",
};

export function ProgramDay({ section, index }: ProgramDayProps) {
  const ref = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(timelineRef.current?.children ?? [], {
        x: isEven ? -32 : 32,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 68%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(imageRef.current, {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [index, isEven]);

  const dayNum = String(section.day ?? index + 1).padStart(2, "0");
  const lead = section.lead || section.body;
  const stops = section.stops ?? [];
  const highlights = section.highlights ?? [];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-soft py-24 md:py-32"
      aria-labelledby={`day-${section.day}-title`}
    >
      <span
        className={`pointer-events-none absolute top-12 select-none font-display text-[clamp(6rem,18vw,14rem)] font-semibold leading-none text-paper/[0.025] ${
          isEven ? "right-4 md:right-16" : "left-4 md:left-16"
        }`}
        aria-hidden
      >
        {dayNum}
      </span>

      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div
          className={`grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-20 ${
            isEven ? "" : "lg:[direction:rtl]"
          }`}
        >
          {/* Контент программы */}
          <div ref={timelineRef} className="lg:[direction:ltr]">
            <SectionLabel>{section.tag}</SectionLabel>

            <h2
              id={`day-${section.day}-title`}
              className="mt-4 font-display text-balance text-3xl font-semibold leading-[1.08] text-paper md:text-4xl lg:text-5xl"
            >
              {section.title}
            </h2>

            {section.subtitle && (
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-accent">
                {section.subtitle}
              </p>
            )}

            {lead && (
              <p className="mt-8 max-w-2xl text-base leading-[1.85] text-paper-muted md:text-lg">
                {lead}
              </p>
            )}

            {section.body && (
              <p className="mt-4 max-w-2xl text-base leading-[1.85] text-paper-muted">
                {section.body}
              </p>
            )}

            {stops.length > 0 && (
              <div className="program-timeline mt-12">
                <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-paper-muted">
                  Маршрут дня
                </p>
                <ol className="space-y-0">
                  {stops.map((stop, i) => (
                    <li key={stop.title} className="program-stop group relative flex gap-5 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface text-[11px] font-medium text-accent">
                          {i + 1}
                        </span>
                        {i < stops.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-line min-h-[2rem]" aria-hidden />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-display text-xl font-semibold text-paper transition-colors group-hover:text-accent md:text-2xl">
                          {stop.title}
                        </h3>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper-muted md:text-base">
                          {stop.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {highlights.length > 0 && (
              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="program-highlight rounded-sm border border-line bg-surface/80 p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-accent" aria-hidden>
                        {highlightIcons[h.kind]}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-paper-muted">
                        {highlightLabels[h.kind]}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-lg font-semibold text-paper">
                      {h.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                      {h.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Фото дня */}
          <div ref={imageRef} className="lg:[direction:ltr] lg:sticky lg:top-28">
            <div className="slide-frame relative aspect-[3/4] overflow-hidden rounded-sm md:aspect-[4/5]">
              <img
                src={section.image}
                alt={section.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                <span className="font-display text-5xl font-semibold text-paper/90">
                  {dayNum}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-paper-muted">
                  {section.tag}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
