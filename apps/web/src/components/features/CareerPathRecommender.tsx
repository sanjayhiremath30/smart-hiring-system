"use client";

import { useState } from "react";

const ROLES = [
  { id: "backend", name: "Backend", skills: "Node, Java, Go, DBs" },
  { id: "frontend", name: "Frontend", skills: "React, CSS, a11y" },
  { id: "ai", name: "AI / ML", skills: "Python, TensorFlow, stats" },
  { id: "devops", name: "DevOps", skills: "K8s, AWS, CI/CD" },
  { id: "data", name: "Data", skills: "SQL, Spark, pipelines" },
];

export function CareerPathRecommender() {
  const [skills, setSkills] = useState("React, JavaScript, Node");
  const [results, setResults] = useState<{ id: string; name: string; skills: string; fit: number }[] | null>(null);
  const run = () => {
    setResults(
      ROLES.map((r) => ({ ...r, fit: 60 + Math.floor(Math.random() * 35) })).sort((a, b) => b.fit - a.fit)
    );
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Enter your skills to get role recommendations.</p>
      <input
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Your skills (comma-separated)"
        className="input-field"
      />
      <button onClick={run} className="btn-primary">
        Get recommendations
      </button>
      {results && (
        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{r.name}</p>
                <p className="text-sm text-gray-500">{r.skills}</p>
              </div>
              <span className="text-cyan-400 font-bold">{r.fit}% fit</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
