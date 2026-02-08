import { differenceInDays, startOfWeek, format } from "date-fns";
import { fr } from "date-fns/locale";

export function daysSince(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return differenceInDays(new Date(), d);
}

export function isOverdue(date: Date | string, days = 7): boolean {
  return daysSince(date) > days;
}

export function getCurrentWeekStart(): string {
  return startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd MMM yyyy", { locale: fr });
}

export function formatRelative(date: Date | string): string {
  const days = daysSince(date);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}
