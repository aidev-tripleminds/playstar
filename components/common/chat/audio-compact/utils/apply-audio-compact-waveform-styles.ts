import { AUDIO_COMPACT_WAVEFORM_UNPLAYED_OPACITY } from "../audio-compact.constants";

const AUDIO_COMPACT_WAVEFORM_STYLE_ID = "audio-compact-waveform-styles";

export function applyAudioCompactWaveformStyles(container: HTMLElement | null | undefined) {
  const shadowHost = container?.firstElementChild;

  if (!shadowHost?.shadowRoot) {
    return;
  }

  const shadowRoot = shadowHost.shadowRoot;

  if (shadowRoot.getElementById(AUDIO_COMPACT_WAVEFORM_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = AUDIO_COMPACT_WAVEFORM_STYLE_ID;
  style.textContent = `
    .canvases {
      opacity: ${AUDIO_COMPACT_WAVEFORM_UNPLAYED_OPACITY};
    }

    .progress {
      opacity: 1;
    }
  `;

  shadowRoot.appendChild(style);
}
