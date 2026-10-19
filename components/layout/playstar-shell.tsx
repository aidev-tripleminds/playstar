"use client";

import * as React from "react";

import { LogoTopBar } from "@/components/common/navigation/logo-top-bar";

export function PlaystarShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="playstar-shell"
      className="bg-dialog-bg text-foreground flex min-h-[100lvh] md:h-dvh md:overflow-hidden"
    >
      <div className="flex min-w-0 flex-1 flex-col md:min-h-0">
        <header
          data-slot="playstar-header"
          className="border-border-strong bg-dialog-bg sticky top-0 z-[85] flex h-[62px] shrink-0 items-center border-b px-4"
        >
          <LogoTopBar showMobileMenuButton={false} />
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
