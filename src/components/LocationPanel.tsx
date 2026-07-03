import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../hooks/useSmoothScroll";
import type { TourSection } from "../data/tour";
import { GrainOverlay, SectionLabel } from "./ui/SlideEffects";

type LocationPanelProps = {
  section: TourSection;
  index: number;
};

export function LocationPanel({ section, index }: LocationPanelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageLayersRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const isReversed = index % 2 !== 0;
  const gallery = section.gallery ?? [];
  const allImages = [section.image, ...gallery];
  const totalLocations = 9;
  const scrollHeight = gallery.length > 0 ? "160vh" : "130vh";

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const scrollConfig = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      };

      gsap.fromTo(
        imageWrapRef.current,
        { scale: 1.06, y: 20 },
        { scale: 1, y: -16, ease: "none", scrollTrigger: scrollConfig },
      );

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: scrollConfig },
      );

      if (imageLayersRef.current && allImages.length > 1) {
        const layers = Array.from(
          imageLayersRef.current.querySelectorAll<HTMLElement>("[data-layer]"),
        );

        ScrollTrigger.create({
          ...scrollConfig,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * allImages.length),
              allImages.length - 1,
            );

            layers.forEach((layer, i) => {
              layer.style.opacity = i === idx ? "1" : "0";
            });

            galleryRef.current
              ?.querySelectorAll("[data-gallery-item]")
              .forEach((el, i) => {
                el.classList.toggle("is-active", i + 1 === idx);
              });
          },
        });
      }

      gsap.from(textRef.current?.children ?? [], {
        y: 36,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stickyRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [allImages.length]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink"
      style={{ height: scrollHeight }}
      aria-labelledby={`loc-${section.id}`}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-[100svh] flex-col overflow-hidden"
      >
        <GrainOverlay />

        <div
          className={`pointer-events-none absolute top-8 z-20 font-display text-[10rem] font-semibold leading-none text-paper/[0.025] md:text-[14rem] ${isReversed ? "right-8 md:right-16" : "left-8 md:left-16"}`}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="absolute inset-0 flex flex-col md:flex-row">
          <div
            className={`relative flex flex-col md:h-full md:w-[58%] ${isReversed ? "md:order-2" : ""}`}
          >
            <div className="relative h-[50%] overflow-hidden md:h-[70%]">
              <div
                ref={imageWrapRef}
                className="slide-frame absolute inset-3 overflow-hidden rounded-sm will-change-transform md:inset-4"
              >
                <div ref={imageLayersRef} className="relative h-full w-full">
                  {allImages.map((src, i) => (
                    <img
                      key={src}
                      data-layer
                      src={src}
                      alt={i === 0 ? (section.tag ?? section.title) : ""}
                      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-accent/5" />

                <div className="absolute left-4 top-4 rounded-full border border-line/60 bg-ink/50 px-3 py-1 backdrop-blur-md">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-paper-muted">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(totalLocations).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {gallery.length > 0 && (
              <div
                ref={galleryRef}
                className="flex flex-1 items-center gap-2 px-3 pb-3 md:gap-3 md:px-4 md:pb-4"
              >
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    data-gallery-item
                    className="group relative min-w-0 flex-1 overflow-hidden rounded-sm border border-transparent transition-all duration-700 [&.is-active]:border-accent [&.is-active]:glow-nature"
                    aria-label={`Фото ${i + 2}`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 md:aspect-auto md:h-24"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className={`relative flex flex-1 flex-col justify-center px-6 py-8 md:px-12 lg:px-16 ${isReversed ? "md:order-1 md:items-end md:text-right" : ""}`}
          >
            <div ref={textRef} className="max-w-md">
              <SectionLabel className={isReversed ? "md:flex-row-reverse" : ""}>
                {section.tag}
                {section.day && (
                  <span className="ml-2 text-paper-muted normal-case tracking-normal">
                    · День {section.day}
                  </span>
                )}
              </SectionLabel>

              <h2
                id={`loc-${section.id}`}
                className="mt-4 font-display text-balance text-3xl font-semibold leading-tight text-paper md:text-4xl lg:text-[2.75rem]"
              >
                {section.title}
              </h2>

              <div
                className={`my-6 h-px w-16 bg-gradient-to-r from-accent to-transparent ${isReversed ? "md:ml-auto md:bg-gradient-to-l" : ""}`}
              />

              <p className="text-sm leading-[1.9] text-paper-muted md:text-base">
                {section.body}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-line/50">
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-accent to-accent/40"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
