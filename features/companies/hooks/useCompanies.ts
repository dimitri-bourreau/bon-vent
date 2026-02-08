"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAdapter } from "../adapters/company.adapter";
import { createCompanyService } from "../services/company.service";
import type {
  CreateCompanyDTO,
  UpdateCompanyDTO,
  AddTimelineEventDTO,
  ApplicationStage,
} from "../domain/types";

const service = createCompanyService(companyAdapter);

const KEYS = {
  all: ["companies"] as const,
  favorites: ["companies", "favorites"] as const,
  contacted: ["companies", "contacted"] as const,
  overdue: ["companies", "overdue"] as const,
  waiting: ["companies", "waiting"] as const,
  search: (q: string) => ["companies", "search", q] as const,
  duplicates: (name: string) => ["companies", "duplicates", name] as const,
  byCategory: (category: string) =>
    ["companies", "category", category] as const,
};

export function useCompanies() {
  return useQuery({ queryKey: KEYS.all, queryFn: service.getAll });
}

export function useFavorites() {
  return useQuery({ queryKey: KEYS.favorites, queryFn: service.getFavorites });
}

export function useContacted() {
  return useQuery({ queryKey: KEYS.contacted, queryFn: service.getContacted });
}

export function useOverdue() {
  return useQuery({
    queryKey: KEYS.overdue,
    queryFn: () => service.getOverdue(7),
  });
}

export function useWaiting() {
  return useQuery({ queryKey: KEYS.waiting, queryFn: service.getWaiting });
}

export function useCompaniesByCategory(category: string) {
  return useQuery({
    queryKey: KEYS.byCategory(category),
    queryFn: () => service.getByCategory(category),
    enabled: !!category,
  });
}

export function useSearchCompanies(query: string) {
  return useQuery({
    queryKey: KEYS.search(query),
    queryFn: () => service.search(query),
    enabled: query.length >= 2,
  });
}

export function useFindDuplicates(name: string) {
  return useQuery({
    queryKey: KEYS.duplicates(name),
    queryFn: () => service.findDuplicates(name),
    enabled: name.length >= 2,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCompanyDTO) => service.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateCompanyDTO) => service.update(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteManyCompanies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => service.deleteMany(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.toggleFavorite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useMarkAsContacted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.markAsContacted(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useAddTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddTimelineEventDTO) => service.addTimelineEvent(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateApplicationStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: ApplicationStage }) =>
      service.updateApplicationStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}
