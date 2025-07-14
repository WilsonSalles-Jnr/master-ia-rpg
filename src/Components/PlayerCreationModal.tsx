import {
  Button,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreatePlayer } from "../core/Hooks/player.hook";
import type { OpenCloseType } from "../core/Types/CommonTypes";

export default function PlayerCreationModal({
  opened,
  onClose,
}: OpenCloseType) {
  const form = useForm({
    initialValues: {
      name: "",
      hp: 10,
      description: "",
      strength: 1,
      constitution: 1,
      dexterity: 1,
      intelligence: 1,
      charisma: 1,
      luck: 1,
    },
  });
  const { mutateAsync } = useCreatePlayer();

  const create = async () => {
    await mutateAsync({ ...form.values, maxHp: form.values.hp });
    onClose();
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Criação de personagem"
      size="lg"
    >
      <form onSubmit={form.onSubmit(() => create())}>
        <Stack>
          <SimpleGrid cols={2}>
            <TextInput
              label="Nome"
              maxLength={30}
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <NumberInput
              label="HP"
              min={1}
              max={100}
              key={form.key("hp")}
              {...form.getInputProps("hp")}
            />
          </SimpleGrid>
          <Textarea
            label="Descrição"
            maxLength={150}
            rows={3}
            key={form.key("description")}
            {...form.getInputProps("description")}
          />
          <SimpleGrid cols={3}>
            <NumberInput
              label="Força"
              min={1}
              key={form.key("strength")}
              {...form.getInputProps("strength")}
            />
            <NumberInput
              label="Constituição"
              min={1}
              key={form.key("constitution")}
              {...form.getInputProps("constitution")}
            />
            <NumberInput
              label="Destreza"
              min={1}
              key={form.key("dexterity")}
              {...form.getInputProps("dexterity")}
            />
            <NumberInput
              label="Inteligência"
              min={1}
              key={form.key("intelligence")}
              {...form.getInputProps("intelligence")}
            />
            <NumberInput
              label="Carisma"
              min={1}
              key={form.key("charisma")}
              {...form.getInputProps("charisma")}
            />
            <NumberInput
              label="Sorte"
              min={1}
              key={form.key("luck")}
              {...form.getInputProps("luck")}
            />
          </SimpleGrid>
          <Button type="submit">Criar</Button>
        </Stack>
      </form>
    </Modal>
  );
}
