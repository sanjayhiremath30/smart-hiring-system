"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Copy,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Trash2,
    ChevronRight,
    ChevronLeft,
    Terminal,
    FileCode,
    Sparkles,
    Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TrackLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const stepMatch = pathname.match(/\/rb\/0(\d+)/);
    const currentStep = stepMatch ? parseInt(stepMatch[1]) : 0;

    const [copied, setCopied] = useState(false);
    const [hasArtifact, setHasArtifact] = useState(false);
    const [status, setStatus] = useState<'In Progress' | 'Shipped'>('In Progress');

    useEffect(() => {
        const update = () => {
            const s = localStorage.getItem('rb_project_status');
            if (s === 'Shipped') setStatus('Shipped');

            const artifact = localStorage.getItem(`rb_step_${currentStep}_artifact`);
            setHasArtifact(!!artifact);
        };

        update();
        window.addEventListener('storage', update);
        return () => window.removeEventListener('storage', update);
    }, [currentStep]);

    const handleItWorked = () => {
        localStorage.setItem(`rb_step_${currentStep}_artifact`, "captured_artifact_" + Date.now());
        setHasArtifact(true);
    };

    const nextStep = () => {
        if (currentStep < 8) {
            router.push(`/rb/0${currentStep + 1}`);
        } else {
            router.push('/rb/proof');
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            router.push(`/rb/0${currentStep - 1}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-950 text-slate-300 font-sans overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                    <Link href="/rb" className="text-blue-400 font-black tracking-tighter hover:text-blue-300 transition-colors">AI RESUME BUILDER</Link>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded">Project 3</div>
                </div>

                <div className="text-xs font-black text-white/80 uppercase tracking-widest">
                    Step <span className="text-indigo-400">{currentStep}</span> of 8
                </div>

                <div className="flex items-center space-x-3">
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center",
                        status === 'Shipped' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-2", status === 'Shipped' ? "bg-emerald-500" : "bg-blue-400 animate-pulse")} />
                        {status}
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <div className="flex-1 flex overflow-hidden">
                {/* Workspace (70%) */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center justify-between mb-12">
                            <button onClick={prevStep} className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <button
                                disabled={!hasArtifact}
                                onClick={nextStep}
                                className={cn(
                                    "px-6 py-2 rounded-xl border font-black text-xs uppercase tracking-widest flex items-center transition-all",
                                    hasArtifact
                                        ? "bg-blue-600 border-blue-400 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20"
                                        : "bg-white/5 border-white/10 text-white/20"
                                )}
                            >
                                Next Step <ChevronRight size={16} className="ml-2" />
                            </button>
                        </div>

                        {children}
                    </div>
                </div>

                {/* Build Panel (30%) */}
                <div className="w-[400px] border-l border-white/5 bg-black/20 flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center space-x-2">
                            <Terminal size={16} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Build Panel</span>
                        </div>
                        {hasArtifact && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center">
                                <FileCode size={12} className="mr-2" /> Prompt for Lovable
                            </label>
                            <div className="relative group">
                                <textarea
                                    readOnly
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/60 font-mono leading-relaxed h-48 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                                    value={`Build section ${currentStep} of the AI Resume Builder following the KodNest Premium Design System...`}
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`Build section ${currentStep}...`);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="absolute bottom-4 right-4 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg"
                                >
                                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full py-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 font-black hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center group shadow-xl shadow-blue-500/10">
                                <ExternalLink size={18} className="mr-2 group-hover:scale-110 transition-transform text-blue-600 group-hover:text-white" />
                                Build in Lovable
                            </button>

                            <div className="h-[1px] bg-white/5" />

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={handleItWorked}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-3xl border transition-all space-y-2",
                                        hasArtifact ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                    )}
                                >
                                    <CheckCircle2 size={24} />
                                    <span className="text-[10px] font-black uppercase">It Worked</span>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="p-4 rounded-3xl bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 flex flex-col items-center justify-center space-y-2">
                                        <AlertCircle size={20} />
                                        <span className="text-[10px] font-black uppercase">Error</span>
                                    </button>
                                    <button className="p-4 rounded-3xl bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 flex flex-col items-center justify-center space-y-2">
                                        <Plus size={20} />
                                        <span className="text-[10px] font-black uppercase">Screenshot</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer (Proof System) */}
                    <div className="p-6 border-t border-white/5 bg-black/40">
                        <Link
                            href="/rb/proof"
                            className="w-full py-3 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center hover:bg-blue-600/20 transition-all"
                        >
                            <Sparkles size={14} className="mr-2" /> View Final Proof
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
