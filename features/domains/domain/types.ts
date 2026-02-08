export interface Domain {
  id: string;
  name: string;
  color: string;
  order: number;
  createdAt: string;
}

export interface CreateDomainDTO {
  name: string;
  color?: string;
}

export interface UpdateDomainDTO {
  id: string;
  name?: string;
  color?: string;
  order?: number;
}
