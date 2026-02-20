"use client";

import Link from "next/link";
import { ArrowRight, Code, Video, BarChart, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Practice Problems",
        description: "Master coding challenges across all difficulty levels and topics.",
        icon: Code,
    },
    {
        title: "Mock Interviews",
        description: "Simulate real-world interviewer interactions with video-enabled prep.",
        icon: Video,
    },
    {
        title: "Track Progress",
        description: "Visualize your growth with detailed analytics and readiness scores.",
        icon: BarChart,
    },
];

export default function PlacementLanding() {
    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 font-black text-[10px] mb-6 border border-blue-500/20 uppercase tracking-widest">
                        <GraduationCap size={16} />
                        <span>Success Starts Here</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-slate-100">
                        Ace Your <span className="text-blue-500">Placement</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        Practice, assess, and prepare for your dream job with our comprehensive
                        readiness platform designed for modern tech careers.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/placement/dashboard"
                            className="px-8 py-4 rounded-xl font-black text-white flex items-center group transition-all bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-600/20 border border-blue-500/30 uppercase tracking-widest text-sm"
                        >
                            Get Started
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <button className="px-8 py-4 rounded-xl font-black border border-slate-800 hover:border-slate-700 transition-all text-slate-400 uppercase tracking-widest text-sm bg-slate-900/50">
                            View Curriculum
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 bg-slate-950/20 backdrop-blur-3xl border-t border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 rounded-[40px] border border-slate-800 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group bg-slate-900/40 backdrop-blur-xl shadow-2xl"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                    <feature.icon className="text-blue-400" size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-100 mb-4 uppercase tracking-tighter">{feature.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm bg-slate-950/40">
                <div className="max-w-6xl mx-auto px-4">
                    <p>© {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
