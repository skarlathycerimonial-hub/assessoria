"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteEventButton({
  id,
  label,
  redirectTo,
}: {
  id: string;
  label: string;
  redirectTo?: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Apagar o casal "${label}"? Essa ação não pode ser desfeita.`)) return;

    setLoading(true);
    await supabase.from("events").delete().eq("id", id);
    setLoading(false);

    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="shrink-0 text-sm text-muted hover:text-red-500 transition disabled:opacity-60"
    >
      {loading ? "Apagando…" : "Apagar"}
    </button>
  );
}
