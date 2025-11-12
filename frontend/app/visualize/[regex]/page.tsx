"use client";
import { use } from "react";
import { regexToNfa } from "../../../lib/automata/thompson";
import { nfaToDfa, minimizeDfa } from "../../../lib/automata/hopcroft";
import Header from "../../../components/Header";
import dynamic from "next/dynamic";

const NfaVisualizer = dynamic(() => import("../../../components/NfaVisualizer"), { ssr: false });
const DfaVisualizer = dynamic(() => import("../../../components/DfaVisualizer"), { ssr: false });

export default function Page({ params }: { params: { regex: string } }) {
  const decoded = decodeURIComponent(params.regex);
  // build nfa and dfa
  const nfa = regexToNfa(decoded);
  const dfa = nfaToDfa(nfa) as any;
  const minDfa = minimizeDfa(dfa) as any;

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-zinc-100">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <h2 className="text-2xl font-semibold">{decoded}</h2>

        <details className="mt-4 rounded-2xl bg-black/40 p-4">
          <summary className="cursor-pointer text-sm font-medium">View NFA (Thompson's Construction)</summary>
          <div className="mt-3"><NfaVisualizer nfa={nfa} /></div>
        </details>

        <details className="mt-4 rounded-2xl bg-black/40 p-4">
          <summary className="cursor-pointer text-sm font-medium">View DFA (Hopcroft's Minimization)</summary>
          <div className="mt-3"><DfaVisualizer dfa={minDfa} /></div>
        </details>
      </main>
    </div>
  );
}
