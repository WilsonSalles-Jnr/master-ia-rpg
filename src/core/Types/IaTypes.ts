export type Message = {
  message: string;
  hp?: number;
  responseType: "text" | "options" | "dice";
  options?: string[];
  dice?: Dice;
  sender: "user" | "ai";
  finished?: boolean;
};

export type ResponseType = {
  message: string;
  hp?: number;
  //player: Player;
  responseType: "text" | "options" | "dice";
  options?: string[];
  dice?: Dice;
  finished?: boolean;
};

export type Player = {
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  strength: number;
  constitution: number;
  dexterity: number;
  intelligence: number;
  charisma: number;
  luck: number;
};

export type CampaignConfiguration = {
  battle: LevelSize;
  dialog: LevelSize;
  dificult: LevelSize;
};

export type LevelSize = 1 | 2 | 3 | 4 | 5;

type Dice = {
  quantity: number;
  dice: 4 | 6 | 8 | 10 | 12 | 20;
};
