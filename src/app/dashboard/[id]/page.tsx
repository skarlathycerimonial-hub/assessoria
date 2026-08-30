import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { briefingSections, type BriefingField, type MediaItem } from "@/lib/briefing/schema";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import { CoupleAvatar } from "@/components/avatar/CoupleAvatar";
import { defaultAvatar1, defaultAvatar2, type AvatarConfig } from "@/lib/avatar/types";

function formatValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return value.length ? value.join(", ") : null;
  const str = String(value).trim();
  return str.length ? str : null;
}

function hasValue(field: BriefingField, value: unknown): boolean {
  if (field.type === "media") return Array.isArray(value) && value.length > 0;
  return formatValue(value) !== null;
}

function MediaValue({ items }: { items: MediaItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) =>
        item.kind === "file" && item.contentType?.startsWith("image/") ? (
          <a key={i} href={item.url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt="" className="h-16 w-16 rounded-lg object-cover border border-border" />
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
  );
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
  const avatar1 = (event.avatar1 as AvatarConfig | null) ?? defaultAvatar1;
  const avatar2 = (event.avatar2 as AvatarConfig | null) ?? defaultAvatar2;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <CoupleAvatar config={avatar1} size={44} />
            <CoupleAvatar config={avatar2} size={44} flip />
          </div>
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
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 mb-8">
        <span className="flex-1 truncate text-sm text-muted">{link}</span>
        <CopyLinkButton link={link} />
      </div>

      <div className="flex flex-col gap-8">
        {briefingSections.map((section) => {
          const rows = section.fields.filter((field) => hasValue(field, responses[field.key]));

          if (rows.length === 0) return null;

          return (
            <div key={section.id} className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-serif text-lg text-brand-dark mb-4">{section.title}</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {rows.map((field) => (
                  <div key={field.key} className={field.type === "media" ? "sm:col-span-2" : undefined}>
                    <dt className="text-xs uppercase tracking-wide text-muted mb-1">
                      {field.label}
                    </dt>
                    <dd className="text-[15px] text-foreground whitespace-pre-wrap">
                      {field.type === "media" ? (
                        <MediaValue items={responses[field.key] as MediaItem[]} />
                      ) : (
                        formatValue(responses[field.key])
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}

        {briefingSections.every((section) =>
          section.fields.every((f) => !hasValue(f, responses[f.key]))
        ) && (
          <p className="text-muted text-[15px] text-center py-10">
            Este casal ainda não começou a preencher o briefing.
          </p>
        )}
      </div>
    </div>
  );
}
