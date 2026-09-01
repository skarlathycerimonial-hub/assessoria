"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { chaLingerieSteps } from "@/lib/cha-lingerie/schema";
import { FieldRenderer, type FieldValue } from "@/components/briefing/FieldRenderer";
import { SobreStep } from "./SobreStep";
import { GuestListStep, type Guest } from "./GuestListStep";

type Responses = Record<string, FieldValue>;

interface ChaLingerieFormProps {
  mode: "create" | "edit";
  editToken?: string;
  viewToken?: string;
  initialResponses?: Responses;
  initialConvidadas?: Guest[];
}

const STORAGE_BUCKET = "cha-lingerie-anexos";
const STEP_TITLES = [
  "Sobre o seu Chá de Lingerie",
  "Lista de Convidadas",
  ...chaLingerieSteps.map((s) => s.title),
];
const TOTAL_STEPS = STEP_TITLES.length;

function linksFor(origin: string, editToken: string, viewToken: string) {
  return {
    view: `${origin}/cha-de-lingerie/planejamento/${viewToken}`,
    edit: `${origin}/cha-de-lingerie/editar/${editToken}`,
  };
}

export function ChaLingerieForm({
  mode,
  editToken: initialEditToken,
  viewToken: initialViewToken,
  initialResponses,
  initialConvidadas,
}: ChaLingerieFormProps) {
  const supabase = useRef(createClient()).current;
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>(initialResponses ?? {});
  const [convidadas, setConvidadas] = useState<Guest[]>(initialConvidadas ?? []);
  const [tokens, setTokens] = useState<{ edit: string; view: string } | null>(
    mode === "edit" && initialEditToken && initialViewToken
      ? { edit: initialEditToken, view: initialViewToken }
      : null
  );
  const [creating, setCreating] = useState(mode === "create");
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [finished, setFinished] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstSave = useRef(true);

  useEffect(() => {
    if (mode !== "create") return;
    supabase
      .rpc("cha_lingerie_create")
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const d = data as { id: string; edit_token: string; view_token: string };
          setTokens({ edit: d.edit_token, view: d.view_token });
        }
        setCreating(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(complete: boolean, current = responses, currentGuests = convidadas) {
    if (!tokens) return;
    setSaving(true);
    const dataEvento =
      current.data_modo === "tenho" && current.data_evento ? (current.data_evento as string) : null;
    supabase
      .rpc("cha_lingerie_save", {
        p_edit_token: tokens.edit,
        p_noiva: (current.nome_noiva as string) || null,
        p_responses: current,
        p_convidadas: currentGuests,
        p_data_evento: dataEvento,
        p_complete: complete,
      })
      .then(() => setSaving(false));
  }

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    if (!tokens) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(false), 900);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses, convidadas, tokens]);

  function updateField(key: string, value: FieldValue) {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (stepIndex === 0 && !responses.nome_noiva) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);

    if (stepIndex === TOTAL_STEPS - 1) {
      persist(true);
      if (mode === "create") {
        setFinished(true);
      } else {
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2500);
      }
      return;
    }
    persist(false);
    setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    persist(false);
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (creating) {
    return <p className="text-center text-muted py-24">Preparando seu formulário…</p>;
  }

  if (!tokens) {
    return (
      <p className="text-center text-muted py-24">
        Não foi possível abrir o formulário agora. Recarregue a página e tente de novo.
      </p>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const links = linksFor(origin, tokens.edit, tokens.view);

  if (finished) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="font-serif text-3xl text-brand-dark mb-2">Planejamento finalizado! ✨</p>
        <p className="text-muted text-[15px] mb-8">
          Guarde o link de edição e compartilhe somente o link das amigas.
        </p>

        <div className="rounded-xl border border-brand/40 bg-brand-soft p-5 text-left mb-4">
          <p className="text-sm font-medium text-brand-dark mb-2">
            Link para compartilhar com as amigas
          </p>
          <p className="text-sm text-foreground break-all">{links.view}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 text-left">
          <p className="text-sm font-medium text-foreground mb-2">Seu link privado para editar depois</p>
          <p className="text-sm text-muted break-all">{links.edit}</p>
          <p className="text-xs text-muted mt-2">
            Não compartilhe este link. Ele permite alterar as respostas.
          </p>
        </div>
      </div>
    );
  }

  const progress = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100);

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      {mode === "edit" && (
        <div className="rounded-xl border border-border bg-card p-4 mb-8 text-sm">
          <p className="text-muted mb-1">
            Link das amigas: <span className="text-foreground break-all">{links.view}</span>
          </p>
          {justSaved && <p className="text-brand-dark font-medium mt-1">Alterações salvas! ✓</p>}
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>
            Etapa {stepIndex + 1} de {TOTAL_STEPS}
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

      <h2 className="font-serif text-2xl md:text-3xl text-brand-dark mb-1">
        {STEP_TITLES[stepIndex]}
      </h2>

      <div className="mt-6">
        {stepIndex === 0 && (
          <SobreStep
            responses={responses as Record<string, string | undefined>}
            updateField={updateField}
            showError={showErrors}
          />
        )}
        {stepIndex === 1 && <GuestListStep guests={convidadas} onChange={setConvidadas} />}
        {stepIndex >= 2 && (
          <div className="flex flex-col gap-7">
            {chaLingerieSteps[stepIndex - 2].fields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={responses[field.key]}
                onChange={(v) => updateField(field.key, v)}
                token={tokens.edit}
                bucket={STORAGE_BUCKET}
              />
            ))}
          </div>
        )}
      </div>

      {showErrors && stepIndex === 0 && !responses.nome_noiva && (
        <p className="mt-4 text-sm text-red-500">Preencha o nome da noiva para continuar.</p>
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
          {stepIndex === TOTAL_STEPS - 1
            ? mode === "create"
              ? "Finalizar e gerar meus links"
              : "Salvar"
            : "Avançar"}
        </button>
      </div>
    </div>
  );
}
