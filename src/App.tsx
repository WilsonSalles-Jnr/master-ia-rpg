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
  Progress,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { useDisclosure } from "@mantine/hooks";
import mageIa from "../public/ia.png";
import { IconHeart, IconUser } from "@tabler/icons-react";

interface Message {
  id: string;
  text: string;
  currentHp?: number;
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
  const [currentHp, setHp] = useState(100);

  const [playerName, setPlayerName] = useState("");
  const [playerDetails, setPlayerDetails] = useState("");
  const [scenario, setScenario] = useState("");
  const [objective, setObjective] = useState("");
  const [duration, setDuration] = useState("curta");
  const [dificult, setDificult] = useState("média");

  const [isLoading, setIsLoading] = useState(false);
  const [playerModal, playerModalActions] = useDisclosure(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `Você é um mestre de RPG especializado em criar histórias interativas e imersivas.
                SEMPRE responda em STRICT JSON FORMAT como este exemplo:
                {
                  "text": "Aqui vai o markdown formatado com a história...",
                  "currentHp": 100
                  "options": ["Opção 1", "Opção 2"]
                }
                
                Regras OBRIGATÓRIAS:
                1. O campo "text" deve ser uma string com a formatação em markdown com emoção e detalhes vividos, bem como o título em cada nova mensagem
                2. O campo "options" deve ter entre 2-5 opções (exceto no final da campanha)
                3. As opções devem ser claras e concisas (máx 10 palavras)
                4. Para batalhas, inclua rolls de dados no formato: **Dado rolado**: [X]
                5. o campo "currentHp" deverá retornar a vida atual do personagem e ser atualizado conforme recuperar ou receber dano

                Ao final da campanha, apenas uma opção de nova campanha deve aparecer.
                Aqui estão os detalhes importantes sobre o jogador:
                Nome do protagonista: ${playerName} 
                detalhes do protagonista: ${playerDetails}
                cenário inicial: ${scenario}
                objetivo do jogo: ${objective}
                duração da campanha: ${duration}
                dificuldade: ${dificult}`,
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

      //const options = extractOptionsFromResponse(aiResponse);

      //const cleanedText = options ? aiResponse.split("[opcao]")[0] : aiResponse;

      const parsedResponse = JSON.parse(aiResponse);
      console.log(aiResponse, parsedResponse);

      setHp(parsedResponse.currentHp);

      return {
        text: parsedResponse.text,
        currentHp,
        options: parsedResponse.options || [], // Fallback para array vazio
      };
      /* return {
        text: cleanedText,
        options,
      }; */
    } catch (error) {
      console.error("Erro ao chamar DeepSeek API:", error);
      return {
        text: "**Erro:** Não foi possível processar sua requisição. Por favor, tente novamente.",
        currentHp,
        options: ["Tentar novamente", "Voltar ao menu", "Continuar sem opções"],
      };
    }
  };

  const handleSendMessage = async (message: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      currentHp,
      text: message,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { text, options, currentHp: hp } = await callDeepSeekAPI(message);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        currentHp: hp,
        options,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "**Erro:** Não foi possível conectar ao servidor do DeepSeek. Por favor, tente novamente mais tarde.",
        currentHp,
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
          <Stack>
            <Text fw={700} fz={48} ta="center">
              Master IA RPG
            </Text>
            <Group justify="center">
              <IconHeart color="red" />
              <Progress color="red" value={currentHp} w={300} />
            </Group>
          </Stack>

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
        </Modal>
      </AppShellMain>
    </AppShell>
  );
}

export default App;
