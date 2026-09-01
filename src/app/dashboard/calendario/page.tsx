import { createClient } from "@/lib/supabase/server";
import { MonthCalendar } from "@/components/dashboard/MonthCalendar";

export default async function CalendarioPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, noiva, noivo, data_evento")
    .not("data_evento", "is", null);

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-1">Calendário</h1>
      <p className="text-sm text-muted mb-6">
        Preenche sozinho com a data de cada casal cadastrado em Casais.
      </p>
      <MonthCalendar events={events ?? []} />
    </div>
  );
}
