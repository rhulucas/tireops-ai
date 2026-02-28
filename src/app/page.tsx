"use client";

import { Activity, AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface LineStatus {
  name: string;
  status: "RUNNING" | "STOPPED" | "MAINTENANCE";
  efficiency: number;
  qcFails: number;
}

export default function DashboardPage() {
  const [lines, setLines] = useState<LineStatus[]>([
    { name: "Line A", status: "RUNNING", efficiency: 94.2, qcFails: 3 },
    { name: "Line B", status: "RUNNING", efficiency: 91.8, qcFails: 5 },
    { name: "Line C", status: "STOPPED", efficiency: 0, qcFails: 0 },
    { name: "Line D", status: "RUNNING", efficiency: 88.5, qcFails: 8 },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) =>
        prev.map((line) =>
          line.status === "RUNNING"
            ? {
                ...line,
                efficiency: Math.min(99, line.efficiency + (Math.random() - 0.5) * 2),
                qcFails: line.qcFails + (Math.random() > 0.9 ? 1 : 0),
              }
            : line
        )
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalQcFails = lines.reduce((s, l) => s + l.qcFails, 0);
  const avgEfficiency =
    lines.filter((l) => l.status === "RUNNING").reduce((s, l) => s + l.efficiency, 0) /
    Math.max(1, lines.filter((l) => l.status === "RUNNING").length);

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-zinc-400">Real-time production line status & tread efficiency</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Avg tread efficiency</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-400">{avgEfficiency.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">QC failures</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-400">{totalQcFails}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Active lines</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {lines.filter((l) => l.status === "RUNNING").length}/4
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-200">Production lines</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lines.map((line) => (
            <div
              key={line.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200">{line.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    line.status === "RUNNING"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : line.status === "MAINTENANCE"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-zinc-700 text-zinc-400"
                  }`}
                >
                  {line.status === "RUNNING"
? "Running"
                      : line.status === "MAINTENANCE"
                      ? "Maintenance"
                      : "Stopped"}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Efficiency</span>
                  <span className="text-amber-400">{line.efficiency.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-amber-500/80 transition-all"
                    style={{ width: `${line.efficiency}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">QC fails</span>
                  <span className="text-red-400">{line.qcFails}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
