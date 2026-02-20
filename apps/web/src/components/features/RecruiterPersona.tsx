"use client";

import { useState } from "react";
import { RECRUITER_PERSONAS } from "@/lib/featureData";

type PersonaKey = keyof typeof RECRUITER_PERSONAS;

export function RecruiterPersona() {
  const [persona, setPersona] = useState<PersonaKey>("STARTUP");
  const p = RECRUITER_PERSONAS[persona];
  return (
    <div className="space-y-8">
      <p className="text-gray-400">
        Different recruiters evaluate differently. Select a persona to see typical questions and evaluation style.
      </p>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Recruiter type</label>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(RECRUITER_PERSONAS) as PersonaKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setPersona(key)}
              className={`px-4 py-2 rounded-xl text-sm ${persona === key ? "bg-cyan-500/30 text-cyan-300" : "bg-white/10 text-gray-400 hover:text-white"}`}
            >
              {RECRUITER_PERSONAS[key].name}
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card p-6">
        <h4 className="text-white font-semibold mb-2">Mindset</h4>
        <p className="text-gray-400 mb-4">{p.mindset}</p>
        <h4 className="text-white font-semibold mb-2">Sample interview questions</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {p.questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-cyan-400">Evaluation style: {p.evalStyle}</p>
      </div>
    </div>
  );
}
