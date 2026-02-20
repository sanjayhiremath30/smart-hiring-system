"use client";

import { useState } from "react";
import { SKILLS_DYING_2028, ROLES_GROWING_2028, COUNTRY_DEMAND } from "@/lib/featureData";

export function SkillMigrationPredictor() {
  const [skill, setSkill] = useState("React");
  const [score, setScore] = useState<number | null>(null);
  // Deterministic score from skill string (same skill = same score every time)
  const run = () => {
    const dying = SKILLS_DYING_2028.find((s) => s.skill.toLowerCase().includes(skill.trim().toLowerCase()));
    if (dying) {
      setScore(dying.relevance);
      return;
    }
    let h = 0;
    const s = skill.trim().toLowerCase();
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const stable = 50 + (h % 46); // 50–95, same input = same output
    setScore(stable);
  };
  return (
    <div className="space-y-8">
      <p className="text-slate-600 font-medium">
        Which skills will decline, which roles will grow, and your skill relevance for 2028.
      </p>
      <div>
        <label className="block text-sm text-slate-500 font-bold mb-2 uppercase tracking-tight">Your primary skill (for 2028 relevance)</label>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="e.g. React, Python, Java"
          className="input-field max-w-md"
        />
        <button onClick={run} className="btn-primary mt-3">
          Get 2028 relevance score
        </button>
      </div>
      {score !== null && (
        <div className="glass-card p-6 border-blue-500/30 bg-blue-50/50">
          <h4 className="text-slate-900 font-bold mb-2">📈 Your skill relevance score for 2028</h4>
          <p className="text-4xl font-black text-blue-600">{score}/100</p>
          <p className="text-slate-600 font-medium mt-2">
            {score >= 70 ? "Strong relevance. Keep upskilling in this area." : "Consider adding adjacent skills or pivoting."}
          </p>
        </div>
      )}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-3">Skills likely to decline by 2028</h3>
        <div className="space-y-2">
          {SKILLS_DYING_2028.map((s) => (
            <div key={s.skill} className="p-3 rounded-xl bg-red-50 border border-red-100 flex justify-between items-center shadow-sm">
              <span className="text-slate-900 font-bold">{s.skill}</span>
              <span className="text-red-600 text-xs font-black">Relevance {s.relevance}% — {s.reason}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-3">Roles that will grow</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES_GROWING_2028.map((r) => (
            <div key={r.role} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm transition-all hover:scale-[1.02]">
              <p className="text-slate-900 font-black">{r.role}</p>
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-tight">{r.growth} growth · Demand: {r.demand}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-3">Country demand (sample)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b-2 border-slate-100">
                <th className="pb-3 pr-4 font-black uppercase tracking-tighter">Country</th>
                <th className="pb-3 pr-4 font-black uppercase tracking-tighter">Skill in demand</th>
                <th className="pb-3 font-black uppercase tracking-tighter">Trend</th>
              </tr>
            </thead>
            <tbody>
              {COUNTRY_DEMAND.map((c) => (
                <tr key={c.country} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 text-slate-900 font-bold">{c.country}</td>
                  <td className="py-3 text-blue-600 font-black">{c.skill}</td>
                  <td className="py-3 text-emerald-600 font-black">{c.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
