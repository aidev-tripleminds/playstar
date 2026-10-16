export type EmptyChatStarter = {
  id: string;
  badgeText: string;
  message: string;
  contentType?: "default" | "video";
};

export const EMPTY_CHAT_STATE_SUBTITLE = "Try one of these conversations starters:";

export const DEFAULT_EMPTY_CHAT_STARTERS: EmptyChatStarter[] = [
  {
    id: "romantic",
    badgeText: "ROMANTIC",
    message: "Hey, what makes you feel special and appreciated? 😘",
  },
  {
    id: "adventurous",
    badgeText: "ADVENTUROUS",
    message: "Get dressed it's chilly, unless you'd like to stay naked so we save time? 🥶",
  },
  {
    id: "energic",
    badgeText: "ENERGIC",
    message: "If we were dating, what would you cook for me as your signature dish? 🍪",
  },
  {
    id: "calm",
    badgeText: "CALM",
    message: "Hey, what makes you feel special and appreciated?",
  },
];

export function emptyChatTitle(characterName: string) {
  const firstName = characterName.trim().split(/\s+/)[0] || characterName;
  return `Start a conversation with ${firstName}`;
}
