"use client";

import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { cn } from "@/lib/utils";

import {
  AI_MODEL_GENERATE_LABEL,
  type AiModelSize,
  resolveTemplateStatusBadgeSize,
} from "../ai-model.constants";
import {
  aiModelContentVariants,
  aiModelHoverFadeInVariants,
  aiModelHoverFadeOutVariants,
  aiModelNameVariants,
  aiModelTemplatesContentVariants,
  aiModelTemplatesHoverVariants,
  aiModelTemplatesStackVariants,
} from "../ai-model.shared";
import { AiModelActionButton } from "./ai-model-action-button";

export type AiModelTemplatesContentProps = {
  size?: AiModelSize;
  name: string;
  badgeLabel: string;
  actionLabel?: string;
  showActionButton?: boolean;
  onActionClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function AiModelTemplatesContent({
  size = "default",
  name,
  badgeLabel,
  actionLabel = AI_MODEL_GENERATE_LABEL,
  showActionButton = true,
  onActionClick,
}: AiModelTemplatesContentProps) {
  const enableHoverActions = showActionButton && size === "default";
  const statusBadgeSize = resolveTemplateStatusBadgeSize(size);

  return (
    <span
      className={cn(
        aiModelContentVariants({ size, align: "center" }),
        aiModelTemplatesContentVariants({ size }),
      )}
    >
      <span
        data-slot="ai-model-templates-default"
        className={cn(
          aiModelTemplatesStackVariants({ size }),
          enableHoverActions && aiModelHoverFadeOutVariants({ enabled: true }),
        )}
      >
        <Badge
          type="rose"
          size={statusBadgeSize}
          text={badgeLabel}
          showIcon={false}
          data-slot="ai-model-badge"
        />
        <span data-slot="ai-model-name" className={aiModelNameVariants({ size, align: "center" })}>
          {name}
        </span>
      </span>

      {enableHoverActions ? (
        <span
          data-slot="ai-model-templates-hover"
          className={cn(
            aiModelTemplatesHoverVariants({ size }),
            aiModelHoverFadeInVariants({ enabled: true }),
          )}
        >
          <span className={aiModelNameVariants({ size, align: "center" })} aria-hidden>
            {name}
          </span>
          <AiModelActionButton label={actionLabel} onClick={onActionClick} showOnHover={false} />
        </span>
      ) : null}
    </span>
  );
}
