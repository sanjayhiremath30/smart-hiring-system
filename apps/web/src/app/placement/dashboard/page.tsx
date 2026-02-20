"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Progress
} from "@/components/ui-custom";
import {
    PlayCircle,
    Calendar,
    Clock,
    CheckCircle2,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const radarData = [
    { subject: "DSA", A: 75, fullMark: 100 },
    { subject: "System Design", A: 60, fullMark: 100 },
    { subject: "Comm.", A: 80, fullMark: 100 },
    { subject: "Resume", A: 85, fullMark: 100 },
    { subject: "Aptitude", A: 70, fullMark: 100 },
];

const assessments = [
    { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", icon: Clock },
    { title: "System Design Review", time: "Wed, 2:00 PM", icon: Calendar },
    { title: "HR Interview Prep", time: "Friday, 11:00 AM", icon: PlayCircle },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];
const activeDays = [0, 1, 2, 4]; // Mon, Tue, Wed, Fri

export default function DashboardPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, John! Here&apos;s your current readiness status.</p>
                </div>
                <button className="btn-primary rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center px-6 py-3">
                    Start Assessment <ChevronRight className="ml-2" size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Readiness */}
                <Card className="flex flex-col items-center justify-center p-8 text-center bg-white border-slate-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-500 font-medium">Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex items-center justify-center pt-4">
                        <svg className="w-48 h-48 -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                className="text-slate-100"
                            />
                            <motion.circle
                                cx="96"
                                cy="96"
                                r="88"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeLinecap="round"
                                className="text-blue-600"
                                initial={{ strokeDasharray: "0 553" }}
                                animate={{ strokeDasharray: `${(72 / 100) * 553} 553` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-slate-900">72</span>
                            <span className="text-sm font-black text-slate-500 uppercase tracking-widest mt-1">Ready</span>
                        </div>
                    </CardContent>
                    <p className="text-sm text-slate-400 mt-4 px-8 leading-relaxed">
                        Your score is calculated based on skill assessments, practice frequency, and mock test performance.
                    </p>
                </Card>

                {/* Skill Breakdown */}
                <Card className="bg-white border-slate-100">
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="#2563eb"
                                    fill="#2563eb"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Continue Practice & Weekly Goals */}
                <div className="space-y-8 flex flex-col">
                    <Card className="bg-white border-slate-100 flex-1">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center text-sm text-slate-600 uppercase tracking-widest font-black">
                                <PlayCircle className="mr-2 text-blue-600" size={16} /> Continue Practice
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <h4 className="text-2xl font-bold text-slate-900">Dynamic Programming</h4>
                                <p className="text-slate-500 text-sm">Longest Common Subsequence and related problems.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>3/10 Completed</span>
                                    <span>30%</span>
                                </div>
                                <Progress value={30} className="h-3" />
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl bg-slate-900 text-white font-black hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/10">
                                Continue Learning
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center text-sm text-slate-500 uppercase tracking-widest font-bold">
                                <CheckCircle2 className="mr-2 text-indigo-600" size={16} /> Weekly Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <div className="text-3xl font-black text-slate-900">12/20</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Problems Solved</div>
                                </div>
                                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">60% Complete</div>
                            </div>
                            <Progress value={60} className="h-2 mb-8" />

                            <div className="flex justify-between px-2">
                                {days.map((day, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                                            activeDays.includes(idx)
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                : "bg-slate-50 text-slate-400 border border-slate-100"
                                        )}>
                                            {day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Assessments */}
                <Card className="bg-white border-slate-100 min-h-full">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {assessments.map((item, idx) => (
                            <div key={idx} className="flex items-start p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <item.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-slate-900">{item.title}</h5>
                                    <p className="text-sm text-slate-500 font-medium">{item.time}</p>
                                </div>
                                <ChevronRight className="text-slate-300 self-center" size={20} />
                            </div>
                        ))}
                        <button className="w-full mt-4 py-4 rounded-3xl border-2 border-dashed border-slate-200 text-slate-500 font-black hover:border-blue-400 hover:text-blue-600 transition-all bg-slate-50/50">
                            + Schedule New Test
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
