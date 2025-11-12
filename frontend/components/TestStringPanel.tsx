"use client";
import { useState } from "react";

export default function TestStringPanel({ regex }: { regex: string }) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ s: string; ok: boolean }[]>([]);

  function runTest() {
    try {
      const re = new RegExp(regex);
      const ok = re.test(input);
      setResults((r) => [{ s: input, ok }, ...r]);
      setInput("");
    } catch (e) {
      setResults((r) => [{ s: input + " (invalid regex)", ok: false }, ...r]);
    }
  }

  return (
    <div className="rounded-2xl bg-neutral-900/50 p-4 shadow-md">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-md bg-black/40 p-2 text-zinc-100"
          placeholder="Enter test string"
        />
        <button onClick={runTest} className="rounded-md bg-emerald-600 px-3 py-1 text-white">
          Test
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`rounded-full p-1 ${r.ok ? "bg-emerald-600" : "bg-rose-600"}`}>
              {r.ok ? "✅" : "❌"}
            </div>
            <div className="text-sm text-zinc-200">{r.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
