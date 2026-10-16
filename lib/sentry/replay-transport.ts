import type { makeFetchTransport } from "@sentry/nextjs";

import { stripQueryStringsDeep } from "./scrub";

/**
 * Removes query strings and fragments from every URL that Session Replay
 * sends, at the last point the browser SDK lets us see it: the transport.
 *
 * Replay records URLs outside every other hook this app uses. `beforeSend`,
 * `beforeSendSpan` and `dataCollection.urlQueryParams` never see a replay, and
 * Replay's own `beforeAddRecordingEvent` sees only its custom events
 * (breadcrumbs and performance spans), not the rrweb events. So without this:
 *
 * - the rrweb Meta event carries `window.location.href`, which on
 *   `/auth/handoff` still holds the single-use login token;
 * - DOM snapshots carry `href` / `src` / `srcset` attributes and inlined CSS
 *   `url(…)`, which rrweb makes absolute;
 * - resource and navigation spans carry presigned media URLs, whose query
 *   string IS the credential for that object;
 * - the `replay_event` item lists every page URL visited (`urls`).
 *
 * A replay envelope holds a `replay_event` item and a `replay_recording` item.
 * The recording is `{"segment_id":N}\n` followed by the JSON array of rrweb
 * events, as a string or, when the compression worker runs, zlib-deflated
 * bytes. Both are decoded, scrubbed with the same rule as every other channel
 * ({@link stripQueryStringsDeep} → `stripQueryString`), and re-encoded.
 *
 * Fails closed: an envelope that cannot be decoded, scrubbed and re-encoded is
 * dropped, never sent as it was.
 */

type Transport = ReturnType<typeof makeFetchTransport>;
type Envelope = Parameters<Transport["send"]>[0];
type EnvelopeItem = Envelope[1][number];

const NEWLINE = 0x0a;
/** First byte of a zlib stream (deflate, 32K window): what the worker emits. */
const ZLIB_HEADER_BYTE = 0x78;

export function withReplayUrlScrubbing(transport: Transport): Transport {
  return {
    ...transport,
    send: async (envelope) => {
      if (!isReplayEnvelope(envelope)) return transport.send(envelope);
      let scrubbed: Envelope;
      try {
        scrubbed = await scrubReplayEnvelope(envelope);
      } catch {
        // Fail closed: a replay we cannot scrub is not sent at all.
        return {};
      }
      return transport.send(scrubbed);
    },
  };
}

function isReplayEnvelope(envelope: Envelope): boolean {
  return envelope[1].some(
    ([headers]) => headers.type === "replay_recording" || headers.type === "replay_event",
  );
}

export async function scrubReplayEnvelope(envelope: Envelope): Promise<Envelope> {
  const [headers, items] = envelope;
  const scrubbedItems = await Promise.all(items.map(scrubReplayItem));
  return [stripQueryStringsDeep(headers), scrubbedItems] as Envelope;
}

async function scrubReplayItem(item: EnvelopeItem): Promise<EnvelopeItem> {
  const [headers, payload] = item;
  if (headers.type === "replay_event") {
    return [headers, stripQueryStringsDeep(payload)] as EnvelopeItem;
  }
  if (headers.type === "replay_recording") {
    const recording = await scrubRecording(payload as string | Uint8Array);
    const length =
      typeof recording === "string" ? new TextEncoder().encode(recording).length : recording.length;
    return [{ ...headers, length }, recording] as EnvelopeItem;
  }
  return item;
}

/** Scrub a `replay_recording` payload, keeping its form (string or deflated bytes). */
export async function scrubRecording(payload: string | Uint8Array): Promise<string | Uint8Array> {
  if (typeof payload === "string") {
    const split = payload.indexOf("\n");
    if (split === -1) throw new Error("replay recording without a header line");
    return payload.slice(0, split + 1) + scrubEventsJson(payload.slice(split + 1));
  }

  const split = payload.indexOf(NEWLINE);
  if (split === -1 || payload[split + 1] !== ZLIB_HEADER_BYTE) {
    throw new Error("replay recording is not a header line plus a zlib stream");
  }
  const header = payload.subarray(0, split + 1);
  const events = new TextDecoder().decode(await inflate(payload.subarray(split + 1)));
  const body = await deflate(new TextEncoder().encode(scrubEventsJson(events)));

  const out = new Uint8Array(header.length + body.length);
  out.set(header);
  out.set(body, header.length);
  return out;
}

function scrubEventsJson(json: string): string {
  const events: unknown = JSON.parse(json);
  if (!Array.isArray(events)) throw new Error("replay recording is not an event array");
  return JSON.stringify(stripQueryStringsDeep(events));
}

async function inflate(bytes: Uint8Array): Promise<Uint8Array> {
  return pipeThrough(bytes, new DecompressionStream("deflate"));
}

async function deflate(bytes: Uint8Array): Promise<Uint8Array> {
  return pipeThrough(bytes, new CompressionStream("deflate"));
}

async function pipeThrough(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const source = new Response(new Uint8Array(bytes)).body;
  if (!source) throw new Error("no stream body");
  return new Uint8Array(await new Response(source.pipeThrough(stream)).arrayBuffer());
}
