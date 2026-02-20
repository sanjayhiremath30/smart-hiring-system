"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

type Question = {
  id?: string;
  q: string;
  options?: string[];
  correct?: string | number;
  type?: "mcq" | "coding" | "text";
};

export default function MockTestTakePage() {
  const params = useParams();
  const resolvedId = params?.id as string | undefined;
  const [test, setTest] = useState<{ id: string; type: string; title: string; questions: Question[]; durationMins?: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!resolvedId) return;
    fetch(`/api/mock-tests/${resolvedId}`)
      .then((r) => r.json())
      .then((data) => {
        setTest(data?.id ? data : null);
        if (data?.durationMins) setTimeLeft(data.durationMins * 60);
      })
      .catch(() => setTest(null))
      .finally(() => setLoaded(true));
  }, [resolvedId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;
    const t = setInterval(() => setTimeLeft((l) => (l != null && l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  const questions: Question[] = test?.questions && Array.isArray(test.questions) ? test.questions : [];
  const isMcq = test?.type === "aptitude" || test?.type === "hr";

  const submit = () => {
    if (!test || submitted) return;
    let correct = 0;
    questions.forEach((q, i) => {
      const ans = answers[i]?.toString().trim();
      const right = q.correct != null ? String(q.correct).trim().toLowerCase() : "";
      if (ans && right && ans.toLowerCase() === right) correct++;
    });
    const total = questions.length || 1;
    const scorePct = Math.round((correct / total) * 100);
    setScore(scorePct);
    setSubmitted(true);
    if (session?.user?.id) {
      fetch("/api/mock-tests/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id, score: scorePct, maxScore: 100, answers }),
      }).catch(() => {});
    }
  };

  if (!loaded) return <div className="max-w-2xl mx-auto px-4 py-12 text-gray-500">Loading...</div>;
  if (loaded && !test) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-gray-500">Test not found.</p>
        <Link href="/mock-test" className="text-cyan-400 mt-4 inline-block">← Mock Test Center</Link>
      </div>
    );
  }
  if (!test) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/mock-test" className="text-cyan-400 text-sm mb-6 inline-block">← Mock Test Center</Link>
      <div className="glass-card p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-white">{test.title}</h1>
          {timeLeft != null && !submitted && (
            <span className="text-cyan-400 font-mono">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>

        {!submitted ? (
          <>
            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={i} className="border-b border-white/10 pb-4">
                  <p className="text-white font-medium mb-2">{i + 1}. {q.q}</p>
                  {q.options && q.options.length > 0 ? (
                    <div className="space-y-2">
                      {q.options.map((opt, j) => (
                        <label key={j} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`q-${i}`}
                            checked={answers[i] === opt}
                            onChange={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                            className="accent-cyan-500"
                          />
                          <span className="text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      placeholder="Your answer..."
                      value={answers[i] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                      className="input-field min-h-[80px] mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={submit} className="btn-primary mt-8">
              Submit & see score
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-3xl font-bold text-cyan-400 mb-2">Score: {score}%</p>
            <p className="text-gray-400 mb-4">Result saved to your dashboard.</p>
            <Link href="/mock-test" className="btn-primary">Back to Mock Test Center</Link>
          </div>
        )}
      </div>
    </div>
  );
}
