import type { CompanyStatus } from "./company-status.type";
import type { ApplicationStage } from "./application-stage.type";
import type { TimelineEvent } from "./timeline-event.type";

export interface Company {
  id: string;
  name: string;
  categories: string[];
  website?: string;
  jobUrl?: string;
  contactEmail?: string;
  contactName?: string;
  note?: string;
  status: CompanyStatus;
  applicationStage: ApplicationStage;
  timeline: TimelineEvent[];
  contactedAt?: string;
  lastInteractionAt?: string;
  isFavorite: boolean;
  skipFollowUp?: boolean;
  createdAt: string;
  updatedAt: string;
}
