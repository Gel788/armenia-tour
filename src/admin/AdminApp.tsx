import { useMemo, useState } from "react";
import { useTourContent } from "../context/TourContentContext";
import type { SiteContent, TourSection } from "../data/tour.types";
import { SectionEditor } from "./components/SectionEditor";
import { TextAreaField, TextField } from "./components/Fields";

const AUTH_KEY = "armenia-admin-auth";

type NavItem = {
  id: string;
  label: string;
  group: string;
};

function LoginScreen({ onSuccess }: { onSuccess: (password: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Неверный пароль");
      sessionStorage.setItem(AUTH_KEY, password);
      onSuccess(password);
    } catch {
      if (import.meta.env.DEV && password === "armenia2024") {
        sessionStorage.setItem(AUTH_KEY, password);
        onSuccess(password);
      } else {
        setError("Неверный пароль или нет связи с сервером");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <p className="admin-eyebrow">Armenia Tour</p>
        <h1 className="font-display text-4xl font-semibold text-paper">Админ-панель</h1>
        <p className="mt-3 text-sm text-paper-muted">
          Редактируйте все тексты и фото тура. Изменения сохраняются на сервер.
        </p>
        <div className="mt-8">
          <label className="admin-label" htmlFor="admin-password">
            Пароль
          </label>
          <input
            id="admin-password"
            type="password"
            className="admin-input mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль администратора"
            autoFocus
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button type="submit" className="admin-btn admin-btn-primary mt-8 w-full" disabled={loading}>
          {loading ? "Вход…" : "Войти"}
        </button>
        <a href="/" className="admin-link mt-6 inline-block">
          ← На сайт
        </a>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const { content, loading, saving, source, save, updateLocal, refresh } = useTourContent();
  const [password, setPassword] = useState(() => sessionStorage.getItem(AUTH_KEY) ?? "");
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [activeId, setActiveId] = useState("hero");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const data = draft ?? content;

  const nav = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { id: "global", label: "Контакты и блоки", group: "Общее" },
      { id: "pricing-items", label: "Что включено", group: "Общее" },
    ];
    for (const s of data.sections) {
      items.push({
        id: s.id,
        label: s.title || s.id,
        group:
          s.type === "day-intro"
            ? "Дни"
            : s.type === "location"
              ? "Локации"
              : "Страницы",
      });
    }
    return items;
  }, [data.sections]);

  const groups = useMemo(() => {
    const map = new Map<string, NavItem[]>();
    for (const item of nav) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return [...map.entries()];
  }, [nav]);

  const activeSection = data.sections.find((s) => s.id === activeId);

  const patchSection = (section: TourSection) => {
    setDraft({
      ...data,
      sections: data.sections.map((s) => (s.id === section.id ? section : s)),
    });
  };

  const handleSave = async () => {
    setError("");
    try {
      await save(data, password);
      setDraft(null);
      setToast("Сохранено на сервере");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message}. Изменения сохранены локально в браузере.`
          : "Сохранено локально",
      );
      updateLocal(data);
      setDraft(null);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "armenia-tour-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as SiteContent;
    setDraft(parsed);
    setToast("JSON импортирован — нажмите «Сохранить»");
  };

  if (!password) {
    return <LoginScreen onSuccess={setPassword} />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <p className="font-display text-2xl text-paper">Admin</p>
          <p className="text-[10px] uppercase tracking-[0.28em] text-paper-muted">
            Armenia Tour
          </p>
        </div>

        <nav className="admin-nav">
          {groups.map(([group, items]) => (
            <div key={group} className="admin-nav-group">
              <p className="admin-nav-label">{group}</p>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-nav-item ${activeId === item.id ? "is-active" : ""}`}
                  onClick={() => setActiveId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" className="admin-link" target="_blank" rel="noreferrer">
            Открыть сайт ↗
          </a>
          <button
            type="button"
            className="admin-link mt-3"
            onClick={() => {
              sessionStorage.removeItem(AUTH_KEY);
              setPassword("");
            }}
          >
            Выйти
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Редактор контента</p>
            <p className="text-sm text-paper-muted">
              Источник: {source}
              {loading ? " · загрузка…" : ""}
              {draft ? " · есть несохранённые изменения" : ""}
            </p>
          </div>
          <div className="admin-topbar-actions">
            <label className="admin-btn admin-btn-secondary cursor-pointer">
              Импорт JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => void importJson(e.target.files?.[0])}
              />
            </label>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={exportJson}>
              Экспорт JSON
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => void refresh()}>
              Обновить
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? "Сохранение…" : "Сохранить"}
            </button>
          </div>
        </header>

        {toast && <div className="admin-toast admin-toast-ok">{toast}</div>}
        {error && <div className="admin-toast admin-toast-warn">{error}</div>}

        <div className="admin-content">
          {activeId === "global" && (
            <div className="admin-panel">
              <div className="admin-panel-head">
                <h2 className="admin-title">Контакты и глобальные блоки</h2>
              </div>
              <div className="admin-grid">
                <TextField
                  label="Email"
                  value={data.contact.email}
                  onChange={(email) =>
                    setDraft({ ...data, contact: { ...data.contact, email } })
                  }
                />
                <TextField
                  label="Telegram URL"
                  value={data.contact.telegram}
                  onChange={(telegram) =>
                    setDraft({ ...data, contact: { ...data.contact, telegram } })
                  }
                />
                <TextField
                  label="Телефон"
                  value={data.contact.phone}
                  onChange={(phone) =>
                    setDraft({ ...data, contact: { ...data.contact, phone } })
                  }
                />
              </div>

              <div className="admin-subsection">
                <h3 className="admin-subtitle">Статистика hero</h3>
                {data.heroStats.map((stat, i) => (
                  <div key={i} className="admin-card admin-grid">
                    <TextField
                      label="Число"
                      value={stat.value}
                      onChange={(value) => {
                        const heroStats = [...data.heroStats];
                        heroStats[i] = { ...heroStats[i], value };
                        setDraft({ ...data, heroStats });
                      }}
                    />
                    <TextField
                      label="Подпись"
                      value={stat.label}
                      onChange={(label) => {
                        const heroStats = [...data.heroStats];
                        heroStats[i] = { ...heroStats[i], label };
                        setDraft({ ...data, heroStats });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="admin-subsection">
                <h3 className="admin-subtitle">Trust bar (бегущая строка)</h3>
                {data.trustPills.map((pill, i) => (
                  <TextField
                    key={i}
                    label={`Пункт ${i + 1}`}
                    value={pill}
                    onChange={(value) => {
                      const trustPills = [...data.trustPills];
                      trustPills[i] = value;
                      setDraft({ ...data, trustPills });
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeId === "pricing-items" && (
            <div className="admin-panel">
              <div className="admin-panel-head">
                <h2 className="admin-title">Что включено в тур</h2>
              </div>
              {data.pricingItems.map((item, i) => (
                <div key={i} className="admin-card admin-grid">
                  <TextField
                    label="Иконка (emoji)"
                    value={item.icon}
                    onChange={(icon) => {
                      const pricingItems = [...data.pricingItems];
                      pricingItems[i] = { ...pricingItems[i], icon };
                      setDraft({ ...data, pricingItems });
                    }}
                  />
                  <TextAreaField
                    label="Текст пункта"
                    value={item.label}
                    onChange={(label) => {
                      const pricingItems = [...data.pricingItems];
                      pricingItems[i] = { ...pricingItems[i], label };
                      setDraft({ ...data, pricingItems });
                    }}
                    rows={3}
                  />
                </div>
              ))}
              {data.sections
                .filter((s) => s.type === "pricing")
                .map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onChange={patchSection}
                    password={password}
                  />
                ))}
            </div>
          )}

          {activeSection &&
            activeId !== "global" &&
            activeId !== "pricing-items" && (
              <SectionEditor
                section={activeSection}
                onChange={patchSection}
                password={password}
              />
            )}
        </div>
      </div>
    </div>
  );
}
