"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import RegexCard from "../../components/RegexCard";

export default function VisualizerPage() {
  const [pos, setPos] = useState("");
  const [neg, setNeg] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ regex: string; score: number }[] | null>(null);

  async function submit() {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positive: pos.split('\n').filter(Boolean), negative: neg.split('\n').filter(Boolean) }),
      });
      const data = await res.json();
      setResults(data.top_regexes || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-zinc-100">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <h2 className="text-2xl font-semibold">Visualizer</h2>
        <p className="mt-2 text-sm text-zinc-400">Provide examples and generate candidate regular expressions.</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-300">Positive Strings</label>
            <textarea value={pos} onChange={(e) => setPos(e.target.value)} className="mt-2 h-48 w-full rounded-xl bg-black/40 p-3 text-zinc-100" placeholder="one per line" />
          </div>
          <div>
            <label className="block text-sm text-zinc-300">Negative Strings</label>
            <textarea value={neg} onChange={(e) => setNeg(e.target.value)} className="mt-2 h-48 w-full rounded-xl bg-black/40 p-3 text-zinc-100" placeholder="one per line" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={submit} className="rounded-xl bg-indigo-600 px-4 py-2 font-medium">Submit</button>
          {loading && <Loader message="Generating regex candidates..." />}
        </div>

        <div className="mt-8 grid gap-4">
          {results && results.length === 0 && <div className="text-sm text-zinc-400">No results</div>}
          {results && results.map((r, i) => (
            <RegexCard key={i} regex={r.regex} score={r.score} />
          ))}
        </div>
      </main>
    </div>
  );
}
