"use client";

type Value = string | undefined;

function Toggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: Value;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-xl border px-4 py-3 text-[15px] transition ${
            value === opt.value
              ? "border-brand bg-brand-soft text-brand-dark font-medium"
              : "border-border bg-card hover:border-brand/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition";

export function SobreStep({
  responses,
  updateField,
  showError,
}: {
  responses: Record<string, Value>;
  updateField: (key: string, value: string) => void;
  showError?: boolean;
}) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium text-foreground">
          Nome da noiva <span className="text-brand">*</span>
        </label>
        <input
          className={`${inputClass} ${showError && !responses.nome_noiva ? "border-red-400" : ""}`}
          placeholder="Nome completo"
          value={responses.nome_noiva ?? ""}
          onChange={(e) => updateField("nome_noiva", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[15px] font-medium text-foreground">Sobre a data</p>
        <Toggle
          value={responses.data_modo}
          onChange={(v) => updateField("data_modo", v)}
          options={[
            { value: "tenho", label: "Já tenho uma data" },
            { value: "amigas", label: "Amigas definem" },
          ]}
        />
        {responses.data_modo === "tenho" && (
          <div className="grid gap-2 sm:grid-cols-3 mt-1">
            <input
              type="date"
              className={inputClass}
              value={responses.data_evento ?? ""}
              onChange={(e) => updateField("data_evento", e.target.value)}
            />
            <input
              type="text"
              placeholder="Início (ex: 15h)"
              className={inputClass}
              value={responses.hora_inicio ?? ""}
              onChange={(e) => updateField("hora_inicio", e.target.value)}
            />
            <input
              type="text"
              placeholder="Término (ex: 19h)"
              className={inputClass}
              value={responses.hora_fim ?? ""}
              onChange={(e) => updateField("hora_fim", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[15px] font-medium text-foreground">Sobre o local</p>
        <Toggle
          value={responses.local_modo}
          onChange={(v) => updateField("local_modo", v)}
          options={[
            { value: "tenho", label: "Já tenho um local" },
            { value: "amigas", label: "Amigas escolhem" },
          ]}
        />
        {responses.local_modo === "tenho" && (
          <div className="grid gap-2 sm:grid-cols-2 mt-1">
            <input
              type="text"
              placeholder="Nome do local"
              className={inputClass}
              value={responses.local_nome ?? ""}
              onChange={(e) => updateField("local_nome", e.target.value)}
            />
            <input
              type="text"
              placeholder="Endereço"
              className={inputClass}
              value={responses.local_endereco ?? ""}
              onChange={(e) => updateField("local_endereco", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[15px] font-medium text-foreground">Sobre o orçamento</p>
        <Toggle
          value={responses.orcamento_modo}
          onChange={(v) => updateField("orcamento_modo", v)}
          options={[
            { value: "informo", label: "Quero informar" },
            { value: "amigas", label: "Amigas definem" },
          ]}
        />
        {responses.orcamento_modo === "informo" && (
          <input
            type="text"
            placeholder="Valor"
            className={`${inputClass} mt-1`}
            value={responses.orcamento_valor ?? ""}
            onChange={(e) => updateField("orcamento_valor", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
