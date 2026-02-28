"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function InvoiceAIPage() {
  const [warrantyMiles, setWarrantyMiles] = useState("60000");
  const [certFee, setCertFee] = useState("500");
  const [items, setItems] = useState("Tires x 200, cert fee");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warrantyMiles,
          certFee,
          items,
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Invoice AI</h1>
        <p className="mt-1 text-zinc-400">Invoice: tread warranty, certification fee</p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Tread warranty (mi)
          </label>
          <input
            type="text"
            value={warrantyMiles}
            onChange={(e) => setWarrantyMiles(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            placeholder="60000"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Cert fee (USD)
          </label>
          <input
            type="text"
            value={certFee}
            onChange={(e) => setCertFee(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Line items</label>
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            placeholder="Tires x 200, cert fee"
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
              Generating invoice...
            </>
          ) : (
            "AI Generate Invoice"
          )}
        </button>
        {result && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <p className="text-sm font-medium text-zinc-400">Invoice content</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
