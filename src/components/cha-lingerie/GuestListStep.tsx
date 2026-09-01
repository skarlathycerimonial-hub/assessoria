"use client";

export interface Guest {
  nome: string;
  whatsapp: string;
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition";

export function GuestListStep({
  guests,
  onChange,
}: {
  guests: Guest[];
  onChange: (guests: Guest[]) => void;
}) {
  function updateGuest(index: number, patch: Partial<Guest>) {
    const next = guests.map((g, i) => (i === index ? { ...g, ...patch } : g));
    onChange(next);
  }

  function addGuest() {
    onChange([...guests, { nome: "", whatsapp: "" }]);
  }

  function removeGuest(index: number) {
    onChange(guests.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] text-muted">Cadastre quem você gostaria de ter nesse momento.</p>
        <span className="shrink-0 rounded-full bg-brand-soft text-brand-dark text-xs font-medium px-3 py-1">
          TOTAL: {guests.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {guests.map((guest, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <input
              className={`${inputClass} sm:flex-1`}
              placeholder={`Convidada ${i + 1} — nome completo`}
              value={guest.nome}
              onChange={(e) => updateGuest(i, { nome: e.target.value })}
            />
            <input
              className={`${inputClass} sm:w-44`}
              placeholder="(75) 99999-9999"
              value={guest.whatsapp}
              onChange={(e) => updateGuest(i, { whatsapp: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeGuest(i)}
              className="shrink-0 rounded-xl border border-border px-4 py-3 text-sm text-muted hover:text-red-500 hover:border-red-300 transition"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGuest}
        className="mt-4 w-full rounded-xl border border-brand text-brand-dark py-3 text-sm font-medium hover:bg-brand-soft transition"
      >
        + Adicionar convidada
      </button>
    </div>
  );
}
