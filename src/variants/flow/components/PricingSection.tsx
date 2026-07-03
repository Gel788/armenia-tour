import { motion } from "motion/react";
import { useTourContent } from "../../../context/TourContentContext";
import { Eyebrow, fadeUpBlur, Grain, PrimaryCta, Reveal } from "./FlowEffects";
import { SectionOrnament, OrnamentWrap } from "./SectionOrnament";

type PricingSectionProps = {
  title: string;
  body: string;
  image: string;
};

export function PricingSection({ title, body, image }: PricingSectionProps) {
  const { content } = useTourContent();
  const { pricingItems, contact } = content;

  return (
    <section
      id="included"
      className="relative overflow-hidden bg-ink-soft py-28 md:py-36"
      aria-labelledby="flow-pricing-title"
    >
      <div className="absolute inset-0 opacity-[0.04]">
        <img src={image} alt="" className="h-full w-full scale-110 object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_55%)]" />
      <SectionOrnament variant="vertical" side="left" />
      <Grain />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-20">
          <div>
            <OrnamentWrap variant="ladder">
              <div className="relative px-1 py-2 md:px-2 md:py-3">
            <Reveal variant={fadeUpBlur}>
              <Eyebrow>Включено в тур</Eyebrow>
            </Reveal>
            <Reveal variant={fadeUpBlur} delay={0.08}>
              <h2
                id="flow-pricing-title"
                className="mt-5 font-display text-4xl font-semibold text-paper md:text-5xl"
              >
                {title}
              </h2>
            </Reveal>
            <Reveal variant={fadeUpBlur} delay={0.14}>
              <p className="mt-5 max-w-xl text-paper-muted">{body}</p>
            </Reveal>

            <div className="mt-12 grid gap-2 sm:grid-cols-2">
              {pricingItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex gap-4 rounded-sm border border-line/80 bg-surface/60 p-4 backdrop-blur-sm transition-colors hover:border-accent/30"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg transition-colors group-hover:bg-accent/20"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <p className="text-sm leading-snug text-paper">{item.label}</p>
                </motion.div>
              ))}
            </div>
              </div>
            </OrnamentWrap>
          </div>

          <Reveal variant={fadeUpBlur} delay={0.2}>
            <OrnamentWrap variant="diamond">
            <div className="flow-cta-card sticky top-28 rounded-sm border border-accent/25 bg-surface p-8 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                Бронирование
              </p>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-paper">
                Готовы к приключению?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-paper-muted">
                Оставьте заявку — мы ответим в течение нескольких часов и поможем
                спланировать поездку.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <PrimaryCta href={`mailto:${contact.email}?subject=Бронирование тура по Армении`} className="w-full">
                  Написать на email
                </PrimaryCta>
                <a
                  href={contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-full border border-line py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent/40 hover:text-accent"
                >
                  Telegram
                </a>
              </div>

              <p className="mt-6 text-center text-[10px] text-paper-muted">
                Мест ограничено · группы до 8 человек
              </p>
            </div>
            </OrnamentWrap>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
