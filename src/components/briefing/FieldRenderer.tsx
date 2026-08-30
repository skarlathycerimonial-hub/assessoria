"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BriefingField, MediaItem } from "@/lib/briefing/schema";

export type FieldValue = string | string[] | number | MediaItem[] | undefined;

interface FieldRendererProps {
  field: BriefingField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  showError?: boolean;
  token?: string;
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition";

const STORAGE_BUCKET = "briefing-anexos";

function MediaField({
  field,
  value,
  onChange,
  token,
}: {
  field: BriefingField;
  value: MediaItem[] | undefined;
  onChange: (value: MediaItem[]) => void;
  token?: string;
}) {
  const supabase = createClient();
  const items = value ?? [];
  const [linkDraft, setLinkDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0 || !token) return;
    setUploading(true);
    const uploaded: MediaItem[] = [];
    for (const file of Array.from(fileList)) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${token}/${field.key}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        uploaded.push({ kind: "file", url: data.publicUrl, name: file.name, contentType: file.type });
      }
    }
    setUploading(false);
    if (uploaded.length) onChange([...items, ...uploaded]);
  }

  function addLink() {
    const url = linkDraft.trim();
    if (!url) return;
    onChange([...items, { kind: "link", url }]);
    setLinkDraft("");
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm max-w-[220px]"
            >
              {item.kind === "file" && item.contentType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <span>{item.kind === "file" ? "🎬" : "🔗"}</span>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-brand-dark underline underline-offset-2"
              >
                {item.name ?? item.url}
              </a>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="text-muted hover:text-red-500 shrink-0"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-brand text-brand-dark px-4 py-2 text-sm font-medium hover:bg-brand-soft transition disabled:opacity-60"
        >
          {uploading ? "Enviando…" : "+ Anexar foto ou vídeo"}
        </button>
        <span className="text-xs text-muted">ou</span>
        <input
          type="text"
          placeholder="cole um link (YouTube, Pinterest…)"
          value={linkDraft}
          onChange={(e) => setLinkDraft(e.target.value)}
          className="flex-1 min-w-[160px] rounded-full border border-border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
        <button
          type="button"
          onClick={addLink}
          className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand/50 transition"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

export function FieldRenderer({ field, value, onChange, showError, token }: FieldRendererProps) {
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
            const arr = Array.isArray(value) ? (value as string[]) : [];
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

      {field.type === "media" && (
        <MediaField
          field={field}
          value={value as MediaItem[] | undefined}
          onChange={onChange}
          token={token}
        />
      )}
    </div>
  );
}
