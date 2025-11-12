
import { NFA } from "./thompson";

type DFAState = { id: string; transitions: { symbol: string; to: string }[] };

function epsilonClosure(states: Set<string>, nfa: NFA) {
    const res = new Set<string>(states);
    const stack = Array.from(states);
    const map = new Map(nfa.states.map((s) => [s.id, s]));
    while (stack.length) {
        const cur = stack.pop()!;
        const state = map.get(cur)!;
        for (const t of state.transitions) {
            if (t.symbol === "" && !res.has(t.to)) {
                res.add(t.to);
                stack.push(t.to);
            }
        }
    }
    return res;
}

function move(states: Set<string>, symbol: string, nfa: NFA) {
    const res = new Set<string>();
    const map = new Map(nfa.states.map((s) => [s.id, s]));
    for (const s of states) {
        const st = map.get(s)!;
        for (const t of st.transitions) {
            if (t.symbol === symbol) res.add(t.to);
        }
    }
    return res;
}

export function nfaToDfa(nfa: NFA) {

    const alphabet = new Set<string>();
    nfa.states.forEach((s) => s.transitions.forEach((t) => { if (t.symbol !== "") alphabet.add(t.symbol); }));

    const startClosure = epsilonClosure(new Set([nfa.start]), nfa);
    const statesMap = new Map<string, Set<string>>();
    const dfaStates: DFAState[] = [];

    function keyOf(set: Set<string>) { return Array.from(set).sort().join(",") }

    const queue: Set<string>[] = [startClosure];
    statesMap.set(keyOf(startClosure), startClosure);

    while (queue.length) {
        const cur = queue.shift()!;
        const curKey = keyOf(cur);
        const id = `D_${curKey || "eps"}`;
        const transitions: { symbol: string; to: string }[] = [];
        for (const a of Array.from(alphabet)) {
            const m = move(cur, a, nfa);
            if (m.size === 0) continue;
            const e = epsilonClosure(m, nfa);
            const k = keyOf(e);
            if (!statesMap.has(k)) {
                statesMap.set(k, e);
                queue.push(e);
            }
            transitions.push({ symbol: a, to: `D_${k}` });
        }
        dfaStates.push({ id, transitions });
    }


    const accept: string[] = [];
    for (const [k, set] of statesMap.entries()) {
        if (set.has(nfa.accept)) accept.push(`D_${k}`);
    }

    return { states: dfaStates, start: `D_${keyOf(startClosure)}`, accept };
}


export function minimizeDfa(dfa: { states: { id: string; transitions: { symbol: string; to: string }[] }[]; start: string; accept: string[] }) {

    const alphabet = new Set<string>();
    dfa.states.forEach((s) => s.transitions.forEach((t) => alphabet.add(t.symbol)));

    const stateIds = dfa.states.map((s) => s.id);
    const isAccept = new Set(dfa.accept);


    let P: Set<string>[] = [];
    const acceptSet = new Set(stateIds.filter((id) => isAccept.has(id)));
    const nonAcceptSet = new Set(stateIds.filter((id) => !isAccept.has(id)));
    if (acceptSet.size > 0) P.push(acceptSet);
    if (nonAcceptSet.size > 0) P.push(nonAcceptSet);


    function findPartitionIndex(state: string) {
        for (let i = 0; i < P.length; i++) if (P[i].has(state)) return i;
        return -1;
    }


    const inv: Record<string, Record<string, Set<string>>> = {};
    for (const a of alphabet) inv[a] = {};
    const map = new Map(dfa.states.map((s) => [s.id, s]));
    for (const s of dfa.states) {
        for (const t of s.transitions) {
            if (!inv[t.symbol][t.to]) inv[t.symbol][t.to] = new Set();
            inv[t.symbol][t.to].add(s.id);
        }
    }


    let W: Set<string>[] = P.slice();

    while (W.length) {
        const A = W.pop()!;
        for (const c of Array.from(alphabet)) {

            const X = new Set<string>();
            for (const aState of Array.from(A)) {
                const sources = inv[c][aState];
                if (sources) for (const s of sources) X.add(s);
            }
            if (X.size === 0) continue;

            const newP: Set<string>[] = [];
            for (const Y of P) {

                const inter = new Set(Array.from(Y).filter((s) => X.has(s)));
                const diff = new Set(Array.from(Y).filter((s) => !X.has(s)));
                if (inter.size > 0 && diff.size > 0) {
                    newP.push(inter);
                    newP.push(diff);

                    const idx = P.indexOf(Y);
                    P.splice(idx, 1, inter, diff);


                    const wIdx = W.indexOf(Y);
                    if (wIdx !== -1) {
                        W.splice(wIdx, 1, inter, diff);
                    } else {
                        if (inter.size <= diff.size) W.push(inter); else W.push(diff);
                    }
                }
            }
        }
    }


    const partId = P.map((set) => Array.from(set).sort().join(","));
    const partMap = new Map<string, string>();
    for (let i = 0; i < P.length; i++) {
        for (const s of P[i]) partMap.set(s, partId[i]);
    }

    const newStates: { id: string; transitions: { symbol: string; to: string }[] }[] = [];
    for (let i = 0; i < P.length; i++) {
        const repr = partId[i];

        const member = Array.from(P[i])[0];
        const orig = map.get(member)!;
        const transitions: { symbol: string; to: string }[] = [];
        for (const t of orig.transitions) {
            const toPart = partMap.get(t.to)!;
            if (!transitions.find((tt) => tt.symbol === t.symbol && tt.to === toPart)) transitions.push({ symbol: t.symbol, to: toPart });
        }
        newStates.push({ id: repr, transitions });
    }

    const newStart = partMap.get(dfa.start)!;
    const newAccept = Array.from(new Set(dfa.accept.map((a) => partMap.get(a)!)));

    return { states: newStates, start: newStart, accept: newAccept };
}
