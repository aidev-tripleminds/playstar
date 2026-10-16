"use client";

import { cva } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { Buttons } from "../../general/button/buttons";

const shellVariants = cva(
  "bg-tooltip-default-bg flex w-full max-w-[min(100%,302px)] flex-col overflow-hidden rounded-[16px] border border-border-strong",
);

const headerBarVariants = cva("flex w-full items-start gap-3 p-4", {
  variants: {
    collapsedTone: {
      default: "bg-surface-strong",
      flat: "bg-tooltip-default-bg",
    },
  },
  defaultVariants: {
    collapsedTone: "default",
  },
});

export type CompleteProfileTaskTrailing =
  | { kind: "reward"; value: string }
  | { kind: "claimed"; label?: string }
  | { kind: "claim"; bonus: string };

export type CompleteProfileTask = {
  id: string;
  title: string;
  description?: string;
  /** `pending` = empty ring, `done` = filled green check. */
  leading: "pending" | "done";
  /** First row in Figma uses a stronger surface chip. */
  rowSurface?: "muted" | "none";
  trailing?: CompleteProfileTaskTrailing;
  onClaim?: () => void;
};

export type CompleteProfileProps = Omit<React.ComponentProps<"div">, "children"> & {
  variant?: "progress" | "claimed";
  completedCount: number;
  totalSteps: number;
  tokensLeftLabel?: string | null;
  completionMessage?: string;
  headerTitle?: string;
  tasks: CompleteProfileTask[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  /** Fired after a quest reward is claimed via the Claim CTA. */
  onTaskClaimed?: (taskId: string) => void;
};

function TokenCoin({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block size-4 shrink-0", className)}>
      <Image src="/assets/spice-coin.png" alt="" fill className="object-contain" />
    </span>
  );
}

function ProgressRing({ leading }: { leading: CompleteProfileTask["leading"] }) {
  if (leading === "done") {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-full" aria-hidden>
        <Image alt="" src="/assets/tick.svg" width={13} height={13} />
      </span>
    );
  }
  return (
    <span
      className="size-[13px] shrink-0 rounded-full border border-[var(--select-muted-text)]"
      aria-hidden
    />
  );
}

function TaskTrailingView({
  trailing,
  onClaim,
}: {
  trailing: CompleteProfileTaskTrailing;
  onClaim?: () => void;
}) {
  const isClaimed = trailing.kind === "claimed";

  if (trailing.kind === "reward") {
    return (
      <span className="text-cookie-bg flex shrink-0 items-center gap-0.5 text-sm leading-5 font-normal">
        <span className="text-tokens-gradient text-sm">{trailing.value}</span>
        <TokenCoin />
      </span>
    );
  }

  if (trailing.kind === "claimed") {
    return (
      <span
        className={cn(
          "bg-surface-strong text-tooltip-text rounded-full px-2 py-1.5 text-[12px] leading-4 font-medium opacity-60",
          isClaimed && "-my-1",
        )}
      >
        {trailing.label ?? "Claimed"}
      </span>
    );
  }

  return (
    <Buttons
      type="button"
      variant="rose"
      label={`Claim ${trailing.bonus}`}
      rightIcon
      leftIcon={false}
      size="btn-xs"
      className="h-[28px]! w-[83px]"
      rightIconSizeClassName="h-[12px] w-[12px]"
      rightIconSrc="/assets/spice-coin.png"
      onClick={onClaim}
    />
  );
}

function TaskRow({
  task,
  isClaimed,
  trailing,
  onClaim,
}: {
  task: CompleteProfileTask;
  isClaimed: boolean;
  trailing?: CompleteProfileTaskTrailing;
  onClaim?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg px-2",
        trailing?.kind === "claim" ? "py-1" : "py-2",
        task.rowSurface === "muted" ? "" : "",
      )}
    >
      <div className="flex items-center gap-1.5">
        <ProgressRing leading={isClaimed ? "done" : "pending"} />
        <p className="text-cookie-bg min-w-0 flex-1 text-left text-sm leading-5 font-normal">
          {task.title}
        </p>
        {trailing ? <TaskTrailingView trailing={trailing} onClaim={onClaim} /> : null}
      </div>
      {task.description ? (
        <p className="pl-[19px] text-left text-sm leading-5 font-normal text-[var(--select-muted-text)]">
          {task.description}
        </p>
      ) : null}
    </div>
  );
}

function isTaskClaimed(task: CompleteProfileTask, claimedTaskIds: Set<string>) {
  return claimedTaskIds.has(task.id) || task.trailing?.kind === "claimed";
}

function getEffectiveTrailing(
  task: CompleteProfileTask,
  claimedTaskIds: Set<string>,
): CompleteProfileTaskTrailing | undefined {
  if (isTaskClaimed(task, claimedTaskIds)) {
    return { kind: "claimed" };
  }
  return task.trailing;
}

