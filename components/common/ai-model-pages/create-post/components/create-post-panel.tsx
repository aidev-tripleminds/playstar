"use client";

import Image from "next/image";
import * as React from "react";

import { PostContent } from "@/components/common/ai-model-pages/post-content/post-content";
import { Buttons } from "@/components/common/general/button/buttons";
import { Close } from "@/components/common/general/close/close";
import { Textarea } from "@/components/ui/textarea";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

export type CreatePostPanelProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  title?: string;
  titleIconSrc?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  mediaSrc?: string[];
  publishLabel?: string;
  galleryLabel?: string;
  videoLabel?: string;
  closeLabel?: string;
  onClose?: () => void;
  onPublish?: () => void;
  onAddGallery?: () => void;
  onAddVideo?: () => void;
  onRemoveMedia?: (index: number) => void;
  showHeader?: boolean;
};

export function CreatePostPanel({
  title = "Create a post",
  titleIconSrc = "/assets/add-square.svg",
  avatarSrc = resolveAsset("demo_pics_profile_pic").image ?? "",
  avatarAlt = "Your profile",
  placeholder = "Describe your post...",
  value,
  defaultValue = "",
  onChange,
  mediaSrc = [],
  publishLabel = "Publish",
  galleryLabel = "Add image",
  videoLabel = "Add video",
  closeLabel = "Close",
  onClose,
  onPublish,
  onAddGallery,
  onAddVideo,
  onRemoveMedia,
  showHeader = true,
  className,
  ...props
}: CreatePostPanelProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const textValue = value ?? internalValue;
  const canPublish = textValue.trim().length > 0 || mediaSrc.length > 0;

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div
      data-slot="create-post-panel"
      className={cn("flex flex-col gap-4 font-[Onest]", className)}
      {...props}
    >
      {showHeader ? (
        <header className="flex items-center gap-2">
          <Image
            src={titleIconSrc}
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0 object-contain"
          />
          <h2 className="text-tooltip-text flex-1 text-left text-lg leading-7 font-medium">
            {title}
          </h2>
          <Close
            aria-label={closeLabel}
            onClick={onClose}
            size="medium"
            className="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
          />
        </header>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
            <Image src={avatarSrc} alt={avatarAlt} fill className="object-cover" sizes="48px" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <Textarea
              value={textValue}
              onChange={handleTextChange}
              placeholder={placeholder}
              rows={mediaSrc.length > 0 ? 4 : 1}
              className={cn(
                "min-h-0 resize-none rounded-none border-0 bg-transparent p-0 shadow-none",
                "text-tooltip-text text-base leading-6 md:text-lg md:leading-7",
                "placeholder:text-divider-label",
                "focus-visible:border-0 focus-visible:ring-0",
                "[overflow-wrap:anywhere]",
              )}
            />

            {mediaSrc.length > 0 ? (
              <div
                className={cn("grid gap-3", mediaSrc.length > 1 ? "grid-cols-2" : "grid-cols-1")}
              >
                {mediaSrc.map((item, index) => (
                  <div key={`${item}-${index}`} className={index === 2 ? "col-span-1" : ""}>
                    <PostContent
                      className={cn(
                        "w-full",
                        mediaSrc.length > 1 ? "h-[120px] md:h-[180px]" : "h-[300px] md:w-full",
                      )}
                      imageSrc={item}
                      imageAlt={`Post attachment ${index + 1}`}
                      closeLabel={`Remove attachment ${index + 1}`}
                      onClose={() => onRemoveMedia?.(index)}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-surface-strong h-px w-full" aria-hidden />

        <footer className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={galleryLabel}
              onClick={onAddGallery}
              className="text-divider-label flex size-6 items-center justify-center opacity-70 transition-colors hover:opacity-100"
            >
              <Image
                src="/assets/gallery.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 object-contain"
              />
            </button>
            <button
              type="button"
              aria-label={videoLabel}
              onClick={onAddVideo}
              className="text-divider-label flex size-6 items-center justify-center opacity-70 transition-colors hover:opacity-100"
            >
              <Image
                src="/assets/video-square.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 object-contain"
              />
            </button>
          </div>

          <Buttons
            variant="rose"
            size="btn-s"
            leftIcon={false}
            rightIcon={false}
            label={publishLabel}
            onClick={onPublish}
            disabled={!canPublish}
            className="w-auto"
          />
        </footer>
      </div>
    </div>
  );
}
