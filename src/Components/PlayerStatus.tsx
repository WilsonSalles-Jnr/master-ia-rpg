import {
  Button,
  Card,
  CardSection,
  Drawer,
  Group,
  InputWrapper,
  Paper,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import type { OpenCloseType } from "../core/Types/CommonTypes";

export default function PlayerStatus({ opened, onClose }: OpenCloseType) {
  const attributes = [
    { label: "Força:", value: 1 },
    { label: "Constituição:", value: 1 },
    { label: "Destreza:", value: 1 },
    { label: "Inteligência:", value: 1 },
    { label: "Carisma:", value: 1 },
    { label: "Sorte:", value: 1 },
  ];
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} fz={24}>
          Nome do jogador
        </Text>
      }
      position="right"
      size="lg"
    >
      <Stack>
        <InputWrapper label="HP">
          <Stack gap={0} align="end">
            <Progress value={100} w="100%" />
            <Text>100/100</Text>
          </Stack>
        </InputWrapper>
        <Card withBorder bg="dark" c="white" radius={8}>
          <CardSection>
            <Text m={5} fw={700}>
              Descrição do personagem:
            </Text>
          </CardSection>
          <Text>Descrição detalhada do personagem</Text>
        </Card>
        <Card withBorder bg="dark" c="white" radius={8}>
          <CardSection>
            <Text m={5} fw={700}>
              Atributos:
            </Text>
          </CardSection>
          <Stack gap={5}>
            {attributes.map(({ label, value }, index) => {
              return (
                <Paper bg="dark.2" key={index} px={15}>
                  <Group justify="space-between">
                    <Text>{label}</Text>
                    <Text>{value}</Text>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Card>
        <Button>as das</Button>
      </Stack>
    </Drawer>
  );
}
