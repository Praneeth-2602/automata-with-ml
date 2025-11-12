"use client";
import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

interface State { id: string; transitions: { symbol: string; to: string }[] }
interface NFA { states: State[]; start: string; accept: string }

export default function NfaVisualizer({ nfa }: { nfa: NFA }) {
  const container = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!container.current) return;
    const elements: any[] = [];
    const stateIds = new Set<string>();

    nfa.states.forEach((s) => {
      stateIds.add(s.id);
      elements.push({ data: { id: s.id, label: s.id } });
    });

    nfa.states.forEach((s) => {
      s.transitions.forEach((t, idx) => {
        elements.push({
          data: {
            id: `${s.id}-${t.to}-${idx}`,
            source: s.id,
            target: t.to,
            label: t.symbol === "" ? "ε" : t.symbol,
          },
        });
      });
    });

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    cyRef.current = cytoscape({
      container: container.current,
      elements,
      style: [
        { selector: "node", style: { label: "data(label)", "text-valign": "center", color: "#fff", "background-color": "#111827" } },
        { selector: "edge", style: { label: "data(label)", "curve-style": "bezier", "target-arrow-shape": "triangle", color: "#ddd", "line-color": "#374151", "target-arrow-color": "#374151" } },
        { selector: `node[id = "${nfa.start}"]`, style: { "background-color": "#10b981" } },
        { selector: `node[id = "${nfa.accept}"]`, style: { "background-color": "#3b82f6" } },
      ],
      layout: { name: "dagre", rankDir: "LR" } as any,
    });

    return () => cyRef.current && cyRef.current.destroy();
  }, [nfa]);

  return <div ref={container} className="h-80 w-full rounded-md bg-black/40 p-2" />;
}
