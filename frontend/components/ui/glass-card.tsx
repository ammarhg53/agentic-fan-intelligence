import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  interactive?: boolean;
  intensity?: "default" | "strong" | "subtle";
}

export function GlassCard({
  children,
  className,
  interactive = false,
  intensity = "default",
  ...props
}: GlassCardProps) {
  return (
    <section
      className={cn(
        "glass-panel relative overflow-hidden",
        intensity === "strong" && "bg-pitch-850/90",
        intensity === "subtle" && "bg-pitch-900/50",
        interactive && "glass-panel-hover",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
      {children}
    </section>
  );
}
