import type { CreateCompanyDTO } from "./create-company-dto.type";

export interface UpdateCompanyDTO extends Partial<CreateCompanyDTO> {
  id: string;
}
