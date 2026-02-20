"use client";

import { cn } from "@/lib/utils";
import { COLOR_MAP, ResumeData } from "@/lib/rb/types";

export function ResumePreview({ data, scale = 1, isPrint = false }: { data: ResumeData, scale?: number, isPrint?: boolean }) {
    const accentColor = COLOR_MAP[data.settings.color];
    const isClassic = data.settings.template === 'classic';
    const isModern = data.settings.template === 'modern';
    const isMinimal = data.settings.template === 'minimal';

    return (
        <div
            className={cn(
                "bg-white overflow-hidden origin-top transition-all duration-500",
                !isPrint && "shadow-2xl"
            )}
            style={{
                width: '210mm',
                minHeight: '297mm',
                transform: !isPrint ? `scale(${scale})` : 'none',
                fontFamily: isClassic ? 'Georgia, serif' : 'Inter, sans-serif',
            }}
        >
            {/* Modern Layout Template */}
            {isModern ? (
                <div className="flex h-full min-h-[297mm]">
                    {/* Sidebar */}
                    <div className="w-[75mm] p-10 text-white shrink-0" style={{ backgroundColor: accentColor }}>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black leading-tight uppercase tracking-tighter">{data.personalInfo.name || 'Your Name'}</h1>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{data.experience[0]?.role || 'Professional'}</p>
                            </div>

                            <div className="space-y-4 pt-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-2">Contact</h3>
                                <div className="space-y-2.5 text-[10px] font-medium text-white/90">
                                    {data.personalInfo.email && <div className="flex items-center">{data.personalInfo.email}</div>}
                                    {data.personalInfo.phone && <div className="flex items-center">{data.personalInfo.phone}</div>}
                                    {data.personalInfo.location && <div className="flex items-center">{data.personalInfo.location}</div>}
                                    {data.personalInfo.github && <div className="flex items-center">{data.personalInfo.github}</div>}
                                    {data.personalInfo.linkedin && <div className="flex items-center">{data.personalInfo.linkedin}</div>}
                                </div>
                            </div>

                            <div className="space-y-6 pt-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-2">Skills</h3>
                                {data.skills.technical.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Technical</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data.skills.technical.map((s: string) => <span key={s} className="px-2 py-1 rounded bg-white/10 text-[9px] font-bold">{s}</span>)}
                                        </div>
                                    </div>
                                )}
                                {data.skills.soft.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Soft Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data.skills.soft.map((s: string) => <span key={s} className="px-2 py-1 rounded bg-white/10 text-[9px] font-bold">{s}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {data.education.length > 0 && (
                                <div className="space-y-6 pt-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-2">Education</h3>
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="space-y-1">
                                            <p className="text-[10px] font-black">{edu.school}</p>
                                            <p className="text-[9px] font-medium opacity-80">{edu.degree}</p>
                                            <p className="text-[9px] font-black opacity-60 uppercase">{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 p-16 space-y-12 bg-white">
                        <section className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>Summary</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{data.personalInfo.summary || 'Describe your professional background...'}</p>
                        </section>

                        {data.experience.length > 0 && (
                            <section className="space-y-8">
                                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>Experience</h3>
                                {data.experience.map((exp: any) => (
                                    <div key={exp.id} className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="text-lg font-black text-slate-900">{exp.company}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.period}</span>
                                        </div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest -mt-1">{exp.role}</p>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line pt-2">{exp.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {data.projects.length > 0 && (
                            <section className="space-y-8">
                                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>Projects</h3>
                                {data.projects.map((p: any) => (
                                    <div key={p.id} className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="text-lg font-black text-slate-900">{p.title}</h4>
                                            {p.githubUrl && <span className="text-[9px] font-bold text-slate-400">{p.githubUrl}</span>}
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{p.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            ) : (
                /* Classic / Minimal Layout */
                <div className="p-20 space-y-10">
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: isClassic ? 'black' : accentColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                        <div className="flex items-center justify-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                            {data.personalInfo.phone && <><span>•</span><span>{data.personalInfo.phone}</span></>}
                            {data.personalInfo.location && <><span>•</span><span>{data.personalInfo.location}</span></>}
                        </div>
                        {isClassic && <div className="h-[2px] w-24 bg-slate-900 mx-auto mt-4" />}
                    </div>

                    <section className="space-y-3">
                        <h3 className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b", isClassic ? "border-slate-900" : "border-slate-100")} style={{ color: isClassic ? 'black' : accentColor }}>Summary</h3>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.personalInfo.summary || 'Summary...'}</p>
                    </section>

                    {data.experience.length > 0 && (
                        <section className="space-y-6">
                            <h3 className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b", isClassic ? "border-slate-900" : "border-slate-100")} style={{ color: isClassic ? 'black' : accentColor }}>Experience</h3>
                            {data.experience.map((exp: any) => (
                                <div key={exp.id} className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="text-lg font-black text-slate-900">{exp.company}</h4>
                                        <span className="text-[10px] font-black text-slate-400">{exp.period}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-2">{exp.role}</div>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-10 pt-4">
                        {data.education.length > 0 && (
                            <section className="space-y-4">
                                <h3 className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b", isClassic ? "border-slate-900" : "border-slate-100")} style={{ color: isClassic ? 'black' : accentColor }}>Education</h3>
                                {data.education.map(edu => (
                                    <div key={edu.id} className="space-y-1">
                                        <p className="text-xs font-black">{edu.school}</p>
                                        <p className="text-[11px] font-medium text-slate-600">{edu.degree}</p>
                                        <p className="text-[10px] font-black text-slate-400">{edu.year}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {data.skills.technical.length > 0 && (
                            <section className="space-y-4">
                                <h3 className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b", isClassic ? "border-slate-900" : "border-slate-100")} style={{ color: isClassic ? 'black' : accentColor }}>Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.technical.map((s: string) => (
                                        <span key={s} className="px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-700">{s}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
