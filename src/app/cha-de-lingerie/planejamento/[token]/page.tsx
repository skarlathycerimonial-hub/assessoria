import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PlanningTabs } from "@/components/cha-lingerie/PlanningTabs";
import type { MediaItem } from "@/lib/briefing/schema";
import type { Guest } from "@/components/cha-lingerie/GuestListStep";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function InfoCard({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted mb-1">{label}</p>
      <p className="text-[15px] text-foreground">
        {value ? value : <span className="text-brand-dark font-medium">Amigas podem definir</span>}
      </p>
    </div>
  );
}

function Block({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted mb-1">{label}</p>
      <p className="text-[15px] text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function Inspirations({ items }: { items: MediaItem[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted mb-2">Inspirações da noiva</p>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) =>
          item.kind === "file" && item.contentType?.startsWith("image/") ? (
            <a key={i} href={item.url} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-28 w-28 rounded-lg object-cover border border-border" />
            </a>
          ) : (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-brand-dark underline underline-offset-2"
            >
              <span>{item.kind === "file" ? "🎬" : "🔗"}</span>
              {item.name ?? item.url}
            </a>
          )
        )}
      </div>
    </div>
  );
}

export default async function PlanejamentoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cha_lingerie_get_view", { p_view_token: token }).single();

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-serif text-2xl text-brand-dark mb-3">Link não encontrado</p>
        <p className="text-muted text-[15px]">Esse link parece inválido ou expirou.</p>
      </div>
    );
  }

  const row = data as {
    noiva: string | null;
    data_evento: string | null;
    responses: Record<string, any>;
    convidadas: Guest[];
  };
  const r = row.responses ?? {};
  const noiva = row.noiva || "sua amiga";

  const dataLabel =
    r.data_modo === "tenho" && row.data_evento
      ? `${new Date(row.data_evento + "T00:00:00").toLocaleDateString("pt-BR")}${
          r.hora_inicio ? ` · ${r.hora_inicio}${r.hora_fim ? ` às ${r.hora_fim}` : ""}` : ""
        }`
      : null;
  const localLabel = r.local_modo === "tenho" && r.local_nome ? `${r.local_nome}${r.local_endereco ? ` — ${r.local_endereco}` : ""}` : null;
  const orcamentoLabel = r.orcamento_modo === "informo" && r.orcamento_valor ? r.orcamento_valor : null;

  const visaoGeral = (
    <div className="grid gap-3 sm:grid-cols-3">
      <InfoCard label="Data e horário" value={dataLabel} />
      <InfoCard label="Local" value={localLabel} />
      <InfoCard label="Orçamento" value={orcamentoLabel} />
      <InfoCard label="Convidadas" value={`${row.convidadas?.length ?? 0} pessoas`} />
      <InfoCard label="Estilo" value={r.estilo} />
      <InfoCard label="Cores" value={r.cores} />
      {(r.inspiracoes as MediaItem[])?.length > 0 && (
        <div className="sm:col-span-3">
          <Inspirations items={r.inspiracoes} />
        </div>
      )}
    </div>
  );

  const convidadasTab = (
    <div className="rounded-xl border border-border bg-card p-4">
      {(!row.convidadas || row.convidadas.length === 0) && (
        <p className="text-muted text-[15px]">Nenhuma convidada cadastrada ainda.</p>
      )}
      <div className="flex flex-col divide-y divide-border">
        {row.convidadas?.map((g, i) => (
          <div key={i} className="flex items-center justify-between py-2.5">
            <span className="text-[15px] text-foreground">{g.nome || "—"}</span>
            <span className="text-sm text-muted">{g.whatsapp || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const estiloTab = (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <Block label="Estilo" value={r.estilo} />
      <Block label="Cores" value={r.cores} />
      <Block label="Tema, referências ou atmosfera" value={r.tema} />
      <Block label="O que definitivamente não gostaria" value={r.nao_gostaria} />
      <Inspirations items={r.inspiracoes ?? []} />
    </div>
  );

  const presentesTab = (
    <div className="rounded-xl border border-border bg-card p-5 grid gap-4 sm:grid-cols-2">
      <Block label="Tamanho de sutiã" value={r.tamanho_sutia} />
      <Block label="Tamanho de calcinha" value={r.tamanho_calcinha} />
      <Block label="Camisola / pijama" value={r.tamanho_camisola} />
      <Block label="Robe" value={r.tamanho_robe} />
      <Block label="Cores que gosta" value={r.cores_gosta} />
      <Block label="Cores que não gosta" value={r.cores_nao_gosta} />
      <div className="sm:col-span-2">
        <Block label="Modelos que gosta" value={r.modelos_gosta} />
      </div>
      <div className="sm:col-span-2">
        <Block label="Como organizar os presentes" value={r.organizacao_presentes} />
      </div>
    </div>
  );

  const comidasTab = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted mb-1">Comidas</p>
        <p className="text-[15px] text-foreground whitespace-pre-wrap">{r.comidas || "Amigas podem definir"}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted mb-1">Bebidas</p>
        <p className="text-[15px] text-foreground whitespace-pre-wrap">{r.bebidas || "Amigas podem definir"}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted mb-1">Decoração</p>
        <p className="text-[15px] text-foreground whitespace-pre-wrap">{r.decoracao || "Amigas podem definir"}</p>
      </div>
      <div className="rounded-xl border border-brand/40 bg-brand-soft p-4">
        <p className="text-xs uppercase tracking-wide text-brand-dark mb-1">Cuidados / Restrições</p>
        <p className="text-[15px] text-brand-dark whitespace-pre-wrap">{r.restricoes || "Nenhuma informada"}</p>
      </div>
    </div>
  );

  const diversaoTab = (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted mb-2">Brincadeiras</p>
        {r.brincadeiras?.length ? (
          <div className="flex flex-wrap gap-2">
            {r.brincadeiras.map((b: string) => (
              <span key={b} className="rounded-full bg-brand-soft text-brand-dark text-sm px-3 py-1.5">
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[15px] text-brand-dark font-medium">Amigas podem definir</p>
        )}
      </div>
      <Block label="O que NÃO pode acontecer nas brincadeiras" value={r.brincadeiras_evitar} />
      <Block label="Músicas ou estilos que ela ama" value={r.musicas} />
      <Block label="Fotos e vídeos" value={r.registro_fotos} />
    </div>
  );

  const preferenciasTab = (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <Block label="Nível de participação" value={r.nivel_participacao} />
      <Block label="O que pode ser surpresa" value={r.pode_ser_surpresa} />
      <Block label="O que precisa saber antecipadamente" value={r.precisa_saber} />
      <Block label="Amiga que gostaria que liderasse" value={r.amiga_lider} />
      <Block label="Momento ou detalhe especial" value={r.momento_especial} />
      <Block label="Recado para vocês" value={r.recado_amigas} />
    </div>
  );

  return (
    <div className="flex-1">
      <div className="bg-brand text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <p className="font-serif text-2xl">Chá de Lingerie de {noiva}</p>
          <p className="text-white/80 text-sm mt-1">
            Ela já contou tudo que gostaria para esse dia. Agora é com vocês!
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <PlanningTabs
          tabs={[
            { id: "geral", label: "Visão geral", content: visaoGeral },
            { id: "convidadas", label: "Convidadas", content: convidadasTab },
            { id: "estilo", label: "Estilo", content: estiloTab },
            { id: "presentes", label: "Presentes", content: presentesTab },
            { id: "comidas", label: "Comidas", content: comidasTab },
            { id: "diversao", label: "Diversão", content: diversaoTab },
            { id: "preferencias", label: "Preferências", content: preferenciasTab },
          ]}
        />
      </div>
    </div>
  );
}
