import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Player } from "../Types/IaTypes";

const players: Player[] = [
  {
    name: "Grak",
    description:
      "Um orc imponente, com cicatrizes que contam histórias. Força monumental e coração nobre, protege aliados. Prefere a ação direta à sutileza.",
    hp: 35,
    maxHp: 35,
    strength: 18,
    constitution: 16,
    dexterity: 7,
    intelligence: 9,
    charisma: 10,
    luck: 8,
  },
];

export function useListPlayer() {
  const queryClient = useQuery({
    queryKey: ["players"],
    queryFn: () => players,
  });
  return queryClient;
}

export function useCreatePlayer() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (player: Player) => {
      players.push(player);
      return players as unknown as Promise<Player[]>;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["players"] });
    },
  });
  return mutation;
}
