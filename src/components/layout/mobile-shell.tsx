import type { ReactNode } from "react";
import { BottomTabs } from "@/components/layout/bottom-tabs";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-app-surface shadow-2xl shadow-zinc-300/60">
        <main className="flex-1 overflow-y-auto px-4 pb-5 pt-4">{children}</main>
        <BottomTabs />
      </div>
    </div>
  );
}
