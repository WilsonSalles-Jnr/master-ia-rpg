import {
  ActionIcon,
  AppShellNavbar,
  Button,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLayoutSidebarLeftCollapse,
  IconSettings,
} from "@tabler/icons-react";
import type { OpenCloseType } from "../core/Types/CommonTypes";
import PlayerListDrawer from "./PlayerListDrawer";
import Configuration from "./Configuration";

export default function NavigationMenu({ onClose }: OpenCloseType) {
  const [playerDrawer, playerDrawerActions] = useDisclosure(false);
  const [settingsDrawer, settingsDrawerActions] = useDisclosure(false);
  return (
    <AppShellNavbar bg="dark.8" c="white" p={10}>
      <Stack h="100%" justify="space-between">
        <Stack>
          <Group justify="space-between">
            <Text fw={700} fz={24}>
              MASTER IA RPG
            </Text>
            <ActionIcon size="lg" onClick={onClose}>
              <IconLayoutSidebarLeftCollapse />
            </ActionIcon>
          </Group>
          <Divider />
          <Button onClick={playerDrawerActions.open}>
            Lista de personagens
          </Button>
          <Button>Bestiário</Button>
        </Stack>
        <PlayerListDrawer
          opened={playerDrawer}
          onClose={playerDrawerActions.close}
        />
        <Stack>
          <Button
            color="gray"
            leftSection={<IconSettings />}
            onClick={settingsDrawerActions.open}
          >
            Configurações
          </Button>
          <Button color="red">Sair</Button>
          <Configuration
            opened={settingsDrawer}
            onClose={settingsDrawerActions.close}
          />
        </Stack>
      </Stack>
    </AppShellNavbar>
  );
}
