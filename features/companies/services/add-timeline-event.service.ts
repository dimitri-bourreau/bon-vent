import type { CompanyRepository } from "../api/company.port";
import type { AddTimelineEventDTO } from "../types/add-timeline-event-dto.type";

export function addTimelineEvent(
  repository: CompanyRepository,
  dto: AddTimelineEventDTO,
) {
  return repository.addTimelineEvent(dto);
}
