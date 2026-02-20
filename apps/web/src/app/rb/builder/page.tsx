"use client";

import { useResume } from "@/lib/rb/context";
import { calculateATSScore } from "@/lib/rb/engine";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Progress
} from "@/components/ui-custom";
import { ResumePreview } from "@/components/ResumePreview";
import {
    Plus,
    Trash2,
    ChevronDown,
    Sparkles,
    User,
    GraduationCap,
    Briefcase,
    Code2,
    Wrench,
    Layout,
    Palette,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { COLOR_MAP, ResumeTemplate, ResumeColor } from "@/lib/rb/types";
import { SUGGESTED_SKILLS } from "@/lib/rb/engine";

// Helper for collapsible sections
function Accordion({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-800 rounded-3xl bg-slate-950/50 overflow-hidden mb-4 transition-all hover:border-slate-700 shadow-xl">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                        <Icon size={18} />
                    </div>
                    <span className="font-black text-slate-100 uppercase tracking-tight text-sm">{title}</span>
                </div>
                <ChevronDown size={20} className={cn("text-slate-500 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-[1px] bg-slate-800 mb-6" />
                    {children}
                </div>
            )}
        </div>
    );
}

// Main Builder Page
export default function BuilderPage() {
    const { data, updateData, loadSample } = useResume();
    const { score, suggestions } = useMemo(() => calculateATSScore(data), [data]);

    const [activeSection, setActiveSection] = useState<'content' | 'style'>('content');

    // handlers
    const handlePersonalInfo = (field: string, value: string) => {
        updateData({ personalInfo: { ...data.personalInfo, [field]: value } });
    };

    const addEducation = () => {
        const newItem = { id: Date.now().toString(), school: "", degree: "", year: "", location: "" };
        updateData({ education: [...data.education, newItem] });
    };

    const removeEducation = (id: string) => {
        updateData({ education: data.education.filter(e => e.id !== id) });
    };

    const updateEducation = (id: string, field: string, value: string) => {
        updateData({ education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) });
    };

    const addExperience = () => {
        const newItem = { id: Date.now().toString(), company: "", role: "", period: "", description: "" };
        updateData({ experience: [...data.experience, newItem] });
    };

    const updateExperience = (id: string, field: string, value: string) => {
        updateData({ experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e) });
    };

    const addProject = () => {
        const newItem = { id: Date.now().toString(), title: "", description: "", techStack: [], githubUrl: "", liveUrl: "" };
        updateData({ projects: [...data.projects, newItem] });
    };

    const updateProject = (id: string, field: string, value: any) => {
        updateData({ projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p) });
    };

    const toggleSkill = (category: 'technical' | 'soft' | 'tools', skill: string) => {
        const list = data.skills[category];
        const exists = list.includes(skill);
        const newList = exists ? list.filter(s => s !== skill) : [...list, skill];
        updateData({ skills: { ...data.skills, [category]: newList } });
    };

    const suggestSkills = () => {
        updateData({
            skills: {
                technical: Array.from(new Set([...data.skills.technical, ...SUGGESTED_SKILLS.technical])),
                soft: Array.from(new Set([...data.skills.soft, ...SUGGESTED_SKILLS.soft])),
                tools: Array.from(new Set([...data.skills.tools, ...SUGGESTED_SKILLS.tools])),
            }
        });
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Editor (Left) */}
            <div className="w-[550px] bg-slate-950/20 backdrop-blur-xl border-r border-slate-800 flex flex-col shrink-0 relative z-10">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
                    <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveSection('content')}
                            className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all", activeSection === 'content' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:text-blue-600")}
                        >
                            CONTENT
                        </button>
                        <button
                            onClick={() => setActiveSection('style')}
                            className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all", activeSection === 'style' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:text-blue-600")}
                        >
                            STYLE
                        </button>
                    </div>
                    <button
                        onClick={loadSample}
                        className="text-[10px] font-black text-blue-400 hover:text-blue-300 underline underline-offset-4 uppercase tracking-widest"
                    >
                        LOAD SAMPLE DATA
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {activeSection === 'content' ? (
                        <>
                            {/* Personal Info */}
                            <Accordion title="Personal Info" icon={User} defaultOpen>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                        <input
                                            type="text"
                                            className="input-field rounded-2xl text-sm border-slate-800 bg-slate-950/50 text-slate-100"
                                            value={data.personalInfo.name}
                                            onChange={e => handlePersonalInfo('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                                        <input
                                            type="email"
                                            className="input-field rounded-2xl text-sm border-slate-800 bg-slate-950/50 text-slate-100"
                                            value={data.personalInfo.email}
                                            onChange={e => handlePersonalInfo('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                        <input
                                            type="text"
                                            className="input-field rounded-2xl text-sm border-slate-800 bg-slate-950/50 text-slate-100"
                                            value={data.personalInfo.phone}
                                            onChange={e => handlePersonalInfo('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</label>
                                        <textarea
                                            rows={4}
                                            className="input-field rounded-3xl text-sm border-slate-800 bg-slate-950/50 text-slate-100"
                                            value={data.personalInfo.summary}
                                            onChange={e => handlePersonalInfo('summary', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Accordion>

                            {/* Education */}
                            <Accordion title="Education" icon={GraduationCap}>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={edu.id} className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 relative group animate-in slide-in-from-right-2 duration-300">
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-500 hover:text-red-500 hover:border-red-500 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <input
                                                        placeholder="School / University"
                                                        className="w-full bg-transparent font-black text-slate-100 border-none focus:ring-0 p-0 placeholder:text-slate-700"
                                                        value={edu.school}
                                                        onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                                                    />
                                                </div>
                                                <input
                                                    placeholder="Degree"
                                                    className="text-sm bg-transparent border-none focus:ring-0 p-0 text-slate-600 placeholder:text-slate-300"
                                                    value={edu.degree}
                                                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                                                />
                                                <input
                                                    placeholder="Year (e.g. 2020-2024)"
                                                    className="text-sm bg-transparent border-none focus:ring-0 p-0 text-slate-400 text-right placeholder:text-slate-300"
                                                    value={edu.year}
                                                    onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addEducation}
                                        className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:border-blue-600 hover:text-blue-400 transition-all flex items-center justify-center"
                                    >
                                        <Plus size={18} className="mr-2" /> Add Education
                                    </button>
                                </div>
                            </Accordion>

                            {/* Experience */}
                            <Accordion title="Experience" icon={Briefcase}>
                                <div className="space-y-6">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id} className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
                                            <input
                                                placeholder="Company Name"
                                                className="w-full bg-transparent font-black text-lg text-slate-100 border-none focus:ring-0 p-0"
                                                value={exp.company}
                                                onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                                            />
                                            <div className="flex justify-between items-center text-sm font-bold">
                                                <input
                                                    placeholder="Role / Title"
                                                    className="bg-transparent border-none focus:ring-0 p-0 text-blue-400 flex-1 font-black uppercase tracking-tight"
                                                    value={exp.role}
                                                    onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                                                />
                                                <input
                                                    placeholder="Period (e.g. 2022 - Present)"
                                                    className="bg-transparent border-none focus:ring-0 p-0 text-slate-400 text-right w-40"
                                                    value={exp.period}
                                                    onChange={e => updateExperience(exp.id, 'period', e.target.value)}
                                                />
                                            </div>
                                            <textarea
                                                rows={3}
                                                placeholder="Bullets starting with action verbs..."
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-400 resize-none font-medium leading-relaxed"
                                                value={exp.description}
                                                onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={addExperience} className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:border-blue-600 hover:text-blue-400 transition-all flex items-center justify-center">
                                        <Plus size={18} className="mr-2" /> Add Experience
                                    </button>
                                </div>
                            </Accordion>

                            {/* Skills */}
                            <Accordion title="Skills" icon={Wrench}>
                                <div className="space-y-6">
                                    {(['technical', 'soft', 'tools'] as const).map(cat => (
                                        <div key={cat} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat} Skills</label>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{data.skills[cat].length}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {data.skills[cat].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => toggleSkill(cat, s)}
                                                        className="px-3 py-1.5 rounded-xl bg-blue-900/20 text-blue-400 text-xs font-black border border-blue-500/20 flex items-center group hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/20 transition-all"
                                                    >
                                                        {s}
                                                        <Trash2 size={10} className="ml-2 opacity-0 group-hover:opacity-100" />
                                                    </button>
                                                ))}
                                                <input
                                                    placeholder="Type & Enter..."
                                                    className="bg-transparent border-none focus:ring-0 p-0 text-xs text-slate-400 w-24"
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            const val = (e.currentTarget.value).trim();
                                                            if (val) {
                                                                toggleSkill(cat, val);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={suggestSkills}
                                        className="w-full py-3 rounded-2xl bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-blue-600/20 transition-all border border-blue-500/10"
                                    >
                                        <Sparkles size={14} className="mr-2" /> SUGGEST SKILLS
                                    </button>
                                </div>
                            </Accordion>
                        </>
                    ) : (
                        <>
                            {/* Template Picker */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Layout</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {(['classic', 'modern', 'minimal'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => updateData({ settings: { ...data.settings, template: t } })}
                                            className={cn(
                                                "p-4 rounded-3xl bg-slate-900/50 border-2 transition-all text-center space-y-2 shadow-xl",
                                                data.settings.template === t ? "border-blue-600 bg-blue-600/10" : "border-transparent border-slate-800 hover:border-slate-700"
                                            )}
                                        >
                                            <div className="aspect-[3/4] bg-slate-950 rounded-lg shadow-sm mb-2 relative overflow-hidden flex flex-col items-center border border-slate-800">
                                                {t === 'classic' && <div className="p-2 space-y-1 w-full"><div className="h-1 w-full bg-slate-800" /><div className="h-[2px] w-2/3 bg-slate-900" /><div className="h-1 w-full bg-slate-800" /><div className="h-1 w-full bg-slate-800" /></div>}
                                                {t === 'modern' && <div className="flex h-full w-full"><div className="w-1/3 bg-slate-900 h-full" /><div className="flex-1 p-2 space-y-1"><div className="h-1 w-full bg-slate-800" /><div className="h-1 w-full bg-slate-800" /></div></div>}
                                                {t === 'minimal' && <div className="flex flex-col items-center p-3 w-full"><div className="h-1 w-1/2 bg-slate-800 mb-2" /><div className="h-0.5 w-full bg-slate-900" /><div className="h-0.5 w-full bg-slate-900" /></div>}
                                                {data.settings.template === t && <CheckCircle2 className="absolute top-1 right-1 text-blue-500" size={14} />}
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-600">{t}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Theme */}
                            <div className="space-y-4 pt-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accent Color</label>
                                <div className="flex flex-wrap gap-4">
                                    {(Object.keys(COLOR_MAP) as ResumeColor[]).map(c => (
                                        <button
                                            key={c}
                                            onClick={() => updateData({ settings: { ...data.settings, color: c } })}
                                            className={cn(
                                                "w-10 h-10 rounded-full border-4 transition-all hover:scale-110 shadow-lg",
                                                data.settings.color === c ? "border-white/20" : "border-transparent"
                                            )}
                                            style={{ backgroundColor: COLOR_MAP[c] }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ATS Score Meter (Bottom of editor sidebar) */}
                <div className="p-8 border-t border-slate-800 bg-slate-950/40 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">ATS Readiness Score</span>
                            <div className="text-3xl font-black text-slate-100 leading-none">
                                {score}<span className="text-sm font-bold text-slate-600 ml-1">/100</span>
                            </div>
                        </div>
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-xl",
                            score >= 70 ? "bg-emerald-500 shadow-emerald-200" : score >= 40 ? "bg-amber-500 shadow-amber-200" : "bg-red-500 shadow-red-200"
                        )}>
                            {score >= 70 ? 'S' : score >= 40 ? 'B' : 'F'}
                        </div>
                    </div>

                    <Progress value={score} className={cn("h-2.5 bg-slate-800", score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-500")} />

                    <div className="mt-8 space-y-3">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center">
                            <Sparkles size={12} className="mr-2" /> Top Improvements
                        </h4>
                        {suggestions.map((s, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800 group hover:border-blue-900/40 transition-all">
                                <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-xs font-black text-slate-400 leading-tight">{s.message}</p>
                            </div>
                        ))}
                        {suggestions.length === 0 && (
                            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-black uppercase tracking-wider">ATS Optimized. Ready to ship!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Preview (Right) */}
            <div className="flex-1 bg-slate-900/20 overflow-y-auto p-12 custom-scrollbar flex flex-col items-center">
                <div className="mb-8 flex items-center space-x-4 bg-slate-950/40 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-800 shadow-2xl">
                    <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Live Preview Rendering
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                    <button className="text-[10px] font-black text-slate-400 hover:text-blue-400 uppercase tracking-widest transition-colors">Zoom 100%</button>
                </div>

                {/* A4 Resume Body */}
                <ResumePreview data={data} scale={0.7} />
            </div>
        </div>
    );
}

