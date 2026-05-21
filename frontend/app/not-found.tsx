import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] place-items-center px-4">
      <section className="glass-panel w-full max-w-lg p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-gold-500/30 bg-gold-500/10 text-gold-400">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-black text-white">Match signal not found</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">
          That route is outside the current intelligence feed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-neon-500/25 bg-neon-500/10 px-4 text-sm font-semibold text-neon-100 transition hover:border-neon-500/40 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Dashboard
        </Link>
      </section>
    </div>
  );
}
