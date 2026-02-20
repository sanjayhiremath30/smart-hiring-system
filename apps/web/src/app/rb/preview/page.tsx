"use client";

import { useResume } from "@/lib/rb/context";
import { Download, Copy, Printer, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ResumePreview } from "@/components/ResumePreview";

export default function PreviewPage() {
    const { data } = useResume();
    const [copied, setCopied] = useState(false);

    const handleCopyText = () => {
        const text = `
${data.personalInfo.name}
${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}

SUMMARY
${data.personalInfo.summary}

EXPERIENCE
${data.experience.map(e => `${e.company} - ${e.role} (${e.period})\n${e.description}`).join('\n\n')}

PROJECTS
${data.projects.map(p => `${p.title}\n${p.description}`).join('\n\n')}

SKILLS
Technical: ${data.skills.technical.join(', ')}
Soft: ${data.skills.soft.join(', ')}
Tools: ${data.skills.tools.join(', ')}
    `.trim();

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-950/20 backdrop-blur-3xl p-12 custom-scrollbar">
            {/* Action Bar (Hidden in Print) */}
            <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl p-6 rounded-[32px] border border-slate-800 shadow-2xl print:hidden">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-900/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-100 leading-tight uppercase tracking-tight">Export Ready</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimized for ATS Systems</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleCopyText}
                        className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-100 font-bold hover:bg-slate-700 transition-all flex items-center text-sm shadow-lg"
                    >
                        {copied ? <CheckCircle2 size={16} className="mr-2 text-emerald-400" /> : <Copy size={16} className="mr-2" />}
                        {copied ? 'Copied' : 'Copy Text'}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all flex items-center text-sm"
                    >
                        <Printer size={16} className="mr-2" />
                        Print / Save PDF
                    </button>
                </div>
            </div>

            {/* Preview Container */}
            <div className="flex justify-center print:p-0">
                <ResumePreview data={data} isPrint />
            </div>

        </div>
    );
}
