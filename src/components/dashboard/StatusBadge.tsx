const labels: Record<string, string> = {
  rascunho: "Aguardando preenchimento",
  em_preenchimento: "Em preenchimento",
  completo: "Completo",
};

const styles: Record<string, string> = {
  rascunho: "bg-neutral-100 text-neutral-600",
  em_preenchimento: "bg-amber-100 text-amber-700",
  completo: "bg-emerald-100 text-emerald-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? styles.rascunho}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
