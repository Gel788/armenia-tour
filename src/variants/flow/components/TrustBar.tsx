import { motion } from "motion/react";
import { trustPills } from "../../../data/tour";

export function TrustBar() {
  const items = [...trustPills, ...trustPills];

  return (
    <section
      className="relative overflow-hidden border-y border-line/60 bg-surface py-5"
      aria-label="Преимущества тура"
    >
      <div className="flow-marquee flex w-max gap-8">
        {items.map((pill, i) => (
          <motion.span
            key={`${pill}-${i}`}
            className="flex shrink-0 items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-paper-muted"
          >
            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
            {pill}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
