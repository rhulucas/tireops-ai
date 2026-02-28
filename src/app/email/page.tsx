"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const scenarios = [
  { value: "oem", label: "OEM 认证咨询" },
  { value: "fleet", label: "车队询价" },
  { value: "warranty", label: "质保投诉" },
];

export default function EmailAIPage() {
  const [scenario, setScenario] = useState("oem");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, content }),
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Email AI</h1>
        <p className="mt-1 text-zinc-400">轮胎行业邮件场景：OEM 认证、车队询价、质保投诉</p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">场景</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            {scenarios.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">邮件内容/要点</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            placeholder="输入客户邮件内容或回复要点..."
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI 生成回复...
            </>
          ) : (
            "AI 生成回复"
          )}
        </button>
        {result && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <p className="text-sm font-medium text-zinc-400">回复草稿</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
