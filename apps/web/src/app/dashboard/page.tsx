"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { JOBS_DATASET, type JobListing } from "@/lib/jobsData";
import { loadJobTrackerPreferences, DEFAULT_PREFERENCES, type JobTrackerPreferences } from "@/lib/preferences";
import { computeMatchScore as computeMatchScoreFn } from "@/lib/matchScore";
import { getAllStatuses, setJobStatus, statusBadgeClass as statusBadgeClassFn, type JobStatus } from "@/lib/jobStatus";

const SAVED_JOBS_KEY = "likzz_saved_job_ids";
const PREFERENCES_KEY = "jobTrackerPreferences";

function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function toggleSaved(id: string): void {
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("storage"));
}

function postedLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/** Extract first number from salary string for sort (e.g. "6–10 LPA" -> 6, "₹15k–₹40k" -> 15). */
function salarySortValue(s: string): number {
  const match = s.match(/\d+(?:\.\d+)?/);
  const n = match ? parseFloat(match[0]) : 0;
  if (s.toLowerCase().includes("lpa")) return n;
  if (s.toLowerCase().includes("k")) return n / 1000;
  return n;
}

const computeMatchScore = computeMatchScoreFn;

function matchScoreBadgeClass(score: number): string {
  if (score >= 80) return "bg-green-500/20 text-green-400";
  if (score >= 60) return "bg-amber-500/20 text-amber-400";
  if (score >= 40) return "bg-slate-800 text-slate-300";
  return "bg-slate-900 border border-slate-800 text-slate-500";
}

