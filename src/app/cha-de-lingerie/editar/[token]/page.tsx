import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ChaLingerieForm } from "@/components/cha-lingerie/ChaLingerieForm";
import type { Guest } from "@/components/cha-lingerie/GuestListStep";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditarChaLingeriePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cha_lingerie_get_edit", { p_edit_token: token }).single();

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-serif text-2xl text-brand-dark mb-3">Link não encontrado</p>
        <p className="text-muted text-[15px]">
          Esse link parece inválido. Fale com a Skarlathy Assessoria para receber um novo link.
        </p>
      </div>
    );
  }

  const row = data as {
    noiva: string | null;
    data_evento: string | null;
    responses: Record<string, unknown>;
    convidadas: Guest[];
    view_token: string;
  };

  const initialResponses = {
    nome_noiva: row.noiva ?? undefined,
    ...row.responses,
  };

  return (
    <div className="flex-1">
      <header className="border-b border-border bg-card/60 py-6">
        <div className="mx-auto max-w-xl px-6">
          <p className="font-serif text-xl text-brand-dark">Skarlathy Assessoria & Eventos</p>
          <p className="text-sm text-muted mt-1">Editar seu Chá de Lingerie</p>
        </div>
      </header>
      <ChaLingerieForm
        mode="edit"
        editToken={token}
        viewToken={row.view_token}
        initialResponses={initialResponses}
        initialConvidadas={row.convidadas ?? []}
      />
    </div>
  );
}
