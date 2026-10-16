import { resolveAsset } from "@/lib/assets/asset-store";

import type { EmblaCarouselSlide } from "./types";

export const defaultEmblaCarouselSlides = [0, 1, 2, 3, 4];

export const defaultEmblaCarouselItems: EmblaCarouselSlide[] = [
  { id: "1", label: "1", src: resolveAsset("demo_pics_model1").image ?? "", alt: "Preview 1" },
  { id: "2", label: "2", src: resolveAsset("demo_pics_model2").image ?? "", alt: "Preview 2" },
  { id: "3", label: "3", src: resolveAsset("demo_pics_model3").image ?? "", alt: "Preview 3" },
  { id: "4", label: "4", src: resolveAsset("demo_pics_model4").image ?? "", alt: "Preview 4" },
  { id: "5", label: "5", src: resolveAsset("demo_pics_model7").image ?? "", alt: "Preview 5" },
];
