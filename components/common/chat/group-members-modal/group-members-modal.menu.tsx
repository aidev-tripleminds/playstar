import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { CrossIcon } from "@/public/assets/icons";

export const GROUP_MEMBERS_DOT_MENU_ITEMS: OptionListItem[] = [
  {
    value: "remove",
    label: "Remove member",
    leftIconSrc: <CrossIcon className="size-5" />,
  },
];
