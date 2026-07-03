import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { tourSections } from "../../data/tour";
import { HeroSection } from "./components/HeroSection";
import { DayIntro } from "./components/DayIntro";
import { ProgramIntro } from "../../components/program/ProgramIntro";
import { LocationPanel } from "./components/LocationPanel";
import { HorizontalGallery } from "./components/HorizontalGallery";
import { PricingSection } from "./components/PricingSection";
import { OutroSection } from "./components/OutroSection";
import { ScrollProgress, SiteNav } from "./components/SiteChrome";

export default function AppClassic() {
  useSmoothScroll();

  const hero = tourSections.find((s) => s.type === "hero")!;
  let locationIndex = 0;
  let dayIntroIndex = 0;

  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main id="main-content">
        <HeroSection
          title={hero.title}
          subtitle={hero.subtitle}
          body={hero.body}
          image={hero.image}
          gallery={hero.gallery}
        />
        {tourSections.map((section) => {
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
            const el = (
              <LocationPanel key={section.id} section={section} index={locationIndex} />
            );
            locationIndex++;
            if (section.id === "arevatsag") {
              return (
                <>
                  {el}
                  <HorizontalGallery key="gallery" />
                </>
              );
            }
            return el;
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
      </main>
      <footer className="border-t border-line bg-ink px-6 py-8 text-center text-xs text-paper-muted">
        <p>Armenia Tour · Classic</p>
      </footer>
    </>
  );
}
