export type CompanyStatus = "favorite" | "contacted" | "waiting" | "follow_up";

export interface Company {
  id: string;
  name: string;
  categories: string[];
  website?: string;
  contactEmail?: string;
  contactName?: string;
  note?: string;
  status: CompanyStatus;
  contactedAt?: string;
  lastInteractionAt?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDTO {
  name: string;
  categories: string[];
  website?: string;
  contactEmail?: string;
  contactName?: string;
  note?: string;
  status?: CompanyStatus;
  isFavorite?: boolean;
  contactedAt?: string;
}

export interface UpdateCompanyDTO extends Partial<CreateCompanyDTO> {
  id: string;
}
