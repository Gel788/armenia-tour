import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../../hooks/useSmoothScroll";

type SplitRevealProps = {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  delay?: number;
  trigger?: React.RefObject<HTMLElement | null>;
};

export function SplitReveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  trigger,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll("[data-char]");

    const ctx = gsap.context(() => {
      gsap.from(chars, {
        y: "110%",
        opacity: 0,
        rotateX: -40,
        stagger: 0.025,
        duration: 0.9,
        ease: "power4.out",
        delay,
        scrollTrigger: trigger?.current
          ? {
              trigger: trigger.current,
              start: "top 70%",
              toggleActions: "play none none none",
            }
          : undefined,
      });
    }, ref);

    return () => ctx.revert();
  }, [text, delay, trigger]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={`${className} perspective-[800px]`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block origin-bottom"
              style={{ transformStyle: "preserve-3d" }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span data-char className="inline-block">
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </Tag>
  );
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent ${className}`}
    >
      <span className="h-px w-6 bg-accent/60" aria-hidden />
      {children}
    </span>
  );
}

export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
      aria-hidden
    />
  );
}

export function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-3" aria-hidden>
      <span className="text-[10px] uppercase tracking-[0.3em] text-paper-muted">
        Scroll
      </span>
      <div className="relative h-14 w-px overflow-hidden bg-line">
        <div className="absolute inset-x-0 h-1/2 animate-[scroll-cue_2s_ease-in-out_infinite] bg-accent" />
      </div>
    </div>
  );
}
