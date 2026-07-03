import { useEffect, useRef, useMemo } from "react";
import { gsap } from "../../../hooks/useSmoothScroll";
import { tourSections } from "../../../data/tour";
import { GrainOverlay } from "./ui/SlideEffects";

type GalleryItem = {
  id: string;
  src: string;
  tag: string;
  title: string;
};

export function HorizontalGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const items = useMemo<GalleryItem[]>(() => {
    const result: GalleryItem[] = [];
    for (const loc of tourSections.filter((s) => s.type === "location")) {
      result.push({
        id: `${loc.id}-main`,
        src: loc.image,
        tag: loc.tag ?? loc.title,
        title: loc.title,
      });
      for (const src of loc.gallery ?? []) {
        result.push({
          id: `${loc.id}-${src}`,
          src,
          tag: loc.tag ?? loc.title,
          title: loc.title,
        });
      }
    }
    return result;
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const track = trackRef.current;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children ?? [], {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 100)}`,
          pin: true,
          pinSpacing: true,
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section
      ref={wrapperRef}
      className="relative overflow-hidden bg-ink-soft"
      aria-labelledby="gallery-title"
    >
      <GrainOverlay />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-soft to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-soft to-transparent md:w-40" />

      <div
        ref={headerRef}
        className="absolute left-6 top-10 z-20 md:left-12 lg:left-20"
      >
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
          <span className="h-px w-8 bg-accent/60" />
          Фотогалерея
        </p>
        <h2
          id="gallery-title"
          className="mt-3 font-display text-3xl font-semibold text-paper md:text-5xl"
        >
          Все фото маршрута
        </h2>
        <p className="mt-2 text-sm text-paper-muted">{items.length} кадров</p>
      </div>

      <div
        ref={trackRef}
        className="flex h-[100svh] items-center gap-5 px-6 pt-28 will-change-transform md:gap-6 md:px-12 md:pt-32 lg:px-20"
      >
        {items.map((item, i) => (
          <figure
            key={item.id}
            data-gallery-card
            className="group relative h-[58vh] w-[78vw] shrink-0 overflow-hidden rounded-sm md:h-[62vh] md:w-[36vw] lg:w-[30vw]"
          >
            <div className="slide-frame absolute inset-0 overflow-hidden">
              <img
                src={item.src}
                alt={`${item.tag} — ${item.title}`}
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
              <div className="absolute inset-0 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/[0.06]" />
            </div>

            <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="font-display text-3xl tabular-nums text-accent/80 md:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 font-display text-xl font-semibold text-paper md:text-2xl">
                    {item.tag}
                  </p>
                </div>
                <span className="hidden text-[10px] uppercase tracking-[0.25em] text-paper-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                  {item.title}
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
