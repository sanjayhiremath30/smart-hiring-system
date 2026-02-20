"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ALL_LOCATIONS } from "@/lib/constants";

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
  company?: string;
  location?: string;
  state?: string;
  salary?: string;
  skills?: string[];
  applyUrl?: string | null;
};

export default function Home() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");

  function loadJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (stateFilter) params.set("state", stateFilter);
    if (skillsFilter) params.set("skills", skillsFilter);
    const url = params.toString() ? `/api/jobs?${params}` : "/api/jobs";
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load jobs");
        return r.json();
      })
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load jobs. Try again or clear filters.");
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadJobs();
  }, [stateFilter, skillsFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center py-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent -z-10 blur-3xl rounded-full" />
        <h1 className="text-5xl md:text-7xl font-black mb-6 font-serif tracking-tight leading-tight">
          <span className="gradient-text">Likzz Smart Hiring</span>
          <br />
          <span className="text-slate-100">Experience Job Discovery v2</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-10 font-medium text-slate-400">
          Find your next career move across India with our integrated AI toolset.
        </p>
      </section>

      {/* Quick Launch Tools */}
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center">
        <span className="px-3">Career Catalyst Hub</span>
        <div className="flex-1 h-[1px] bg-slate-800" />
      </h3>

      <section className="grid gap-6 md:grid-cols-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="glass-card p-6 border border-slate-800 hover:border-blue-600 transition-all group scale-95 hover:scale-100 duration-300">
          <h4 className="font-black text-slate-100 mb-1">Job Discovery</h4>
          <p className="text-[10px] text-slate-400 mb-3">Skill-based search</p>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Explore →</span>
        </Link>
        <Link href="/placement/dashboard" className="glass-card p-6 border border-slate-800 hover:border-blue-600 transition-all group scale-95 hover:scale-100 duration-300">
          <h4 className="font-black text-slate-100 mb-1">Placement Prep</h4>
          <p className="text-[10px] text-slate-400 mb-3">Mock plans & JD analysis</p>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Prep Now →</span>
        </Link>
        <Link href="/mock-test" className="glass-card p-6 border border-slate-800 hover:border-amber-600 transition-all group scale-95 hover:scale-100 duration-300">
          <h4 className="font-black text-slate-100 mb-1">Mock Interviews</h4>
          <p className="text-[10px] text-slate-400 mb-3">AI practice simulations</p>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Practice →</span>
        </Link>
        <Link href="/rb" className="glass-card p-6 border border-slate-800 hover:border-rose-600 transition-all group scale-95 hover:scale-100 duration-300">
          <h4 className="font-black text-slate-100 mb-1">AI Resume Builder</h4>
          <p className="text-[10px] text-slate-400 mb-3">ATS scoring & exports</p>
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Build →</span>
        </Link>
      </section>

      {/* Filters Overlay */}
      <section className="glass-card p-8 mb-12 border-slate-800 bg-slate-900/50 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl text-blue-100" />

        <div className="flex items-center space-x-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Advanced Skill Search</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">State / Location</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="input-field rounded-2xl bg-slate-950/80 backdrop-blur-sm border-slate-700 text-slate-100"
              style={{ colorScheme: "dark" }}
            >
              <option value="">All states</option>
              {ALL_LOCATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Skills Requirement</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="input-field rounded-2xl bg-slate-950/80 backdrop-blur-sm border-slate-700 text-slate-100"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStateFilter("");
                setSkillsFilter("");
              }}
              className="px-6 py-3 rounded-2xl text-xs font-black text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Admin posted jobs (always visible, from API) */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif" style={{ color: "var(--text-primary)" }}>Admin posted jobs</h2>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm transition-opacity hover:opacity-80" style={{ color: "var(--accent)" }}>
              Post a Job →
            </Link>
          )}
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4 w-3/4" />
                <div className="h-4 bg-white/10 rounded mb-2 w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-card p-6 text-center">
            <p style={{ color: "var(--accent)" }}>{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="mb-2" style={{ color: "var(--text-muted)" }}>No admin-posted jobs yet.</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Clear filters above to see all, or post jobs from Admin.</p>
            <button onClick={() => { setStateFilter(""); setSkillsFilter(""); loadJobs(); }} className="text-sm transition-opacity hover:opacity-80" style={{ color: "var(--accent)" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} session={session} onApplySuccess={loadJobs} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

function JobCard({
  job,
  session,
  onApplySuccess,
}: {
  job: Job;
  session: any;
  onApplySuccess: () => void;
}) {
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [submitting, setSubmitting] = useState(false);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in your name and email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, name, email }),
      });
      if (res.ok) {
        alert("Application Submitted Successfully!");
        if (!session) {
          setName("");
          setEmail("");
        }
        onApplySuccess();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to submit. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card p-6 transition-all group" style={{ transitionDuration: "150ms" }}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold transition-colors group-hover:opacity-90" style={{ color: "var(--text-primary)" }}>
          {job.title}
        </h3>
        <span className="px-2 py-1 text-xs rounded-full opacity-90" style={{ background: "rgba(139,0,0,0.12)", color: "var(--accent)" }}>
          {job.status}
        </span>
      </div>
      {job.company && <p className="text-sm mb-1" style={{ color: "var(--accent)" }}>{job.company}</p>}
      {(job.state || job.location) && (
        <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>📍 {[job.state, job.location].filter(Boolean).join(", ")}</p>
      )}
      {job.salary && (
        <p className="text-sm mb-2" style={{ color: "var(--success)" }}>💰 {job.salary}</p>
      )}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.skills.map((s) => (
            <span key={s} className="px-2 py-0.5 text-xs rounded border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              {s}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm mb-4 line-clamp-3" style={{ color: "var(--text-muted)" }}>{job.description}</p>

      {job.applyUrl ? (
        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="w-full btn-primary py-2.5 text-sm inline-block text-center">
            Apply externally →
          </a>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field text-sm py-2"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field text-sm py-2"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-2 text-sm disabled:opacity-50"
          >
            {submitting ? "Applying..." : "Apply Now"}
          </button>
        </form>
      )}
    </div>
  );
}
