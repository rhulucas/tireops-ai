"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const polymers = ["SBR", "NR", "BR", "IR"];
const fillers = ["炭黑 N330", "炭黑 N550", "白炭黑", "碳酸钙"];
const vulcanization = ["硫磺", "过氧化物", "树脂"];

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
      setResult(data.result || data.error || "生成失败");
    } catch {
      setResult("API 调用失败。请配置 OPENAI_API_KEY。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-zinc-100">Compound Spec</h1>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
          新增!
        </span>
      </div>
      <p className="mb-8 text-zinc-400">
        橡胶配方生成器：选择聚合物、填料、硫化体系 → AI 输出 phr 配方 → 预测 EU 标签等级
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              聚合物 (SBR/NR/BR/IR)
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
            <label className="mb-2 block text-sm font-medium text-zinc-300">填料</label>
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
            <label className="mb-2 block text-sm font-medium text-zinc-300">硫化体系</label>
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
                AI 生成配方...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI 生成 phr 配方
              </>
            )}
          </button>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="mb-2 text-sm font-medium text-zinc-400">输出： phr 配方 + EU 标签预测</p>
          {result ? (
            <pre className="whitespace-pre-wrap text-sm text-zinc-200">{result}</pre>
          ) : (
            <p className="text-zinc-500">选择组分后点击「AI 生成 phr 配方」</p>
          )}
        </div>
      </div>
    </div>
  );
}
