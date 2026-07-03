import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "../hooks/useSmoothScroll";
import { pricingItems } from "../data/tour";
import { GrainOverlay, SectionLabel } from "./ui/SlideEffects";

type PricingSectionProps = {
  title: string;
  body: string;
  image: string;
};

export function PricingSection({ title, body, image }: PricingSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children ?? [], {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(cardsRef.current?.children ?? [], {
        y: 60,
        opacity: 0,
        rotateX: -15,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-surface py-28 md:py-36"
      aria-labelledby="pricing-title"
    >
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={image} alt="" className="h-full w-full scale-110 object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent_60%)]" />
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div ref={headerRef} className="mb-16 max-w-2xl">
          <SectionLabel>Включено</SectionLabel>
          <h2
            id="pricing-title"
            className="mt-5 font-display text-4xl font-semibold text-paper md:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-paper-muted">{body}</p>
        </div>

        <div
          ref={cardsRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {pricingItems.map((item, i) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -8, rotateX: 4, rotateY: i % 2 === 0 ? -3 : 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative overflow-hidden rounded-sm border border-line bg-surface-elevated/90 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-accent/30"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 transition-all duration-500 group-hover:from-accent/[0.08] group-hover:to-transparent" />
              <span
                className="relative text-3xl transition-transform duration-500 group-hover:scale-110"
                aria-hidden
              >
                {item.icon}
              </span>
              <p className="relative mt-5 text-sm leading-snug text-paper transition-colors duration-300 group-hover:text-accent">
                {item.label}
              </p>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
