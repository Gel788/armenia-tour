import { useRef, useState } from "react";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  password: string;
};

export async function uploadImage(file: File, password: string): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${password}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-filename": file.name.replace(/[^\w.\-]+/g, "-"),
    },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка загрузки");
  }

  const data = await res.json();
  return data.url as string;
}

export function ImageField({ label, value, onChange, password }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, password);
      onChange(url);
    } catch (e) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onChange(reader.result);
      };
      reader.readAsDataURL(file);
      setError(
        e instanceof Error
          ? `${e.message}. Сохранено локально как preview (data URL).`
          : "Загружено локально",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <div className="admin-image-row">
        <div className="admin-image-preview">
          {value ? (
            <img src={value} alt="" />
          ) : (
            <span className="text-xs text-paper-muted">Нет фото</span>
          )}
        </div>
        <div className="admin-image-controls">
          <input
            className="admin-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... или URL"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Загрузка…" : "Загрузить файл"}
            </button>
            {value && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => onChange("")}
              >
                Очистить
              </button>
            )}
          </div>
          {error && <p className="admin-hint">{error}</p>}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <input
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <textarea
        className="admin-textarea"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
