"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-custom";
import { Sparkles, Info } from "lucide-react";

export default function StepWorkspace({ step, title, description }: { step: number, title: string, description: string }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-white/5 border-white/10 rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                            <Sparkles size={20} />
                        </div>
                        <CardTitle className="text-white text-2xl uppercase tracking-tighter">{title}</CardTitle>
                    </div>
                    <p className="text-white/60 leading-relaxed font-medium">
                        {description}
                    </p>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                            <Info size={32} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white/80 uppercase tracking-tight">Pending Artifact</h4>
                            <p className="text-sm text-white/40 max-w-xs mx-auto">
                                Use the Build Panel on the right to sync your work from Lovable and capture the artifact.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 p-6 rounded-[24px]">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Guidelines</h4>
                    <ul className="space-y-3">
                        {[
                            "Clear and concise problem statement",
                            "User-centric focus",
                            "High-level vision",
                            "Impact assessment"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-sm font-black text-white/50">
                                <div className="w-1 h-1 rounded-full bg-blue-500 mr-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card className="bg-white/5 border-white/10 p-6 rounded-[24px]">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Resources</h4>
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                            <span className="text-sm font-black text-white/70 uppercase tracking-tight">Market Research PDF</span>
                            <Info size={14} className="text-white/20 group-hover:text-blue-400" />
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                            <span className="text-sm font-black text-white/70 uppercase tracking-tight">Architecture Patterns</span>
                            <Info size={14} className="text-white/20 group-hover:text-blue-400" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
