"use client";
import Header from "../../../components/Header";
import TestStringPanel from "../../../components/TestStringPanel";

export default function Page({ params }: { params: { regex: string } }) {
  const decoded = decodeURIComponent(params.regex);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-zinc-100">
      <Header />
      <main className="mx-auto max-w-3xl p-6">
        <h2 className="text-2xl font-semibold">Test: {decoded}</h2>
        <p className="mt-2 text-sm text-zinc-400">Enter strings to test against the regex.</p>
        <div className="mt-4">
          <TestStringPanel regex={decoded} />
        </div>
      </main>
    </div>
  );
}
