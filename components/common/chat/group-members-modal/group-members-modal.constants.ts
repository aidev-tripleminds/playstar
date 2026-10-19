import { dummyImage } from "@/lib/dummy-images";

export const GROUP_MEMBERS_MODAL_TITLE = "Group members";

export const GROUP_MEMBERS_MODAL_ADD_LABEL = "Add character";

export const GROUP_MEMBERS_MODAL_SAVE_LABEL = "Save";

export const GROUP_MEMBERS_MODAL_CREATE_GROUP_LABEL = "Create group chat";

export const GROUP_MEMBERS_MODAL_DESCRIPTION = "View and manage characters in this group chat.";

/** Maximum characters allowed in a group chat (matches AvatarGroup four-person layout). */
export const MAX_GROUP_MEMBERS = 4;

export const GROUP_MEMBERS_DEFAULT_PREVIEW =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export type GroupMember = {
  id: string;
  name: string;
  preview: string;
  avatarSrc: string;
};

export const GROUP_MEMBERS_SAMPLE_ITEMS: GroupMember[] = [
  {
    id: "member-1",
    name: "Joan Doe",
    preview: GROUP_MEMBERS_DEFAULT_PREVIEW,
    avatarSrc: dummyImage(52),
  },
  {
    id: "member-2",
    name: "Joan Doe",
    preview: GROUP_MEMBERS_DEFAULT_PREVIEW,
    avatarSrc: dummyImage(53),
  },
];
