import type { Domain } from "../types/domain.type";
import type { CreateDomainDTO } from "../types/create-domain-dto.type";
import type { UpdateDomainDTO } from "../types/update-domain-dto.type";

export interface DomainRepository {
  getAll(): Promise<Domain[]>;
  getById(id: string): Promise<Domain | undefined>;
  create(dto: CreateDomainDTO): Promise<Domain>;
  update(dto: UpdateDomainDTO): Promise<Domain>;
  delete(id: string): Promise<void>;
}
