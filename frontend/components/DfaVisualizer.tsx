"use client";
import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

interface DState { id: string; transitions: { symbol: string; to: string }[] }
interface DFA { states: DState[]; start: string; accept: string[] }

export default function DfaVisualizer({ dfa }: { dfa: DFA }) {
  const container = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!container.current) return;
    const elements: any[] = [];

    dfa.states.forEach((s) => {
      elements.push({ data: { id: s.id, label: s.id } });
    });

    dfa.states.forEach((s) => {
      s.transitions.forEach((t, idx) => {
        elements.push({
          data: {
            id: `${s.id}-${t.to}-${idx}`,
            source: s.id,
            target: t.to,
            label: t.symbol,
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
        { selector: `node[id = "${dfa.start}"]`, style: { "background-color": "#10b981" } },
        { selector: `node`, style: { "background-color": "#111827" } },
      ],
      layout: { name: "dagre", rankDir: "LR" } as any,
    });

    // color accept states blue
    dfa.accept.forEach((id) => {
      const node = cyRef.current.getElementById(id);
      if (node) node.style("background-color", "#3b82f6");
    });

    return () => cyRef.current && cyRef.current.destroy();
  }, [dfa]);

  return <div ref={container} className="h-80 w-full rounded-md bg-black/40 p-2" />;
}
