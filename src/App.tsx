import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Avatar,
  Button,
  Divider,
  Group,
  Input,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { useDisclosure } from "@mantine/hooks";
import mageIa from "../public/ia.png";
import { IconUser } from "@tabler/icons-react";

interface Message {
  id: string;
  text: string;
  options?: string[];
  sender: "user" | "ai";
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "**Bem-vindo ao Master IA RPG!**\n\nVamos criar uma história fantástica onde você será o protagonista. Você pode:\n\n- Escolher seu personagem\n- Definir o cenário inicial\n- Começar com um enigma\n\n*Por onde gostaria de começar?*",
      sender: "ai",
    },
  ]);

  const [playerName, setPlayerName] = useState("");
  const [playerDetails, setPlayerDetails] = useState("");
  const [scenario, setScenario] = useState("");
  const [objective, setObjective] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [playerModal, playerModalActions] = useDisclosure(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractOptionsFromResponse = (response: string) => {
    console.log(response);
    const opcoes = response
      .split("\n")
      .filter((linha) => linha.trim().startsWith("[opcao]"))
      .map((linha) => linha.replace("[opcao]", "").trim());
    if (opcoes != undefined && opcoes.length > 1) {
      return opcoes;
    }
    return undefined;
  };

  const callDeepSeekAPI = async (prompt: string) => {
    try {
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: `Você é um mestre de RPG especializado em criar histórias interativas e imersivas.
                Responda sempre em markdown formatado com emoção e detalhes vívidos.
                Incentive o jogador a tomar decisões que moldem a história.
                Ofereça no mínimo 2 opções e no máximo 5 opções.
                Sempre ofereça as opções no seguinte padrão [opcao]Descrição da opção (para que seja feito a tratativa do retorno da mensagem, é necessário vir literalmente escrito [opcao]).
                As opções devem vir apenas no final e elas não devem ser em markdown.
                Ao final da campanha, apenas uma opção de nova campanha deve aparecer.
                Sistema de batalha devem ser feitas com dados, sendo girados automaticamente durante as batalhas e decisões que dependam de dados.
                Aqui estão os detalhes importantes sobre o jogador: Nome do protagonista: ${playerName},  detalhes do protagonista: ${playerDetails}, cenário inicial: ${scenario}, objetivo do jogo: ${objective}, duração da campanha: curta`,
              },
              ...messages
                .filter((m) => m.sender === "ai")
                .map((m) => ({
                  role: "assistant",
                  content: m.text,
                })),
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const options = extractOptionsFromResponse(aiResponse);

      const cleanedText = options ? aiResponse.split("[opcao]")[0] : aiResponse;

      return {
        text: cleanedText,
        options,
      };
    } catch (error) {
      console.error("Erro ao chamar DeepSeek API:", error);
      return {
        text: "**Erro:** Não foi possível processar sua requisição. Por favor, tente novamente.",
        options: ["Tentar novamente", "Voltar ao menu", "Continuar sem opções"],
      };
    }
  };

  const handleSendMessage = async (message: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { text, options } = await callDeepSeekAPI(message);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        options,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "**Erro:** Não foi possível conectar ao servidor do DeepSeek. Por favor, tente novamente mais tarde.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = () => {
    handleSendMessage("Iniciar carreira");
    playerModalActions.close();
  };

  return (
    <AppShell
      navbar={{ breakpoint: 700, width: 300, collapsed: { mobile: true } }}
    >
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
        <Stack p={25} h="100vh">
          <Text fw={700} fz={48} ta="center">
            Master IA RPG
          </Text>

          <ScrollArea h="calc(100vh - 200px)" offsetScrollbars>
            <Stack gap="md" pb={20}>
              {messages.map((message, index) => (
                <Group
                  key={message.id}
                  align="flex-start"
                  justify={
                    message.sender === "user" ? "flex-end" : "flex-start"
                  }
                >
                  {message.sender === "ai" && (
                    <Avatar color="blue" radius="xl" src={mageIa}>
                      AI
                    </Avatar>
                  )}
                  <Paper
                    p="md"
                    radius="md"
                    bg={message.sender === "user" ? "blue.6" : "dark.5"}
                    maw="70%"
                  >
                    {message.sender === "ai" ? (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    ) : (
                      <Text>{message.text}</Text>
                    )}
                    {message.options ? (
                      <Group>
                        {message.options.map((opt) => (
                          <Button
                            style={{ whiteSpace: "break-spaces" }}
                            disabled={messages.length - 1 > index || isLoading}
                            onClick={() => handleSendMessage(opt)}
                          >
                            {opt}
                          </Button>
                        ))}
                      </Group>
                    ) : null}
                    {index === 0 && (
                      <Button
                        fullWidth
                        onClick={playerModalActions.open}
                        disabled={messages.length - 1 > index || isLoading}
                      >
                        Iniciar jornada
                      </Button>
                    )}
                  </Paper>
                  {message.sender === "user" && (
                    <Avatar color="teal" radius="xl">
                      <IconUser />
                    </Avatar>
                  )}
                </Group>
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
        <Modal
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
            <Button onClick={startGame}>Iniciar</Button>
          </Stack>
        </Modal>
      </AppShellMain>
    </AppShell>
  );
}

export default App;
