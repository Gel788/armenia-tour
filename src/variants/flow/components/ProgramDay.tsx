import type { TourSection } from "../../../data/tour";
import { highlightLabels } from "../../../data/tour";
import { Eyebrow, fadeUpBlur, Grain, Reveal } from "./FlowEffects";
import { SectionOrnament, OrnamentWrap } from "./SectionOrnament";

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
  const isEven = index % 2 === 0;
  const dayNum = String(section.day ?? index + 1).padStart(2, "0");
  const lead = section.lead || section.body;
  const stops = section.stops ?? [];
  const highlights = section.highlights ?? [];

  return (
    <section
      className={`scroll-section relative overflow-hidden py-24 md:py-32 ${
        isEven ? "bg-ink-soft" : "bg-surface"
      }`}
      aria-labelledby={`day-${section.day}-title`}
    >
      <Grain />
      <SectionOrnament index={index} side={isEven ? "right" : "left"} />

      <span
        className={`pointer-events-none absolute top-8 select-none font-display text-[clamp(5rem,16vw,12rem)] font-semibold leading-none text-paper/[0.02] ${
          isEven ? "right-4 md:right-12" : "left-4 md:left-12"
        }`}
        aria-hidden
      >
        {dayNum}
      </span>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div
          className={`grid items-start gap-12 lg:grid-cols-[1fr_340px] lg:gap-20 xl:grid-cols-[1fr_380px] ${
            isEven ? "" : "lg:[direction:rtl]"
          }`}
        >
          <div className="lg:[direction:ltr]">
            <OrnamentWrap index={index}>
              <div className="relative px-1 py-2 md:px-2 md:py-3">
                <Reveal variant={fadeUpBlur}>
                  <Eyebrow>{section.tag}</Eyebrow>
                </Reveal>

                <Reveal variant={fadeUpBlur} delay={0.06}>
                  <h2
                    id={`day-${section.day}-title`}
                    className="mt-4 font-display text-balance text-3xl font-semibold leading-[1.06] text-paper md:text-4xl lg:text-[2.75rem]"
                  >
                    {section.title}
                  </h2>
                </Reveal>

                {section.subtitle && (
                  <Reveal variant={fadeUpBlur} delay={0.1}>
                    <p className="mt-3 text-xs uppercase tracking-[0.28em] text-accent">
                      {section.subtitle}
                    </p>
                  </Reveal>
                )}

                {lead && (
                  <Reveal variant={fadeUpBlur} delay={0.14}>
                    <p className="mt-7 max-w-2xl text-base leading-[1.85] text-paper-muted md:text-lg">
                      {lead}
                    </p>
                  </Reveal>
                )}

                {section.body && (
                  <Reveal variant={fadeUpBlur} delay={0.18}>
                    <p className="mt-6 max-w-2xl text-base leading-[1.85] text-paper-muted md:text-lg">
                      {section.body}
                    </p>
                  </Reveal>
                )}

                {stops.length > 0 && (
                  <div className="mt-12">
                    <Reveal variant={fadeUpBlur} delay={0.18}>
                      <p className="mb-8 text-[10px] uppercase tracking-[0.35em] text-paper-muted">
                        Маршрут
                      </p>
                    </Reveal>
                    <ol className="space-y-0">
                      {stops.map((stop, i) => (
                        <Reveal key={stop.title} variant={fadeUpBlur} delay={0.2 + i * 0.06}>
                          <li className="group flex gap-5 border-t border-line py-6 first:border-t-0 first:pt-0">
                            <span className="mt-0.5 font-display text-2xl font-semibold text-accent/50 transition-colors group-hover:text-accent">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <h3 className="font-display text-xl font-semibold text-paper md:text-2xl">
                                {stop.title}
                              </h3>
                              <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper-muted md:text-base">
                                {stop.description}
                              </p>
                            </div>
                          </li>
                        </Reveal>
                      ))}
                    </ol>
                  </div>
                )}

                {highlights.length > 0 && (
                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    {highlights.map((h, i) => (
                      <Reveal key={h.title} variant={fadeUpBlur} delay={0.25 + i * 0.08}>
                        <div className="flow-highlight rounded-sm border border-line bg-ink/50 p-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-accent" aria-hidden>
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
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </OrnamentWrap>
          </div>

          <div className="lg:[direction:ltr] lg:sticky lg:top-28 lg:self-start">
            <Reveal variant={fadeUpBlur} delay={0.1}>
              <OrnamentWrap index={index + 2}>
                <div className="flow-frame relative aspect-[3/4] overflow-hidden rounded-sm md:aspect-[4/5]">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <span className="font-display text-6xl font-semibold leading-none text-paper">
                      {dayNum}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-paper-muted">
                      {section.tag}
                    </span>
                  </div>
                </div>
              </OrnamentWrap>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
