"use client";

import { useState, useRef } from "react";

function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsText(file, "UTF-8");
  });
}

function computeAtsScore(text: string): { score: number; feedback: { label: string; pass: boolean; tip: string }[] } {
  const t = text.toLowerCase();
  const hasContact = /\b(email|@|phone|mobile)\b/i.test(t);
  const hasExperience = /\b(experience|work|intern|project)\b/i.test(t);
  const hasSkills = /\b(skill|technical|proficient)\b/i.test(t);
  const hasEducation = /\b(education|degree|b\.?tech|b\.?e\.?|graduation)\b/i.test(t);
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  const lengthOk = wordCount >= 150 && wordCount <= 600;
  const bulletPoints = (t.match(/^[\s]*[•\-*]\s/gm) || []).length;
  const structureOk = bulletPoints >= 3 || t.includes("experience") || t.includes("education");

  const feedback = [
    { label: "Contact info", pass: hasContact, tip: "Include email and phone." },
    { label: "Experience / projects", pass: hasExperience, tip: "List experience or projects clearly." },
    { label: "Skills section", pass: hasSkills, tip: "Add a Skills or Technical section." },
    { label: "Education", pass: hasEducation, tip: "Mention degree and institution." },
    { label: "Length (150–600 words)", pass: lengthOk, tip: "Keep resume concise but complete." },
    { label: "Structure / bullets", pass: structureOk, tip: "Use bullets for readability." },
  ];
  const passCount = feedback.filter((f) => f.pass).length;
  const score = Math.min(100, Math.round(40 + (passCount / feedback.length) * 55));
  return { score, feedback };
}

export function ResumeAtsScoring() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<null | { score: number; feedback: { label: string; pass: boolean; tip: string }[] }>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setResult(null);
      if (!text.trim() || (file.type && !file.type.startsWith("text/"))) {
        setUploadError("For PDF or images, paste the extracted text below.");
      }
    } catch (err) {
      setUploadError("Could not read file. Paste resume text below instead.");
    }
    e.target.value = "";
  };

  const run = () => {
    if (!resumeText.trim()) {
      setUploadError("Paste resume text or upload a .txt file.");
      return;
    }
    setUploadError("");
    setResult(computeAtsScore(resumeText));
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-400">
        Get an ATS (Applicant Tracking System) score. Upload a file of any format or paste text for analysis.
      </p>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Upload a file (any format) or paste text below</label>
        <input
          type="file"
          accept="*"
          onChange={handleFile}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-3 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-gray-300 hover:bg-white/15"
        >
          Upload file (any format)
        </button>
        <textarea
          value={resumeText}
          onChange={(e) => { setResumeText(e.target.value); setResult(null); }}
          placeholder="Paste resume text here (or upload .txt above)..."
          className="input-field min-h-[180px]"
        />
        {uploadError && <p className="text-red-400 text-sm mt-1">{uploadError}</p>}
      </div>
      <button onClick={run} className="btn-primary" disabled={!resumeText.trim()}>
        Get ATS score
      </button>
      {result && (
        <div className="glass-card p-6 space-y-4">
          <p className="text-3xl font-bold text-cyan-400">ATS Score: {result.score}/100</p>
          <p className="text-gray-400 text-sm">
            {result.score >= 70 ? "Good ATS compatibility." : "Improve sections below to pass more ATS filters."}
          </p>
          <div className="space-y-2">
            {result.feedback.map((f) => (
              <div
                key={f.label}
                className={`p-3 rounded-lg text-sm ${f.pass ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}
              >
                <span className={f.pass ? "text-green-400" : "text-amber-400"}>{f.label}:</span>{" "}
                {f.pass ? "OK" : f.tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
