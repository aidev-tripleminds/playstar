import { MAX_ROTATION, MAX_ZOOM, MIN_ROTATION, MIN_ZOOM } from "./constants";

export function sliderToZoom(value: number) {
  return MIN_ZOOM + (value / 100) * (MAX_ZOOM - MIN_ZOOM);
}

export function sliderToRotation(value: number) {
  return MIN_ROTATION + (value / 100) * (MAX_ROTATION - MIN_ROTATION);
}
