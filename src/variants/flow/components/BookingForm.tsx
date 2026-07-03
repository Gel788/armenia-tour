import { useState, type FormEvent } from "react";
import { motion } from "motion/react";

type BookingFormProps = {
  variant?: "default" | "compact";
  className?: string;
};

type FormState = {
  name: string;
  phone: string;
  phoneAlt: string;
};

const initial: FormState = { name: "", phone: "", phoneAlt: "" };

function validate({ name, phone }: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!name.trim()) errors.name = "Укажите имя";
  else if (name.trim().length < 2) errors.name = "Минимум 2 символа";

  const digits = phone.replace(/\D/g, "");
  if (!phone.trim()) errors.phone = "Укажите телефон";
  else if (digits.length < 10) errors.phone = "Введите корректный номер";

  return errors;
}

export function BookingForm({ variant = "default", className = "" }: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const patch = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          phoneAlt: form.phoneAlt.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Не удалось отправить заявку");
      }

      setStatus("success");
      setMessage("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setForm(initial);
      setErrors({});
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Ошибка отправки. Попробуйте позже.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className={`booking-form-success ${className}`} role="status">
        <p className="font-display text-2xl text-paper">Спасибо!</p>
        <p className="mt-3 text-sm leading-relaxed text-paper-muted">{message}</p>
        <button
          type="button"
          className="booking-form-link mt-6"
          onClick={() => setStatus("idle")}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form
      className={`booking-form ${variant === "compact" ? "booking-form-compact" : ""} ${className}`}
      onSubmit={(e) => void submit(e)}
      noValidate
    >
      <div className="booking-field">
        <label htmlFor={`booking-name-${variant}`} className="booking-label">
          Имя <span className="text-accent">*</span>
        </label>
        <input
          id={`booking-name-${variant}`}
          type="text"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => patch("name", e.target.value)}
          className={`booking-input ${errors.name ? "has-error" : ""}`}
          placeholder="Как к вам обращаться"
        />
        {errors.name && <p className="booking-error">{errors.name}</p>}
      </div>

      <div className="booking-field">
        <label htmlFor={`booking-phone-${variant}`} className="booking-label">
          Телефон <span className="text-accent">*</span>
        </label>
        <input
          id={`booking-phone-${variant}`}
          type="tel"
          autoComplete="tel"
          required
          value={form.phone}
          onChange={(e) => patch("phone", e.target.value)}
          className={`booking-input ${errors.phone ? "has-error" : ""}`}
          placeholder="+374 00 000 000"
        />
        {errors.phone && <p className="booking-error">{errors.phone}</p>}
      </div>

      <div className="booking-field">
        <label htmlFor={`booking-phone-alt-${variant}`} className="booking-label">
          Доп. телефон
          <span className="booking-optional">необязательно</span>
        </label>
        <input
          id={`booking-phone-alt-${variant}`}
          type="tel"
          autoComplete="tel"
          value={form.phoneAlt}
          onChange={(e) => patch("phoneAlt", e.target.value)}
          className="booking-input"
          placeholder="+374 00 000 000"
        />
      </div>

      {status === "error" && message && (
        <p className="booking-error mb-2" role="alert">
          {message}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="booking-submit"
      >
        {status === "loading" ? "Отправка…" : "Отправить заявку"}
      </motion.button>
    </form>
  );
}
