import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "../hooks/useSmoothScroll";
import { GrainOverlay } from "./ui/SlideEffects";

type OutroSectionProps = {
  title: string;
  subtitle?: string;
  body: string;
  image: string;
};

export function OutroSection({ title, subtitle, body, image }: OutroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.2 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(contentRef.current?.children ?? [], {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      aria-labelledby="outro-title"
    >
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_55%)]" />
        <GrainOverlay />
      </div>

      <div ref={contentRef} className="relative z-10 px-6 text-center md:px-12">
        {subtitle && (
          <p className="mb-5 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-accent">
            <span className="h-px w-8 bg-accent/60" />
            {subtitle}
            <span className="h-px w-8 bg-accent/60" />
          </p>
        )}

        <h2
          id="outro-title"
          className="font-display text-[clamp(3.5rem,12vw,8rem)] font-semibold leading-[0.9] text-paper"
        >
          {title}
        </h2>

        <p className="mx-auto mt-8 max-w-md text-paper-muted">{body}</p>

        <a
          href="mailto:info@armeniatour.am"
          className="group relative mt-12 inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent/40 px-10 py-4"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <span className="relative text-sm font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 group-hover:text-ink">
            Связаться с нами
          </span>
          <motion.span
            className="relative text-accent transition-colors group-hover:text-ink"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            aria-hidden
          >
            →
          </motion.span>
        </a>
      </div>
    </section>
  );
}
