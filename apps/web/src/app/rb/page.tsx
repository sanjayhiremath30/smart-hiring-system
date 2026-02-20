"use client";

import Link from "next/link";
import { Sparkles, FileText, Layout, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeHome() {
    return (
        <div className="flex-1 bg-transparent flex flex-col items-center justify-center p-8 text-center bg-slate-950/20 backdrop-blur-3xl">
            <div className="max-w-4xl space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles size={14} />
                        <span>AI-Powered Resume Builder</span>
                    </div>
                    <h1 className="text-7xl font-black text-slate-100 leading-[0.95] tracking-tighter">
                        Build a Resume <br />
                        <span className="text-blue-500">That Gets Read.</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Professional designs, deterministic ATS scoring, and real-time guidance to land your dream job.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/rb/builder"
                        className="px-10 py-5 rounded-3xl bg-blue-600 text-white font-black text-lg hover:bg-blue-500 transition-all flex items-center group shadow-2xl shadow-blue-500/20"
                    >
                        Start Building <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform text-white" />
                    </Link>
                    <Link
                        href="/rb/01-problem"
                        className="px-10 py-5 rounded-3xl bg-slate-900/50 text-slate-100 border-2 border-slate-800 font-black text-lg hover:border-slate-700 transition-all"
                    >
                        Project 3 Track
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12"
                >
                    {[
                        { icon: FileText, title: "ATS Optimized", desc: "Real-time scoring based on industry standards." },
                        { icon: Layout, title: "Premium Layouts", desc: "Choose from Modern, Classic, and Minimal templates." },
                        { icon: CheckCircle2, title: "Export Ready", desc: "One-click PDF export and text copy for any portal." },
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800 space-y-4 text-left shadow-xl backdrop-blur-md">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-100 shadow-sm border border-slate-700">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-100">{feature.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
