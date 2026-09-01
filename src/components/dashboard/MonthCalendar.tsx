"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  noiva: string | null;
  noivo: string | null;
  data_evento: string; // yyyy-mm-dd
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function coupleLabel(ev: CalendarEvent) {
  return `${ev.noiva || "—"} & ${ev.noivo || "—"}`;
}

export function MonthCalendar({ events }: { events: CalendarEvent[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const list = map.get(ev.data_evento) ?? [];
      list.push(ev);
      map.set(ev.data_evento, list);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = today.toISOString().slice(0, 10);

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const upcoming = events
    .filter((ev) => ev.data_evento >= todayKey)
    .sort((a, b) => a.data_evento.localeCompare(b.data_evento))
    .slice(0, 8);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="h-8 w-8 rounded-full border border-border hover:border-brand/50 transition text-muted"
          >
            ‹
          </button>
          <p className="font-serif text-lg text-brand-dark">
            {monthNames[month]} {year}
          </p>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="h-8 w-8 rounded-full border border-border hover:border-brand/50 transition text-muted"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted mb-1">
          {weekDays.map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsByDay.get(key) ?? [];
            const isToday = key === todayKey;
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg border p-1 flex flex-col items-center gap-0.5 ${
                  isToday ? "border-brand bg-brand-soft" : "border-border"
                }`}
                title={dayEvents.map(coupleLabel).join(", ")}
              >
                <span className={`text-xs ${isToday ? "text-brand-dark font-medium" : "text-muted"}`}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span key={ev.id} className="h-1.5 w-1.5 rounded-full bg-brand" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="font-serif text-lg text-brand-dark mb-4">Próximos casamentos</p>
        {upcoming.length === 0 && (
          <p className="text-sm text-muted">Nenhum casamento com data marcada ainda.</p>
        )}
        <div className="flex flex-col gap-3">
          {upcoming.map((ev) => (
            <Link
              key={ev.id}
              href={`/dashboard/casais/${ev.id}`}
              className="block hover:text-brand-dark transition"
            >
              <p className="text-[15px] font-medium text-foreground">{coupleLabel(ev)}</p>
              <p className="text-sm text-muted">
                {new Date(ev.data_evento + "T00:00:00").toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
