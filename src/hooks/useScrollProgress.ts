import { useEffect, useRef, useState } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

/** Лёгкий прогресс скролла — один rAF-слушатель на страницу */
export function useScrollProgress(): MotionValue<number> {
  const progress = useMotionValue(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      ticking.current = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? window.scrollY / max : 0);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progress]);

  return progress;
}

/** Активная секция для навигации — IntersectionObserver вместо ScrollTrigger */
export function useActiveSection(sectionIds: string[], defaultId: string) {
  const [active, setActive] = useState(defaultId);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = defaultId;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActive(bestId);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, defaultId]);

  return active;
}
