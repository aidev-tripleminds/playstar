import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";

import {
  DEFAULT_PERSONA_LIBRARY_STATE,
  isPersonaImageSrc,
  PERSONA_BACKGROUND_ID_SET,
  PERSONA_ICON_ID_SET,
  PERSONA_NONE_ID,
  PERSONA_STORAGE_KEY,
  type PersonaBackgroundId,
  type PersonaIconId,
  type PersonaItem,
  type PersonaLibraryState,
} from "./persona-modal.constants";

function isPersonaItem(value: unknown): value is PersonaItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<PersonaItem>;
  if (
    typeof item.id !== "string" ||
    typeof item.name !== "string" ||
    typeof item.bio !== "string" ||
    (item.source !== "custom" && item.source !== "ai-model") ||
    (item.gender !== "woman" && item.gender !== "man" && item.gender !== "other")
  ) {
    return false;
  }

  if (item.iconId !== undefined && !PERSONA_ICON_ID_SET.has(item.iconId)) {
    return false;
  }

  if (item.backgroundId !== undefined && !PERSONA_BACKGROUND_ID_SET.has(item.backgroundId)) {
    return false;
  }

  if (item.imageSrc !== undefined && !isPersonaImageSrc(item.imageSrc)) {
    return false;
  }

  if (
    item.sourceCharacterId !== undefined &&
    (typeof item.sourceCharacterId !== "string" || item.sourceCharacterId.length === 0)
  ) {
    return false;
  }

  return true;
}

function normalizeLibraryState(value: unknown): PersonaLibraryState {
  if (!value || typeof value !== "object") {
    return DEFAULT_PERSONA_LIBRARY_STATE;
  }

  const raw = value as Partial<PersonaLibraryState>;
  const personas = Array.isArray(raw.personas)
    ? raw.personas.filter(isPersonaItem).map((persona) => ({
        ...persona,
        iconId: persona.iconId as PersonaIconId | undefined,
        backgroundId: persona.backgroundId as PersonaBackgroundId | undefined,
      }))
    : [];
  const activePersonaId =
    typeof raw.activePersonaId === "string" &&
    (raw.activePersonaId === PERSONA_NONE_ID ||
      personas.some((persona) => persona.id === raw.activePersonaId))
      ? raw.activePersonaId
      : PERSONA_NONE_ID;

  return { personas, activePersonaId };
}

export function readPersonaLibraryState(): PersonaLibraryState {
  const raw = readBrowserStorage(PERSONA_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_PERSONA_LIBRARY_STATE;
  }

  try {
    return normalizeLibraryState(JSON.parse(raw));
  } catch {
    return DEFAULT_PERSONA_LIBRARY_STATE;
  }
}

/**
 * Cached snapshot for `useSyncExternalStore`. Must return a stable reference when
 * the underlying storage value is unchanged, or React will loop re-renders.
 */
let snapshotCache: { raw: string | null; state: PersonaLibraryState } | null = null;

export function getPersonaLibrarySnapshot(): PersonaLibraryState {
  const raw = readBrowserStorage(PERSONA_STORAGE_KEY);
  if (snapshotCache && snapshotCache.raw === raw) {
    return snapshotCache.state;
  }

  const state = readPersonaLibraryState();
  snapshotCache = { raw, state };
  return state;
}

export function getServerPersonaLibrarySnapshot(): PersonaLibraryState {
  return DEFAULT_PERSONA_LIBRARY_STATE;
}

export function writePersonaLibraryState(state: PersonaLibraryState): void {
  const next = normalizeLibraryState(state);
  const raw = JSON.stringify(next);
  snapshotCache = { raw, state: next };
  writeBrowserStorage(PERSONA_STORAGE_KEY, raw);
}

/** @internal Exported for unit tests. */
export const __testOnly = {
  isPersonaItem,
  normalizeLibraryState,
};
