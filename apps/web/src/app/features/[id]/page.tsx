"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MarketDemandAnalyzer } from "@/components/features/MarketDemandAnalyzer";
import { DigitalTwinSimulator } from "@/components/features/DigitalTwinSimulator";
import { RecruiterPersona } from "@/components/features/RecruiterPersona";
import { SkillMigrationPredictor } from "@/components/features/SkillMigrationPredictor";
import { ResumeJdGap } from "@/components/features/ResumeJdGap";
import { PlacementProbability } from "@/components/features/PlacementProbability";
import { SkillRoadmap } from "@/components/features/SkillRoadmap";
import { CareerPathRecommender } from "@/components/features/CareerPathRecommender";
import { MultiResume } from "@/components/features/MultiResume";
import { ApplicationOptimizer } from "@/components/features/ApplicationOptimizer";
import { BehavioralScoring } from "@/components/features/BehavioralScoring";
import { FollowUpReminder } from "@/components/features/FollowUpReminder";
import { ProfileAnalyzer } from "@/components/features/ProfileAnalyzer";
import { AIInterviewSim } from "@/components/features/AIInterviewSim";
import { ResumeAtsScoring } from "@/components/features/ResumeAtsScoring";

const FEATURES: Record<
  string,
  { title: string; description: string; icon: string; Component?: React.ComponentType }
> = {
  "ai-interview": {
    title: "AI Interview Simulation Engine",
    icon: "🎤",
    description: "Mock interview with real-time feedback and technical evaluation.",
    Component: AIInterviewSim,
  },
  "resume-ats": {
    title: "Resume ATS Scoring",
    icon: "✅",
    description: "Upload or paste resume for ATS score and improvement tips.",
    Component: ResumeAtsScoring,
  },
  "resume-jd-gap": {
    title: "Resume–JD Gap Analyzer",
    icon: "📋",
    description: "Compare resume vs JD, missing skills %, and shortlisting probability.",
    Component: ResumeJdGap,
  },
  "placement-probability": {
    title: "Smart Placement Probability Score",
    icon: "📊",
    description: "Shortlist, interview clear, and offer likelihood by profile and role.",
    Component: PlacementProbability,
  },
  "skill-roadmap": {
    title: "Auto Skill Learning Roadmap",
    icon: "🛤️",
    description: "Courses, YouTube, and practice projects for your target skill.",
    Component: SkillRoadmap,
  },
  "market-demand": {
    title: "Real-Time Market Demand Analyzer",
    icon: "🔥",
    description: "Trending skills, salary by role, and skill demand heatmap.",
    Component: MarketDemandAnalyzer,
  },
  "career-path": {
    title: "AI Career Path Recommender",
    icon: "🧭",
    description: "Backend / AI / DevOps / Data roles based on your skills.",
    Component: CareerPathRecommender,
  },
  "multi-resume": {
    title: "Multi-Resume Strategy Generator",
    icon: "📄",
    description: "Resume versions for product, service, and startup companies.",
    Component: MultiResume,
  },
  "application-optimizer": {
    title: "AI-Powered Application Optimizer",
    icon: "⚡",
    description: "Best time to apply, referral tips, and cover letter draft.",
    Component: ApplicationOptimizer,
  },
  "behavioral-scoring": {
    title: "Behavioral & Soft Skill Scoring",
    icon: "💬",
    description: "Score mock HR answers and get improvement feedback.",
    Component: BehavioralScoring,
  },
  "follow-up-reminder": {
    title: "Smart Deadline & Follow-up Reminder AI",
    icon: "⏰",
    description: "Application timelines and follow-up email template.",
    Component: FollowUpReminder,
  },
  "profile-analyzer": {
    title: "GitHub & LinkedIn Profile Analyzer",
    icon: "🔗",
    description: "Profile strength and improvement suggestions.",
    Component: ProfileAnalyzer,
  },
  "digital-twin": {
    title: "Digital Twin Career Simulator",
    icon: "🧠",
    description: "Simulate: learn X → salary in 2 years, path choice, delay impact.",
    Component: DigitalTwinSimulator,
  },
  "recruiter-persona": {
    title: "AI Recruiter Persona Engine",
    icon: "🤖",
    description: "Startup / MNC / Product recruiter mindset, questions & evaluation.",
    Component: RecruiterPersona,
  },
  "skill-migration": {
    title: "Global Skill Migration Predictor",
    icon: "🌍",
    description: "Skills dying, roles growing, your 2028 relevance score.",
    Component: SkillMigrationPredictor,
  },
  "funnel-analytics": {
    title: "Placement Funnel Analytics Dashboard",
    icon: "📈",
    description: "Applied → Shortlisted → Interviewed → Selected with drop-off.",
  },
};

export default function FeaturePage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const feature = FEATURES[id];

  if (!feature) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-gray-400">Feature not found.</p>
        <Link href="/features" className="text-cyan-400 mt-4 inline-block">
          ← All features
        </Link>
      </div>
    );
  }

  if (id === "funnel-analytics") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/features" className="text-cyan-400 text-sm mb-6 inline-block">
          ← All features
        </Link>
        <div className="glass-card p-8">
          <span className="text-5xl mb-4 block">{feature.icon}</span>
          <h1 className="text-2xl font-bold text-white mb-2">{feature.title}</h1>
          <p className="text-gray-400 mb-6">{feature.description}</p>
          <p className="text-cyan-400 text-sm">
            <Link href="/features/funnel-analytics">Open Placement Funnel Analytics dashboard →</Link>
          </p>
        </div>
      </div>
    );
  }

  const Component = feature.Component;
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/features" className="text-cyan-400 text-sm mb-6 inline-block">
        ← All features
      </Link>
      <div className="glass-card p-8">
        <span className="text-5xl mb-4 block">{feature.icon}</span>
        <h1 className="text-2xl font-bold text-white mb-2">{feature.title}</h1>
        <p className="text-gray-400 mb-6">{feature.description}</p>
        {Component ? <Component /> : null}
      </div>
    </div>
  );
}
