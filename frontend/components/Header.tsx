"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-white/6 bg-transparent p-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-zinc-50">Regex Learner</h1>
          <span className="text-sm text-zinc-400">ML + TOC Hybrid Visualizer</span>
        </Link>
        <nav className="flex gap-3">
          <Link href="/visualizer" className="text-sm text-zinc-300 hover:text-zinc-50">
            Visualizer
          </Link>
          <Link href="/" className="text-sm text-zinc-300 hover:text-zinc-50">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
