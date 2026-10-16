import { resolveAsset } from "@/lib/assets/asset-store";
export const DEFAULT_AVATAR_GROUP_SOURCES = [
  resolveAsset("demo_pics_profile2").image ?? "",
  resolveAsset("demo_pics_model1").image ?? "",
  resolveAsset("demo_pics_model2").image ?? "",
  resolveAsset("demo_pics_model3").image ?? "",
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
