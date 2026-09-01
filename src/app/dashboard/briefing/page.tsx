import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default async function BriefingListPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, noiva, noivo, data_evento, status")
    .eq("tem_briefing_legado", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark">Briefing dos Noivos</h1>
          <p className="text-sm text-muted mt-1">
            Casais que receberam (ou vão receber) o link do briefing inicial.
          </p>
        </div>
        <Link
          href="/dashboard/casais/novo"
          className="rounded-full bg-brand hover:bg-brand-dark transition text-white px-5 py-2.5 text-sm font-medium"
        >
          + Gerar link
        </Link>
      </div>

      {(!events || events.length === 0) && (
        <p className="text-muted text-[15px] mt-16 text-center">
          Nenhum briefing pendente. Clique em &ldquo;Gerar link&rdquo; para começar um novo.
        </p>
      )}

      <div className="grid gap-3">
        {events?.map((ev) => (
          <Link
            key={ev.id}
            href={`/dashboard/casais/${ev.id}`}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 hover:border-brand/50 transition"
          >
            <div>
              <p className="text-[15px] font-medium text-foreground">
                {ev.noiva || "—"} &amp; {ev.noivo || "—"}
              </p>
              <p className="text-sm text-muted mt-0.5">
                {ev.data_evento
                  ? new Date(ev.data_evento + "T00:00:00").toLocaleDateString("pt-BR")
                  : "Data ainda não definida"}
              </p>
            </div>
            <StatusBadge status={ev.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
