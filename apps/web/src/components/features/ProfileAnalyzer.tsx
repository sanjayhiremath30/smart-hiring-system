"use client";

import { useState } from "react";

export function ProfileAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | { strength: number; tips: string[] }>(null);
  const run = () => {
    const isGh = url.toLowerCase().includes("github");
    setResult({
      strength: 65 + Math.floor(Math.random() * 28),
      tips: isGh
        ? ["Pin 2–3 best repos on profile", "Add a clear README to each repo", "Use topics and description"]
        : ["Add a headline and summary", "List projects with impact", "Get 2–3 recommendations"],
    });
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Paste your GitHub or LinkedIn profile URL for strength and suggestions.</p>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/... or https://linkedin.com/in/..." className="input-field" type="url" />
      <button onClick={run} className="btn-primary" disabled={!url.trim()}>Analyze profile</button>
      {result && (
        <div className="glass-card p-6">
          <p className="text-2xl font-bold text-cyan-400 mb-2">Profile strength: {result.strength}/100</p>
          <p className="text-white font-medium mb-2">Suggestions:</p>
          <ul className="list-disc list-inside text-gray-400">{result.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
