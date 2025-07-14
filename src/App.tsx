import {
  ActionIcon,
  Affix,
  AppShell,
  AppShellMain,
  Button,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu, IconUser } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Messages from "./Components/Messages";
import NavigationMenu from "./Components/NavigationMenu";
import NewCampaignModal from "./Components/NewCampaignModal";
import PlayerStatus from "./Components/PlayerStatus";
import { callApi } from "./core/Services/deepseek.service";
import type {
  CampaignConfiguration,
  Message,
  Player,
} from "./core/Types/IaTypes";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hiddenNavigation, hiddenNavigationActions] = useDisclosure(false);
  const [playerStatus, playerStatusAction] = useDisclosure(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [config, setConfig] = useState<CampaignConfiguration>();

  const [isLoading, setIsLoading] = useState(false);
  const [playerModal, playerModalActions] = useDisclosure(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startGame = async (
    player: Player,
    scenario: string,
    objective: string,
    configuration: CampaignConfiguration
  ) => {
    try {
      setCurrentPlayer(player);
      setConfig(configuration);
      setIsLoading(true);
      const response = await callApi(
        messages,
        `Iniciar minha carreira em ${scenario}, meu objetivo é ${objective}`,
        player,
        configuration
      );
      const aiMessage: Message = { ...response, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
    playerModalActions.close();
  };

  const sendMessage = async (message: Message) => {
    setMessages((prev) => [...prev, message]);
    try {
      setIsLoading(true);
      if (currentPlayer && config) {
        const response = await callApi(
          messages,
          message.message,
          currentPlayer,
          config
        );
        const aiMessage: Message = { ...response, sender: "ai" };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell
      navbar={{
        breakpoint: 700,
        width: 300,
        collapsed: { desktop: hiddenNavigation, mobile: hiddenNavigation },
      }}
    >
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button
          size="lg"
          rightSection={<IconUser />}
          radius="xl"
          onClick={playerStatusAction.open}
        >
          Status
        </Button>
      </Affix>
      <Affix
        position={{ bottom: 20, left: 20 }}
        display={!hiddenNavigation ? "none" : undefined}
      >
        <Tooltip label="Exibir menu" position="right">
          <ActionIcon
            onClick={hiddenNavigationActions.close}
            size="xl"
            radius={60}
          >
            <IconMenu />
          </ActionIcon>
        </Tooltip>
      </Affix>
      <NavigationMenu
        onClose={hiddenNavigationActions.open}
        opened={hiddenNavigation}
      />
      <AppShellMain bg="dark.6" c="white">
        <Stack
          p={25}
          h="100vh"
          justify={messages.length > 0 ? "start" : "center"}
        >
          <Stack align="center" gap={5}>
            <Text fw={700} fz={48}>
              Master IA RPG
            </Text>
            <Text fz={20} hidden={messages.length > 0 || isLoading}>
              Cada jornada é única, com cada detalhe construído pela IA. Crie
              seu personagem e dê início à sua história, informando seu objetivo
              e onde tudo irá começar.
            </Text>
            <Button
              size="lg"
              radius="xl"
              w={300}
              onClick={playerModalActions.open}
              display={messages.length > 0 || isLoading ? "none" : undefined}
              /* onClick={() =>
                callApi(
                  messages,
                  "Local de inicio: metro de tokio, Objetivo: destruir a caixa de pandora que esta impedindo das pessoas morrerem em paz",
                  {
                    name: "Dragnov",
                    charisma: 1,
                    constitution: 1,
                    dexterity: 1,
                    hp: 10,
                    intelligence: 1,
                    luck: 1,
                    maxHp: 10,
                    strength: 6,
                  },
                  { battle: 5, dialog: 2, dificult: 3, duration: 2 }
                )
              } */
            >
              iniciar carreira
            </Button>
          </Stack>

          <ScrollArea
            h="calc(100vh - 200px)"
            offsetScrollbars
            display={messages.length > 0 ? undefined : "none"}
          >
            <Stack gap="md" pb={20}>
              {messages.map((message, index) => (
                <Messages
                  key={index}
                  isLoading={isLoading}
                  index={index}
                  message={message}
                  messagesCount={messages.length}
                  sendMessage={sendMessage}
                />
              ))}
              {isLoading && (
                <Group>
                  <Loader />
                  <Text>Escrevendo...</Text>
                </Group>
              )}
              <div ref={messagesEndRef} />
            </Stack>
          </ScrollArea>
        </Stack>
        {/* <Modal
          opened={playerModal}
          onClose={playerModalActions.close}
          title="Criação de personagem e enredo"
        >
          <Stack>
            <Input
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nome do personagem"
            />
            <Textarea
              onChange={(e) => setPlayerDetails(e.target.value)}
              placeholder="Detalhes do personagem"
            />
            <Textarea
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Descrição do cenário inicial"
            />
            <Textarea
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descrição do objetivo do rpg"
            />
            <Select
              data={["curta", "média", "longa"]}
              onSelect={(e) => setDuration(e.currentTarget.value)}
              defaultValue={duration}
              label="Duração"
            />
            <Select
              data={["fácil", "média", "difícil"]}
              onSelect={(e) => setDificult(e.currentTarget.value)}
              defaultValue={dificult}
              label="Dificuldade"
            />
            <Button onClick={startGame}>Iniciar</Button>
          </Stack>
        </Modal> */}
        <PlayerStatus
          opened={playerStatus}
          onClose={playerStatusAction.close}
        />
        <NewCampaignModal
          opened={playerModal}
          onClose={playerModalActions.close}
          start={startGame}
        />
      </AppShellMain>
    </AppShell>
  );
}

export default App;
