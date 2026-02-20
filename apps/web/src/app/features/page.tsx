"use client";

import Link from "next/link";

const FEATURES = [
  {
    id: "ai-interview",
    title: "AI Interview Simulation Engine",
    short: "Mock interview with voice, confidence & sentiment analysis, AI feedback.",
    icon: "🎤",
  },
  {
    id: "resume-ats",
    title: "Resume ATS Scoring",
    short: "Upload or paste resume for ATS score and improvement tips.",
    icon: "✅",
  },
  {
    id: "resume-jd-gap",
    title: "Resume–JD Gap Analyzer",
    short: "Compare resume vs JD, missing skills %, improvements, shortlisting probability.",
    icon: "📋",
  },
  {
    id: "placement-probability",
    title: "Smart Placement Probability Score",
    short: "ML prediction: shortlist, interview clear, offer likelihood.",
    icon: "📊",
  },
  {
    id: "skill-roadmap",
    title: "Auto Skill Learning Roadmap",
    short: "Courses, YouTube playlists, practice problems, project ideas from missing skills.",
    icon: "🛤️",
  },
  {
    id: "market-demand",
    title: "Real-Time Market Demand Analyzer",
    short: "Trending skills, salary by role, skill demand heatmap.",
    icon: "🔥",
  },
  {
    id: "career-path",
    title: "AI Career Path Recommender",
    short: "Backend / AI / DevOps / Data roles from skills + interest.",
    icon: "🧭",
  },
  {
    id: "multi-resume",
    title: "Multi-Resume Strategy Generator",
    short: "Resume versions for product/service/startup + A/B testing.",
    icon: "📄",
  },
  {
    id: "application-optimizer",
    title: "AI-Powered Application Optimizer",
    short: "Best time to apply, referral probability, custom cover letters.",
    icon: "⚡",
  },
  {
    id: "behavioral-scoring",
    title: "Behavioral & Soft Skill Scoring",
    short: "Mock HR analysis, personality profiling, communication score.",
    icon: "💬",
  },
  {
    id: "funnel-analytics",
    title: "Placement Funnel Analytics Dashboard",
    short: "Funnel: Applied → Shortlisted → Interviewed → Selected; drop-off reasons.",
    icon: "📈",
  },
  {
    id: "follow-up-reminder",
    title: "Smart Deadline & Follow-up Reminder AI",
    short: "Application timelines, follow-up email templates, calendar sync.",
    icon: "⏰",
  },
  {
    id: "profile-analyzer",
    title: "GitHub & LinkedIn Profile Analyzer",
    short: "Profile strength, improvements, pinned projects.",
    icon: "🔗",
  },
  {
    id: "digital-twin",
    title: "Digital Twin Career Simulator",
    short: "Simulate career path: learn X → salary in 2 years, AI vs Web, delay impact.",
    icon: "🧠",
  },
  {
    id: "recruiter-persona",
    title: "AI Recruiter Persona Engine",
    short: "Startup / MNC / Product recruiter mindset, questions & evaluation style.",
    icon: "🤖",
  },
  {
    id: "skill-migration",
    title: "Global Skill Migration Predictor",
    short: "Skills dying in 3 years, roles growing, your 2028 relevance score.",
    icon: "🌍",
  },
];

export default function FeaturesHubPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-slate-100 mb-2 gradient-text">AI Career Features</h1>
      <p className="text-slate-400 mb-10 font-medium">
        Smart tools to improve your placement chances. Click any feature to open it.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {FEATURES.map((f) => (
          <Link
            key={f.id}
            href={`/features/${f.id}`}
            className="glass-card p-6 block border-slate-800 hover:border-blue-500/40 transition-all group shadow-xl"
          >
            <span className="text-3xl mb-4 block transform group-hover:scale-110 transition-transform">{f.icon}</span>
            <h2 className="text-lg font-black text-slate-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
              {f.title}
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{f.short}</p>
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest mt-4 inline-block hover:text-blue-300">Open Module →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
