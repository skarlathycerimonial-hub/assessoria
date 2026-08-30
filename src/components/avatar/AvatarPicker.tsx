"use client";

import { CoupleAvatar } from "./CoupleAvatar";
import {
  hairColorOptions,
  hairStyleOptions,
  outfitOptions,
  skinToneOptions,
  type AvatarConfig,
} from "@/lib/avatar/types";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-brand bg-brand-soft text-brand-dark font-medium"
          : "border-border bg-card hover:border-brand/50"
      }`}
    >
      {children}
    </button>
  );
}

export function AvatarPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-4 mb-4">
        <CoupleAvatar config={value} size={56} />
        <p className="text-[15px] font-medium text-foreground">{label}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs text-muted mb-1.5">Traje</p>
          <div className="flex flex-wrap gap-2">
            {outfitOptions.map((o) => (
              <Chip key={o.value} active={value.outfit === o.value} onClick={() => onChange({ ...value, outfit: o.value })}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted mb-1.5">Tom de pele</p>
          <div className="flex flex-wrap gap-2">
            {skinToneOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => onChange({ ...value, skinTone: o.value })}
                title={o.label}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  value.skinTone === o.value ? "border-brand" : "border-transparent"
                }`}
                style={{ background: o.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted mb-1.5">Cor do cabelo</p>
          <div className="flex flex-wrap gap-2">
            {hairColorOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => onChange({ ...value, hairColor: o.value })}
                title={o.label}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  value.hairColor === o.value ? "border-brand" : "border-transparent"
                }`}
                style={{ background: o.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted mb-1.5">Cabelo</p>
          <div className="flex flex-wrap gap-2">
            {hairStyleOptions.map((o) => (
              <Chip
                key={o.value}
                active={value.hairStyle === o.value}
                onClick={() => onChange({ ...value, hairStyle: o.value })}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
