"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { briefingSections } from "@/lib/briefing/schema";
import { FieldRenderer, type FieldValue } from "./FieldRenderer";

type Responses = Record<string, FieldValue>;

interface BriefingFormProps {
  token: string;
  initialResponses: Responses;
  initialStatus: string;
}

function isFilled(value: FieldValue) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function BriefingForm({ token, initialResponses, initialStatus }: BriefingFormProps) {
  const supabase = useMemo(() => createClient(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>(initialResponses);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(initialStatus === "completo");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = briefingSections.length;
  const section = briefingSections[stepIndex];
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  function persist(next: Responses, complete: boolean) {
    setSaving(true);
    supabase
      .rpc("briefing_save", {
        p_token: token,
        p_responses: next,
        p_noiva: (next.noiva as string) ?? null,
        p_noivo: (next.noivo as string) ?? null,
        p_email: (next.email as string) ?? null,
        p_data_evento: (next.data_evento as string) || null,
        p_complete: complete,
      })
      .then(() => setSaving(false));
  }

  function updateField(key: string, value: FieldValue) {
    setResponses((prev) => {
      const next = { ...prev, [key]: value };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => persist(next, false), 900);
      return next;
    });
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const missingRequired = section.fields.filter(
    (f) => f.required && !isFilled(responses[f.key])
  );

  function goNext() {
    if (missingRequired.length > 0) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);

    if (stepIndex === totalSteps - 1) {
      persist(responses, true);
      setDone(true);
      return;
    }
    persist(responses, false);
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    persist(responses, false);
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-serif text-3xl text-brand-dark mb-4">Recebemos tudo! ✨</p>
        <p className="text-muted text-[15px] leading-relaxed">
          Obrigada por compartilhar cada detalhe com tanto carinho. A Skarlathy já está com o
          briefing de vocês em mãos e vai entrar em contato em breve para os próximos passos.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-8 text-sm text-brand underline underline-offset-4"
        >
          Preciso alterar alguma resposta
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>
            Etapa {stepIndex + 1} de {totalSteps}
          </span>
          <span>{saving ? "salvando…" : "salvo"}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-brand-soft overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="font-serif text-2xl md:text-3xl text-brand-dark mb-1">{section.title}</h2>
      {section.subtitle && <p className="text-muted text-[15px] mb-6">{section.subtitle}</p>}
      {!section.subtitle && <div className="mb-6" />}

      <div className="flex flex-col gap-7">
        {section.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={responses[field.key]}
            onChange={(v) => updateField(field.key, v)}
            showError={showErrors && field.required && !isFilled(responses[field.key])}
          />
        ))}
      </div>

      {showErrors && missingRequired.length > 0 && (
        <p className="mt-4 text-sm text-red-500">
          Preencha os campos marcados com * antes de continuar.
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="text-[15px] text-muted disabled:opacity-0 hover:text-foreground transition"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full bg-brand hover:bg-brand-dark transition text-white px-7 py-3 text-[15px] font-medium"
        >
          {stepIndex === totalSteps - 1 ? "Enviar" : "Avançar"}
        </button>
      </div>
    </div>
  );
}
