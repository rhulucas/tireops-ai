"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const polymers = ["SBR", "NR", "BR", "IR"];
const fillers = ["Carbon black N330", "Carbon black N550", "Silica", "Calcium carbonate"];
  const vulcanization = ["Sulfur", "Peroxide", "Resin"];

export default function CompoundSpecPage() {
  const [selectedPolymer, setSelectedPolymer] = useState<string[]>([]);
  const [selectedFiller, setSelectedFiller] = useState<string[]>([]);
  const [selectedVulc, setSelectedVulc] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (
    arr: string[],
    setArr: (v: string[]) => void,
    item: string
  ) => {
    if (arr.includes(item)) {
      setArr(arr.filter((x) => x !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/compound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          polymers: selectedPolymer,
          fillers: selectedFiller,
          vulcanization: selectedVulc,
        }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "Failed");
    } catch {
      setResult("API failed. Configure OPENAI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-zinc-100">Compound Spec</h1>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
          NEW!
        </span>
      </div>
      <p className="mb-8 text-zinc-400">
        Rubber compound generator: select polymers, fillers, vulcanization → AI outputs phr → predicts EU label
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Polymers (SBR/NR/BR/IR)
            </label>
            <div className="flex flex-wrap gap-2">
              {polymers.map((p) => (
                <button
                  key={p}
                  onClick={() => toggle(selectedPolymer, setSelectedPolymer, p)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedPolymer.includes(p)
                      ? "bg-amber-500/30 text-amber-400"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Fillers</label>
            <div className="flex flex-wrap gap-2">
              {fillers.map((f) => (
                <button
                  key={f}
                  onClick={() => toggle(selectedFiller, setSelectedFiller, f)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedFiller.includes(f)
                      ? "bg-amber-500/30 text-amber-400"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Vulcanization</label>
            <div className="flex flex-wrap gap-2">
              {vulcanization.map((v) => (
                <button
                  key={v}
                  onClick={() => toggle(selectedVulc, setSelectedVulc, v)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedVulc.includes(v)
                      ? "bg-amber-500/30 text-amber-400"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating formula...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Generate phr Formula
              </>
            )}
          </button>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="mb-2 text-sm font-medium text-zinc-400">Output: phr formula + EU label prediction</p>
          {result ? (
            <pre className="whitespace-pre-wrap text-sm text-zinc-200">{result}</pre>
          ) : (
            <p className="text-zinc-500">Select components and click "AI Generate phr Formula"</p>
          )}
        </div>
      </div>
    </div>
  );
}
