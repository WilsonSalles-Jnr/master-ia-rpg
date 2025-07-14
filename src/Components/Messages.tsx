import {
  Group,
  Avatar,
  Paper,
  Button,
  Text,
  Input,
  ActionIcon,
} from "@mantine/core";
import { IconSend, IconUser } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../core/Types/IaTypes";
import mageIa from "../../public/ia.png";
import { useState } from "react";

type MessagesProps = {
  message: Message;
  index: number;
  sendMessage: (message: Message) => void;
  messagesCount: number;
  isLoading: boolean;
};

export default function Messages({
  message,
  index,
  sendMessage,
  messagesCount,
  isLoading,
}: MessagesProps) {
  const [text, setText] = useState("");

  const rollDice = (quantity: number, dice: number) => {
    let total = 0;
    for (let i = 0; i < quantity; i++) {
      total += Math.floor(Math.random() * dice) + 1;
    }
    return `Dado ${quantity}d${dice} rolado, totalizando ${total}`;
  };

  return (
    <Group
      key={index}
      align="flex-start"
      justify={message.sender === "user" ? "flex-end" : "flex-start"}
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
          <ReactMarkdown>{message.message}</ReactMarkdown>
        ) : (
          <Text>{message.message}</Text>
        )}
        {message.responseType === "options" && !!message.options && (
          <Group>
            {message.options.map((opt) => (
              <Button
                style={{
                  minHeight: 25,
                  height: "auto",
                  textAlign: "center",
                  wordBreak: "break-word",
                }}
                disabled={messagesCount - 1 > index || isLoading}
                onClick={() =>
                  sendMessage({
                    message: opt,
                    responseType: "text",
                    sender: "user",
                  })
                }
              >
                <Text style={{ whiteSpace: "break-spaces" }}>{opt}</Text>
              </Button>
            ))}
          </Group>
        )}
        {message.responseType === "dice" && !!message.dice && (
          <Button
            disabled={messagesCount - 1 > index || isLoading}
            onClick={() => {
              sendMessage({
                message: rollDice(
                  message.dice?.quantity || 1,
                  message.dice?.dice || 6
                ),
                responseType: "text",
                sender: "user",
              });
            }}
          >
            Rolar dados
          </Button>
        )}
        {message.responseType === "text" &&
          message.sender != "user" &&
          !message?.finished && (
            <Group
              display={messagesCount - 1 > index ? "none" : undefined}
              wrap="nowrap"
            >
              <Input
                placeholder="Responder..."
                onChange={(e) => setText(e.currentTarget.value)}
                w="100%"
              />
              <ActionIcon>
                <IconSend
                  onClick={() => {
                    sendMessage({
                      message: text,
                      responseType: "text",
                      sender: "user",
                    });
                    setText("");
                  }}
                />
              </ActionIcon>
            </Group>
          )}
      </Paper>
      {message.sender === "user" && (
        <Avatar color="teal" radius="xl">
          <IconUser />
        </Avatar>
      )}
    </Group>
  );
}
