
export interface State { id: string; transitions: { symbol: string; to: string }[] }
export interface NFA { states: State[]; start: string; accept: string }

let idCounter = 0;
function fresh() { return `q${idCounter++}` }

type Frag = { start: string; accept: string; states: State[] }

function makeState(id: string, transitions: { symbol: string; to: string }[] = []): State {
    return { id, transitions };
}

function toPostfix(re: string) {
    const out: string[] = [];
    const ops: string[] = [];

    const prec: Record<string, number> = { '|': 1, '.': 2, '*': 3 };

    const tokens: string[] = [];
    for (let i = 0; i < re.length; i++) {
        const c = re[i];
        if (c === '(' || c === ')' || c === '|' || c === '*') tokens.push(c);
        else tokens.push(c);
    }


    const withConcat: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        withConcat.push(t);
        if (i + 1 < tokens.length) {
            const a = t;
            const b = tokens[i + 1];
            if ((a !== '|' && a !== '(') && (b !== '|' && b !== ')' && b !== '*')) {
                withConcat.push('.');
            }
        }
    }

    for (const t of withConcat) {
        if (t === '(') ops.push(t);
        else if (t === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') out.push(ops.pop()!);
            ops.pop();
        } else if (t === '|' || t === '.' || t === '*') {
            while (ops.length && ops[ops.length - 1] !== '(' && prec[ops[ops.length - 1]] >= (prec[t] || 0)) out.push(ops.pop()!);
            ops.push(t);
        } else {
            out.push(t);
        }
    }
    while (ops.length) out.push(ops.pop()!);
    return out;
}

export function regexToNfa(regex: string): NFA {
    idCounter = 0;
    const postfix = toPostfix(regex);
    const stack: Frag[] = [];

    for (const tok of postfix) {
        if (tok === '.') {
            const b = stack.pop()!;
            const a = stack.pop()!;

            a.states.push(makeState(a.accept, [{ symbol: "", to: b.start }]));

            const states = [...a.states, ...b.states];
            stack.push({ start: a.start, accept: b.accept, states });
        } else if (tok === '|') {
            const b = stack.pop()!;
            const a = stack.pop()!;
            const s = fresh();
            const f = fresh();
            const states: State[] = [];
            states.push(makeState(s, [{ symbol: "", to: a.start }, { symbol: "", to: b.start }]));
            states.push(...a.states);
            states.push(...b.states);
            states.push(makeState(a.accept, [{ symbol: "", to: f }]));
            states.push(makeState(b.accept, [{ symbol: "", to: f }]));
            states.push(makeState(f, []));
            stack.push({ start: s, accept: f, states });
        } else if (tok === '*') {
            const a = stack.pop()!;
            const s = fresh();
            const f = fresh();
            const states: State[] = [];
            states.push(makeState(s, [{ symbol: "", to: a.start }, { symbol: "", to: f }]));
            states.push(...a.states);
            states.push(makeState(a.accept, [{ symbol: "", to: a.start }, { symbol: "", to: f }]));
            states.push(makeState(f, []));
            stack.push({ start: s, accept: f, states });
        } else {

            const s = fresh();
            const f = fresh();
            const states = [makeState(s, [{ symbol: tok, to: f }]), makeState(f, [])];
            stack.push({ start: s, accept: f, states });
        }
    }

    const frag = stack.pop()!;

    const map = new Map<string, State>();
    for (const st of frag.states) {
        if (!map.has(st.id)) map.set(st.id, { id: st.id, transitions: [...st.transitions] });
        else map.get(st.id)!.transitions.push(...st.transitions);
    }
    const states = Array.from(map.values());
    return { states, start: frag.start, accept: frag.accept };
}
