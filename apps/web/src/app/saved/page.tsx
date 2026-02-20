"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JOBS_DATASET, type JobListing } from "@/lib/jobsData";
import { getAllStatuses, setJobStatus, statusBadgeClass, type JobStatus } from "@/lib/jobStatus";

const SAVED_JOBS_KEY = "likzz_saved_job_ids";

function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function removeSaved(id: string): void {
  const ids = getSavedIds().filter((x) => x !== id);
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("storage"));
}

function postedLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function SavedPage() {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [viewJob, setViewJob] = useState<JobListing | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, JobStatus>>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const ids = getSavedIds();
    setSavedJobs(JOBS_DATASET.filter((j) => ids.includes(j.id)));
    setStatusMap(getAllStatuses());
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const ids = getSavedIds();
      setSavedJobs(JOBS_DATASET.filter((j) => ids.includes(j.id)));
      setStatusMap(getAllStatuses());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const removeAndRefresh = (id: string) => {
    removeSaved(id);
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  if (savedJobs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-12">
          <div className="text-6xl mb-6 opacity-80">📌</div>
          <h2 className="text-2xl font-bold text-white mb-2">No saved jobs yet</h2>
          <p className="text-gray-400 mb-8">
            Save jobs from your Dashboard to see them here. You can apply later with one click.
          </p>
          <Link href="/dashboard" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-cyan-500/90 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold gradient-text">Saved Jobs</h1>
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm">← Dashboard</Link>
      </div>
      <p className="text-gray-400 mb-6">{savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedJobs.map((job) => {
          const status = statusMap[job.id] || "Not Applied";
          return (
            <div key={job.id} className="glass-card p-5 hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white text-lg leading-tight">{job.title}</h3>
                <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400">{job.source}</span>
              </div>
              <p className="text-cyan-400 text-sm mb-1">{job.company}</p>
              <p className="text-gray-500 text-sm mb-1">{job.location} · {job.mode}</p>
              <p className="text-gray-400 text-sm mb-2">Exp: {job.experience} · {job.salaryRange}</p>
              <p className="text-gray-500 text-xs mb-3">{postedLabel(job.postedDaysAgo)}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(["Not Applied", "Applied", "Rejected", "Selected"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setJobStatus(job.id, s, { title: job.title, company: job.company });
                      setStatusMap(getAllStatuses());
                      setToast(`Status updated: ${s}`);
                    }}
                    className={`px-2 py-1 rounded text-xs ${status === s ? statusBadgeClass(s) : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-white/10 text-gray-400 text-xs">{s}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewJob(job)} className="flex-1 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/15">View</button>
                <button onClick={() => removeAndRefresh(job.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30">Remove</button>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm text-center hover:bg-cyan-500/30">Apply</a>
              </div>
            </div>
          );
        })}
      </div>

      {viewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setViewJob(null)}>
          <div className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-white mb-2">{viewJob.title}</h3>
            <p className="text-cyan-400 mb-2">{viewJob.company}</p>
            <p className="text-gray-400 text-sm mb-4">{viewJob.description}</p>
            <p className="text-white font-medium mb-1">Skills:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {viewJob.skills.map((s) => (
                <span key={s} className="px-2 py-1 rounded bg-white/10 text-gray-300 text-sm">{s}</span>
              ))}
            </div>
            <button onClick={() => setViewJob(null)} className="btn-primary w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
