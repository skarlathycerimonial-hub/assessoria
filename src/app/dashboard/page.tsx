import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteEventButton } from "@/components/dashboard/DeleteEventButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, noiva, noivo, data_evento, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-brand-dark">Casais</h1>
        <Link
          href="/dashboard/novo"
          className="rounded-full bg-brand hover:bg-brand-dark transition text-white px-5 py-2.5 text-sm font-medium"
        >
          + Novo casal
        </Link>
      </div>

      {(!events || events.length === 0) && (
        <p className="text-muted text-[15px] mt-16 text-center">
          Nenhum casal cadastrado ainda. Clique em &ldquo;Novo casal&rdquo; para gerar o primeiro
          link de briefing.
        </p>
      )}

      <div className="grid gap-3">
        {events?.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 hover:border-brand/50 transition"
          >
            <Link href={`/dashboard/${ev.id}`} className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-foreground">
                {ev.noiva || "—"} &amp; {ev.noivo || "—"}
              </p>
              <p className="text-sm text-muted mt-0.5">
                {ev.data_evento
                  ? new Date(ev.data_evento + "T00:00:00").toLocaleDateString("pt-BR")
                  : "Data ainda não definida"}
              </p>
            </Link>
            <div className="flex items-center gap-4 shrink-0">
              <StatusBadge status={ev.status} />
              <DeleteEventButton id={ev.id} label={`${ev.noiva || "—"} & ${ev.noivo || "—"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
