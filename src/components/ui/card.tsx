import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-card p-4 text-card-foreground shadow-sm shadow-zinc-200/60",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
