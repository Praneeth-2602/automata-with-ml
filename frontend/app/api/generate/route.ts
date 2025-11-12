import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Demo: comment out real backend proxy and return a canned response for demo/testing.
    // If you want to re-enable the real backend, uncomment the block below and set BACKEND_URL.
    /*
    // Proxy to backend service. Assumption: backend running at http://localhost:8000/generate_regex
    const backend = process.env.BACKEND_URL || 'http://localhost:8000/generate_regex';
    const resp = await fetch(backend, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return NextResponse.json(data);
    */

    // Return demo response (matches backend contract used by the frontend)
    const demo = {
      top_regexes: [
        { regex: "(a|b)*abb", score: 0.92 },
        { regex: "a*b+", score: 0.89 },
        { regex: "(ab)*", score: 0.85 },
      ],
    };

    return NextResponse.json(demo);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
