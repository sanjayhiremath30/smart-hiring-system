"use client";

import { useState } from "react";

export function BehavioralScoring() {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | { score: number; feedback: string }>(null);
  const run = () => {
    const len = answer.trim().length;
    const score = Math.min(95, 50 + Math.floor(len / 20) + Math.floor(Math.random() * 15));
    setResult({
      score,
      feedback: score >= 75 ? "Strong structure and clarity. Good use of STAR-style response." : "Add a specific example and outcome. Keep under 2 minutes when speaking.",
    });
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Paste a mock HR/behavioral answer for scoring and feedback.</p>
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Paste your answer to a behavioral question (e.g. Tell me about a conflict...)..." className="input-field min-h-[120px]" />
      <button onClick={run} className="btn-primary" disabled={!answer.trim()}>Score answer</button>
      {result && (
        <div className="glass-card p-6">
          <p className="text-2xl font-bold text-cyan-400 mb-2">Score: {result.score}/100</p>
          <p className="text-gray-400">{result.feedback}</p>
        </div>
      )}
    </div>
  );
}
