import type { TourSection } from "../../../data/tour.types";
import { Eyebrow, fadeUpBlur, Grain, Reveal } from "./FlowEffects";
import { SectionOrnament, OrnamentWrap } from "./SectionOrnament";

type ProgramIntroProps = {
  section: TourSection;
};

export function ProgramIntro({ section }: ProgramIntroProps) {
  return (
    <section
      id="program"
      className="scroll-section relative overflow-hidden bg-ink py-28 md:py-36"
      aria-labelledby="program-title"
    >
      <Grain />
      <SectionOrnament variant="chevron" side="right" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 md:px-12 lg:px-20">
        <div>
          <OrnamentWrap variant="vertical">
            <div className="relative px-1 py-2 md:px-2 md:py-3">
              <Reveal variant={fadeUpBlur}>
                <Eyebrow>Программа</Eyebrow>
              </Reveal>

              <Reveal variant={fadeUpBlur} delay={0.08}>
                <h2
                  id="program-title"
                  className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] text-paper md:text-5xl lg:text-[3.5rem]"
                >
                  Каждый день —{" "}
                  <span className="text-accent">новая глава</span>
                </h2>
              </Reveal>

              <Reveal variant={fadeUpBlur} delay={0.16}>
                <p className="mt-8 max-w-lg text-lg leading-[1.85] text-paper-muted">
                  {section.body}
                </p>
              </Reveal>

              <Reveal variant={fadeUpBlur} delay={0.24}>
                <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-10">
                  {[
                    { n: "04", t: "дня" },
                    { n: "09", t: "локаций" },
                    { n: "03", t: "ночи" },
                  ].map((s) => (
                    <div key={s.t}>
                      <p className="font-display text-3xl font-semibold text-paper md:text-4xl">
                        {s.n}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-paper-muted">
                        {s.t}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </OrnamentWrap>
        </div>

        <Reveal variant={fadeUpBlur} delay={0.12} className="relative">
          <OrnamentWrap variant="chevron">
            <div className="flow-frame relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src={section.image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-display text-2xl italic text-paper/90">
                  «От ущелий до альпийских лугов»
                </p>
              </div>
            </div>
          </OrnamentWrap>
          <div
            className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-sm border border-accent/20"
            aria-hidden
          />
        </Reveal>
      </div>
    </section>
  );
}
