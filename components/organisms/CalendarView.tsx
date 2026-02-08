"use client";

import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  addDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-companies.hook";
import type { Company } from "@/features/companies/types/company.type";

interface Props {
  onSelectCompany?: (company: Company) => void;
}

export function CalendarView({ onSelectCompany }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: companies = [] } = useCompanies();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart, calendarEnd],
  );

  type CalendarEvent = { company: Company; type: "contact" | "followup" };

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    companies.forEach((c) => {
      const hasBeenContacted =
        c.contactedAt && c.applicationStage !== "research";
      if (hasBeenContacted) {
        const contactKey = format(new Date(c.contactedAt), "yyyy-MM-dd");
        const contactList = map.get(contactKey) || [];
        contactList.push({ company: c, type: "contact" });
        map.set(contactKey, contactList);

        if (c.status === "waiting") {
          const followupKey = format(
            addDays(new Date(c.contactedAt), 7),
            "yyyy-MM-dd",
          );
          const followupList = map.get(followupKey) || [];
          followupList.push({ company: c, type: "followup" });
          map.set(followupKey, followupList);
        }
      }
    });
    return map;
  }, [companies]);

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          &lt;
        </Button>
        <h3 className="font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          &gt;
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {weekDays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const events = eventsByDay.get(key) || [];
          const isCurrentMonth = day >= monthStart && day <= monthEnd;

          return (
            <div
              key={key}
              className={`min-h-[60px] rounded-md border p-1 text-xs ${
                isCurrentMonth ? "bg-background" : "bg-muted/30"
              } ${isToday(day) ? "border-primary" : "border-transparent"}`}
            >
              <div
                className={`mb-1 ${isToday(day) ? "font-bold text-primary" : ""}`}
              >
                {format(day, "d")}
              </div>
              {events.slice(0, 2).map((evt) => (
                <button
                  key={`${evt.company.id}-${evt.type}`}
                  type="button"
                  onClick={() => onSelectCompany?.(evt.company)}
                  className={`block w-full truncate rounded px-1 text-left text-[10px] ${
                    evt.type === "followup"
                      ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                      : "bg-primary/10 hover:bg-primary/20"
                  }`}
                >
                  {evt.type === "followup" && "! "}
                  {evt.company.name}
                </button>
              ))}
              {events.length > 2 && (
                <span className="text-[10px] text-muted-foreground">
                  +{events.length - 2}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
