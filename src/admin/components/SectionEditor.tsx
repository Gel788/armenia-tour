import type {
  ProgramHighlight,
  ProgramStop,
  TourSection,
} from "../../data/tour.types";
import { SECTION_TYPE_LABELS, highlightLabels } from "../../data/tour.types";
import { ImageField, TextAreaField, TextField } from "./Fields";

type SectionEditorProps = {
  section: TourSection;
  onChange: (section: TourSection) => void;
  password: string;
};

export function SectionEditor({ section, onChange, password }: SectionEditorProps) {
  const patch = (partial: Partial<TourSection>) =>
    onChange({ ...section, ...partial });

  const updateGallery = (index: number, url: string) => {
    const gallery = [...(section.gallery ?? [])];
    gallery[index] = url;
    patch({ gallery });
  };

  const addGallery = () => patch({ gallery: [...(section.gallery ?? []), ""] });
  const removeGallery = (index: number) =>
    patch({ gallery: (section.gallery ?? []).filter((_, i) => i !== index) });

  const updateStop = (index: number, partial: Partial<ProgramStop>) => {
    const stops = [...(section.stops ?? [])];
    stops[index] = { ...stops[index], ...partial };
    patch({ stops });
  };

  const addStop = () =>
    patch({
      stops: [...(section.stops ?? []), { title: "Новая точка", description: "" }],
    });

  const updateHighlight = (index: number, partial: Partial<ProgramHighlight>) => {
    const highlights = [...(section.highlights ?? [])];
    highlights[index] = { ...highlights[index], ...partial };
    patch({ highlights });
  };

  const addHighlight = () =>
    patch({
      highlights: [
        ...(section.highlights ?? []),
        { kind: "activity", title: "Новый блок", description: "" },
      ],
    });

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="admin-eyebrow">{SECTION_TYPE_LABELS[section.type]}</p>
          <h2 className="admin-title">{section.title || section.id}</h2>
        </div>
        <span className="admin-badge">{section.id}</span>
      </div>

      <div className="admin-grid">
        <TextField
          label="ID (не менять)"
          value={section.id}
          onChange={() => undefined}
        />
        <TextField
          label="Заголовок"
          value={section.title}
          onChange={(title) => patch({ title })}
        />
        {(section.type === "hero" ||
          section.type === "outro" ||
          section.type === "day-intro") && (
          <TextField
            label="Подзаголовок"
            value={section.subtitle ?? ""}
            onChange={(subtitle) => patch({ subtitle })}
          />
        )}
        {section.type === "day-intro" && (
          <>
            <TextField
              label="Тег дня"
              value={section.tag ?? ""}
              onChange={(tag) => patch({ tag })}
            />
            <TextAreaField
              label="Lead (краткое описание)"
              value={section.lead ?? ""}
              onChange={(lead) => patch({ lead })}
              rows={3}
            />
          </>
        )}
        {section.type === "location" && (
          <TextField
            label="Тег локации"
            value={section.tag ?? ""}
            onChange={(tag) => patch({ tag })}
          />
        )}
      </div>

      <TextAreaField
        label="Основной текст"
        value={section.body}
        onChange={(body) => patch({ body })}
        rows={section.type === "location" ? 8 : 5}
      />

      <ImageField
        label="Главное фото"
        value={section.image}
        onChange={(image) => patch({ image })}
        password={password}
      />

      {(section.type === "hero" || section.type === "location") && (
        <div className="admin-subsection">
          <div className="admin-subsection-head">
            <h3 className="admin-subtitle">Галерея</h3>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={addGallery}>
              + Фото
            </button>
          </div>
          {(section.gallery ?? []).map((src, i) => (
            <div key={i} className="admin-stack-item">
              <ImageField
                label={`Фото ${i + 1}`}
                value={src}
                onChange={(url) => updateGallery(i, url)}
                password={password}
              />
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => removeGallery(i)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {section.type === "day-intro" && (
        <>
          <div className="admin-subsection">
            <div className="admin-subsection-head">
              <h3 className="admin-subtitle">Маршрут дня</h3>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={addStop}>
                + Точка
              </button>
            </div>
            {(section.stops ?? []).map((stop, i) => (
              <div key={i} className="admin-card">
                <TextField
                  label={`Точка ${i + 1}`}
                  value={stop.title}
                  onChange={(title) => updateStop(i, { title })}
                />
                <TextAreaField
                  label="Описание"
                  value={stop.description}
                  onChange={(description) => updateStop(i, { description })}
                  rows={3}
                />
              </div>
            ))}
          </div>

          <div className="admin-subsection">
            <div className="admin-subsection-head">
              <h3 className="admin-subtitle">Акценты дня</h3>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={addHighlight}
              >
                + Блок
              </button>
            </div>
            {(section.highlights ?? []).map((h, i) => (
              <div key={i} className="admin-card">
                <label className="admin-label">Тип</label>
                <select
                  className="admin-input"
                  value={h.kind}
                  onChange={(e) =>
                    updateHighlight(i, {
                      kind: e.target.value as ProgramHighlight["kind"],
                    })
                  }
                >
                  {Object.entries(highlightLabels).map(([kind, label]) => (
                    <option key={kind} value={kind}>
                      {label}
                    </option>
                  ))}
                </select>
                <TextField
                  label="Заголовок"
                  value={h.title}
                  onChange={(title) => updateHighlight(i, { title })}
                />
                <TextAreaField
                  label="Описание"
                  value={h.description}
                  onChange={(description) => updateHighlight(i, { description })}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
