"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Progress } from "../progress";
import { Step } from "../step";

export type FunnelProgressProps = React.ComponentPropsWithoutRef<"div"> & {
  currentStep?: 1 | 2 | 3 | 4 | 5 | 6;
  defaultStep?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Furthest step the user has reached. Gates which icons are clickable.
   * Pink fill follows `currentStep`, so walking back greys out later steps
   * while they stay one click away. Defaults to the current step.
   */
  maxStepReached?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Ignore step-icon navigation (e.g. while a generation is in flight).
   */
  disableStepNavigation?: boolean;
  onStepChange?: (nextStep: 1 | 2 | 3 | 4 | 5 | 6) => void;
  title?: string;
};

const profile = "/assets/profile-fill.svg";
const sxicon = "/assets/sax-id.svg";
const body = "/assets/body-icon.svg";
const face_female = "/assets/face-female.svg";
const heart = "/assets/heart.svg";
const check = "/assets/icontick-circle.svg";
const icons = [
  { src: profile, alt: "Profile" },
  { src: sxicon, alt: "Gender" },
  { src: body, alt: "Body" },
  { src: face_female, alt: "Face" },
  { src: heart, alt: "Preferences" },
  { src: check, alt: "Complete" },
] as const;

export function FunnelProgress({
  currentStep,
  defaultStep = 1,
  maxStepReached,
  disableStepNavigation = false,
  onStepChange,
  className,
  ...props
}: FunnelProgressProps) {
  const [internalStep, setInternalStep] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(defaultStep);
  const [internalMaxStepReached, setInternalMaxStepReached] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(
    defaultStep,
  );
  const activeStep = currentStep ?? internalStep;
  // A caller that tracks the step but not the furthest one reached gets the
  // old behaviour, where progress is simply "everything up to here".
  const reachedStep = Math.max(maxStepReached ?? internalMaxStepReached, activeStep) as
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6;

  const setStep = (nextStep: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (currentStep === undefined) {
      setInternalStep(nextStep);
      setInternalMaxStepReached((current) => (nextStep > current ? nextStep : current));
    }
    onStepChange?.(nextStep);
  };

  return (
    <div
      className={cn(
        "isolate flex w-full max-w-[430px] items-center gap-2 [box-shadow:0_0_5px_rgba(0,0,0,0.25)]",
        className,
      )}
      {...props}
    >
      {/* Single step row */}
      <div className="flex flex-1 items-center">
        {icons.map((icon, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
          const isReached = stepNumber <= reachedStep;
          const isCurrent = stepNumber === activeStep;
          const isLit = stepNumber <= activeStep;
          // FRONT-870: a step this run has opened is light grey and clickable.
          // One never opened stays Neutral 800, with a Neutral 400 icon.
          const isUnvisited = !isReached;
          const canJump = isReached && !isCurrent && !disableStepNavigation;

          return (
            <React.Fragment key={stepNumber}>
              <Step
                className={cn(
                  isReached && !isLit && "bg-handle-bg bg-none opacity-100",
                  isUnvisited && "bg-surface-strong bg-none opacity-100",
                  canJump && "cursor-pointer",
                )}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={
                  canJump
                    ? `Go to step ${stepNumber}`
                    : isCurrent
                      ? `Step ${stepNumber}, current`
                      : `Step ${stepNumber}`
                }
                onClick={canJump ? () => setStep(stepNumber) : undefined}
              >
                <Image
                  src={icon.src}
                  alt=""
                  aria-hidden
                  height={20}
                  width={20}
                  className={cn(
                    "object-contain",
                    // #FAFAFA × 0.652 ≈ Neutral 400 (#a3a3a3).
                    isUnvisited && "brightness-[0.652]",
                  )}
                />
              </Step>
              {index < icons.length - 1 && (
                <Progress
                  variant={
                    stepNumber < activeStep
                      ? "progress"
                      : stepNumber < reachedStep
                        ? "disable"
                        : "unvisited"
                  }
                  className="min-w-0 flex-1"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
