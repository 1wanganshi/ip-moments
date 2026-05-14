"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainTabs } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-border bg-card/95 px-2 pb-2 pt-1 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs transition",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground active:bg-muted",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" strokeWidth={2.2} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
