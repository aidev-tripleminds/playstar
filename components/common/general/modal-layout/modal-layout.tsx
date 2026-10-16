"use client";

import "./modal-layout.css";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Close } from "@/components/common/general/close/close";
import { Handle } from "@/components/common/general/handle/handle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  useResponsiveModalMode,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  MODAL_LAYOUT_DESKTOP_CLASSNAME,
  MODAL_LAYOUT_DESKTOP_MOTION_CLASSNAME,
  MODAL_LAYOUT_DESKTOP_OVERLAY_MOTION_CLASSNAME,
  MODAL_LAYOUT_MOBILE_CLASSNAME,
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
} from "./modal-layout.constants";

export {
  INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
  MODAL_LAYOUT_DESKTOP_CLASSNAME,
  MODAL_LAYOUT_DESKTOP_MOTION_CLASSNAME,
  MODAL_LAYOUT_DESKTOP_OVERLAY_MOTION_CLASSNAME,
  MODAL_LAYOUT_MOBILE_CLASSNAME,
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
} from "./modal-layout.constants";

export type ModalLayoutProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When this changes while the modal is open, the current view closes before the next opens. */
  viewKey?: string | number;
  title?: string;
  description?: string;
  showIcon?: boolean;
  titleIconSrc?: string;
  /** Custom title icon node. Takes precedence over `titleIconSrc` when provided. */
  titleIcon?: React.ReactNode;
  showMobileHandle?: boolean;
  /**
   * Draw the drag handle above the title even when the modal is a centered dialog.
   * Used by mobile layouts forced in Storybook on a desktop viewport.
   */
  showHandle?: boolean;
  generateLabel?: string;
  cancelLabel?: string;
  /**
   * Merged onto {@link MODAL_LAYOUT_OVERLAY_CLASSNAME}.
   * Use to extend (e.g. positioning) or override tint/blur via conflicting utilities.
   */
  overlayClassName?: string;
  /** Snapshot the page once and blur with CSS filter instead of live backdrop-filter. */
  freezeBackdrop?: boolean;
  onGenerate?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  /** When false, the header close (X) button is hidden. Defaults to true. */
  showClose?: boolean;
  closeLabel?: string;
  closeClassName?: string;
  className?: string;
  innerClassName?: string;
  headerClassName?: string;
  children?: React.ReactNode;
  /** When false, the modal only closes via explicit actions (close button, cancel, save). */
  dismissOnOutsideClick?: boolean;
  /** When false, browser Back does not close this modal / no synthetic history entry. Defaults to true. */
  closeOnHistoryBack?: boolean;
  /** Return false to keep the modal open and immediately restore its Back trap. */
  onHistoryBack?: () => boolean | void;
};

type ModalContentSnapshot = {
  title: string;
  description: string;
  showIcon: boolean;
  titleIconSrc: string;
  titleIcon?: React.ReactNode;
  showMobileHandle: boolean;
  showHandle: boolean;
  showClose: boolean;
  generateLabel: string;
  cancelLabel: string;
  onGenerate?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  closeLabel: string;
  closeClassName?: string;
  className?: string;
  innerClassName?: string;
  headerClassName?: string;
  children?: React.ReactNode;
};

type ViewTransitionPhase = "idle" | "closing" | "opening";

function createModalContentSnapshot(props: ModalLayoutProps): ModalContentSnapshot {
  return {
    title: props.title ?? "This is my modal dialog",
    description: props.description ?? "This is my modal dialog text.",
    showIcon: props.showIcon ?? true,
    titleIconSrc: props.titleIconSrc ?? "/assets/info.svg",
    titleIcon: props.titleIcon,
    showMobileHandle: props.showMobileHandle ?? true,
    showHandle: props.showHandle ?? false,
    showClose: props.showClose ?? true,
    generateLabel: props.generateLabel ?? "Generate",
    cancelLabel: props.cancelLabel ?? "Cancel",
    onGenerate: props.onGenerate,
    onCancel: props.onCancel,
    onClose: props.onClose,
    closeLabel: props.closeLabel ?? "Close modal",
    closeClassName: props.closeClassName,
    className: props.className,
    innerClassName: props.innerClassName,
    headerClassName: props.headerClassName,
    children: props.children,
  };
}

