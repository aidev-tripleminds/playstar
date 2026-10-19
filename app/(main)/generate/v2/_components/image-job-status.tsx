"use client";

/** Job polling is off. This demo does not ask the backend for image jobs. */
export function ImageJobStatus(_props: {
  onCompleted: () => Promise<unknown>;
  watching?: boolean;
}) {
  return null;
}
