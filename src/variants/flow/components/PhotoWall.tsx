import { useMemo } from "react";
import { motion } from "motion/react";
import { tourSections } from "../../../data/tour";
import { Eyebrow, fadeUpBlur, Reveal } from "./FlowEffects";

type WallItem = {
  id: string;
  src: string;
  tag: string;
  title: string;
  tall?: boolean;
  wide?: boolean;
};

export function PhotoWall() {
  const items = useMemo<WallItem[]>(() => {
    const result: WallItem[] = [];
    let i = 0;
    for (const loc of tourSections.filter((s) => s.type === "location")) {
      result.push({
        id: `${loc.id}-main`,
        src: loc.image,
        tag: loc.tag ?? loc.title,
        title: loc.title,
        tall: i % 4 === 0,
        wide: i % 7 === 3,
      });
      for (const src of loc.gallery ?? []) {
        if (result.length >= 16) break;
        result.push({
          id: `${loc.id}-${src}`,
          src,
          tag: loc.tag ?? loc.title,
          title: loc.title,
          tall: i % 5 === 2,
        });
        i++;
      }
      i++;
    }
    return result.slice(0, 16);
  }, []);

  return (
    <section
      id="gallery"
      className="relative bg-surface py-28 md:py-36"
      aria-label="Галерея тура"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal variant={fadeUpBlur}>
              <Eyebrow>Галерея</Eyebrow>
            </Reveal>
            <Reveal variant={fadeUpBlur} delay={0.08}>
              <h2 className="mt-4 font-display text-4xl font-semibold text-paper md:text-5xl">
                Моменты, которые
                <span className="text-accent"> останутся</span>
              </h2>
            </Reveal>
          </div>
          <Reveal variant={fadeUpBlur} delay={0.12}>
            <p className="max-w-xs text-sm text-paper-muted md:text-right">
              Монастыри, горы, озеро Севан и армянская кухня — всё это ваши кадры.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {items.map((item, i) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-4%" }}
              transition={{
                delay: (i % 4) * 0.08,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-sm ${
                item.wide
                  ? "col-span-2 aspect-[2/1]"
                  : item.tall
                    ? "row-span-2 aspect-[3/4]"
                    : "aspect-square"
              } ${i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[320px]" : ""}`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-[9px] uppercase tracking-[0.25em] text-accent">
                  {item.tag}
                </span>
                <p className="mt-1 text-sm text-paper">{item.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
