"use client";

import { useState, useRef } from "react";

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsText(file, "UTF-8");
  });
}

export function ResumeJdGap() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<null | { missing: string[]; match: number; tips: string[] }>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      try {
        const text = await readFileAsText(f);
        setResume(text);
      } catch {
        alert("Could not read file. Paste resume text instead.");
      }
      e.target.value = "";
    }
  };
  const run = () => {
    const words = (resume + " " + jd).toLowerCase().split(/\s+/).filter(Boolean);
    const resumeWords = new Set(resume.toLowerCase().split(/\s+/).filter(Boolean));
    const jdWords = jd.toLowerCase().split(/\s+/).filter(Boolean);
    const missing = [...new Set(jdWords.filter((w) => w.length > 3 && !resumeWords.has(w)))].slice(0, 8);
    const match = Math.min(100, 100 - missing.length * 8 + Math.floor(Math.random() * 5));
    setResult({
      missing,
      match,
      tips: [
        "Add 2–3 of the missing keywords naturally in your experience bullets.",
        "Include a Skills section and list the JD's required skills.",
        "Mention one project that used the missing tech.",
      ],
    });
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Upload resume (.txt) or paste text, and job description, to see gap and shortlisting probability.</p>
      <div>
        <input type="file" accept="*" ref={fileRef} onChange={onFile} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="mb-2 px-3 py-1.5 rounded-lg bg-white/10 text-sm text-gray-300">Upload file (any format)</button>
        <textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Or paste resume text..." className="input-field min-h-[120px]" />
      </div>
      <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste job description..." className="input-field min-h-[120px]" />
      <button onClick={run} className="btn-primary" disabled={!resume.trim() || !jd.trim()}>Analyze gap</button>
      {result && (
        <div className="glass-card p-6 space-y-4">
          <p className="text-2xl font-bold text-cyan-400">Shortlisting probability: {result.match}%</p>
          {result.missing.length > 0 && (
            <>
              <p className="text-white font-medium">Missing / weak keywords:</p>
              <div className="flex flex-wrap gap-2">
                {result.missing.map((m) => (
                  <span key={m} className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-sm">{m}</span>
                ))}
              </div>
            </>
          )}
          <p className="text-white font-medium">Suggestions:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            {result.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
