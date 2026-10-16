const AUDIO_EXTENSION_MIME_TYPES = {
  aac: "audio/aac",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  oga: "audio/ogg",
  ogg: "audio/ogg",
  opus: "audio/ogg",
  wav: "audio/wav",
  webm: "audio/webm",
} as const;

type SupportedAudioExtension = keyof typeof AUDIO_EXTENSION_MIME_TYPES;

function getExtensionFromSrc(src: string): string | undefined {
  const trimmedSrc = src.trim();

  if (!trimmedSrc) {
    return undefined;
  }

  try {
    const { pathname } = new URL(trimmedSrc);
    return pathname.split(".").pop()?.toLowerCase();
  } catch {
    return trimmedSrc.split("?")[0]?.split("#")[0]?.split(".").pop()?.toLowerCase();
  }
}

export function resolveAudioMimeType(src?: string): string | undefined {
  if (!src) {
    return undefined;
  }

  const extension = getExtensionFromSrc(src);

  if (!extension || !(extension in AUDIO_EXTENSION_MIME_TYPES)) {
    return undefined;
  }

  return AUDIO_EXTENSION_MIME_TYPES[extension as SupportedAudioExtension];
}
