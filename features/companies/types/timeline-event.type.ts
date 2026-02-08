import type { TimelineEventType } from "./timeline-event-type.type";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string;
  content: string;
}
