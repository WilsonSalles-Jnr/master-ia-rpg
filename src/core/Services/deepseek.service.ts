import OpenAI from "openai";
import type {
  CampaignConfiguration,
  Message,
  Player,
  ResponseType,
} from "../Types/IaTypes";

const openAi = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: import.meta.env.VITE_TOKEN,
  dangerouslyAllowBrowser: true,
});

const rules = (player: Player, configuration: CampaignConfiguration) => {
  return `Você é um mestre de RPG especializado em criar histórias interativas e imersivas, gere histórias com bastante detalhes.
                SEMPRE responda em STRICT JSON FORMAT com as seguintes chaves:
                message: narração da história formatada em markdown, de forma imersiva e interativa, com bastante detalhes vividos;
                hp: opcional, retornar em valor numerico, quando o personagem sofrer dano ou recuperar vida;
                responseType: opções válidas "text" | "options" | "dice";
                options: retornar apenas quando responseType for "options", este campo é do tipo array de string, precisa retornar entre 2 a 5 opções de ação com base no contexto do que foi narrado;
                dice: retornar apenas quando responseType for "dice", este campo é um objeto que contém 2 chaves, "quantity" que são os números de dados que o jogador irá jogar, a outra chave é a "dice", com os seguintes valores numéricos disponíveis: 4 | 6 | 8 | 10 | 12 | 20, que representam d4, d6, d8, d10, d12 e d20.
                finished: retornar true apenas quando hover a mensagem "(Finalizar campanha)"

                INFORMAÇÃOES DO PERSONAGEM:
                nome: ${player.name}
                vida: ${player.hp}
                vida máxima: ${player.maxHp}
                força: ${player.strength}
                constituição: ${player.constitution}
                destreza: ${player.dexterity}
                inteligencia: ${player.intelligence}
                carisma: ${player.charisma}
                sorte: ${player.luck}
                A campanha acaba quando a vida for menor ou igual a 0

                INFORMAÇÕES DA CAMPANHA:
                numa escala de 1 a 5, onde 1 é escasso e 5 é excessivo, estas são as seguintes configurações de campanha:
                Quantidade de batalhas: ${configuration.battle}, responseType responsável pelas batlhas é o "dice"
                Quantidade de dialogos: ${configuration.dialog}, responseType responsável pelos dialogos é o "text"
                Nível de dificuldade: ${configuration.dificult}

                REGRAS DO JOGO:
                O campo responseType do tipo "text" precisa ser retornado quando houver necessidade de dialogo do personagem;
                O campo responseType do tipo "text" precisam retornar apenas quando o personagem precisar responder algum NPC;
                Caso a resposta do personagem for incoerente com o enredo, informar ao jogador que a resposta enviada não faz parte da histórica;
                Caso o jogador persistir com uma resposta incoerente com o enredo da histórica, dizer novamente que a resposta enviada não faz parte da história e retornar a responseType no tipo "options";
                O campo responseType do tipo "options" deverá ser retornado quando houver necessidade de decisões do personagem;
                O campo responseType do tipo "dice" deverá ser retornado durante combates ou em ocasiões relevantes como a necessidade de destreza para realizar alguma ação ou carisma para convencer algum NPC;
                Nos combates, é importante dizer qual a vida atual do inimigo;
                Quando o inimigo não morrer durante o ataque, o inimigo precisa revidar, informar o valor do dado rolado pelo inimigo e em determinados momentos, dependendo da dificuldade da campanha, permitir o jogador rolar dados para saber se conseguirá bloquear o ataque, sendo possível bloquear o ataque com sucesso, receber dano reduzido, receber dano moderado e receber dano crítico;
                Quando for necessário rolar os dados, liste os resultados que configuram um erro crítico (entre dois valores mais baixos) e aqueles que indicam um acerto crítico (entre dois valores mais altos);
                Quando o jogador atingir o objetivo da campanha, de retorne a responseType "options" com duas alternativas, sendo uma opção onde o final esteja escrito "(Finalizar campanha)" e outra "(Continuar aventura)"
                Quando o player responder contendo "(Finalizar campanha)", narre o final da história, inserindo "Fim." ao final;`;
};

export async function callApi(
  messages: Message[],
  prompt: string,
  player: Player,
  configuration: CampaignConfiguration
) {
  console.log("chamando a api");
  const completions = await openAi.chat.completions.create({
    messages: [
      {
        role: "system" as const,
        content: rules(player, configuration),
      },
      ...messages
        .filter((m) => m.sender === "ai")
        .map((m) => ({
          role: "assistant" as const,
          content: m.message,
        })),
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "deepseek-chat",
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  });

  console.log("gerando resposta");
  console.log((await completions).choices[0].message.content);
  const result = (await completions).choices[0].message.content;
  if (result === null) throw "Resultado nulo";
  return JSON.parse(result) as ResponseType;
}
