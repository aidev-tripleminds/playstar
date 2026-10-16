import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { PinIcon } from "@/public/assets/icons/pin-icon";
import { TrashIcon } from "@/public/assets/icons/trash-icon";

export const dotOptionMenuItems: OptionListItem[] = [
  { value: "pin", label: "Pin", leftIconSrc: <PinIcon /> },
  { value: "delete", label: "Delete", leftIconSrc: <TrashIcon /> },
];
