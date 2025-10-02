// Minimal app shell with sticky header/footer and constrained content width.
import type { PropsWithChildren } from "react";

export function Applayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full w-full">
      <header className="sticky top-0 z-20 bg-[#12161c]/80 backdrop-blur border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            Live Tournament Leaderboard
          </h1>
          <a
            className="text-xs text-slate-400 hover:text-slate-200"
            href="http://localhost:4000/api/tournaments"
            target="_blank"
            rel="noreferrer"
          >
            API
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        Built with React + TypeScript
      </footer>
    </div>
  );
}
