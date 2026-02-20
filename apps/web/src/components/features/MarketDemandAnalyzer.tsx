"use client";

import { TRENDING_SKILLS, SALARY_BY_ROLE } from "@/lib/featureData";

export function MarketDemandAnalyzer() {
  const roles = Object.entries(SALARY_BY_ROLE);
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4">🔥 Trending skills (demand score)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b-2 border-slate-100">
                <th className="pb-3 pr-4 font-black uppercase tracking-tighter">Skill</th>
                <th className="pb-3 pr-4 font-black uppercase tracking-tighter">Demand</th>
                <th className="pb-3 pr-4 font-black uppercase tracking-tighter">Growth</th>
                <th className="pb-3 font-black uppercase tracking-tighter">Salary range</th>
              </tr>
            </thead>
            <tbody>
              {TRENDING_SKILLS.map((r) => (
                <tr key={r.skill} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pr-4 text-slate-900 font-bold">{r.skill}</td>
                  <td className="py-4 pr-4">
                    <span className="text-blue-600 font-black">{r.demand}</span>
                    <span className="text-slate-400 font-bold">/100</span>
                  </td>
                  <td className="py-4 pr-4 text-emerald-600 font-black">{r.growth}</td>
                  <td className="py-4 text-slate-500 font-bold">{r.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4">💰 Salary prediction by role</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map(([role, salary]) => (
            <div
              key={role}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-sm hover:border-blue-300 transition-all"
            >
              <span className="text-slate-900 font-bold">{role}</span>
              <span className="text-blue-600 font-black tracking-tight">{salary}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4">📊 Skill demand heatmap (top skills)</h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SKILLS.map((r) => {
            const intensity = r.demand / 100;
            const bg = intensity > 0.9 ? "bg-emerald-600" : intensity > 0.7 ? "bg-blue-600" : "bg-slate-200 text-slate-700";
            const textColor = intensity > 0.7 ? "text-white" : "text-slate-700";
            return (
              <span
                key={r.skill}
                className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm ${bg} ${textColor}`}
                title={`Demand: ${r.demand}`}
              >
                {r.skill} ({r.demand})
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