function hasPreferencesSet(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREFERENCES_KEY) !== null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [experience, setExperience] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("Latest");
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"" | JobStatus>("");
  const [viewJob, setViewJob] = useState<JobListing | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, JobStatus>>({});
  const [toast, setToast] = useState("");
  const [prefs, setPrefs] = useState<JobTrackerPreferences>(DEFAULT_PREFERENCES);
  const [prefsMounted, setPrefsMounted] = useState(false);

  useEffect(() => {
    setSavedIds(getSavedIds());
    setStatusMap(getAllStatuses());
    const onStorage = () => {
      setSavedIds(getSavedIds());
      setPrefs(loadJobTrackerPreferences());
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

  useEffect(() => {
    setPrefs(loadJobTrackerPreferences());
    setPrefsMounted(true);
  }, []);

  useEffect(() => {
    if (!session) return;
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setApplications([]));
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, [session]);

  const [dbJobs, setDbJobs] = useState<JobListing[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  useEffect(() => {
    setLoadingDb(true);
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: JobListing[] = data.map((j: any) => ({
            id: j.id,
            title: j.title,
            company: j.company || "Likzz Partner",
            location: j.location || j.state || "Remote",
            mode: "Onsite", // Default for DB jobs
            experience: "Fresher", // Default for DB jobs
            skills: j.skills || [],
            source: "LinkedIn", // Label for DB jobs in this UI
            postedDaysAgo: Math.floor((Date.now() - new Date(j.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            salaryRange: j.salary || "Competitive",
            applyUrl: j.applyUrl || "/",
            description: j.description || "",
          }));
          setDbJobs(mapped);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingDb(false));
  }, []);

  const allJobs = useMemo(() => {
    // Merge DB jobs with mock dataset, putting DB jobs first
    return [...dbJobs, ...JOBS_DATASET];
  }, [dbJobs]);

  const jobsWithScore = useMemo(() => {
    return allJobs.map((job) => ({
      job,
      matchScore: computeMatchScore(job, prefs),
    }));
  }, [allJobs, prefs]);

  const filteredJobs = useMemo(() => {
    let list = jobsWithScore.slice();
    const kw = keyword.trim().toLowerCase();
    if (kw) {
      list = list.filter(
        (x) =>
          x.job.title.toLowerCase().includes(kw) ||
          x.job.company.toLowerCase().includes(kw)
      );
    }
    if (location) list = list.filter((x) => x.job.location === location);
    if (mode) list = list.filter((x) => x.job.mode === mode);
    if (experience) list = list.filter((x) => x.job.experience === experience);
    if (source) list = list.filter((x) => x.job.source === source);
    if (showOnlyMatches) list = list.filter((x) => x.matchScore >= prefs.minMatchScore);
    if (statusFilter) {
      list = list.filter((x) => (statusMap[x.job.id] || "Not Applied") === statusFilter);
    }
    if (sort === "Latest") list.sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo);
    else if (sort === "Oldest") list.sort((a, b) => b.job.postedDaysAgo - a.job.postedDaysAgo);
    else if (sort === "Match Score") list.sort((a, b) => b.matchScore - a.matchScore);
    else if (sort === "Salary") list.sort((a, b) => salarySortValue(b.job.salaryRange) - salarySortValue(a.job.salaryRange));
    return list;
  }, [jobsWithScore, keyword, location, mode, experience, source, showOnlyMatches, statusFilter, statusMap, prefs.minMatchScore, sort]);

  const locations = useMemo(() => [...new Set(allJobs.map((j) => j.location))].sort(), [allJobs]);
  const modes = ["Remote", "Hybrid", "Onsite"];
  const experiences = ["Fresher", "0-1", "1-3", "3-5"];
  const sourcesList = ["LinkedIn", "Naukri", "Indeed"];

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-cyan-500/90 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
      <h1 className="text-3xl font-black gradient-text mb-2">My Dashboard</h1>
      <p className="text-slate-400 mb-8 font-medium">Jobs, applications, and notifications</p>

      {prefsMounted && !hasPreferencesSet() && (
        <div className="glass-card p-4 mb-6 border-blue-500/30 bg-blue-500/5">
          <p className="text-slate-300 font-medium">
            Set your preferences to activate intelligent matching.
          </p>
          <Link href="/settings" className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block font-bold">
            Go to Settings →
          </Link>
        </div>
      )}

      {/* Filter bar */}
      <section className="glass-card p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <input
            type="text"
            placeholder="Keyword (title / company)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-field max-w-[200px] py-2 text-sm"
          />
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-field max-w-[140px] py-2 text-sm" style={{ colorScheme: "dark" }}>
            <option value="">Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="input-field max-w-[120px] py-2 text-sm" style={{ colorScheme: "dark" }}>
            <option value="">Mode</option>
            {modes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field max-w-[120px] py-2 text-sm" style={{ colorScheme: "dark" }}>
            <option value="">Experience</option>
            {experiences.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="input-field max-w-[120px] py-2 text-sm" style={{ colorScheme: "dark" }}>
            <option value="">Source</option>
            {sourcesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field max-w-[120px] py-2 text-sm" style={{ colorScheme: "dark" }}>
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
            <option value="Match Score">Match Score</option>
            <option value="Salary">Salary</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "" | JobStatus)} className="input-field max-w-[140px] py-2 text-sm" style={{ colorScheme: "dark" }}>
            <option value="">Status</option>
            <option value="Not Applied">Not Applied</option>
            <option value="Applied">Applied</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>
        </div>
        <label className="flex items-center gap-2 mt-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={showOnlyMatches}
            onChange={(e) => setShowOnlyMatches(e.target.checked)}
            className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium">Show only jobs above my threshold</span>
        </label>
      </section>

      {/* Job cards */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Recommended jobs ({filteredJobs.length})</h2>
        {filteredJobs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-black text-slate-100 mb-2">No roles match your criteria.</h3>
            <p className="text-slate-500 mb-6 font-medium">Adjust filters or lower threshold.</p>
            <button
              onClick={() => { setKeyword(""); setLocation(""); setMode(""); setExperience(""); setSource(""); setShowOnlyMatches(false); setStatusFilter(""); }}
              className="text-blue-400 hover:text-blue-300 text-sm font-bold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map(({ job, matchScore }) => {
              const status = statusMap[job.id] || "Not Applied";
              return (
                <div key={job.id} className="glass-card p-5 border-slate-800 hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-black text-slate-100 text-lg leading-tight">{job.title}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${matchScoreBadgeClass(matchScore)}`}>
                        {matchScore}%
                      </span>
                      <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter bg-blue-600/20 text-blue-400 border border-blue-500/20">{job.source}</span>
                    </div>
                  </div>
                  <p className="text-blue-400 text-sm mb-1 font-bold">{job.company}</p>
                  <p className="text-slate-500 text-sm mb-1 font-medium">{job.location} · {job.mode}</p>
                  <p className="text-slate-400 text-sm mb-2 font-medium">Exp: {job.experience} · {job.salaryRange}</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">{postedLabel(job.postedDaysAgo)}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(["Not Applied", "Applied", "Rejected", "Selected"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setJobStatus(job.id, s, { title: job.title, company: job.company });
                          setStatusMap(getAllStatuses());
                          setToast(`Status updated: ${s}`);
                        }}
                        className={`px-2 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-tight transition-colors ${status === s ? statusBadgeClassFn(s) : "bg-slate-950 text-slate-500 hover:bg-slate-800"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-black uppercase border border-slate-700">{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewJob(job)} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-100 text-xs font-black uppercase hover:bg-slate-700 transition-colors">View</button>
                    <button
                      onClick={() => { toggleSaved(job.id); setSavedIds(getSavedIds()); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-colors ${savedIds.includes(job.id) ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-100 hover:bg-slate-700"}`}
                    >
                      {savedIds.includes(job.id) ? "Saved" : "Save"}
                    </button>
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-xl bg-blue-600/20 text-blue-400 text-xs font-black uppercase text-center border border-blue-500/20 hover:bg-blue-600/30 transition-colors">Apply</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* View modal */}
      {viewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setViewJob(null)}>
          <div className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-black text-slate-100 mb-2">{viewJob.title}</h3>
            <p className="text-blue-400 font-bold mb-2">{viewJob.company}</p>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed font-medium">{viewJob.description}</p>
            <p className="text-slate-100 font-black uppercase text-[10px] tracking-widest mb-2">Skills Required:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {viewJob.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">{s}</span>
              ))}
            </div>
            <button onClick={() => setViewJob(null)} className="btn-primary w-full">Close</button>
          </div>
        </div>
      )}

      {/* Notifications */}
      <section className="glass-card p-6 mb-8">
        <h2 className="text-xl font-black text-slate-100 mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-slate-500 font-medium">No notifications yet.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 rounded-xl border transition-colors ${n.read ? "bg-slate-950 border-slate-800" : "bg-blue-600/10 border-blue-500/20 shadow-lg shadow-blue-500/5"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-slate-100">{n.title}</p>
                    <p className="text-sm text-slate-400 mt-1 font-medium">{n.message}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="text-xs font-black uppercase text-blue-400 hover:text-blue-300 tracking-tight transition-colors">Mark read</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Applications (from API) */}
      <section className="glass-card p-6">
        <h2 className="text-xl font-black text-slate-100 mb-4">My Applications</h2>
        {applications.length === 0 ? (
          <p className="text-slate-500 font-medium mb-4">You haven&apos;t applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <p className="font-black text-slate-100">{app.job?.title}</p>
                <p className="text-sm text-slate-400 font-medium">{app.job?.company}</p>
                <span className={`inline-block mt-3 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${app.status === "APPROVED" ? "bg-green-500/20 text-green-400" : app.status === "REJECTED" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <Link href="/" className="btn-primary">Browse Jobs</Link>
          <Link href="/saved" className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15">Saved Jobs</Link>
        </div>
      </section>
    </div>
  );
}
