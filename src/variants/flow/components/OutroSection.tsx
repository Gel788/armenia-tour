import { contact } from "../../../data/tour";
import { Eyebrow, fadeUpBlur, GhostCta, Grain, PrimaryCta, Reveal } from "./FlowEffects";

type OutroSectionProps = {
  title: string;
  subtitle?: string;
  body: string;
  image: string;
};

export function OutroSection({ title, subtitle, body, image }: OutroSectionProps) {
  return (
    <section
      className="scroll-section relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      aria-labelledby="flow-outro-title"
    >
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_65%)]" />
        <Grain />
      </div>

      <div className="relative z-10 w-full px-6 py-24 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal variant={fadeUpBlur}>
            {subtitle && <Eyebrow>{subtitle}</Eyebrow>}
          </Reveal>

          <Reveal variant={fadeUpBlur} delay={0.08}>
            <h2
              id="flow-outro-title"
              className="mt-5 font-display text-[clamp(2.75rem,10vw,5.5rem)] font-semibold leading-[0.92] text-paper"
            >
              {title}
              <span className="block text-accent">Армения останется с вами</span>
            </h2>
          </Reveal>

          <Reveal variant={fadeUpBlur} delay={0.16}>
            <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-paper-muted md:text-lg">
              {body}
            </p>
          </Reveal>

          <Reveal variant={fadeUpBlur} delay={0.24}>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <PrimaryCta href={`mailto:${contact.email}?subject=Хочу забронировать тур`}>
                Забронировать тур
              </PrimaryCta>
              <GhostCta href="#program">Ещё раз программа</GhostCta>
            </div>
          </Reveal>

          <Reveal variant={fadeUpBlur} delay={0.32}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-paper-muted">
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-accent">
                {contact.email}
              </a>
              <span className="hidden h-1 w-1 rounded-full bg-line sm:block" aria-hidden />
              <a
                href={contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                Telegram
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
