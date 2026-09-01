"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/casais", label: "Casais" },
  { href: "/dashboard/briefing", label: "Briefing dos Noivos" },
  { href: "/dashboard/cha-lingerie", label: "Chá de Lingerie" },
  { href: "/dashboard/calendario", label: "Calendário" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card/60">
      <div className="mx-auto max-w-5xl px-6 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const active = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`shrink-0 px-4 py-3 text-sm border-b-2 transition ${
                active
                  ? "border-brand text-brand-dark font-medium"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
