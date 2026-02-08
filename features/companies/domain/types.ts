export type CompanyStatus = "favorite" | "contacted" | "waiting" | "follow_up";

export type ApplicationStage =
  | "research"
  | "applied"
  | "interview"
  | "offer"
  | "accepted"
  | "rejected";

export type TimelineEventType =
  | "note"
  | "email_sent"
  | "email_received"
  | "call"
  | "interview"
  | "offer"
  | "status_change";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string;
  content: string;
}

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
  createdAt: string;
  updatedAt: string;
}

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
  contactedAt?: string;
}

export interface UpdateCompanyDTO extends Partial<CreateCompanyDTO> {
  id: string;
}

export interface AddTimelineEventDTO {
  companyId: string;
  type: TimelineEventType;
  content: string;
}
