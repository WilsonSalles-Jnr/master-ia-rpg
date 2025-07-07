import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Button,
  Divider,
  Input,
  Stack,
  Text,
  ActionIcon,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import "./App.css";

function AppCopy() {
  return (
    <AppShell navbar={{ breakpoint: 700, width: 300 }}>
      <AppShellNavbar bg="dark.8" c="white">
        <Stack m={5}>
          <Text fw={700} fz={24}>
            MASTER IA RPG
          </Text>
          <Divider />
          <Button>Primeira história</Button>
        </Stack>
      </AppShellNavbar>
      <AppShellMain bg="dark.6" c="white">
        <Stack p={50} justify="center" h="100vh" align="center">
          <Stack gap={5} align="center">
            <Text fw={700} fz={48}>
              Master IA RPG
            </Text>
            <Text>
              Vamos criar uma história fantástica onde você será o protagonista
              e tomará decisões que podem tomar um rumo totalmente único
            </Text>
          </Stack>
          <Input
            size="lg"
            radius={100}
            w={1000}
            placeholder="Inicie sua jornada"
            rightSection={
              <ActionIcon size="lg" radius={100} p={8}>
                <IconSend />
              </ActionIcon>
            }
          />
        </Stack>
      </AppShellMain>
    </AppShell>
  );
}

export default AppCopy;
