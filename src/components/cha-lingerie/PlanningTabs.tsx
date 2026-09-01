"use client";

import { useState, type ReactNode } from "react";

export function PlanningTabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
              active === tab.id
                ? "border-brand bg-brand-soft text-brand-dark font-medium"
                : "border-border bg-card text-muted hover:border-brand/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.id === active)?.content}
    </div>
  );
}
