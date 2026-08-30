"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import { defaultAvatar1, defaultAvatar2, type AvatarConfig } from "@/lib/avatar/types";

export default function NovoCasalPage() {
  const supabase = createClient();
  const [noiva, setNoiva] = useState("");
  const [noivo, setNoivo] = useState("");
  const [email, setEmail] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [avatar1, setAvatar1] = useState<AvatarConfig>(defaultAvatar1);
  const [avatar2, setAvatar2] = useState<AvatarConfig>(defaultAvatar2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = result ? `${origin}/briefing/${result.token}` : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .rpc("briefing_create", {
        p_noiva: noiva,
        p_noivo: noivo,
        p_email: email || null,
        p_data_evento: dataEvento || null,
        p_avatar1: avatar1,
        p_avatar2: avatar2,
      })
      .single();
    setLoading(false);
    if (error || !data) {
      setError("Não foi possível criar o casal. Tente novamente.");
      return;
    }
    setResult(data as { id: string; token: string });
  }

  if (result) {
    const waText = encodeURIComponent(
      `Oi ${noiva.split(" ")[0]} e ${noivo.split(" ")[0]}! Segue o link do nosso briefing inicial, é rapidinho de preencher: ${link}`
    );
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <p className="font-serif text-2xl text-brand-dark mb-2">Link gerado! ✨</p>
        <p className="text-muted text-[15px] mb-6">
          Envie este link para {noiva} e {noivo} preencherem o briefing, sem precisar de login.
        </p>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 mb-4">
          <span className="flex-1 truncate text-sm text-foreground">{link}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="shrink-0 text-sm text-brand font-medium"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>

        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-brand hover:bg-brand-dark transition text-white px-6 py-3 text-sm font-medium mb-4"
        >
          Enviar pelo WhatsApp
        </a>

        <div>
          <Link href={`/dashboard/${result.id}`} className="text-sm text-muted underline underline-offset-4">
            Ver painel do casal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-serif text-2xl text-brand-dark mb-6">Novo casal</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Nome do(a) noivo(a) 1"
          value={noiva}
          onChange={(e) => setNoiva(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
        <input
          required
          placeholder="Nome do(a) noivo(a) 2"
          value={noivo}
          onChange={(e) => setNoivo(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
        <input
          type="email"
          placeholder="E-mail (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
        <input
          type="date"
          placeholder="Data do evento (opcional)"
          value={dataEvento}
          onChange={(e) => setDataEvento(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />

        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Bonequinhos do casal
          </p>
          <p className="text-xs text-muted mb-3">
            Personalize como cada um aparece na barra de progresso do briefing.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <AvatarPicker label={noiva || "Noivo(a) 1"} value={avatar1} onChange={setAvatar1} />
            <AvatarPicker label={noivo || "Noivo(a) 2"} value={avatar2} onChange={setAvatar2} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-brand hover:bg-brand-dark transition text-white px-7 py-3 text-[15px] font-medium disabled:opacity-60"
        >
          {loading ? "Gerando…" : "Gerar link do briefing"}
        </button>
      </form>
    </div>
  );
}
