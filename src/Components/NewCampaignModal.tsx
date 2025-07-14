import {
  Button,
  Modal,
  Select,
  Stack,
  Textarea,
  type ComboboxData,
} from "@mantine/core";
import { useListPlayer } from "../core/Hooks/player.hook";
import type { OpenCloseType } from "../core/Types/CommonTypes";
import type { CampaignConfiguration, Player } from "../core/Types/IaTypes";
import { useState } from "react";
import { useConfiguration } from "../core/Hooks/configuration.hook";

type NewCampaignModalProps = {
  start: (
    player: Player,
    scenario: string,
    objective: string,
    configuration: CampaignConfiguration
  ) => Promise<void>;
} & OpenCloseType;

export default function NewCampaignModal({
  opened,
  onClose,
  start,
}: NewCampaignModalProps) {
  const { data } = useListPlayer();
  const { data: config } = useConfiguration();
  const [player, setPlayer] = useState<Player | undefined>();
  const [scenario, setScenario] = useState("");
  const [objective, setObjective] = useState("");

  const findAndSetPlayer = (index: string) => {
    setPlayer(data?.at(Number(index)));
  };

  const playerList: ComboboxData | undefined = data?.map(({ name }, index) => ({
    label: name,
    value: index.toString(),
  }));
  return (
    <Modal opened={opened} onClose={onClose} title="Criando campanha">
      <Stack>
        <Select
          label="Selecione o personagem"
          data={playerList}
          onChange={(playerIndex) =>
            playerIndex != null && findAndSetPlayer(playerIndex)
          }
        />
        <Textarea
          label="Descreva a área inicial"
          maxLength={200}
          onChange={(e) => setScenario(e.currentTarget.value)}
        />
        <Textarea
          label="Descreva o objetivo da campanha"
          maxLength={200}
          onChange={(e) => setObjective(e.currentTarget.value)}
        />
        <Button
          disabled={player === undefined}
          onClick={() => {
            if (player && config) start(player, scenario, objective, config);
            onClose();
          }}
        >
          Iniciar
        </Button>
      </Stack>
    </Modal>
  );
}
