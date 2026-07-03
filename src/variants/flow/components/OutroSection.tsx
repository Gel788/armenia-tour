import { useTourContent } from "../../../context/TourContentContext";
import { BookingForm } from "./BookingForm";
import { Eyebrow, fadeUpBlur, GhostCta, Grain, Reveal } from "./FlowEffects";

type OutroSectionProps = {
  title: string;
  subtitle?: string;
  body: string;
  image: string;
};

export function OutroSection({ title, subtitle, body, image }: OutroSectionProps) {
  const { content } = useTourContent();
  const { contact } = content;

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
        <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="text-center lg:text-left">
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
            <div className="mt-10 flex justify-center lg:justify-start">
              <GhostCta href="#program">Ещё раз программа</GhostCta>
            </div>
          </Reveal>

          <Reveal variant={fadeUpBlur} delay={0.32}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-paper-muted lg:justify-start">
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

          <Reveal variant={fadeUpBlur} delay={0.2}>
            <div id="booking" className="booking-card mx-auto w-full max-w-md lg:max-w-none">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">
                Заявка на тур
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-paper md:text-3xl">
                Забронировать место
              </h3>
              <p className="mt-3 text-sm text-paper-muted">
                Оставьте контакты — перезвоним и поможем спланировать поездку.
              </p>
              <BookingForm className="mt-6" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
