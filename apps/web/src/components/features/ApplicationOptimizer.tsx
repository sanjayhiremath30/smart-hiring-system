"use client";

import { useState } from "react";

export function ApplicationOptimizer() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState<{ time: string; referral: string; letter: string } | null>(null);
  const run = () => {
    setResult({
      time: "Best window: Tuesday–Thursday 9–11 AM (recruiter activity peak). Avoid Mondays and Fridays.",
      referral: "Referral probability: Medium. Search LinkedIn for employees at the company and request an intro.",
      letter: "Dear Hiring Manager,\n\nI am writing to apply for the " + (role || "position") + ". My experience in [X] and [Y] aligns with your requirements. I am eager to contribute to [Company] and would welcome the opportunity to discuss further.\n\nSincerely,\n[Your name]",
    });
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Get best time to apply, referral tips, and a cover letter draft.</p>
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role you're applying for" className="input-field" />
      <button onClick={run} className="btn-primary">Get suggestions</button>
      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-cyan-400 font-medium mb-1">Best time to apply</p>
            <p className="text-gray-300 text-sm">{result.time}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white font-medium mb-1">Referral</p>
            <p className="text-gray-400 text-sm">{result.referral}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white font-medium mb-1">Cover letter draft</p>
            <pre className="text-gray-400 text-sm whitespace-pre-wrap mt-2">{result.letter}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
