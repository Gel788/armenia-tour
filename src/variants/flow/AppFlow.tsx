import { useTourContent } from "../../context/TourContentContext";
import { HeroSection } from "./components/HeroSection";
import { DayIntro } from "./components/DayIntro";
import { ProgramIntro } from "./components/ProgramIntro";
import { LocationSection } from "./components/LocationSection";
import { PhotoWall } from "./components/PhotoWall";
import { PricingSection } from "./components/PricingSection";
import { OutroSection } from "./components/OutroSection";
import { FlowNav, StickyBookBar } from "./components/SiteChrome";
import { TrustBar } from "./components/TrustBar";

export default function AppFlow() {
  const { content, loading } = useTourContent();
  const { sections, contact } = content;

  const hero = sections.find((s) => s.type === "hero")!;
  let dayIntroIndex = 0;
  let locationIndex = 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-paper-muted">
        Загрузка тура…
      </div>
    );
  }

  return (
    <>
      <FlowNav />
      <StickyBookBar />

      <main id="main-content">
        <HeroSection
          title={hero.title}
          subtitle={hero.subtitle}
          body={hero.body}
          image={hero.image}
          gallery={hero.gallery}
        />

        <TrustBar />

        {sections.map((section) => {
          if (section.type === "hero") return null;

          if (section.type === "program-intro") {
            return <ProgramIntro key={section.id} section={section} />;
          }

          if (section.type === "day-intro") {
            const el = (
              <div key={section.id} id={`day-${section.day}`}>
                <DayIntro section={section} index={dayIntroIndex} />
              </div>
            );
            dayIntroIndex++;
            return el;
          }

          if (section.type === "location") {
            return (
              <LocationSection
                key={section.id}
                section={section}
                index={locationIndex++}
              />
            );
          }

          if (section.type === "pricing") {
            return (
              <PricingSection
                key={section.id}
                title={section.title}
                body={section.body}
                image={section.image}
              />
            );
          }

          if (section.type === "outro") {
            return (
              <div key={section.id} id="outro">
                <OutroSection
                  title={section.title}
                  subtitle={section.subtitle}
                  body={section.body}
                  image={section.image}
                />
              </div>
            );
          }

          return null;
        })}

        <PhotoWall />
      </main>

      <footer className="border-t border-line bg-ink px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <p className="font-display text-xl tracking-[0.1em] text-paper">
            ARMENIA TOUR
          </p>
          <p className="text-center text-xs text-paper-muted md:text-right">
            4 дня · 9 локаций · незабываемые впечатления
            <br />
            <a href={`mailto:${contact.email}`} className="text-accent hover:underline">
              {contact.email}
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
