# Asset resolution

Backend-managed images/videos (uploaded via the admin panel) are referenced in the frontend by a logical **key** (e.g. `demo_explore_explore_img_character2`), never by a hardcoded URL. There are two ways to resolve a key to a URL — pick based on whether you're in a React client component or not.

## `useAsset` / `useAssetImage` — the default choice

Use these inside any `"use client"` component. They read from `AssetMapContext`, which `AssetMapProvider` (mounted near the app root) keeps in sync with the live `/api/v1/assets/map` response. **A key added or changed in the admin panel just works — no rebuild, no local file to update.**

```tsx
"use client";

import { useAssetImage } from "@/lib/assets/asset-map-context";

export function DummyImageTest() {
  const src = useAssetImage("your_new_test_key");

  return <img src={src} alt="test" />;
}
```

```tsx
"use client";

import Image from "next/image";
import { useAssetImage } from "@/lib/assets/asset-map-context";

export function DummyImageTestNext() {
  const src = useAssetImage("your_new_test_key");

  return <Image src={src} alt="test" width={200} height={200} />;
}
```

- `useAssetImage(key, fallback = "")` — one string, optional fallback for retrofits (see below). For a video, read `useAsset(key)` through `assetCardSources` (`lib/media-card-sources.ts`): it plays the card rendition and never hands a gated (`blurred`) viewer the original.
- `useAsset(key)` — the full `{ image?, video?, description? }` object, when you need more than the image (e.g. alt text driven by the admin-entered description):

```tsx
const { image, description } = useAsset("your_new_test_key");
<Image src={image ?? ""} alt={description ?? ""} fill className="object-cover" />;
```

Before the live map has hydrated (or if the key doesn't exist), these resolve to `""` — you'll see a broken image until the key is saved in admin and the map loads. That's expected.

### Retrofitting a component that has an existing baked default

Components with a legacy default prop (Storybook fixtures, SSR floor, etc.) can keep it as the fallback arg, so the live value wins once available but nothing breaks before that:

```tsx
const resolvedImageSrc = useAssetImage(assetKey ?? "", imageSrc /* baked default prop */);
```

See `CharacterHighlight`, `AiModel`, `HomeCard` for the full pattern (an optional `assetKey` prop layered on top of an existing `imageSrc` prop).

## Dummy images

Module-level placeholders use `dummyImage()` from `lib/dummy-images.ts`, which cycles the pictures in `public/assets/playright`. Live keys still go through `useAsset` / `useAssetImage` inside client components.

## Does this cover all usages?

Not fully — by design, `useAsset`/`useAssetImage` only work in client components:

- **Server components** can't call hooks at all. A server component needs to become a client component, or receive an already-resolved string from a client parent.
- **Module-level constants** (`*.constants.ts` evaluated at import time) use `dummyImage()` for placeholder art.

If you're adding a **new** component from scratch, use `useAsset`/`useAssetImage` for live assets.

## The bundled snapshot (`fallback-map.json`)

`fallback-map.json` is what every viewer sees before the live map arrives. It is a snapshot of the live `main` map, taken as an anonymous viewer by `scripts/snapshot-asset-map.mjs`, which runs as `prebuild`:

- **On Vercel** each build takes it from the backend in `NEXT_PUBLIC_API_BASE_URL`, with the Brand from `APP_PUBLIC_HOST`. Each environment therefore bundles its own bucket URLs and card renditions (`video_web`, `poster`, `image_web`), whose `derived/<etag>/` paths differ per backend. A Production build fails if the snapshot can't be taken or a video lacks its card renditions; other builds warn and keep the committed file.
- **Locally** a build keeps the committed file. Refresh it from the test backend with `NEXT_PUBLIC_API_BASE_URL=https://test.api.omnipink.ai APP_PUBLIC_HOST=test.spicestars.ai npm run assets:snapshot` and commit the result.
- Gated keys stay blurred (`blurred: true`) in the snapshot: an anonymous viewer must never get the original, and a verified viewer gets the original once the live map arrives.
