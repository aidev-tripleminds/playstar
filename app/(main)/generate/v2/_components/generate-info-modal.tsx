"use client";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { InfoButton } from "@/components/common/generate/info-button";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ExternalIcon } from "@/public/assets/icons";

import {
  GENERATE_INFO_MODAL_GOT_IT_LABEL,
  GENERATE_INFO_MODAL_PARAGRAPHS,
  GENERATE_INFO_MODAL_TITLE,
  GENERATE_INFO_MODAL_WIKI_HREF,
  GENERATE_INFO_MODAL_WIKI_LABEL,
} from "../_lib/constants";

type GenerateInfoModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  wikiHref?: string;
};

export function GenerateInfoModal({
  open = false,
  onOpenChange,
  wikiHref = GENERATE_INFO_MODAL_WIKI_HREF,
}: GenerateInfoModalProps) {
  const handleClose = () => {
    onOpenChange?.(false);
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={GENERATE_INFO_MODAL_TITLE}
      titleIcon={
        <InfoButton
          size="mobile"
          status="highlight"
          tabIndex={-1}
          className="pointer-events-none"
        />
      }
      showIcon
      showMobileHandle
      overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-1000")}
      closeLabel="Close tutorial"
      className="z-1000 md:w-full md:max-w-[600px]!"
    >
      <div data-slot="generate-info-modal" className="flex flex-col gap-4">
        <DialogDescription className="sr-only">
          {GENERATE_INFO_MODAL_TITLE} details and wiki link.
        </DialogDescription>

        {GENERATE_INFO_MODAL_PARAGRAPHS.map((paragraph, index) => (
          <div
            key={`info-paragraph-${index}`}
            className="border-surface-strong bg-tooltip-default-bg flex w-full rounded-2xl border p-3"
          >
            <p className="text-modal-text min-w-0 flex-1 text-sm leading-5 font-normal">
              {paragraph}
            </p>
          </div>
        ))}

        <div className="flex w-full flex-col items-stretch gap-2">
          <Buttons
            type="button"
            variant="rose"
            size="btn-m"
            label={GENERATE_INFO_MODAL_GOT_IT_LABEL}
            leftIcon={false}
            rightIcon={false}
            onClick={handleClose}
            className="w-full"
          />
          <Buttons
            type="button"
            variant="neutral"
            size="btn-m"
            label={GENERATE_INFO_MODAL_WIKI_LABEL}
            leftIcon={false}
            rightIcon={false}
            leftIconNode={<ExternalIcon className="size-5" aria-hidden />}
            onClick={() => {
              if (wikiHref && wikiHref !== "#") {
                window.open(wikiHref, "_blank", "noopener,noreferrer");
              }
              handleClose();
            }}
            className="w-full"
          />
        </div>
      </div>
    </ModalLayout>
  );
}
