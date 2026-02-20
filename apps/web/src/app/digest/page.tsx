"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JOBS_DATASET } from "@/lib/jobsData";
import { loadJobTrackerPreferences } from "@/lib/preferences";
import { computeMatchScore } from "@/lib/matchScore";
import { getStatusLog } from "@/lib/jobStatus";

const PREFERENCES_KEY = "jobTrackerPreferences";

function digestStorageKey(date: string): string {
  return `jobTrackerDigest_${date}`;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

type DigestJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  matchScore: number;
  applyUrl: string;
};

function buildDigestJobs(): DigestJob[] {
  const prefs = loadJobTrackerPreferences();
  const withScore = JOBS_DATASET.map((job) => ({
    job,
    matchScore: computeMatchScore(job, prefs),
  }));
  withScore.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.job.postedDaysAgo - b.job.postedDaysAgo;
  });
  return withScore.slice(0, 10).map(({ job, matchScore }) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    experience: job.experience,
    matchScore,
    applyUrl: job.applyUrl,
  }));
}

function formatDigestPlainText(jobs: DigestJob[], date: string): string {
  const lines = [
    "Top 10 Jobs For You — 9AM Digest",
    date,
    "",
    ...jobs.map(
      (j) =>
        `${j.title} | ${j.company} | ${j.location} | Exp: ${j.experience} | Match: ${j.matchScore}\n${j.applyUrl}`
    ),
    "",
    "This digest was generated based on your preferences.",
  ];
  return lines.join("\n");
}

export default function DigestPage() {
  const [digest, setDigest] = useState<DigestJob[] | null>(null);
  const [date, setDate] = useState("");
  const [prefsSet, setPrefsSet] = useState<boolean | null>(null);
  const [statusLog, setStatusLog] = useState<ReturnType<typeof getStatusLog>>([]);

  useEffect(() => {
    setPrefsSet(localStorage.getItem(PREFERENCES_KEY) !== null);
    setDate(todayDate());
    const key = digestStorageKey(todayDate());
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw) as { date: string; jobs: DigestJob[] };
        setDigest(data.jobs || []);
        return;
      } catch {
        // fall through to generate
      }
    }
    if (localStorage.getItem(PREFERENCES_KEY) !== null) {
      const jobs = buildDigestJobs();
      setDigest(jobs);
      localStorage.setItem(key, JSON.stringify({ date: todayDate(), jobs }));
    } else {
      setDigest([]);
    }
  }, []);

  useEffect(() => {
    setStatusLog(getStatusLog());
    const onStorage = () => setStatusLog(getStatusLog());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const generateDigest = () => {
    if (localStorage.getItem(PREFERENCES_KEY) === null) return;
    const d = todayDate();
    const key = digestStorageKey(d);
    const existing = localStorage.getItem(key);
    if (existing) {
      try {
        const data = JSON.parse(existing) as { date: string; jobs: DigestJob[] };
        setDigest(data.jobs || []);
        setDate(d);
        return;
      } catch {
        // fall through to regenerate
      }
    }
    const jobs = buildDigestJobs();
    setDigest(jobs);
    setDate(d);
    localStorage.setItem(key, JSON.stringify({ date: d, jobs }));
  };

  if (prefsSet === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass-card p-8 text-center">Loading…</div>
      </div>
    );
  }

  if (!prefsSet) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass-card p-8 text-center">
          <h1 className="text-xl font-semibold text-white mb-4">Set preferences to generate a personalized digest.</h1>
          <Link href="/settings" className="btn-primary inline-block">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  const noMatches = digest && digest.length === 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm">← Dashboard</Link>
        <button onClick={generateDigest} className="btn-primary text-sm">
          Generate Today&apos;s 9AM Digest (Simulated)
        </button>
      </div>

      <p className="text-gray-500 text-xs mb-6">
        Demo Mode: Daily 9AM trigger simulated manually.
      </p>

      {noMatches ? (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-400">No matching roles today. Check again tomorrow.</p>
        </div>
      ) : digest && digest.length > 0 ? (
        <div className="bg-[#F7F6F3] rounded-lg p-8" style={{ background: "#F7F6F3" }}>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <header className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-serif font-bold text-[#111111]">
                Top 10 Jobs For You — 9AM Digest
              </h1>
              <p className="text-gray-500 text-sm mt-1">Today&apos;s Date: {date}</p>
            </header>

            <ul className="space-y-6">
              {digest.map((j) => (
                <li key={j.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h2 className="font-semibold text-[#111111]">{j.title}</h2>
                      <p className="text-gray-600 text-sm">{j.company}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {j.location} · Exp: {j.experience} · Match: {j.matchScore}
                      </p>
                    </div>
                    <a
                      href={j.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-600 text-sm font-medium hover:bg-cyan-500/30"
                    >
                      Apply
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="mt-8 pt-4 border-t border-gray-200 text-gray-500 text-sm">
              This digest was generated based on your preferences.
            </footer>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const text = formatDigestPlainText(digest, date);
                  navigator.clipboard.writeText(text);
                }}
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-700 border border-gray-300 text-sm hover:bg-gray-100"
              >
                Copy Digest to Clipboard
              </button>
              <a
                href={`mailto:?subject=${encodeURIComponent("My 9AM Job Digest")}&body=${encodeURIComponent(formatDigestPlainText(digest, date))}`}
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-700 border border-gray-300 text-sm hover:bg-gray-100 inline-block"
              >
                Create Email Draft
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {statusLog.length > 0 && (
        <section className="mt-10 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Status Updates</h2>
          <ul className="space-y-3">
            {statusLog.slice(0, 10).map((entry, i) => (
              <li key={`${entry.jobId}-${entry.dateChanged}-${i}`} className="text-sm text-gray-300">
                <span className="font-medium text-white">{entry.title}</span> · {entry.company} ·{" "}
                <span className={
                  entry.status === "Selected" ? "text-green-400" :
                  entry.status === "Applied" ? "text-blue-400" :
                  entry.status === "Rejected" ? "text-red-400" : "text-gray-400"
                }>{entry.status}</span>
                {" "}· {new Date(entry.dateChanged).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
