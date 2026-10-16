import { AiModel, type AiModelSize } from "@/components/common/Prismic/ai-model";

import type { ChooseTemplateItem } from "../choose-template.constants";
import type { ChooseTemplateProps } from "./types";

type ChooseTemplateCardProps = {
  template: ChooseTemplateItem;
  index: number;
  isSelected: boolean;
  showVideo?: boolean;
  cardSize: AiModelSize;
  getTemplateProps?: ChooseTemplateProps["getTemplateProps"];
  onTemplateSelect?: ChooseTemplateProps["onTemplateSelect"];
};

export function ChooseTemplateCard({
  template,
  index,
  isSelected,
  cardSize,
  getTemplateProps,
  onTemplateSelect,
  showVideo,
}: ChooseTemplateCardProps) {
  const extraProps = getTemplateProps?.(template, index) ?? {};
  const { showActionButton, onClick, className: extraClassName, ...restExtraProps } = extraProps;
  const variant = template.variant ?? restExtraProps.variant ?? "characters";

  return (
    <AiModel
      showVideo={showVideo}
      showStats={false}
      variant={variant}
      size={cardSize}
      name={template.name}
      description={template.description}
      assetKey={template.assetKey}
      imageSrc={template.imageSrc}
      videoSrc={template.videoSrc}
      imageAlt={template.imageAlt}
      blurred={template.blurred}
      stats={template.stats}
      badgeLabel={template.badgeLabel}
      insetImageSrc={template.insetImageSrc}
      showActionButton={showActionButton ?? false}
      aria-pressed={isSelected}
      className={extraClassName}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onTemplateSelect?.(template.id, template);
      }}
      {...restExtraProps}
    />
  );
}
