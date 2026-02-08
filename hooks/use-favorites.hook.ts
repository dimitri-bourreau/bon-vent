"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getFavorites } from "@/features/companies/services/get-favorites.service";

export function useFavorites() {
  return useQuery({
    queryKey: ["companies", "favorites"],
    queryFn: () => getFavorites(companyApiAdapter),
  });
}
