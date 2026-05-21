"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { cn } from "@/lib/utils";
import { useSidebarCollapsed } from "@/store/use-app-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSidebarCollapsed();

  return (
    <div className="afi-shell-bg min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-neon-line" />
        <div className="absolute left-0 top-0 h-px w-full animate-scan-line bg-neon-line opacity-40" />
      </div>

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div
        className={cn(
          "relative z-10 min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[var(--sidebar-collapsed-width)]" : "lg:pl-[var(--sidebar-width)]"
        )}
      >
        <TopNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
