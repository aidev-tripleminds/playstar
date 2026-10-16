export const PERSONA_NONE_ID = "none" as const;

export const PERSONA_MODAL_TITLE = "Your persona";

export const PERSONA_MODAL_DESCRIPTION =
  "Choose how AI characters see you in conversation. Personas are shared across all chats.";

export const PERSONA_NONE_LABEL = "None";

export const PERSONA_SELECT_AI_MODEL_LABEL = "Select AI Character";

export const PERSONA_CREATE_CUSTOM_LABEL = "Create custom";

export const PERSONA_MODAL_SAVE_LABEL = "Save";

export const PERSONA_FORM_CREATE_TITLE = "Create persona";

export const PERSONA_FORM_EDIT_TITLE = "Edit persona";

export const PERSONA_FORM_SAVE_LABEL = "Create";

export const PERSONA_FORM_EDIT_SAVE_LABEL = "Save";

export const PERSONA_FORM_NAME_LABEL = "Name";

export const PERSONA_FORM_NAME_PLACEHOLDER = "Enter a persona name";

export const PERSONA_FORM_GENDER_LABEL = "Gender";

export const PERSONA_FORM_GENDER_PLACEHOLDER = "Select gender";

export const PERSONA_FORM_BIO_LABEL = "Description";

export const PERSONA_FORM_BIO_PLACEHOLDER = "Describe this persona";

export const PERSONA_FORM_ICON_LABEL = "Profile Icon";

export const PERSONA_FORM_BACKGROUND_LABEL = "Profile Background";

export const PERSONA_DELETE_CONFIRM_TITLE = "Are you sure?";

export const PERSONA_DELETE_CONFIRM_DESCRIPTION =
  "You’re about to delete a persona. If you proceed, you won’t be able to restore it.";

export const PERSONA_DELETE_CANCEL_LABEL = "Cancel";

export const PERSONA_DELETE_CONFIRM_LABEL = "Delete";

export const PERSONA_STORAGE_KEY = "spicestars:persona-library";

export const PERSONA_CHOOSE_TEMPLATE_TITLE = "Select AI Model";

export type PersonaGender = "woman" | "man" | "other";

export type PersonaSource = "custom" | "ai-model";

export type PersonaIconId = "evil" | "kiss" | "atma" | "smile" | "cat" | "dog" | "monk";

export type PersonaBackgroundId = "beige" | "slate" | "black" | "rose" | "ocean";

export type PersonaItem = {
  id: string;
  name: string;
  bio: string;
  gender: PersonaGender;
  source: PersonaSource;
  /** Present when `source` is `"ai-model"`. */
  sourceCharacterId?: string;
  /** AI character image when `source` is `"ai-model"`. */
  imageSrc?: string;
  /** Custom persona icon when `source` is `"custom"`. */
  iconId?: PersonaIconId;
  /** Custom persona background when `source` is `"custom"`. */
  backgroundId?: PersonaBackgroundId;
};

export type PersonaLibraryState = {
  personas: PersonaItem[];
  activePersonaId: string;
};

export type PersonaFormValues = {
  name: string;
  gender: PersonaGender;
  bio: string;
  iconId: PersonaIconId;
  backgroundId: PersonaBackgroundId;
  source: PersonaSource;
  sourceCharacterId?: string;
  imageSrc?: string;
};

export const PERSONA_GENDER_OPTIONS: { value: PersonaGender; label: string }[] = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "other", label: "Other" },
];

export const PERSONA_ICON_OPTIONS: {
  id: PersonaIconId;
  label: string;
  src: string;
}[] = [
  { id: "evil", label: "Evil", src: "/assets/profile-icons/evil.svg" },
  { id: "kiss", label: "Kiss", src: "/assets/profile-icons/kiss.svg" },
  { id: "atma", label: "Atma", src: "/assets/profile-icons/atma.svg" },
  { id: "smile", label: "Smile", src: "/assets/profile-icons/smile.svg" },
  { id: "cat", label: "Cat", src: "/assets/profile-icons/cat.svg" },
  { id: "dog", label: "Dog", src: "/assets/profile-icons/dog.svg" },
  { id: "monk", label: "Monk", src: "/assets/profile-icons/monk.svg" },
];

export const PERSONA_BACKGROUND_OPTIONS: {
  id: PersonaBackgroundId;
  label: string;
  color: string;
  tone?: "light" | "dark";
}[] = [
  { id: "beige", label: "Beige", color: "#C0AB72", tone: "light" },
  { id: "slate", label: "Slate", color: "#6B6B6B", tone: "dark" },
  { id: "rose", label: "Rose", color: "#e60076", tone: "dark" },
  { id: "black", label: "Black", color: "#383838", tone: "dark" },
  { id: "ocean", label: "Ocean", color: "#335bb8", tone: "dark" },
];

export const PERSONA_ICON_ID_SET = new Set<string>(PERSONA_ICON_OPTIONS.map((option) => option.id));

export const PERSONA_BACKGROUND_ID_SET = new Set<string>(
  PERSONA_BACKGROUND_OPTIONS.map((option) => option.id),
);

export const PERSONA_DEFAULT_ICON_ID: PersonaIconId = "smile";

export const PERSONA_DEFAULT_BACKGROUND_ID: PersonaBackgroundId = "slate";

export const PERSONA_DEFAULT_GENDER: PersonaGender = "other";

export const DEFAULT_PERSONA_LIBRARY_STATE: PersonaLibraryState = {
  personas: [],
  activePersonaId: PERSONA_NONE_ID,
};

export function isPersonaImageSrc(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    (value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://"))
  );
}

export function getPersonaIconSrc(iconId: PersonaIconId | undefined): string {
  return (
    PERSONA_ICON_OPTIONS.find((option) => option.id === iconId)?.src ??
    "/assets/profile-icons/evil.svg"
  );
}

export function getPersonaBackgroundColor(backgroundId: PersonaBackgroundId | undefined): string {
  return (
    PERSONA_BACKGROUND_OPTIONS.find((option) => option.id === backgroundId)?.color ?? "#334155"
  );
}

export function createPersonaId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `persona-${crypto.randomUUID()}`;
  }
  return `persona-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
