import { dummyImage } from "@/lib/dummy-images";

import type { EmblaCarouselSlide } from "./types";

export const defaultEmblaCarouselSlides = [0, 1, 2, 3, 4];

export const defaultEmblaCarouselItems: EmblaCarouselSlide[] = [
  { id: "1", label: "1", src: dummyImage(127), alt: "Preview 1" },
  { id: "2", label: "2", src: dummyImage(128), alt: "Preview 2" },
  { id: "3", label: "3", src: dummyImage(129), alt: "Preview 3" },
  { id: "4", label: "4", src: dummyImage(130), alt: "Preview 4" },
  { id: "5", label: "5", src: dummyImage(131), alt: "Preview 5" },
];
