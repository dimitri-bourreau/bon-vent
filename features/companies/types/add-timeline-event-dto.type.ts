import type { TimelineEventType } from "./timeline-event-type.type";

export interface AddTimelineEventDTO {
  companyId: string;
  type: TimelineEventType;
  content: string;
}
