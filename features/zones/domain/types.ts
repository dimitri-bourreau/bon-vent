export interface Zone {
  id: string;
  name: string;
  order: number;
}

export interface CreateZoneDTO {
  name: string;
  order?: number;
}

export interface UpdateZoneDTO {
  id: string;
  name?: string;
  order?: number;
}
