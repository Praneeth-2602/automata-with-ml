import Link from "next/link";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-100">
      <Header />
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">Regex Learner: ML + TOC Hybrid Visualizer</h1>
        <p className="mt-2 text-zinc-400">Generate regular expressions from examples, visualize their NFA & DFA, and test them live!</p>

        <section className="mt-6 rounded-2xl bg-black/40 p-6">
          <h3 className="text-lg font-semibold">Pipeline</h3>
          <ol className="mt-2 list-decimal pl-5 text-zinc-300">
            <li>Step 1: Provide positive and negative strings</li>
            <li>Step 2: Backend generates candidate regexes</li>
            <li>Step 3: Frontend visualizes their NFA and DFA</li>
            <li>Step 4: Test your own strings against the regexes</li>
          </ol>
          <div className="mt-6">
            <Link href="/visualizer" className="rounded-2xl bg-indigo-600 px-4 py-2 text-white">Get Started</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
