import { ChaLingerieForm } from "@/components/cha-lingerie/ChaLingerieForm";

export default function ChaDeLingeriePage() {
  return (
    <div className="flex-1">
      <header className="border-b border-border bg-card/60 py-6">
        <div className="mx-auto max-w-xl px-6">
          <p className="font-serif text-xl text-brand-dark">Skarlathy Assessoria & Eventos</p>
          <p className="text-sm text-muted mt-1">
            Chá de Lingerie — formulário da noiva + planejamento com as amigas
          </p>
        </div>
      </header>
      <ChaLingerieForm mode="create" />
    </div>
  );
}
