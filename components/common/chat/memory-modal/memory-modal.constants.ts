export const MEMORY_MODAL_TITLE = "Memory";

export const MEMORY_MODAL_APPLY_LABEL = "Save";

export const MEMORY_MODAL_CREATE_LABEL = "Create new memory";

export const MEMORY_CORE_MEMORIES_LABEL = "Core memories";

export const MEMORY_CORE_MEMORIES_DESCRIPTION =
  "A core memory is info or a rule that becomes part of the character’s permanent personality.";

export const MEMORY_CUSTOM_INSTRUCTIONS_LABEL = "Custom instructions";

export const MEMORY_CUSTOM_INSTRUCTIONS_DESCRIPTION =
  "A core memory is info or a rule that becomes part of the character’s permanent personality.";

export const MEMORY_CUSTOM_INSTRUCTIONS_PLACEHOLDER =
  "Add instructions here. e.g. always call me by my last name “Smith”.";

export const MEMORY_LONG_TERM_LABEL = "Long term memory";

export const MEMORY_LONG_TERM_DESCRIPTION = "Use memories from all past conversations.";

export const MEMORY_DEFAULT_LONG_TERM_ENABLED = true;

export const MEMORY_DEFAULT_PREVIEW =
  "Hey, this is what we talked last time we talked togetther......";

export type MemoryItem = {
  id: string;
  name: string;
  preview: string;
};

export const MEMORY_SAMPLE_ITEMS: MemoryItem[] = [
  {
    id: "memory-1",
    name: "Joan Doe",
    preview: MEMORY_DEFAULT_PREVIEW,
  },
  {
    id: "memory-2",
    name: "Joan Doe",
    preview: MEMORY_DEFAULT_PREVIEW,
  },
  {
    id: "memory-3",
    name: "Joan Doe",
    preview: MEMORY_DEFAULT_PREVIEW,
  },
  {
    id: "memory-4",
    name: "Joan Doe",
    preview: MEMORY_DEFAULT_PREVIEW,
  },
  {
    id: "memory-5",
    name: "Joan Doe",
    preview: MEMORY_DEFAULT_PREVIEW,
  },
  {
    id: "memory-6",
    name: "Joan Doe",
    preview: MEMORY_DEFAULT_PREVIEW,
  },
];

export const MEMORY_DEFAULT_ITEMS: MemoryItem[] = MEMORY_SAMPLE_ITEMS.slice(0, 2);

export const MEMORY_DEFAULT_CUSTOM_INSTRUCTIONS = "";
