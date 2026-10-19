import { dummyImage } from "@/lib/dummy-images";
export const DEFAULT_AVATAR_GROUP_SOURCES = [
  dummyImage(18),
  dummyImage(19),
  dummyImage(20),
  dummyImage(21),
] as const;

export type AvatarGroupPersons = "two-person" | "three-person" | "four-person";

/** Maps member count to AvatarGroup layout (caps at four-person). */
export function resolveAvatarGroupPersons(count: number): AvatarGroupPersons {
  if (count >= 4) {
    return "four-person";
  }
  if (count === 3) {
    return "three-person";
  }
  return "two-person";
}
