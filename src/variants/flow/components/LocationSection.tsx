import type { TourSection } from "../../../data/tour";
import { Eyebrow, fadeUpBlur, Grain, Reveal } from "./FlowEffects";
import { SectionOrnament, OrnamentWrap } from "./SectionOrnament";

type LocationSectionProps = {
  section: TourSection;
  index: number;
};

export function LocationSection({ section, index }: LocationSectionProps) {
  const reversed = index % 2 === 1;
  const gallery = section.gallery ?? [];

  return (
    <section
      id={section.id}
      className={`scroll-section relative overflow-hidden py-20 md:py-28 ${
        reversed ? "bg-surface" : "bg-ink-soft"
      }`}
      aria-labelledby={`loc-${section.id}-title`}
    >
      <Grain />
      <SectionOrnament index={index + 1} side={reversed ? "left" : "right"} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div
          className={`grid items-start gap-10 lg:grid-cols-2 lg:gap-16 ${
            reversed ? "lg:[direction:rtl]" : ""
          }`}
        >
          <Reveal variant={fadeUpBlur} className="lg:[direction:ltr]">
            <OrnamentWrap index={index}>
              <div className="flow-frame relative aspect-[4/5] overflow-hidden rounded-sm">
                <img
                  src={section.image}
                  alt={section.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                {section.tag && (
                  <span className="absolute bottom-4 left-4 rounded-full border border-line/60 bg-ink/80 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-accent">
                    {section.tag}
                  </span>
                )}
              </div>
            </OrnamentWrap>
          </Reveal>

          <div className="lg:[direction:ltr]">
            <OrnamentWrap index={index + 1}>
              <div className="relative px-1 py-2 md:px-2 md:py-3">
                <Reveal variant={fadeUpBlur}>
                  <Eyebrow>День {section.day}</Eyebrow>
                </Reveal>
                <Reveal variant={fadeUpBlur} delay={0.06}>
                  <h3
                    id={`loc-${section.id}-title`}
                    className="mt-4 font-display text-3xl font-semibold text-paper md:text-4xl"
                  >
                    {section.title}
                  </h3>
                </Reveal>
                <Reveal variant={fadeUpBlur} delay={0.12}>
                  <p className="mt-6 text-base leading-[1.85] text-paper-muted md:text-lg">
                    {section.body}
                  </p>
                </Reveal>

                {gallery.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {gallery.map((src, i) => (
                      <Reveal key={src} variant={fadeUpBlur} delay={0.16 + i * 0.06}>
                        <div className="aspect-square overflow-hidden rounded-sm transition-transform duration-500 hover:scale-[1.03]">
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </OrnamentWrap>
          </div>
        </div>
      </div>
    </section>
  );
}
