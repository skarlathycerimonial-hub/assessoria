import { createClient } from "@/lib/supabase/server";
import { BriefingForm } from "@/components/briefing/BriefingForm";

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("briefing_get", { p_token: token }).single();

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-serif text-2xl text-brand-dark mb-3">Link não encontrado</p>
        <p className="text-muted text-[15px]">
          Esse link parece inválido ou expirou. Fale com a Skarlathy Assessoria para receber um
          novo link do seu briefing.
        </p>
      </div>
    );
  }

  const row = data as {
    noiva: string | null;
    noivo: string | null;
    email: string | null;
    data_evento: string | null;
    status: string;
    responses: Record<string, unknown>;
  };

  const initialResponses = {
    noiva: row.noiva ?? undefined,
    noivo: row.noivo ?? undefined,
    email: row.email ?? undefined,
    data_evento: row.data_evento ?? undefined,
    ...row.responses,
  };

  return (
    <div className="flex-1">
      <header className="border-b border-border bg-card/60 py-6">
        <div className="mx-auto max-w-xl px-6">
          <p className="font-serif text-xl text-brand-dark">Skarlathy Assessoria & Eventos</p>
          <p className="text-sm text-muted mt-1">Briefing inicial do seu casamento</p>
        </div>
      </header>
      <BriefingForm
        token={token}
        initialResponses={initialResponses}
        initialStatus={row.status}
      />
    </div>
  );
}
