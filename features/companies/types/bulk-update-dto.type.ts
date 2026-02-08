export interface BulkUpdateDTO {
  ids: string[];
  contactedAt?: string;
  clearContactedAt?: boolean;
  categories?: string[];
  addCategories?: string[];
  removeCategories?: string[];
}
