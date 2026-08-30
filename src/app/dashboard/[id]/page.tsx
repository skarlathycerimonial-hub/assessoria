import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { briefingSections } from "@/lib/briefing/schema";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";

function formatValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return value.length ? value.join(", ") : null;
  const str = String(value).trim();
  return str.length ? str : null;
}

export default async function CasalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) notFound();

  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const link = `${protocol}://${host}/briefing/${event.token}`;

  const responses = (event.responses ?? {}) as Record<string, unknown>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark">
            {event.noiva || "—"} &amp; {event.noivo || "—"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {event.data_evento
              ? new Date(event.data_evento + "T00:00:00").toLocaleDateString("pt-BR")
              : "Data ainda não definida"}
            {event.email ? ` · ${event.email}` : ""}
          </p>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 mb-8">
        <span className="flex-1 truncate text-sm text-muted">{link}</span>
        <CopyLinkButton link={link} />
      </div>

      <div className="flex flex-col gap-8">
        {briefingSections.map((section) => {
          const rows = section.fields
            .map((field) => ({ field, value: formatValue(responses[field.key]) }))
            .filter((row) => row.value !== null);

          if (rows.length === 0) return null;

          return (
            <div key={section.id} className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-serif text-lg text-brand-dark mb-4">{section.title}</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {rows.map(({ field, value }) => (
                  <div key={field.key}>
                    <dt className="text-xs uppercase tracking-wide text-muted mb-1">
                      {field.label}
                    </dt>
                    <dd className="text-[15px] text-foreground whitespace-pre-wrap">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}

        {briefingSections.every(
          (section) => section.fields.every((f) => formatValue(responses[f.key]) === null)
        ) && (
          <p className="text-muted text-[15px] text-center py-10">
            Este casal ainda não começou a preencher o briefing.
          </p>
        )}
      </div>
    </div>
  );
}
