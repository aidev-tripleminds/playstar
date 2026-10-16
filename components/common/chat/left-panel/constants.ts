import { resolveAsset } from "@/lib/assets/asset-store";

import type { LeftPanelConversation } from "./types";

export const DEFAULT_LEFT_PANEL_TITLE = "Your chats";

export const DEFAULT_LEFT_PANEL_SEARCH_PLACEHOLDER = "Search chats...";

export const DEFAULT_LEFT_PANEL_PINNED_CHATS_LABEL = "Pinned chats";

export const DEFAULT_LEFT_PANEL_YOUR_CHATS_LABEL = "Your chats";

export const DEFAULT_LEFT_PANEL_SUGGESTED_CHATS_LABEL = "Suggested chats";

export const DEFAULT_LEFT_PANEL_NEW_CHAT_LABEL = "New chat";

export const DEFAULT_SPICE_BOT: LeftPanelConversation = {
  id: "spice-bot",
  name: "Spice Bot",
  preview: "AI assistance, prompts and more",
  avatarSrc: resolveAsset("demo_pics_check_point").image ?? "",
  status: "default",
};

export const DEFAULT_LEFT_PANEL_CONVERSATIONS: LeftPanelConversation[] = [
  {
    id: "chat-1",
    name: "Emma Wilson",
    preview: "Can you send over the latest design mockups when you get a chance?",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "focus",
  },
  {
    id: "chat-2",
    name: "Michael Chen, Sophia Martinez",
    preview: "The client approved the proposal. We can move forward with development.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    memberAvatars: [
      resolveAsset("demo_pics_model1").image ?? "",
      resolveAsset("demo_pics_model2").image ?? "",
    ],
    status: "unread",
  },
  {
    id: "chat-3",
    name: "Sophia Martinez, James Anderson, Ava Rodriguez",
    preview: "Thanks for the update! I'll review everything this afternoon.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    memberAvatars: [
      resolveAsset("demo_pics_model1").image ?? "",
      resolveAsset("demo_pics_dog").image ?? "",
      resolveAsset("demo_pics_model3").image ?? "",
    ],
    status: "default",
  },
  {
    id: "chat-4",
    name: "James Anderson",
    preview: "Let's schedule a quick call tomorrow to discuss the next steps.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "default",
  },
  {
    id: "chat-5",
    name: "Dwayne Johnson, Noah Patel, Isabella Brown, Liam Thompson",
    preview: "No wonder why you bought this stuff...",
    avatarSrc: resolveAsset("demo_pics_model2").image ?? "",
    memberAvatars: [
      resolveAsset("demo_pics_model2").image ?? "",
      resolveAsset("demo_pics_model1").image ?? "",
      resolveAsset("demo_pics_model3").image ?? "",
      resolveAsset("demo_pics_profile2").image ?? "",
    ],
    status: "default",
  },
];

export const DEFAULT_LEFT_PANEL_SUGGESTED_CONVERSATIONS: LeftPanelConversation[] = [
  {
    id: "suggested-1",
    name: "Olivia Taylor",
    preview: "I came across an article that might help with your research project.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "default",
  },
  {
    id: "suggested-2",
    name: "Liam Thompson",
    preview: "Are you available for a meeting sometime this week?",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "default",
  },
  {
    id: "suggested-3",
    name: "Ava Rodriguez",
    preview: "The new feature looks great! Looking forward to the release.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "default",
  },
  {
    id: "suggested-4",
    name: "Noah Patel",
    preview: "I've shared the updated documents in the team workspace.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "default",
  },
  {
    id: "suggested-5",
    name: "Isabella Brown",
    preview: "No wonder why you if you need any help with the onboarding process.",
    avatarSrc: resolveAsset("demo_pics_model1").image ?? "",
    status: "default",
  },
];

export const DEFAULT_LEFT_PANEL_SEARCH_VALUE = "hey, what we talked the f";
