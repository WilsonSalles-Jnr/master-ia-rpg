import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Drawer,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import type { OpenCloseType } from "../core/Types/CommonTypes";
import { IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import PlayerCreationModal from "./PlayerCreationModal";
import { useListPlayer } from "../core/Hooks/player.hook";

export default function PlayerListDrawer({ opened, onClose }: OpenCloseType) {
  const [creationModal, creationModalActions] = useDisclosure(false);
  const { data } = useListPlayer();
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Text fz={24} fw={700}>
          Lista de personagens
        </Text>
      }
    >
      <Stack>
        {data?.map(
          (
            {
              charisma,
              constitution,
              dexterity,
              hp,
              intelligence,
              luck,
              maxHp,
              name,
              strength,
              description,
            },
            index
          ) => {
            return (
              <Card withBorder radius={18} key={index}>
                <Group justify="space-between">
                  <Group>
                    <Avatar />
                    <Stack gap={0}>
                      <Text fw={700}>{name}</Text>
                      <Text>{`HP: ${hp}/${maxHp}`}</Text>
                    </Stack>
                  </Group>
                  <ActionIcon color="red">
                    <IconTrash />
                  </ActionIcon>
                </Group>
                <Text c="dimmed">{description}</Text>
                <SimpleGrid cols={3} spacing={0}>
                  <Text>Força: {strength}</Text>
                  <Text>Constituição: {constitution}</Text>
                  <Text>Destreza: {dexterity}</Text>
                  <Text>Inteligência: {intelligence}</Text>
                  <Text>Carisma: {charisma}</Text>
                  <Text>Sorte: {luck}</Text>
                </SimpleGrid>
              </Card>
            );
          }
        )}
        <Button onClick={creationModalActions.open}>Criar jogador</Button>
      </Stack>
      <PlayerCreationModal
        opened={creationModal}
        onClose={creationModalActions.close}
      />
    </Drawer>
  );
}
