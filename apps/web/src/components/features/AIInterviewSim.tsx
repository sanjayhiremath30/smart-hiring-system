"use client";

import { useState } from "react";

const QUESTIONS = [
  "Tell me about yourself and your background.",
  "Describe a challenging project you worked on.",
  "How do you handle disagreements in a team?",
  "Where do you see yourself in 3 years?",
];

export function AIInterviewSim() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const submit = () => {
    setFeedback([
      "Good structure. Try adding a number (e.g. “improved load time by 40%”).",
      "Confidence: High. Keep eye contact and pace.",
    ]);
  };
  if (step >= QUESTIONS.length) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-cyan-400 font-semibold mb-2">Round complete</p>
        <p className="text-gray-400 mb-4">You answered {QUESTIONS.length} questions. Review feedback below.</p>
        <button onClick={() => { setStep(0); setAnswer(""); setFeedback([]); }} className="btn-primary">Start again</button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Mock interview: answer the question; you’ll get brief AI-style feedback.</p>
      <div className="glass-card p-6">
        <p className="text-sm text-gray-500 mb-2">Question {step + 1} of {QUESTIONS.length}</p>
        <p className="text-white text-lg mb-4">{QUESTIONS[step]}</p>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." className="input-field min-h-[120px]" />
        <div className="flex gap-3 mt-4">
          <button onClick={submit} className="btn-primary">Submit & get feedback</button>
          <button onClick={() => { setStep((s) => s + 1); setAnswer(""); setFeedback([]); }} className="px-4 py-2 rounded-xl bg-white/10 text-white">Next question</button>
        </div>
      </div>
      {feedback.length > 0 && (
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-cyan-400 font-medium mb-2">Feedback</p>
          <ul className="list-disc list-inside text-gray-400">{feedback.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
