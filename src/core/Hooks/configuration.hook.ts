import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CampaignConfiguration } from "../Types/IaTypes";

let configuration: CampaignConfiguration = {
  battle: 3,
  dialog: 3,
  dificult: 3,
};

export function useConfiguration() {
  return useQuery<CampaignConfiguration>({
    queryKey: ["configuration"],
    queryFn: () => configuration,
  });
}

export function useSetConfiguration() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (config: CampaignConfiguration) => {
      configuration = config;
      return configuration as unknown as Promise<CampaignConfiguration>;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configuration"] });
    },
  });
}
