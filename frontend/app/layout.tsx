import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://agentic-fan-intelligence.vercel.app"),
  title: {
    default: "Agentic Fan Intelligence Platform",
    template: "%s | AFI Platform"
  },
  description:
    "A futuristic AI-powered cricket analytics platform for live match intelligence, win probability, momentum, and fan insight.",
  keywords: [
    "cricket analytics",
    "AI sports intelligence",
    "win probability",
    "momentum analytics",
    "fan dashboard"
  ],
  authors: [{ name: "Agentic Fan Intelligence Team" }],
  openGraph: {
    title: "Agentic Fan Intelligence Platform",
    description: "AI cricket analytics for cinematic live match intelligence.",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic Fan Intelligence Platform",
    description: "AI cricket analytics for cinematic live match intelligence."
  }
};

export const viewport: Viewport = {
  themeColor: "#020408",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
