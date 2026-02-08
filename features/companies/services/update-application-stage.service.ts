import type { CompanyRepository } from "../api/company.port";
import type { ApplicationStage } from "../types/application-stage.type";

export function updateApplicationStage(repository: CompanyRepository, id: string, stage: ApplicationStage) {
  return repository.update({ id, applicationStage: stage });
}
