"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-custom";
import {
    CheckCircle2,
    Circle,
    ExternalLink,
    Github,
    Globe,
    Send,
    Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Problem", "Market", "Architecture", "HLD", "LLD", "Build", "Test", "Ship"];

export default function ProofPage() {
    const [artifacts, setArtifacts] = useState<Record<string, string>>({});
    const [links, setLinks] = useState({ lovable: "", github: "", deploy: "" });
    const [isShipped, setIsShipped] = useState(false);

    useEffect(() => {
        const saved = {};
        for (let i = 1; i <= 8; i++) {
            const val = localStorage.getItem(`rb_step_${i}_artifact`);
            if (val) (saved as any)[i] = val;
        }
        setArtifacts(saved);

        const submission = localStorage.getItem('rb_final_submission');
        if (submission) {
            setLinks(JSON.parse(submission));
        }

        const status = localStorage.getItem('rb_project_status');
        if (status === 'Shipped') {
            setIsShipped(true);
        }
    }, []);

    const allStepsDone = steps.every((_, i) => artifacts[i + 1]);
    const linksValid = links.lovable && links.github && links.deploy;
    const canShip = allStepsDone && linksValid;

    const handleShip = () => {
        if (!canShip) return;
        localStorage.setItem('rb_final_submission', JSON.stringify(links));
        localStorage.setItem('rb_project_status', 'Shipped');
        setIsShipped(true);
        // Force status update in TrackLayout if possible, or just re-render
        window.dispatchEvent(new Event('storage'));
    };

    const handleCopyFinal = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
    `.trim();
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {isShipped && (
                <div className="p-6 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white">Project 3 Shipped Successfully.</h2>
                        <p className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest">Great work, Commander.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/10 rounded-[32px]">
                    <CardHeader>
                        <CardTitle className="text-white text-xl font-black">Step Completion</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center space-x-3">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest w-4">0{i + 1}</span>
                                    <span className="text-sm font-bold text-white/80">{step}</span>
                                </div>
                                {artifacts[i + 1] ? (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                ) : (
                                    <Circle size={16} className="text-white/10" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 rounded-[32px]">
                    <CardHeader>
                        <CardTitle className="text-white text-xl font-black">Final Submission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase flex items-center">
                                    <ExternalLink size={12} className="mr-2" /> Lovable Project Link
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white/80 placeholder:text-white/10 focus:outline-none focus:border-indigo-600"
                                    placeholder="https://lovable.dev/..."
                                    value={links.lovable}
                                    onChange={(e) => setLinks({ ...links, lovable: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase flex items-center">
                                    <Github size={12} className="mr-2" /> GitHub Repository
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white/80 placeholder:text-white/10 focus:outline-none focus:border-indigo-600"
                                    placeholder="https://github.com/..."
                                    value={links.github}
                                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase flex items-center">
                                    <Globe size={12} className="mr-2" /> Deployment URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white/80 placeholder:text-white/10 focus:outline-none focus:border-indigo-600"
                                    placeholder="https://my-app.vercel.app"
                                    value={links.deploy}
                                    onChange={(e) => setLinks({ ...links, deploy: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={!canShip}
                            onClick={handleShip}
                            className={cn(
                                "w-full py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 disabled:opacity-20 flex items-center justify-center transition-all group",
                                isShipped && "hidden"
                            )}
                        >
                            <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Complete Project 3
                        </button>
                        <button
                            onClick={handleCopyFinal}
                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 flex items-center justify-center transition-all"
                        >
                            <Copy size={18} className="mr-2" /> Copy Final Submission
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
