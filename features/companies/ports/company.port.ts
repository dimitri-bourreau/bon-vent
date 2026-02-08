import type {
  Company,
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from "../domain/types";

export interface CompanyRepository {
  getAll(): Promise<Company[]>;
  getById(id: string): Promise<Company | undefined>;
  getByZone(zone: string): Promise<Company[]>;
  getByStatus(status: string): Promise<Company[]>;
  getFavorites(): Promise<Company[]>;
  getContacted(): Promise<Company[]>;
  getOverdue(days: number): Promise<Company[]>;
  getWaiting(): Promise<Company[]>;
  create(dto: CreateCompanyDTO): Promise<Company>;
  update(dto: UpdateCompanyDTO): Promise<Company>;
  delete(id: string): Promise<void>;
}
