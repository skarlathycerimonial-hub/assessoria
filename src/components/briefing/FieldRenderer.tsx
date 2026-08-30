"use client";

import type { BriefingField } from "@/lib/briefing/schema";

export type FieldValue = string | string[] | number | undefined;

interface FieldRendererProps {
  field: BriefingField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  showError?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition";

export function FieldRenderer({ field, value, onChange, showError }: FieldRendererProps) {
  const errorRing = showError ? "border-red-400 focus:ring-red-200" : "";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[15px] font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-brand"> *</span>}
      </label>
      {field.help && <p className="text-sm text-muted -mt-1">{field.help}</p>}

      {(field.type === "text" || field.type === "email" || field.type === "date" || field.type === "number") && (
        <input
          type={field.type}
          className={`${inputClass} ${errorRing}`}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) =>
            onChange(field.type === "number" ? e.target.value.replace(/[^0-9]/g, "") : e.target.value)
          }
        />
      )}

      {field.type === "textarea" && (
        <textarea
          className={`${inputClass} ${errorRing} min-h-[110px] resize-y`}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "select" && (
        <div className="flex flex-col gap-2">
          {field.options?.map((option) => {
            const checked = value === option;
            return (
              <button
                type="button"
                key={option}
                onClick={() => onChange(option)}
                className={`text-left rounded-xl border px-4 py-3 text-[15px] transition ${
                  checked
                    ? "border-brand bg-brand-soft text-brand-dark font-medium"
                    : `border-border bg-card hover:border-brand/50 ${errorRing}`
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {field.type === "multiselect" && (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const arr = Array.isArray(value) ? value : [];
            const checked = arr.includes(option);
            return (
              <button
                type="button"
                key={option}
                onClick={() => {
                  const next = checked ? arr.filter((o) => o !== option) : [...arr, option];
                  onChange(next);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  checked
                    ? "border-brand bg-brand-soft text-brand-dark font-medium"
                    : `border-border bg-card hover:border-brand/50 ${errorRing}`
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {field.type === "scale" && (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const checked = Number(value) === n;
            return (
              <button
                type="button"
                key={n}
                onClick={() => onChange(String(n))}
                className={`h-11 w-11 rounded-full border text-[15px] font-medium transition ${
                  checked
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-card hover:border-brand/50"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
