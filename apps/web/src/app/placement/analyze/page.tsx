"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui-custom";
import { extractSkills, calculateReadinessScore, generate7DayPlan, generateQuestions } from "@/lib/placement/analyzer";
import { Sparkles, Building2, Briefcase } from "lucide-react";

export default function AnalyzePage() {
    const [jdText, setJdText] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const router = useRouter();

    const handleAnalyze = async () => {
        if (!jdText.trim()) return;
        setIsAnalyzing(true);

        // Simulate slight delay for premium feel
        await new Promise(r => setTimeout(r, 1500));

        const extractedSkills = extractSkills(jdText);
        const categoriesCount = new Set(extractedSkills.map(s => s.category)).size;
        const score = calculateReadinessScore(jdText, company, role, categoriesCount);

        const analysisResult = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            company,
            role,
            jdText,
            extractedSkills,
            readinessScore: score,
            plan: generate7DayPlan(extractedSkills),
            questions: generateQuestions(extractedSkills),
            checklist: [
                "Basics & Aptitude",
                "DSA + Core CS Fundamentals",
                "Technical Deep Dive (projects)",
                "Behavioral & HR Prep"
            ],
            skillConfidenceMap: {}
        };

        // Save to history
        const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
        localStorage.setItem('placement_history', JSON.stringify([analysisResult, ...history]));
        localStorage.setItem('latest_analysis', JSON.stringify(analysisResult));

        router.push("/placement/results");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">JD Analyzer</h1>
                <p className="text-slate-500 text-lg">Instant readiness assessment & 7-day prep plan based on the job description.</p>
            </div>

            <Card className="bg-white border-slate-100 shadow-xl shadow-slate-200/50">
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center">
                                <Building2 className="mr-2 text-indigo-600" size={16} /> Company Name
                            </label>
                            <input
                                type="text"
                                placeholder="Google, Microsoft, etc."
                                className="input-field rounded-2xl border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center">
                                <Briefcase className="mr-2 text-indigo-600" size={16} /> Job Role
                            </label>
                            <input
                                type="text"
                                placeholder="Software Engineer, Frontend Dev..."
                                className="input-field rounded-2xl border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Job Description (Paste below)</label>
                        <textarea
                            rows={12}
                            placeholder="Paste the full job description text here..."
                            className="input-field rounded-3xl border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 resize-none p-6"
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !jdText.trim()}
                        className="w-full btn-primary py-4 rounded-3xl bg-indigo-600 hover:bg-black text-white font-black text-lg shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center group"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                Analyzing Requirements...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                                Analyze Readiness
                            </>
                        )}
                    </button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {[
                    { icon: "🎯", title: "Targeted Prep", desc: "Focus specifically on what the role demands." },
                    { icon: "⚡", title: "Instant Plan", desc: "Get a personalized 7-day schedule." },
                    { icon: "📚", title: "Key Questions", desc: "Curated list of likely interview topics." }
                ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 items-center justify-center flex flex-col">
                        <span className="text-3xl mb-3">{item.icon}</span>
                        <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
