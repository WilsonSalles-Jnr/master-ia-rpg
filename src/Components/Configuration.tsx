import {
  Button,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useConfiguration,
  useSetConfiguration,
} from "../core/Hooks/configuration.hook";
import type { OpenCloseType } from "../core/Types/CommonTypes";
import type { CampaignConfiguration, LevelSize } from "../core/Types/IaTypes";

export default function Configuration({ opened, onClose }: OpenCloseType) {
  const { data } = useConfiguration();
  const { mutateAsync } = useSetConfiguration();
  const [configuration, setConfiguration] = useState<
    CampaignConfiguration | undefined
  >(data);

  useEffect(() => {
    setConfiguration(data);
  }, [data]);

  const saveConfiguration = async () => {
    if (configuration) await mutateAsync(configuration);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Text fz={24} fw={700}>
          Configurações
        </Text>
      }
      position="right"
      size="lg"
    >
      <Stack>
        <Stack gap={0}>
          <Text fw={700}>Dificuldade</Text>
          <SegmentedControl
            color="blue"
            data={["1", "2", "3", "4", "5"]}
            defaultValue={configuration?.dificult.toString()}
            onChange={(e) => {
              if (configuration) {
                setConfiguration({
                  ...configuration,
                  dificult: Number(e) as LevelSize,
                });
              }
            }}
          />
          <Group justify="space-between">
            <Text>muito fácil</Text>
            <Text>muito difícil</Text>
          </Group>
        </Stack>
        <Stack gap={0}>
          <Text fw={700}>Quantidade de batalhas</Text>
          <SegmentedControl
            color="blue"
            data={["1", "2", "3", "4", "5"]}
            defaultValue={configuration?.battle.toString()}
            onChange={(e) => {
              if (configuration) {
                setConfiguration({
                  ...configuration,
                  battle: Number(e) as LevelSize,
                });
              }
            }}
          />
          <Group justify="space-between">
            <Text>poucas batalhas</Text>
            <Text>muitas batalhas</Text>
          </Group>
        </Stack>
        <Stack gap={0}>
          <Text fw={700}>Quantidade de diálogos</Text>
          <SegmentedControl
            color="blue"
            data={["1", "2", "3", "4", "5"]}
            defaultValue={configuration?.dialog.toString()}
            onChange={(e) => {
              if (configuration) {
                setConfiguration({
                  ...configuration,
                  dialog: Number(e) as LevelSize,
                });
              }
            }}
          />
          <Group justify="space-between">
            <Text>poucos diálogos</Text>
            <Text>muitos diálogos</Text>
          </Group>
        </Stack>
        <Button color="green" onClick={saveConfiguration}>
          Salvar
        </Button>
      </Stack>
    </Drawer>
  );
}
