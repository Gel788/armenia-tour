import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "../data/tour.types";
import { defaultSiteContent } from "../data/tour";

const STORAGE_KEY = "armenia-tour-content-v1";

type TourContentContextValue = {
  content: SiteContent;
  loading: boolean;
  saving: boolean;
  source: "api" | "local" | "default";
  refresh: () => Promise<void>;
  save: (next: SiteContent, password: string) => Promise<void>;
  updateLocal: (next: SiteContent) => void;
};

const TourContentContext = createContext<TourContentContextValue | null>(null);

function mergeWithDefaults(partial: Partial<SiteContent>): SiteContent {
  return {
    ...defaultSiteContent,
    ...partial,
    sections: partial.sections ?? defaultSiteContent.sections,
    pricingItems: partial.pricingItems ?? defaultSiteContent.pricingItems,
    contact: { ...defaultSiteContent.contact, ...partial.contact },
    heroStats: partial.heroStats ?? defaultSiteContent.heroStats,
    trustPills: partial.trustPills ?? defaultSiteContent.trustPills,
    updatedAt: partial.updatedAt ?? new Date().toISOString(),
  };
}

async function fetchContent(): Promise<{ data: SiteContent; source: "api" | "local" | "default" }> {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return { data: mergeWithDefaults(JSON.parse(cached)), source: "local" };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  try {
    const res = await fetch("/api/content");
    if (res.ok) {
      const data = mergeWithDefaults(await res.json());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { data, source: "api" };
    }
  } catch {
    /* offline / no API */
  }

  try {
    const res = await fetch("/data/site-content.json");
    if (res.ok) {
      const data = mergeWithDefaults(await res.json());
      return { data, source: "default" };
    }
  } catch {
    /* ignore */
  }

  return { data: defaultSiteContent, source: "default" };
}

export function TourContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState<"api" | "local" | "default">("default");

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchContent();
    setContent(result.data);
    setSource(result.source);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateLocal = useCallback((next: SiteContent) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    setContent(stamped);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
    setSource("local");
  }, []);

  const save = useCallback(
    async (next: SiteContent, password: string) => {
      setSaving(true);
      const stamped = { ...next, updatedAt: new Date().toISOString() };

      try {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${password}`,
          },
          body: JSON.stringify(stamped),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Не удалось сохранить на сервере");
        }

        const saved = mergeWithDefaults(await res.json());
        setContent(saved);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        setSource("api");
      } catch (error) {
        updateLocal(stamped);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [updateLocal],
  );

  const value = useMemo(
    () => ({ content, loading, saving, source, refresh, save, updateLocal }),
    [content, loading, saving, source, refresh, save, updateLocal],
  );

  return (
    <TourContentContext.Provider value={value}>{children}</TourContentContext.Provider>
  );
}

export function useTourContent() {
  const ctx = useContext(TourContentContext);
  if (!ctx) throw new Error("useTourContent must be used within TourContentProvider");
  return ctx;
}