export function CompleteProfile({
  variant = "progress",
  completedCount,
  totalSteps,
  tokensLeftLabel = "+347 Free Tokens left to claim",
  completionMessage = "All Rewards Claimed! 🎉",
  headerTitle,
  tasks,
  expanded: expandedControlled,
  defaultExpanded = false,
  onExpandedChange,
  onTaskClaimed,
  className,
  ...props
}: CompleteProfileProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
  const isExpandedControlled = expandedControlled !== undefined;
  const expanded = isExpandedControlled ? expandedControlled : internalExpanded;

  const [userClaimedTaskIds, setUserClaimedTaskIds] = React.useState<Set<string>>(() => new Set());

  const claimedTaskIds = React.useMemo(() => {
    const ids = new Set(userClaimedTaskIds);

    tasks.forEach((task) => {
      if (task.trailing?.kind === "claimed") {
        ids.add(task.id);
      }
    });

    return ids;
  }, [tasks, userClaimedTaskIds]);

  const handleClaim = React.useCallback(
    (task: CompleteProfileTask) => {
      setUserClaimedTaskIds((prev) => new Set(prev).add(task.id));
      task.onClaim?.();
      onTaskClaimed?.(task.id);
    },
    [onTaskClaimed],
  );

  const setExpanded = React.useCallback(
    (next: boolean) => {
      if (!isExpandedControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [isExpandedControlled, onExpandedChange],
  );

  const pct = totalSteps > 0 ? Math.min(100, Math.round((completedCount / totalSteps) * 100)) : 0;
  const claimedCollapsed = variant === "claimed" && !expanded;
  const title = headerTitle ?? (claimedCollapsed ? "Profile complete!" : "Complete your profile");
  const countLabel = `${completedCount} of ${totalSteps}`;
  const isCompleted = completedCount === totalSteps;
  const headerTone = expanded ? "default" : "flat";

  return (
    <div data-slot="complete-profile" className={cn(shellVariants(), className)} {...props}>
      <button
        type="button"
        className={cn(
          headerBarVariants({ collapsedTone: headerTone === "flat" ? "flat" : "default" }),
          "cursor-pointer text-left",
        )}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2 className="text-tooltip-text text-lg leading-7 font-semibold">{title}</h2>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span
                className={cn(
                  "text-sm leading-5 font-medium",
                  isCompleted ? "text-gradient-success" : "text-tooltip-text",
                )}
              >
                {countLabel}
              </span>
              <span
                className={cn(
                  "text-sm leading-5 font-medium",
                  isCompleted ? "text-gradient-success" : "text-select-muted-text",
                )}
              >
                complete
              </span>
            </div>
            <Progress
              value={pct}
              aria-label="Profile completion"
              className={cn(
                "bg-border-focus h-2",
                "[&_[data-slot=progress-indicator]]:bg-[image:var(--progress-bar-bg)]",
                "[&_[data-slot=progress-indicator]]:rounded-r-full",
              )}
            />
            {claimedCollapsed ? (
              <p className="text-cookie-bg text-sm leading-5 font-normal">{completionMessage}</p>
            ) : tokensLeftLabel ? (
              <div className="text-cookie-bg flex flex-wrap items-center gap-1 text-sm leading-5 font-normal">
                <span>{tokensLeftLabel}</span>
                <Image
                  src="/assets/spice-coin.png"
                  width={16}
                  height={16}
                  alt=""
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
        <span className="relative inline-block h-[1.5em] w-[1.5em]">
          <Image
            src="/assets/chevron.svg"
            alt=""
            fill
            className={cn("object-contain", expanded ? "rotate-180" : "")}
          />
        </span>
      </button>

      {expanded ? (
        <div className="flex flex-col p-2">
          {tasks.map((task) => {
            const isClaimed = isTaskClaimed(task, claimedTaskIds);
            const trailing = getEffectiveTrailing(task, claimedTaskIds);

            return (
              <TaskRow
                key={task.id}
                task={task}
                isClaimed={isClaimed}
                trailing={trailing}
                onClaim={trailing?.kind === "claim" ? () => handleClaim(task) : undefined}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export const defaultCompleteProfileTasks: CompleteProfileTask[] = [
  {
    id: "banner",
    title: "Customize profile banner",
    leading: "pending",
    rowSurface: "muted",
    trailing: { kind: "reward", value: "+5" },
  },
  {
    id: "animate",
    title: "Animate profile picture",
    leading: "pending",
    trailing: { kind: "reward", value: "+50" },
  },
  {
    id: "message",
    title: "Send your first message",
    leading: "pending",
    trailing: { kind: "claimed" },
  },
  {
    id: "picture",
    title: "Create your first picture",
    leading: "pending",
    trailing: { kind: "reward", value: "+10" },
  },
  {
    id: "video",
    title: "Create your first video",
    leading: "done",
    trailing: { kind: "claim", bonus: "30" },
  },
  {
    id: "cam",
    title: "Create her first cam action",
    leading: "pending",
    trailing: { kind: "reward", value: "+50" },
  },
  {
    id: "lora",
    title: "Train your first AI LoRA",
    leading: "pending",
    description: "Maximize AI model consistency across all generated content.",
    trailing: { kind: "reward", value: "+100" },
  },
];
