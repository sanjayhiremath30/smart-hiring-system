"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui-custom";
import {
    History as HistoryIcon,
    ChevronRight,
    Calendar,
    Trash2,
    Briefcase,
    Building2
} from "lucide-react";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('placement_history') || '[]');
        setHistory(data);
    }, []);

    const deleteEntry = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = history.filter(h => h.id !== id);
        setHistory(updated);
        localStorage.setItem('placement_history', JSON.stringify(updated));
    };

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
                    <p className="text-slate-500">Review your past job descriptions and preparation plans.</p>
                </div>
                <button
                    onClick={() => router.push("/placement/analyze")}
                    className="btn-primary rounded-2xl bg-indigo-600 px-6 py-3 flex items-center"
                >
                    New Analysis <ChevronRight className="ml-2" size={18} />
                </button>
            </div>

            <div className="space-y-4">
                {history.length === 0 ? (
                    <Card className="p-20 text-center bg-white border-dashed border-slate-200">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <HistoryIcon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No history yet</h3>
                        <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start analyzing job descriptions to see your history here.</p>
                        <button
                            onClick={() => router.push("/placement/analyze")}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Analyze your first JD →
                        </button>
                    </Card>
                ) : (
                    history.map((entry) => (
                        <Card
                            key={entry.id}
                            onClick={() => router.push(`/placement/results?id=${entry.id}`)}
                            className="group cursor-pointer hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all bg-white border-slate-100"
                        >
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex flex-col items-center justify-center text-slate-900 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <span className="text-xl font-black">{entry.readinessScore}</span>
                                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Score</span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                            <Briefcase className="mr-2 text-indigo-600" size={16} />
                                            {entry.role || "Untitled Role"}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-slate-500 font-medium">
                                            <span className="flex items-center"><Building2 size={14} className="mr-1" /> {entry.company || "Unknown Company"}</span>
                                            <span className="flex items-center"><Calendar size={14} className="mr-1" /> {formatDate(entry.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => deleteEntry(e, entry.id)}
                                        className="p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
