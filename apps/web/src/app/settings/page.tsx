"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JOB_LOCATIONS } from "@/lib/jobsData";
import {
  loadJobTrackerPreferences,
  saveJobTrackerPreferences,
  type JobTrackerPreferences,
  DEFAULT_PREFERENCES,
} from "@/lib/preferences";

const MODES: ("Remote" | "Hybrid" | "Onsite")[] = ["Remote", "Hybrid", "Onsite"];
const EXPERIENCE_LEVELS = ["", "Fresher", "0-1", "1-3", "3-5"];

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<JobTrackerPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(loadJobTrackerPreferences());
    setMounted(true);
  }, []);

  function update<K extends keyof JobTrackerPreferences>(key: K, value: JobTrackerPreferences[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function toggleLocation(loc: string) {
    setPrefs((p) => ({
      ...p,
      preferredLocations: p.preferredLocations.includes(loc)
        ? p.preferredLocations.filter((l) => l !== loc)
        : [...p.preferredLocations, loc],
    }));
    setSaved(false);
  }

  function toggleMode(mode: "Remote" | "Hybrid" | "Onsite") {
    setPrefs((p) => ({
      ...p,
      preferredMode: p.preferredMode.includes(mode)
        ? p.preferredMode.filter((m) => m !== mode)
        : [...p.preferredMode, mode],
    }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveJobTrackerPreferences(prefs);
    setSaved(true);
  }

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="glass-card p-8 animate-pulse border-slate-800">
          <div className="h-8 bg-slate-800 rounded w-1/3 mb-6" />
          <div className="h-4 bg-slate-800 rounded w-full mb-4" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black gradient-text mb-2">Job Tracker Preferences</h1>
      <p className="text-slate-400 mb-8 font-medium">Set your preferences to activate intelligent matching on the dashboard.</p>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Role keywords (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. React, Frontend, SDE"
            value={prefs.roleKeywords}
            onChange={(e) => update("roleKeywords", e.target.value)}
            className="input-field w-full border-slate-800 bg-slate-950/50 text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2 text-[10px]">Preferred locations</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 max-h-48 overflow-y-auto custom-scrollbar">
            {JOB_LOCATIONS.map((loc) => (
              <label key={loc} className="flex items-center gap-2 cursor-pointer group p-1">
                <input
                  type="checkbox"
                  checked={prefs.preferredLocations.includes(loc)}
                  onChange={() => toggleLocation(loc)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors font-medium">{loc}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2 text-[10px]">Preferred mode</label>
          <div className="flex flex-wrap gap-4">
            {MODES.map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={prefs.preferredMode.includes(m)}
                  onChange={() => toggleMode(m)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors font-medium">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2 text-[10px]">Experience level</label>
          <select
            value={prefs.experienceLevel}
            onChange={(e) => update("experienceLevel", e.target.value)}
            className="input-field w-full max-w-xs border-slate-800 bg-slate-950/50 text-slate-100"
            style={{ colorScheme: "dark" }}
          >
            {EXPERIENCE_LEVELS.map((opt) => (
              <option key={opt || "any"} value={opt} className="bg-slate-900">{opt || "Any"}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2 text-[10px]">Skills</label>
          <input
            type="text"
            placeholder="e.g. JavaScript, React, Node.js"
            value={prefs.skills}
            onChange={(e) => update("skills", e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2 text-[10px]">
            Minimum match score: <span className="text-blue-400">{prefs.minMatchScore}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={prefs.minMatchScore}
            onChange={(e) => update("minMatchScore", Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none bg-slate-800 accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="btn-primary shadow-lg shadow-blue-500/20">
            Save Changes
          </button>
          <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-slate-800 text-slate-100 font-bold hover:bg-slate-700 transition-colors">
            Discard
          </Link>
        </div>
        {saved && <p className="text-green-400 text-sm">Preferences saved.</p>}
      </form>
    </div>
  );
}
