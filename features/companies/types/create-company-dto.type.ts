import type { CompanyStatus } from "./company-status.type";
import type { ApplicationStage } from "./application-stage.type";

export interface CreateCompanyDTO {
  name: string;
  categories: string[];
  website?: string;
  jobUrl?: string;
  contactEmail?: string;
  contactName?: string;
  note?: string;
  status?: CompanyStatus;
  applicationStage?: ApplicationStage;
  isFavorite?: boolean;
  skipFollowUp?: boolean;
  contactedAt?: string;
}
