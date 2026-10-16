"use client";

import * as React from "react";

import {
  AI_MODEL_ANIMATE_ICON_SRC,
  AI_MODEL_ANIMATE_LABEL,
  AI_MODEL_GENERATE_LABEL,
  type AiModelSize,
  type AiModelVariant,
} from "../ai-model.constants";
import {
  aiModelActionHoverLiftVariants,
  aiModelContentVariants,
  aiModelHoverActionStackVariants,
  aiModelNameVariants,
} from "../ai-model.shared";
import { AiModelActionButton } from "./ai-model-action-button";

export type AiModelMediaContentProps = {
  variant: Extract<AiModelVariant, "images" | "videos">;
  size?: AiModelSize;
  name: string;
  actionLabel?: string;
  showActionButton?: boolean;
  mediaHoverAtAllSizes?: boolean;
  onActionClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function AiModelMediaContent({
  variant,
  size = "default",
  name,
  actionLabel,
  showActionButton = true,
  mediaHoverAtAllSizes = false,
  onActionClick,
}: AiModelMediaContentProps) {
  const resolvedLabel =
    actionLabel ?? (variant === "images" ? AI_MODEL_ANIMATE_LABEL : AI_MODEL_GENERATE_LABEL);
  const actionIconSrc = variant === "images" ? AI_MODEL_ANIMATE_ICON_SRC : undefined;
  const enableHoverActions = showActionButton && (size === "default" || mediaHoverAtAllSizes);

  return (
    <span className={aiModelContentVariants({ size, align: "center" })}>
      {enableHoverActions ? (
        <span data-slot="ai-model-hover-actions" className={aiModelHoverActionStackVariants()}>
          <span
            data-slot="ai-model-name"
            className={aiModelNameVariants({ size, align: "center", hideOnHover: true })}
          >
            {name}
          </span>

          <AiModelActionButton
            label={resolvedLabel}
            leftIconSrc={actionIconSrc}
            onClick={onActionClick}
            showOnHover={false}
            className={aiModelActionHoverLiftVariants({ enabled: true })}
          />
        </span>
      ) : (
        <span data-slot="ai-model-name" className={aiModelNameVariants({ size, align: "center" })}>
          {name}
        </span>
      )}
    </span>
  );
}
