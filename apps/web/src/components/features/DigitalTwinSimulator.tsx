"use client";

import { useState } from "react";

const PATHS = [
  { id: "ai", label: "AI / ML", salary2y: "18–35 LPA", growth: "High" },
  { id: "web", label: "Web / Full Stack", salary2y: "12–22 LPA", growth: "Medium" },
  { id: "data", label: "Data Engineering", salary2y: "16–30 LPA", growth: "High" },
  { id: "devops", label: "DevOps / Cloud", salary2y: "14–28 LPA", growth: "High" },
];

export function DigitalTwinSimulator() {
  const [skill, setSkill] = useState("React");
  const [path, setPath] = useState("web");
  const [delay, setDelay] = useState("0");
  const [result, setResult] = useState<null | { salary: string; impact: string }>(null);

  function runSimulation() {
    const pathObj = PATHS.find((p) => p.id === path);
    const delayMonths = parseInt(delay, 10) || 0;
    const impact =
      delayMonths > 0
        ? `Delaying by ${delayMonths} months could reduce your 2-year salary by ~${Math.min(15, delayMonths * 2)}% (slower seniority).`
        : "No delay — you're on the optimal path.";
    setResult({
      salary: pathObj?.salary2y || "12–25 LPA",
      impact,
    });
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-400">
        Simulate your career trajectory: choose a skill, path, and any delay to see predicted salary after 2 years and impact.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm text-gray-400 mb-2">If you learn this skill</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g. React, Python"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Career path</label>
          <select
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="input-field"
            style={{ colorScheme: "dark" }}
          >
            {PATHS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Delay learning (months)</label>
          <select
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="input-field"
            style={{ colorScheme: "dark" }}
          >
            {[0, 3, 6, 12, 18].map((n) => (
              <option key={n} value={n}>{n === 0 ? "No delay" : `${n} months`}</option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={runSimulation} className="btn-primary">
        Run career simulation
      </button>
      {result && (
        <div className="glass-card p-6 border-cyan-500/30">
          <h4 className="text-white font-semibold mb-2">📊 Your career trajectory (2 years)</h4>
          <p className="text-cyan-400 text-lg">Estimated salary range: <strong>{result.salary}</strong></p>
          <p className="text-gray-400 mt-2">{result.impact}</p>
        </div>
      )}
    </div>
  );
}
