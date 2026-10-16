export const STATUS_BADGE_LABELS = {
  active: "ACTIVE",
  reviewing: "REVIEWING",
  declined: "DECLINED",
} as const;

export type StatusBadgeStatus = keyof typeof STATUS_BADGE_LABELS;
