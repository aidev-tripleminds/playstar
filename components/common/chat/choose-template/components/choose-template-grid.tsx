import type { AiModelSize } from "@/components/common/Prismic/ai-model";

import type { ChooseTemplateItem } from "../choose-template.constants";
import { ChooseTemplateCard } from "./choose-template-card";
import type { ChooseTemplateProps } from "./types";

type ChooseTemplateGridProps = {
  templates: ChooseTemplateItem[];
  selectedTemplateId?: string;
  cardSize?: AiModelSize;
  showVideo?: boolean;
  getTemplateProps?: ChooseTemplateProps["getTemplateProps"];
  onTemplateSelect?: ChooseTemplateProps["onTemplateSelect"];
};

export function ChooseTemplateGrid({
  templates,
  showVideo,
  selectedTemplateId,
  cardSize = "default",
  getTemplateProps,
  onTemplateSelect,
}: ChooseTemplateGridProps) {
  return (
    <div
      data-slot="choose-template-grid"
      className="grid grid-cols-1 gap-2 min-[295px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
    >
      {templates.map((template, index) => (
        <ChooseTemplateCard
          showVideo={showVideo}
          key={template.id}
          template={template}
          index={index}
          isSelected={selectedTemplateId === template.id}
          cardSize={cardSize}
          getTemplateProps={getTemplateProps}
          onTemplateSelect={onTemplateSelect}
        />
      ))}
    </div>
  );
}
