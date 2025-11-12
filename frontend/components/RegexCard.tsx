"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegexCard({
  regex,
  score,
}: {
  regex: string;
  score: number;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-2xl bg-neutral-900/50 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <code className="font-mono text-sm text-zinc-100 select-all">{regex}</code>
        <div className="flex items-center gap-2">
          <div className="w-36">
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${Math.round(score * 100)}%` }}
              />
            </div>
            <div className="text-xs text-zinc-400">Score: {Math.round(score * 100)}%</div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/visualize/${encodeURIComponent(regex)}`}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white"
        >
          Visualize
        </Link>
        <Link
          href={`/test/${encodeURIComponent(regex)}`}
          className="rounded-lg bg-slate-700 px-3 py-1 text-sm text-white"
        >
          Test Strings
        </Link>
        <button
          onClick={() => {
            navigator.clipboard.writeText(regex);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="ml-auto rounded-lg border border-white/10 px-3 py-1 text-sm text-zinc-200"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
