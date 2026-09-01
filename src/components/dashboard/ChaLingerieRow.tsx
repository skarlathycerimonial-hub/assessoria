"use client";

import { useState } from "react";

export function ChaLingerieRow({
  noiva,
  dataEvento,
  viewLink,
  editLink,
}: {
  noiva: string | null;
  dataEvento: string | null;
  viewLink: string;
  editLink: string;
}) {
  const [copied, setCopied] = useState<"view" | "edit" | null>(null);

  function copy(kind: "view" | "edit", link: string) {
    navigator.clipboard.writeText(link);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[15px] font-medium text-foreground">{noiva || "—"}</p>
      <p className="text-sm text-muted mt-0.5 mb-2">
        {dataEvento
          ? new Date(dataEvento + "T00:00:00").toLocaleDateString("pt-BR")
          : "Data ainda não definida"}
      </p>
      <div className="flex gap-3 text-xs">
        <button
          type="button"
          onClick={() => copy("view", viewLink)}
          className="text-brand-dark underline underline-offset-2"
        >
          {copied === "view" ? "Copiado!" : "Copiar link das amigas"}
        </button>
        <button
          type="button"
          onClick={() => copy("edit", editLink)}
          className="text-muted underline underline-offset-2"
        >
          {copied === "edit" ? "Copiado!" : "Copiar link privado"}
        </button>
      </div>
    </div>
  );
}
