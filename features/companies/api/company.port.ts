import type { Company } from "../types/company.type";
import type { CreateCompanyDTO } from "../types/create-company-dto.type";
import type { UpdateCompanyDTO } from "../types/update-company-dto.type";
import type { AddTimelineEventDTO } from "../types/add-timeline-event-dto.type";

export interface CompanyRepository {
  getAll(): Promise<Company[]>;
  getById(id: string): Promise<Company | undefined>;
  getByCategory(category: string): Promise<Company[]>;
  getByStatus(status: string): Promise<Company[]>;
  getFavorites(): Promise<Company[]>;
  getContacted(): Promise<Company[]>;
  getOverdue(days: number): Promise<Company[]>;
  getWaiting(): Promise<Company[]>;
  getAwaitingResponse(): Promise<Company[]>;
  search(query: string): Promise<Company[]>;
  findDuplicates(name: string): Promise<Company[]>;
  create(dto: CreateCompanyDTO): Promise<Company>;
  update(dto: UpdateCompanyDTO): Promise<Company>;
  addTimelineEvent(dto: AddTimelineEventDTO): Promise<Company>;
  delete(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
}
