import { useEffect, useRef } from "react";
import { gsap } from "../../hooks/useSmoothScroll";
import type { TourSection } from "../../data/tour";
import { GrainOverlay, SectionLabel } from "../ui/SlideEffects";

type ProgramIntroProps = {
  section: TourSection;
};

export function ProgramIntro({ section }: ProgramIntroProps) {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(textRef.current?.children ?? [], {
        y: 48,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(imageRef.current, {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.4,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="program"
      className="relative overflow-hidden bg-surface py-28 md:py-36"
      aria-labelledby="program-title"
    >
      <GrainOverlay />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:px-12 lg:px-20">
        <div ref={textRef}>
          <SectionLabel>Программа</SectionLabel>
          <h2
            id="program-title"
            className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] text-paper md:text-5xl lg:text-[3.25rem]"
          >
            {section.title}
          </h2>
          <div className="my-8 h-px w-20 bg-accent" />
          <p className="max-w-xl text-lg leading-[1.85] text-paper-muted md:text-xl">
            {section.body}
          </p>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-line pt-10">
            {[
              { num: "04", label: "дня" },
              { num: "09", label: "локаций" },
              { num: "03", label: "ночи" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-semibold text-accent md:text-5xl">
                  {stat.num}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-paper-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={imageRef}
          className="slide-frame relative aspect-[4/5] overflow-hidden rounded-sm"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <img
            src={section.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
