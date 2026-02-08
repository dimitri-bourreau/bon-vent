import type { Domain, CreateDomainDTO, UpdateDomainDTO } from "../domain/types";

export interface DomainRepository {
  getAll(): Promise<Domain[]>;
  getById(id: string): Promise<Domain | undefined>;
  create(dto: CreateDomainDTO): Promise<Domain>;
  update(dto: UpdateDomainDTO): Promise<Domain>;
  delete(id: string): Promise<void>;
}
