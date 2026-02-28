"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Loader2, Download, Eraser } from "lucide-react";

type DrawMode = "groove" | "block" | "sipe" | "dimple" | "erase";

export default function TreadDesignerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<DrawMode>("groove");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isDrawing = useRef(false);

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !isDrawing.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.fillStyle =
        mode === "groove"
          ? "#1e3a5f"
          : mode === "block"
          ? "#374151"
          : mode === "sipe"
          ? "#4b5563"
          : mode === "dimple"
          ? "#6b7280"
          : "#0a0a0a";
      ctx.beginPath();
      ctx.arc(x, y, mode === "erase" ? 12 : 4, 0, Math.PI * 2);
      ctx.fill();
    },
    [mode]
  );

  const startDraw = useCallback(() => {
    isDrawing.current = true;
  }, []);
  const endDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setAnalysis(null);
  };

  const runAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/tread-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elements: ["grooves", "blocks", "sipes", "dimples"],
        }),
      });
      const data = await res.json();
      setAnalysis(data.result || data.error || "Analysis failed");
    } catch {
      setAnalysis("API failed. Configure OPENAI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  const exportCNC = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "tread-design-mold-cnc.png";
    a.click();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Tread Designer</h1>
        <p className="mt-1 text-zinc-400">
          Tread canvas: grooves / blocks / sipes / dimples → AI analysis → Export Mold CNC
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="mb-2 text-sm font-medium text-zinc-400">Tools</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "groove", label: "Grooves", color: "#1e3a5f" },
                { key: "block", label: "Blocks", color: "#374151" },
                { key: "sipe", label: "Sipes", color: "#4b5563" },
                { key: "dimple", label: "Dimples", color: "#6b7280" },
                { key: "erase", label: "Eraser", color: "#0a0a0a" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setMode(key as DrawMode)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    mode === key
                      ? "bg-amber-500/30 text-amber-400"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              <Eraser className="h-4 w-4" />
              Clear
            </button>
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              AI Analyze
            </button>
            <button
              onClick={exportCNC}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              <Download className="h-4 w-4" />
              Export CNC
            </button>
          </div>
          {analysis && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
              <p className="text-sm font-medium text-zinc-400">AI analysis result</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{analysis}</pre>
            </div>
          )}
        </div>
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="cursor-crosshair rounded-xl border border-zinc-800 bg-zinc-950"
            onMouseDown={startDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onMouseMove={draw}
          />
        </div>
      </div>
    </div>
  );
}
