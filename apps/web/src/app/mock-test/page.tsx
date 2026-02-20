"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MockTest = { id: string; type: string; title: string; description?: string; difficulty?: string; durationMins?: number };

export default function MockTestCenterPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mock-tests")
      .then((r) => r.json())
      .then((data) => setTests(Array.isArray(data) ? data : []))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const byType = (type: string) => tests.filter((t) => t.type === type);
  const types = [
    { id: "coding", label: "Coding Test", icon: "💻" },
    { id: "aptitude", label: "Aptitude Test", icon: "📐" },
    { id: "communication", label: "Communication Practice", icon: "🎤" },
    { id: "hr", label: "HR Interview Questions", icon: "👔" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-2">Mock Test Center</h1>
      <p className="text-gray-400 mb-8">
        Timed coding, aptitude, communication, and HR interview practice.
      </p>

      {loading && <div className="text-gray-500">Loading...</div>}

      {!loading && (
        <div className="grid gap-6 md:grid-cols-2">
          {types.map(({ id, label, icon }) => {
            const list = byType(id);
            return (
              <div key={id} className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                  <span>{icon}</span> {label}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {id === "coding" && "Timed coding problems, code editor, auto-evaluation."}
                  {id === "aptitude" && "MCQ questions, timer, auto scoring."}
                  {id === "communication" && "AI prompts, text response, grammar analysis."}
                  {id === "hr" && "Question bank, random questions, answer tips."}
                </p>
                {list.length === 0 ? (
                  <p className="text-gray-500 text-sm">No tests yet. Admin can add from Dashboard.</p>
                ) : (
                  <ul className="space-y-2">
                    {list.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/mock-test/${t.id}`}
                          className="text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          {t.title}
                        </Link>
                        {t.durationMins != null && (
                          <span className="text-gray-500 text-sm ml-2">{t.durationMins} min</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link href="/" className="inline-block mt-8 text-cyan-400 text-sm">← Back to Jobs</Link>
    </div>
  );
}
