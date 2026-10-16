import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { EditIconV2 } from "@/public/assets/icons";
import { TrashIcon } from "@/public/assets/icons/trash-icon";

export const MEMORY_DOT_MENU_ITEMS: OptionListItem[] = [
  { value: "edit", label: "Edit", leftIconSrc: <EditIconV2 className="size-5" /> },
  { value: "delete", label: "Delete", leftIconSrc: <TrashIcon className="size-5" /> },
];
