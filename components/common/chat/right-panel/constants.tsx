import { resolveAsset } from "@/lib/assets/asset-store";
import { ClockIcon, MemoryIcon, PersonaIcon } from "@/public/assets/icons";
import { EditIcon } from "@/public/assets/icons/edit-icon";
import { GroupIcon } from "@/public/assets/icons/group";
import { MicrophoneIcon } from "@/public/assets/icons/microphone";

import type { RightPanelForwardItem } from "./types";

export const DEFAULT_RIGHT_PANEL_CHARACTER_NAME = "Lorem Ipsum";

export const DEFAULT_RIGHT_PANEL_CHARACTER_AGE = 22;

export const DEFAULT_RIGHT_PANEL_CHARACTER_BIO =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...";

export const DEFAULT_RIGHT_PANEL_CHARACTER_IMAGE = resolveAsset("demo_pics_model4").image ?? "";

export const DEFAULT_RIGHT_PANEL_CHARACTER_IMAGES = [
  resolveAsset("demo_pics_model4").image ?? "",
  resolveAsset("demo_pics_model1").image ?? "",
  resolveAsset("demo_pics_model2").image ?? "",
  resolveAsset("demo_pics_model3").image ?? "",
  resolveAsset("demo_pics_profile2").image ?? "",
] as const;

export const DEFAULT_RIGHT_PANEL_GROUP_TITLE = "Ana John, Marina Dona, Anita B...";

export const DEFAULT_RIGHT_PANEL_MEMBER_COUNT_LABEL = "3 members";

export const DEFAULT_RIGHT_PANEL_MEMBER_AVATARS = [
  resolveAsset("demo_pics_profile2").image ?? "",
  resolveAsset("demo_pics_model1").image ?? "",
  resolveAsset("demo_pics_model2").image ?? "",
] as const;

export const DEFAULT_RIGHT_PANEL_GALLERY_LABEL = "Gallery";

export const DEFAULT_RIGHT_PANEL_NEW_CHAT_LABEL = "New chat";

export const DEFAULT_RIGHT_PANEL_PROFILE_LABEL = "Profile";

export const RIGHT_PANEL_MEDIA_TAB_LABEL = "Medias";

export const RIGHT_PANEL_HISTORY_TAB_LABEL = "Chat History";

export const RIGHT_PANEL_MEDIA_EMPTY_LABEL = "No media in this chat yet.";

export const RIGHT_PANEL_HISTORY_EMPTY_LABEL = "No previous chats for this character yet.";

export const DEFAULT_RIGHT_PANEL_MEDIA_ITEMS = DEFAULT_RIGHT_PANEL_CHARACTER_IMAGES.map(
  (src, index) => ({
    id: `right-panel-media-${index + 1}`,
    src,
    alt: `Generated media ${index + 1}`,
  }),
);

export const DEFAULT_RIGHT_PANEL_CAROUSEL_TOTAL = 5;

export const DEFAULT_RIGHT_PANEL_FORWARD_ITEMS: RightPanelForwardItem[] = [
  {
    id: "writing-style",
    label: "Writing style",
    leftIconSrc: <EditIcon />,
  },
  {
    id: "group-members",
    label: "Group members",
    leftIconSrc: <GroupIcon />,
  },
  {
    id: "voice-language",
    label: "Voice and language",
    leftIconSrc: <MicrophoneIcon />,
  },
  {
    id: "persona",
    label: "Persona",
    leftIconSrc: <PersonaIcon />,
  },
  {
    id: "memory",
    label: "Memory",
    leftIconSrc: <MemoryIcon />,
  },
  {
    id: "chat-history",
    label: "Chat history",
    leftIconSrc: <ClockIcon />,
  },
];
