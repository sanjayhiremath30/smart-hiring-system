"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FunnelData = {
  applied: number;
  shortlisted: number;
  interviewed: number;
  selected: number;
  rejected: number;
  stages: { name: string; value: number; color: string }[];
};

export default function FunnelAnalyticsPage() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/funnel")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const colors: Record<string, string> = {
    cyan: "bg-cyan-500/30 border-cyan-400 text-cyan-300",
    blue: "bg-blue-500/30 border-blue-400 text-blue-300",
    purple: "bg-purple-500/30 border-purple-400 text-purple-300",
    green: "bg-green-500/30 border-green-400 text-green-300",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/features" className="text-cyan-400 text-sm mb-6 inline-block">
        ← All features
      </Link>
      <div className="glass-card p-8">
        <span className="text-5xl mb-4 block">📈</span>
        <h1 className="text-2xl font-bold text-white mb-2">
          Placement Funnel Analytics
        </h1>
        <p className="text-gray-400 mb-8">
          Your hiring funnel: Applied → Shortlisted → Interviewed → Selected. Predict drop-off reasons.
        </p>

        {loading && (
          <div className="h-48 flex items-center justify-center text-gray-500">
            Loading...
          </div>
        )}

        {!loading && !data && (
          <p className="text-gray-500">Sign in to see your funnel.</p>
        )}

        {!loading && data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {data.stages.map((s) => (
                <div
                  key={s.name}
                  className={`rounded-xl border p-4 ${colors[s.color] || "bg-white/10 border-white/20"}`}
                >
                  <p className="text-sm opacity-90">{s.name}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {data.stages.map((s, i) => {
                const prev = data.stages[i - 1]?.value ?? data.applied;
                const drop = prev > 0 ? Math.round((1 - s.value / prev) * 100) : 0;
                return (
                  <div key={s.name} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-gray-400">{s.name}</div>
                    <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${s.color === "cyan" ? "bg-cyan-500/50" : s.color === "blue" ? "bg-blue-500/50" : s.color === "purple" ? "bg-purple-500/50" : "bg-green-500/50"}`}
                        style={{
                          width: `${data.applied ? (s.value / data.applied) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-16">{s.value}</span>
                    {i > 0 && drop > 0 && (
                      <span className="text-xs text-amber-400">−{drop}%</span>
                    )}
                  </div>
                );
              })}
            </div>
            {data.rejected > 0 && (
              <p className="mt-6 text-sm text-gray-500">
                Rejected: {data.rejected}. Improve resume & skills to reduce drop-off.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
