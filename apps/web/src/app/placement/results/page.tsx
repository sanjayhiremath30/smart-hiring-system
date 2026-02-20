"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui-custom";
import {
    Copy,
    Download,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Share2,
    Calendar,
    CheckSquare,
    HelpCircle,
    TrendingUp,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtractedSkill } from "@/lib/placement/analyzer";

export default function ResultsPage() {
    const [result, setResult] = useState<any>(null);
    const [confidences, setConfidences] = useState<Record<string, 'know' | 'practice'>>({});
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get('id');

        if (id) {
            const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
            const entry = history.find((h: any) => h.id === id);
            if (entry) {
                setResult(entry);
                setConfidences(entry.skillConfidenceMap || {});
                return;
            }
        }

        const data = localStorage.getItem('latest_analysis');
        if (!data) {
            router.push("/placement/analyze");
            return;
        }
        const parsed = JSON.parse(data);
        setResult(parsed);
        setConfidences(parsed.skillConfidenceMap || {});
    }, [router]);

    const currentScore = useMemo(() => {
        if (!result) return 0;
        let score = result.readinessScore;
        Object.values(confidences).forEach(val => {
            if (val === 'know') score += 2;
            if (val === 'practice') score -= 0; // The base score already assumes some knowledge, we only penalize if it was "know" and changed? No, user said +2 for know, -2 for practice from base.
            // Wait, user rule: +2 for each skill marked "I know", -2 for each skill marked "Need practice".
            // Let's stick to user rule:
        });

        // Re-calculating based on rule precisely:
        let adjusted = result.readinessScore;
        result.extractedSkills.forEach((skill: any) => {
            const status = confidences[skill.name];
            if (status === 'know') adjusted += 2;
            else if (status === 'practice') adjusted -= 2;
        });

        return Math.min(Math.max(adjusted, 0), 100);
    }, [result, confidences]);

    const toggleConfidence = (skillName: string) => {
        const next = confidences[skillName] === 'know' ? 'practice' : 'know';
        const updated: Record<string, 'know' | 'practice'> = { ...confidences, [skillName]: next };
        setConfidences(updated);

        // Persist to localStorage
        if (result) {
            const newResult = { ...result, skillConfidenceMap: updated };
            localStorage.setItem('latest_analysis', JSON.stringify(newResult));

            // Update in history too
            const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
            const updatedHistory = history.map((h: any) => h.id === result.id ? newResult : h);
            localStorage.setItem('placement_history', JSON.stringify(updatedHistory));
        }
    };

    const copySection = (title: string, content: string[]) => {
        const text = `${title}\n${content.join('\n')}`;
        navigator.clipboard.writeText(text);
        alert(`${title} copied to clipboard!`);
    };

    const downloadTxt = () => {
        if (!result) return;
        const content = `
ANALYSIS RESULTS: ${result.company || 'N/A'} - ${result.role || 'N/A'}
Readiness Score: ${currentScore}/100

SKILLS:
${result.extractedSkills.map((s: any) => `${s.name} (${s.category})`).join('\n')}

7-DAY PLAN:
${result.plan.join('\n')}

INTERVIEW QUESTIONS:
${result.questions.join('\n')}
    `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Prep_Plan_${result.company || 'Job'}.txt`;
        a.click();
    };

    if (!result) return null;

    const weakSkills = result.extractedSkills.filter((s: any) => !confidences[s.name] || confidences[s.name] === 'practice').slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push("/placement/analyze")}
                    className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-all"
                >
                    <ArrowLeft className="mr-2" size={20} /> Back to Analyzer
                </button>
                <div className="flex gap-3">
                    <button onClick={downloadTxt} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold flex items-center hover:bg-black transition-all">
                        <Download className="mr-2" size={16} /> Export TXT
                    </button>
                    <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Score & Skills */}
                <div className="lg:col-span-1 space-y-8 text-center">
                    <Card className="p-10 bg-indigo-600 text-white rounded-[40px] border-none shadow-2xl shadow-indigo-200">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-indigo-100/80 text-sm uppercase tracking-widest font-black">Performance Score</CardTitle>
                        </CardHeader>
                        <div className="relative inline-flex items-center justify-center">
                            <motion.div
                                className="text-8xl font-black"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={currentScore}
                            >
                                {currentScore}
                            </motion.div>
                            <span className="text-xl font-bold text-indigo-200 ml-1 mt-6">/100</span>
                        </div>
                        <p className="mt-4 text-indigo-100 font-medium opacity-80">
                            {currentScore >= 80 ? "You're extremely ready!" : currentScore >= 50 ? "Good start, keep pushing." : "Significant prep needed."}
                        </p>
                    </Card>

                    <Card className="bg-white border-slate-100 text-left">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-slate-900">Key Skills Extracted</CardTitle>
                            <p className="text-xs text-slate-400">Toggle confidence to update your score</p>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-6">
                            {Object.entries(
                                result.extractedSkills.reduce((acc: any, curr: any) => {
                                    acc[curr.category] = [...(acc[curr.category] || []), curr];
                                    return acc;
                                }, {})
                            ).map(([category, skills]: [string, any]) => (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-tighter font-black text-slate-400">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill: any) => (
                                            <button
                                                key={skill.name}
                                                onClick={() => toggleConfidence(skill.name)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${confidences[skill.name] === 'know'
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400"
                                                    }`}
                                            >
                                                {confidences[skill.name] === 'know' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {result.extractedSkills.length === 0 && (
                                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs text-slate-400 italic">General fresher stack detected</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Plans & Questions */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Checklist */}
                        <Card className="bg-white border-slate-100">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center text-slate-500 uppercase tracking-widest text-[10px] font-black">
                                    <CheckSquare className="mr-2 text-indigo-600" size={14} /> Round-wise Checklist
                                </CardTitle>
                                <button onClick={() => copySection("Checklist", result.checklist)} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><Copy size={16} /></button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.checklist.map((item: string, idx: number) => (
                                    <div key={idx} className="flex items-center p-3 px-4 rounded-2xl bg-indigo-50/30 text-slate-700 text-sm font-bold border border-indigo-100/20">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] mr-3">{idx + 1}</span>
                                        {item}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* 7-Day Plan */}
                        <Card className="bg-white border-slate-100">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center text-slate-500 uppercase tracking-widest text-[10px] font-black">
                                    <Calendar className="mr-2 text-indigo-600" size={14} /> 7-Day Strategy
                                </CardTitle>
                                <button onClick={() => copySection("7-Day Plan", result.plan)} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><Copy size={16} /></button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.plan.map((item: string, idx: number) => (
                                    <div key={idx} className="flex flex-col text-sm border-l-2 border-indigo-200 pl-4 py-1">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase mb-1">Step {idx + 1}</span>
                                        <p className="text-slate-600 font-bold">{item}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Likely Questions */}
                    <Card className="bg-white border-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center text-slate-500 uppercase tracking-widest text-[10px] font-black">
                                <HelpCircle className="mr-2 text-indigo-600" size={14} /> 10 Likely Interview Questions
                            </CardTitle>
                            <button onClick={() => copySection("Interview Questions", result.questions)} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><Copy size={16} /></button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.questions.map((q: string, idx: number) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600 hover:border-indigo-200 transition-all">
                                    <span className="text-indigo-600 font-bold mr-2">Q{idx + 1}.</span> {q}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Action Next Box */}
                    <Card className="bg-slate-900 border-none p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-indigo-600/40 transition-colors" />
                        <CardContent className="p-0 relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                        <TrendingUp className="mr-2" size={12} /> Personalized Recommendation
                                    </div>
                                    <h3 className="text-2xl font-bold">Focus on your weak points</h3>
                                    <p className="text-slate-400 font-medium">
                                        You mentioned needing practice in: <span className="text-white">{weakSkills.map((s: any) => s.name).join(', ') || 'General areas'}</span>.
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push("/placement/dashboard")}
                                    className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-black flex items-center group transition-all"
                                >
                                    <Zap className="mr-2 text-indigo-600 fill-indigo-600 group-hover:scale-125 transition-transform" size={20} />
                                    Start Day 1 plan now
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
