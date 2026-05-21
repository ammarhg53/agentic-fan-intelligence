"use client";

import { ChevronLeft, Gauge, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { useAppStore, useSidebarCollapsed } from "@/store/use-app-store";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const collapsed = useSidebarCollapsed();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-pitch-950/80 backdrop-blur-2xl">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-neon-500/30 bg-neon-500/10 text-neon-100 shadow-neon-sm">
          <Gauge className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className={cn("min-w-0 transition-opacity", collapsed && "lg:hidden")}>
          <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-neon-200/70">
            Agentic Fan
          </p>
          <p className="truncate font-display text-lg font-bold text-white">Intelligence</p>
        </div>
        <button
          type="button"
          className="ml-auto grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/5 text-white/70 transition hover:border-neon-500/40 hover:text-white lg:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "border-neon-500/30 bg-neon-500/10 text-white shadow-neon-sm"
                  : "border-transparent text-white/60 hover:border-white/10 hover:bg-white/5 hover:text-white",
                collapsed && "lg:justify-center lg:px-2"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "ml-auto rounded-md border border-lime-500/30 bg-lime-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-lime-400",
                    collapsed && "lg:hidden"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className={cn("glass-panel p-3", collapsed && "lg:p-2")}>
          <p className={cn("text-xs font-semibold text-white", collapsed && "lg:hidden")}>
            AI match engine
          </p>
          <p className={cn("mt-1 text-xs text-white/50", collapsed && "lg:hidden")}>
            Gemini-ready pipeline with FastAPI handoff.
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-white/10">
            <div className="h-full w-[91%] rounded-sm bg-gradient-to-r from-neon-500 via-violet-500 to-lime-500" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleSidebar}
        className="m-3 hidden h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition hover:border-neon-500/30 hover:text-white lg:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          aria-hidden="true"
        />
        <span className={cn(collapsed && "lg:hidden")}>Collapse</span>
      </button>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 transition-[width] duration-300 lg:block",
          collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
        )}
      >
        {sidebarContent}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!mobileOpen}
        onClick={onMobileClose}
      >
        <aside
          className={cn(
            "h-full w-[18rem] border-r border-white/10 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}
