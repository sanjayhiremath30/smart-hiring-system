"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_LOCATIONS } from "@/lib/constants";

export default function AdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [salary, setSalary] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [mockTitle, setMockTitle] = useState("");
  const [mockType, setMockType] = useState("aptitude");
  const [mockQuestions, setMockQuestions] = useState("");

  function loadData() {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setApplications([]));
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]));
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
    fetch("/api/mock-tests")
      .then((res) => res.json())
      .then((data) => setMockTests(Array.isArray(data) ? data : []))
      .catch(() => setMockTests([]));
    fetch("/api/mock-tests/results?admin=true")
      .then((res) => res.json())
      .then((data) => setTestResults(Array.isArray(data) ? data : []))
      .catch(() => setTestResults([]));
  }

  useEffect(loadData, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in title and description");
      return;
    }
    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        company: company || undefined,
        location: location || undefined,
        state: state || undefined,
        salary: salary || undefined,
        skills: skillsInput ? skillsInput.split(",").map((s) => s.trim()) : [],
        applyUrl: applyUrl.trim() || undefined,
      }),
    });
    setTitle("");
    setDescription("");
    setCompany("");
    setLocation("");
    setState("");
    setSalary("");
    setSkillsInput("");
    setApplyUrl("");
    loadData();
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadData();
  }

  async function createMockTest(e: React.FormEvent) {
    e.preventDefault();
    let questions;
    try {
      questions = JSON.parse(mockQuestions || "[]");
    } catch {
      alert("Invalid JSON for questions. Use e.g. [{\"q\":\"What is 2+2?\",\"options\":[\"3\",\"4\"],\"correct\":\"4\"}]");
      return;
    }
    await fetch("/api/mock-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: mockType, title: mockTitle, questions }),
    });
    setMockTitle("");
    setMockQuestions("");
    loadData();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">
            ← Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage jobs and applications</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
            {unreadCount} new notification{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Notifications */}
      {unreadCount > 0 && (
        <section className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Notifications</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {notifications
              .filter((n) => !n.read)
              .slice(0, 5)
              .map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="font-medium text-white text-sm">{n.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                </div>
              ))}
          </div>
          <Link href="/dashboard" className="text-cyan-400 text-sm mt-2 inline-block">
            View all notifications →
          </Link>
        </section>
      )}

      {/* Job Posting Management */}
      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Job Posting Management</h2>
        <p className="text-gray-400 text-sm mb-6">View, edit, or delete posted jobs.</p>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {jobs.map((job: any) => (
              <div key={job.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.company}
                    {(job.location || job.state) && ` · ${job.location || job.state}`}
                    {job.salary && <span className="text-green-400"> · {job.salary}</span>}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (confirm("Delete this job?")) {
                        fetch(`/api/jobs/${job.id}`, { method: "DELETE" }).then(loadData);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create Job */}
      <section className="glass-card p-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Create New Job</h2>
        <form onSubmit={createJob} className="grid gap-4 md:grid-cols-2">
          <input
            placeholder="Job Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field md:col-span-2"
            required
          />
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="input-field"
          />
          <input
            placeholder="Salary (e.g. 5-8 LPA)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="input-field"
          />
          <div>
            <label className="block text-sm text-gray-400 mb-1">State / Location</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field"
              style={{ colorScheme: "dark" }}
            >
              <option value="">Select state</option>
              {ALL_LOCATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <input
            placeholder="City / Area (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
          />
          <input
            placeholder="Optional External Apply Link (redirects here if set)"
            value={applyUrl}
            onChange={(e) => setApplyUrl(e.target.value)}
            className="input-field md:col-span-2"
          />
          <input
            placeholder="Skills needed (comma-separated, e.g. React, Node.js)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="input-field md:col-span-2"
          />
          <textarea
            placeholder="Job Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field md:col-span-2 min-h-[120px] resize-none"
            required
          />
          <button type="submit" className="btn-primary md:col-span-2 w-fit">
            Add Job
          </button>
        </form>
      </section>

      {/* Mock Test Questions */}
      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Mock Test Questions</h2>
        <p className="text-gray-400 text-sm mb-4">View and add tests for Coding, Aptitude, Communication, HR.</p>
        {mockTests.length > 0 && (
          <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
            {mockTests.map((t: any) => (
              <div key={t.id} className="flex justify-between items-center p-2 rounded bg-white/5">
                <span className="text-white">{t.title}</span>
                <span className="text-gray-500 text-sm">{t.type}</span>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={createMockTest} className="space-y-3">
          <input value={mockTitle} onChange={(e) => setMockTitle(e.target.value)} placeholder="Test title" className="input-field" required />
          <select value={mockType} onChange={(e) => setMockType(e.target.value)} className="input-field" style={{ colorScheme: "dark" }}>
            <option value="coding">Coding</option>
            <option value="aptitude">Aptitude</option>
            <option value="communication">Communication</option>
            <option value="hr">HR</option>
          </select>
          <textarea value={mockQuestions} onChange={(e) => setMockQuestions(e.target.value)} placeholder='Questions JSON: [{"q":"Question?","options":["A","B"],"correct":"A"}]' className="input-field min-h-[100px] font-mono text-sm" />
          <button type="submit" className="btn-primary">Add Test</button>
        </form>
      </section>

      {/* User Performance */}
      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">User Performance (Mock Tests)</h2>
        {!Array.isArray(testResults) || testResults.length === 0 ? (
          <p className="text-gray-500">No test results yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(Array.isArray(testResults) ? testResults.slice(0, 20) : []).map((r: any) => (
              <div key={r.id} className="p-3 rounded bg-white/5 flex justify-between items-center text-sm">
                <span className="text-gray-400">{r.user?.email ?? "User"}</span>
                <span className="text-cyan-400">{r.mockTest?.title}</span>
                <span className="text-white font-medium">{r.score}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Applications */}
      <section className="glass-card p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Applications</h2>
        {applications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No applications yet. Applications will appear here when candidates apply.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-white">{app.name}</p>
                  <p className="text-sm text-gray-400">{app.email}</p>
                  <p className="text-sm text-cyan-400 mt-1">
                    Applied for: {app.job?.title || "Unknown Job"}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                      app.status === "APPROVED"
                        ? "bg-green-500/20 text-green-400"
                        : app.status === "REJECTED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(app.id, "APPROVED")}
                    className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "REJECTED")}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
