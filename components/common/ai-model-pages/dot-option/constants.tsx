import { Pin, Trash2 } from "lucide-react";

import type { OptionListItem } from "@/components/common/general/option-list/option-list";

export const dotOptionMenuItems: OptionListItem[] = [
  { value: "pin", label: "Pin", leftIconSrc: <Pin className="size-5" /> },
  { value: "delete", label: "Delete", leftIconSrc: <Trash2 className="size-5" /> },
];
