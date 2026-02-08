export interface BulkUpdateDTO {
  ids: string[];
  contactedAt?: string;
  categories?: string[];
  addCategories?: string[];
  removeCategories?: string[];
}
