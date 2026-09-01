import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteEventButton } from "@/components/dashboard/DeleteEventButton";
import { ChaLingerieRow } from "@/components/dashboard/ChaLingerieRow";

export default async function ChaLingerieListPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("cha_lingerie")
    .select("id, noiva, data_evento, status, edit_token, view_token, created_at")
    .order("created_at", { ascending: false });

  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-brand-dark">Chá de Lingerie</h1>
        <p className="text-sm text-muted mt-1">
          Cada noiva preenche pelo link{" "}
          <span className="text-foreground">{origin}/cha-de-lingerie</span> — não precisa
          cadastrar aqui.
        </p>
      </div>

      {(!rows || rows.length === 0) && (
        <p className="text-muted text-[15px] mt-16 text-center">
          Nenhum chá de lingerie preenchido ainda.
        </p>
      )}

      <div className="grid gap-3">
        {rows?.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
          >
            <ChaLingerieRow
              noiva={row.noiva}
              dataEvento={row.data_evento}
              viewLink={`${origin}/cha-de-lingerie/planejamento/${row.view_token}`}
              editLink={`${origin}/cha-de-lingerie/editar/${row.edit_token}`}
            />
            <div className="flex items-center gap-4 shrink-0">
              <StatusBadge status={row.status} />
              <DeleteEventButton
                id={row.id}
                label={row.noiva || "—"}
                table="cha_lingerie"
                confirmNoun="chá de lingerie"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
