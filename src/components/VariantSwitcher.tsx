import { useEffect, useState } from "react";

export type TourVariant = "classic" | "flow";

function readVariant(): TourVariant {
  const params = new URLSearchParams(window.location.search);
  const v = params.get("v");
  return v === "flow" ? "flow" : "classic";
}

export function useTourVariant(): [TourVariant, (next: TourVariant) => void] {
  const [variant, setVariantState] = useState<TourVariant>(readVariant);

  useEffect(() => {
    const onPop = () => setVariantState(readVariant());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setVariant = (next: TourVariant) => {
    const url = new URL(window.location.href);
    if (next === "classic") {
      url.searchParams.delete("v");
    } else {
      url.searchParams.set("v", next);
    }
    window.history.pushState({}, "", url);
    setVariantState(next);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  };

  return [variant, setVariant];
}

export function VariantSwitcher({
  variant,
  onChange,
}: {
  variant: TourVariant;
  onChange: (v: TourVariant) => void;
}) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[70] flex rounded-full border border-line/60 bg-ink/80 p-1 shadow-lg backdrop-blur-xl"
      role="group"
      aria-label="Вариант анимации"
    >
      {(["classic", "flow"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
            variant === v
              ? "bg-accent text-ink"
              : "text-paper-muted hover:text-paper"
          }`}
          aria-pressed={variant === v}
        >
          {v === "classic" ? "Classic" : "Flow"}
        </button>
      ))}
    </div>
  );
}
