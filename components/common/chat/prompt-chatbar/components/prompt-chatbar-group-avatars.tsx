import Image from "next/image";

export function PromptChatbarGroupAvatars({ avatars }: { avatars: readonly string[] }) {
  return (
    <div
      data-slot="prompt-chatbar-group-avatars"
      className="flex flex-row flex-wrap items-center gap-1"
    >
      {avatars.map((src, index) => (
        <span
          key={`${src}-${index}`}
          className="border-tooltip-default-bg relative size-10 shrink-0 overflow-hidden rounded-full border-2"
        >
          <Image src={src} alt="" aria-hidden fill className="object-cover" sizes="40px" />
        </span>
      ))}
    </div>
  );
}