function renderModalBody(snapshot: ModalContentSnapshot, onDismiss: () => void, isDrawer: boolean) {
  return (
    <>
      {snapshot.showHandle || (snapshot.showMobileHandle && isDrawer) ? (
        <div
          className="flex! h-auto! w-full! shrink-0 justify-center bg-transparent! opacity-100!"
          data-vaul-handle=""
        >
          <Handle className="mx-auto" />
        </div>
      ) : null}

      <header className={cn("flex items-center gap-2", snapshot.headerClassName)}>
        {snapshot.showIcon ? (
          <div
            className={cn(
              "relative flex shrink-0 items-center justify-center",
              snapshot.titleIcon ? null : "h-5 w-5",
            )}
            aria-hidden={snapshot.titleIcon ? true : undefined}
          >
            {snapshot.titleIcon ?? (
              <Image src={snapshot.titleIconSrc} alt="" fill className="object-contain" />
            )}
          </div>
        ) : null}
        <DialogTitle className="text-select-text flex-1 text-left text-[18px]! leading-7 font-medium">
          {snapshot.title}
        </DialogTitle>
        {snapshot.showClose ? (
          <DialogClose asChild>
            <Close
              aria-label={snapshot.closeLabel}
              onClick={() => {
                snapshot.onClose?.();
                onDismiss();
              }}
              size="medium"
              status="default"
              className={cn(snapshot.closeClassName)}
            />
          </DialogClose>
        ) : null}
      </header>

      {snapshot.children ?? (
        <div className="flex flex-col gap-4">
          <DialogDescription className="text-modal-text text-left text-[14px]! leading-5 font-normal">
            {snapshot.description}
          </DialogDescription>

          <div className="flex flex-col gap-2">
            <Buttons
              variant="rose"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={snapshot.generateLabel}
              onClick={snapshot.onGenerate}
              className="w-full"
            />
            <Buttons
              variant="neutral"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={snapshot.cancelLabel}
              onClick={snapshot.onCancel}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

function useSequentialModalView({
  viewKey,
  open,
  defaultOpen,
  onOpenChange,
  contentSnapshot,
}: {
  viewKey?: string | number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentSnapshot: ModalContentSnapshot;
}) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [transitionOpen, setTransitionOpen] = React.useState<boolean | null>(null);
  const [displayedViewKey, setDisplayedViewKey] = React.useState(viewKey);
  const [phase, setPhase] = React.useState<ViewTransitionPhase>("idle");
  const [closingSnapshot, setClosingSnapshot] = React.useState<ModalContentSnapshot | null>(null);
  const pendingViewKeyRef = React.useRef(viewKey);

  React.useEffect(() => {
    pendingViewKeyRef.current = viewKey;
  }, [viewKey]);

  const idleOpen = isControlled ? Boolean(open) : uncontrolledOpen;
  const effectiveOpen = transitionOpen ?? idleOpen;
  const activeViewKey = phase === "idle" && !idleOpen ? viewKey : displayedViewKey;

  React.useEffect(() => {
    if (phase === "idle" || open !== false) {
      return;
    }

    queueMicrotask(() => {
      setPhase("idle");
      setTransitionOpen(null);
      setClosingSnapshot(null);
      setDisplayedViewKey(viewKey);
    });
  }, [open, phase, viewKey]);

  React.useEffect(() => {
    if (viewKey === undefined || viewKey === activeViewKey || phase !== "idle" || !idleOpen) {
      return;
    }

    queueMicrotask(() => {
      setClosingSnapshot(contentSnapshot);
      setPhase("closing");
      setTransitionOpen(false);
    });
  }, [activeViewKey, contentSnapshot, idleOpen, phase, viewKey]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (phase !== "idle") {
        return;
      }

      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange, phase],
  );

  const handleAnimationEnd = React.useCallback(
    (isOpen: boolean) => {
      if (phase === "closing" && !isOpen) {
        setDisplayedViewKey(pendingViewKeyRef.current);
        setClosingSnapshot(null);
        setPhase("opening");
        setTransitionOpen(true);
        return;
      }

      if (phase === "opening" && isOpen) {
        setPhase("idle");
        setTransitionOpen(null);
      }
    },
    [phase],
  );

  const activeSnapshot = phase === "closing" && closingSnapshot ? closingSnapshot : contentSnapshot;

  return {
    effectiveOpen,
    activeSnapshot,
    handleOpenChange,
    handleAnimationEnd,
  };
}

const preventOutsideDismiss = (event: Event) => {
  event.preventDefault();
};

const MODAL_LAYOUT_SHARED_CLASSNAME =
  "border-surface-strong bg-dialog-bg w-full gap-4 rounded-[28px]! border";

function ModalLayoutShell({
  snapshot,
  overlayClassName,
  freezeBackdrop,
  blockOutsideDismiss,
  onDismiss,
}: {
  snapshot: ModalContentSnapshot;
  overlayClassName?: string;
  freezeBackdrop: boolean;
  blockOutsideDismiss: boolean;
  onDismiss: () => void;
}) {
  const mode = useResponsiveModalMode();
  const isDrawer = mode === "drawer";
  const modalBody = renderModalBody(snapshot, onDismiss, isDrawer);

  return (
    <DialogContent
      overlayClassName={cn(
        MODAL_LAYOUT_OVERLAY_CLASSNAME,
        !isDrawer && MODAL_LAYOUT_DESKTOP_OVERLAY_MOTION_CLASSNAME,
        overlayClassName,
      )}
      freezeBackdrop={freezeBackdrop}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={blockOutsideDismiss ? preventOutsideDismiss : undefined}
      onPointerDownOutside={blockOutsideDismiss ? preventOutsideDismiss : undefined}
      data-slot="modal-layout"
      showCloseButton={false}
      className={cn(
        MODAL_LAYOUT_SHARED_CLASSNAME,
        isDrawer
          ? MODAL_LAYOUT_MOBILE_CLASSNAME
          : cn(MODAL_LAYOUT_DESKTOP_CLASSNAME, MODAL_LAYOUT_DESKTOP_MOTION_CLASSNAME),
        snapshot.className,
      )}
    >
      {snapshot.innerClassName ? (
        <div data-slot="modal-layout-inner" className={snapshot.innerClassName}>
          {modalBody}
        </div>
      ) : (
        modalBody
      )}
    </DialogContent>
  );
}

export function ModalLayout(props: ModalLayoutProps) {
  const {
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    viewKey,
    overlayClassName,
    freezeBackdrop = false,
    dismissOnOutsideClick = true,
    closeOnHistoryBack = true,
    onHistoryBack,
  } = props;

  const contentSnapshot = createModalContentSnapshot(props);

  const { effectiveOpen, activeSnapshot, handleOpenChange, handleAnimationEnd } =
    useSequentialModalView({
      viewKey,
      open,
      defaultOpen,
      onOpenChange,
      contentSnapshot,
    });

  const blockOutsideDismiss = dismissOnOutsideClick === false;

  return (
    <Dialog
      open={effectiveOpen}
      onOpenChange={handleOpenChange}
      onAnimationEnd={viewKey === undefined ? undefined : handleAnimationEnd}
      dismissible={dismissOnOutsideClick}
      closeOnHistoryBack={closeOnHistoryBack}
      onHistoryBack={onHistoryBack}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <ModalLayoutShell
        snapshot={activeSnapshot}
        overlayClassName={overlayClassName}
        freezeBackdrop={freezeBackdrop}
        blockOutsideDismiss={blockOutsideDismiss}
        onDismiss={() => handleOpenChange(false)}
      />
    </Dialog>
  );
}
