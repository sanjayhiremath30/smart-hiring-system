"use client";

import { ResumeProvider } from "@/lib/rb/context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Layout, CheckCircle2, User } from "lucide-react";

export default function ResumeAppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // If we are in the 8-step build track, use the existing track layout (already handles its own shell)
    if (pathname.match(/^\/rb\/\d+/) || pathname.includes('/proof')) {
        return <ResumeProvider>{children}</ResumeProvider>;
    }

    return (
        <ResumeProvider>
            <div className="min-h-screen bg-[#020617] flex flex-col font-sans text-slate-100">
                {/* Top Nav */}
                <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center space-x-6">
                        <Link href="/rb" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black group-hover:bg-blue-500 transition-colors">R</div>
                            <span className="font-black tracking-tight text-xl uppercase text-blue-500">AI Resume</span>
                        </Link>

                        <nav className="flex items-center space-x-1">
                            {[
                                { name: 'Builder', href: '/rb/builder', icon: FileText },
                                { name: 'Preview', href: '/rb/preview', icon: Layout },
                                { name: 'Proof', href: '/rb/proof', icon: CheckCircle2 },
                            ].map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all",
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-400 hover:bg-blue-600/10 hover:text-blue-400"
                                        )}
                                    >
                                        <item.icon size={16} className="mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                            <User size={18} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </ResumeProvider>
    );
}
