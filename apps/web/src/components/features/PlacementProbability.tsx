"use client";

import { useState } from "react";

export function PlacementProbability() {
  const [skills, setSkills] = useState("React, Node.js");
  const [role, setRole] = useState("SDE 1");
  const [result, setResult] = useState<null | { shortlist: number; interview: number; offer: number }>(null);
  const run = () => {
    const n = skills.split(",").length * 4 + (role === "SDE 2" ? 15 : 0);
    setResult({
      shortlist: Math.min(92, 45 + n + Math.floor(Math.random() * 10)),
      interview: Math.min(85, 35 + n + Math.floor(Math.random() * 12)),
      offer: Math.min(78, 25 + n + Math.floor(Math.random() * 15)),
    });
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Enter your skills and target role for placement probability.</p>
      <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma-separated)" className="input-field" />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field" style={{ colorScheme: "dark" }}>
        <option value="SDE 1">SDE 1</option>
        <option value="SDE 2">SDE 2</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="ML Engineer">ML Engineer</option>
      </select>
      <button onClick={run} className="btn-primary">Get probability</button>
      {result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-center">
            <p className="text-sm text-gray-400">Shortlisted</p>
            <p className="text-2xl font-bold text-white">{result.shortlist}%</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 text-center">
            <p className="text-sm text-gray-400">Interview clear</p>
            <p className="text-2xl font-bold text-white">{result.interview}%</p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-center">
            <p className="text-sm text-gray-400">Offer</p>
            <p className="text-2xl font-bold text-white">{result.offer}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
