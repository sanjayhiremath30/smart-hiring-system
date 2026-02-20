"use client";

import { useEffect, useState } from "react";

const TEMPLATE = `Hi [Recruiter name],

I applied for the [Role] position on [Date]. I'm still very interested and would appreciate any update when convenient.

Thank you,
[Your name]`;

export function FollowUpReminder() {
  const [applications, setApplications] = useState<{ job?: { title: string }; createdAt: string }[]>([]);
  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApplications(data.slice(0, 10)))
      .catch(() => setApplications([]));
  }, []);
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Track applications and use this follow-up email template.</p>
      {applications.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-semibold">Your recent applications</h4>
          {applications.map((app, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 flex justify-between items-center">
              <span className="text-white">{app.job?.title || "Job"}</span>
              <span className="text-gray-500 text-sm">{new Date(app.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="glass-card p-6">
        <h4 className="text-white font-semibold mb-2">📧 Follow-up email template</h4>
        <p className="text-gray-400 text-sm mb-3">Use 7–10 days after applying if you hear nothing.</p>
        <pre className="bg-black/30 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">{TEMPLATE}</pre>
      </div>
    </div>
  );
}
