import type { FlagName } from "@/components/common/general/flag/flag";

export const VOICE_LANGUAGE_MODAL_TITLE = "Voice";

export const VOICE_LANGUAGE_MODAL_TITLE_ICON_SRC = "/assets/microphone.svg";

export const VOICE_LANGUAGE_MODAL_APPLY_LABEL = "Save";

export const VOICE_LANGUAGE_LANGUAGE_LABEL = "Select a language";

export const VOICE_LANGUAGE_DROPDOWN_LABEL = "Language:";

export const VOICE_LANGUAGE_CHARACTER_LABEL = "Select a group member";

export const VOICE_LANGUAGE_CHARACTER_DROPDOWN_LABEL = "Character:";

export const VOICE_LANGUAGE_VOICE_LABEL = "Select a voice";

export const VOICE_LANGUAGE_PRICE_LABEL = "Price per 100 char";

export const VOICE_LANGUAGE_PLAYBACK_LABEL = "Playback";

export const VOICE_LANGUAGE_AUTO_PLAY_LABEL = "Auto-play messages";

export type VoiceLanguageId =
  | "en"
  | "de"
  | "es"
  | "fr"
  | "it"
  | "nl"
  | "pl"
  | "pt"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "ru"
  | "sru"
  | "kru"
  | "tru"
  | "mru"
  | "qru"
  | "wru";

export type VoiceLanguageOption = {
  id: VoiceLanguageId;
  label: string;
  flag: FlagName;
};

export const VOICE_LANGUAGE_OPTIONS: VoiceLanguageOption[] = [
  { id: "en", label: "English", flag: "United-States" },
  { id: "de", label: "Deutsch", flag: "Germany" },
  { id: "es", label: "Espanol", flag: "Spain" },
  { id: "fr", label: "Français", flag: "France" },
  { id: "it", label: "Italiano", flag: "Italy" },
  { id: "nl", label: "Nederlands", flag: "Netherlands" },
  { id: "pl", label: "Polski", flag: "Poland" },
  { id: "pt", label: "Português", flag: "Portugal" },
  { id: "zh", label: "中文", flag: "China" },
  { id: "ja", label: "日本語", flag: "Japan" },
  { id: "ko", label: "한국어", flag: "South-Korea" },
  { id: "ar", label: "عربي", flag: "Arabia" },
  { id: "ru", label: "русский", flag: "Russia" },
  { id: "kru", label: "한국어", flag: "South-Korea" },
  { id: "wru", label: "عربي", flag: "Arabia" },
  { id: "qru", label: "русский", flag: "Russia" },
  { id: "mru", label: "русский", flag: "Russia" },
  { id: "sru", label: "한국어", flag: "South-Korea" },
  { id: "tru", label: "عربي", flag: "Arabia" },
];

export const VOICE_LANGUAGE_DEFAULT_LANGUAGE_ID: VoiceLanguageId = "en";

/** No voice is pre-selected until the catalogue loads and the user picks one. */
export const VOICE_LANGUAGE_DEFAULT_VOICE_ID = "";

export const VOICE_LANGUAGE_DEFAULT_AUTO_PLAY = true;

export type VoiceLanguageCharacterOption = {
  id: string;
  name: string;
  avatarSrc: string;
  /** Saved voice for this member. Absent means the modal keeps its current selection. */
  voiceId?: string | null;
};
