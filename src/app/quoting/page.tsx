"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AIQuotingPage() {
  const [size, setSize] = useState("225/65R17");
  const [loadIndex, setLoadIndex] = useState(102);
  const [speedRating, setSpeedRating] = useState("V");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuote = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, loadIndex, speedRating }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "生成失败");
    } catch {
      setResult("API 调用失败。请确保已配置 OPENAI_API_KEY。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">AI Quoting</h1>
        <p className="mt-1 text-zinc-400">
          轮胎规格报价：尺寸、载重指数、速度级别、EU 标签、DOT/ECE 合规
        </p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            轮胎尺寸 (如 225/65R17)
          </label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            placeholder="225/65R17"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">载重指数</label>
          <input
            type="number"
            value={loadIndex}
            onChange={(e) => setLoadIndex(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">速度级别</label>
          <select
            value={speedRating}
            onChange={(e) => setSpeedRating(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            {["S", "T", "H", "V", "W", "Y"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleQuote}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI 生成报价...
            </>
          ) : (
            "AI 生成报价"
          )}
        </button>
        {result && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <p className="text-sm font-medium text-zinc-400">报价结果</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
